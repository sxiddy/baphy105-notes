// Cloudflare Worker for BAPHY105 (https://baphy105.notix.in), replacing Vercel. The public site comes from
// dist/ (tools/cf-build.js) through the ASSETS binding; /api/* runs the same api/*.js handlers through a small
// Node-style req/res shim. Notes bundles (/data/*) and figures (/img/*) sit in dist/_p/, which only this Worker reads,
// after the same checks api/content.js and api/img.js make (signed-in student; Pro for paid modules).
// The scheduled job polls Razorpay Payment Links every minute (Pro for buyers who closed the tab).
import battle from '../api/battle.js';
import createOrder from '../api/create-order.js';
import feedback from '../api/feedback.js';
import login from '../api/login.js';
import restore from '../api/restore.js';
import session from '../api/session.js';
import stats from '../api/stats.js';
import sync from '../api/sync.js';
import track from '../api/track.js';
import verify from '../api/verify.js';
import lib from '../api/_lib.js';
import paylink from '../api/_paylink.js';
import BUNDLES from '../api/_bundles.json';
import ACCESS from '../api/_access.json';

const API = { battle, 'create-order': createOrder, feedback, login, restore, session, stats, sync, track, verify };
const REWRITES = { '/api/logout': '/api/login?out=1', '/api/verify-payment': '/api/verify' };
const ADMIN = new Set(['/admin', '/stats', '/stats/html', '/stats.html']);

function rewrite(url) {
  const to = REWRITES[url.pathname];
  if (!to) return url;
  const next = new URL(to, url);
  for (const [k, v] of url.searchParams) next.searchParams.append(k, v);
  return next;
}

// Run a Node-style (req, res) handler and turn what it writes into a Response.
async function runNode(handler, request, url, ctx) {
  const headers = {};
  for (const [k, v] of request.headers) headers[k.toLowerCase()] = v;
  const ip = request.headers.get('cf-connecting-ip');
  if (ip) headers['x-forwarded-for'] = ip;
  const bodyBuf = request.method === 'GET' || request.method === 'HEAD' ? null : Buffer.from(await request.arrayBuffer());
  const req = {
    method: request.method,
    url: url.pathname + url.search,
    headers,
    socket: { remoteAddress: ip || '' },
    async *[Symbol.asyncIterator]() { if (bodyBuf && bodyBuf.length) yield bodyBuf; },
  };
  return new Promise((resolve) => {
    const out = new Headers();
    const chunks = [];
    let done = false;
    const res = {
      statusCode: 200,
      headersSent: false,
      setHeader(k, v) { out.delete(k); for (const x of Array.isArray(v) ? v : [v]) out.append(k, String(x)); return res; },
      getHeader: (k) => out.get(k) ?? undefined,
      removeHeader: (k) => out.delete(k),
      writeHead(status, a, b) {
        res.statusCode = status;
        const h = typeof a === 'object' && a ? a : b;
        if (h) for (const k in h) res.setHeader(k, h[k]);
        return res;
      },
      write(c) { if (c != null) chunks.push(Buffer.from(c)); return true; },
      end(c) {
        if (done) return res;
        done = true;
        res.headersSent = true;
        if (c != null) res.write(c);
        const body = request.method === 'HEAD' || res.statusCode === 204 || res.statusCode === 304 ? null : Buffer.concat(chunks);
        resolve(new Response(body, { status: res.statusCode, headers: out }));
        return res;
      },
    };
    const run = (async () => {
      try { await handler(req, res); } catch (e) {
        console.error('api error', url.pathname, (e && e.stack) || e);
        if (!done) {
          res.statusCode = (e && e.status) || 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: (e && e.status && e.message) || 'Server error. Try again.' }));
        }
      }
      if (!done) res.end();
    })();
    ctx.waitUntil(run);
  });
}

// The access checks of api/content.js / api/img.js: 200 = may have it, 401 = sign in, 402 = needs Pro (for `mod`).
function guard(mod, free) {
  return async (req, res) => {
    if (!(await lib.canOpen(req))) { res.statusCode = 401; return res.end(); }
    if (!free) {
      const t = await lib.hasAccess(req);
      if (!t || (t.modules && mod && !t.modules.includes(mod))) { res.statusCode = 402; return res.end(); }
    }
    res.statusCode = 200; res.end();
  };
}

async function protectedFile(request, url, env, ctx, assetPath, mod, free, type) {
  const asset = await env.ASSETS.fetch(new Request(new URL(assetPath, url)));
  if (!asset.ok) return new Response('not found', { status: 404 });
  const ok = await runNode(guard(mod, free), new Request(request.url, { headers: request.headers }), url, ctx);
  const h = { 'Cache-Control': 'no-store' };
  if (ok.status !== 200) {
    for (const [k, v] of ok.headers) if (k.toLowerCase() === 'set-cookie') h['Set-Cookie'] = v;
    return new Response(ok.status === 401 ? '/* sign in required */' : '/* payment required */', { status: ok.status, headers: h });
  }
  const headers = new Headers({ 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, max-age=' + (free ? 86400 : 3600) }); // free: 1 day; Pro: 1 hour, so removed Pro locks within an hour
  if (type.startsWith('image/svg')) headers.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'");
  return new Response(asset.body, { status: 200, headers });
}

export default {
  async fetch(request, env, ctx) {
    let url = new URL(request.url);
    const p = url.pathname;
    // the asset store sends /admin.html to /admin, so /admin serves the page itself (no redirect loop)
    if (p === '/admin') return env.ASSETS.fetch(request);
    if (ADMIN.has(p)) return Response.redirect(new URL('/admin', url).toString(), 302);
    if (p.startsWith('/_p/')) return new Response('not found', { status: 404 });
    if (p.startsWith('/data/')) {
      const f = p.slice(6), b = Object.prototype.hasOwnProperty.call(BUNDLES, f) && BUNDLES[f];
      if (!b) return new Response('not found', { status: 404 });
      return protectedFile(request, url, env, ctx, '/_p/data/' + f, b.module, b.free, 'text/javascript; charset=utf-8');
    }
    if (p.startsWith('/img/')) {
      const f = p.slice(5);
      if (!/^m\d+-[a-z0-9-]+\.(webp|svg)$/.test(f)) return new Response('not found', { status: 404 });
      const mod = f.split('-')[0];
      return protectedFile(request, url, env, ctx, '/_p/img/' + f, mod, ACCESS.freeModules.includes(mod), f.endsWith('.svg') ? 'image/svg+xml; charset=utf-8' : 'image/webp');
    }
    if (p.startsWith('/api/')) {
      url = rewrite(url);
      const name = url.pathname.slice(5);
      const handler = Object.prototype.hasOwnProperty.call(API, name) && API[name];
      if (!handler) return Response.json({ error: 'Not found' }, { status: 404 });
      return runNode(handler, request, url, ctx);
    }
    return env.ASSETS.fetch(request);
  },

  // every minute: Pro for paid Razorpay Payment Links whose buyer closed the tab
  async scheduled(event, env, ctx) {
    ctx.waitUntil(paylink.pollOnce().then((n) => { if (n) console.log('[paylink] granted', n); }).catch((e) => console.error('[paylink] poll failed:', e.message)));
  },
};
