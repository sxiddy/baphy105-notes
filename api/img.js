// GET /img/<id>.svg | <id>.webp (rewritten to /api/img?f=...) -> figures. Signed-in VIT students (or the owner; anyone while sign-in is switched off);
// free modules (content/modules.json) need nothing more, the rest need payment or free access.
// <id>.svg is the site's own redrawn diagram (copied here by tools/build.js as each one is drawn). Once it exists,
// the cropped course-slide image <id>.webp is no longer served.
const fs = require('fs'), path = require('path');
const { hasAccess, canOpen, handle } = require('./_lib');
const { freeModules } = require('./_access.json');
const DIR = path.join(process.cwd(), 'protected', 'img');
module.exports = handle(async (req, res) => {
  const f = new URL(req.url, 'http://x').searchParams.get('f') || '';
  if (!/^m\d+-[a-z0-9-]+\.(webp|svg)$/.test(f)) { res.statusCode = 404; return res.end('not found'); }
  const deny = (code) => { res.statusCode = code; res.setHeader('Cache-Control', 'no-store'); return res.end(); };
  const svg = f.endsWith('.svg');
  const p = path.join(DIR, f);
  if (!fs.existsSync(p) || (!svg && fs.existsSync(p.replace(/\.webp$/, '.svg')))) { res.statusCode = 404; return res.end('not found'); }
  if (!(await canOpen(req))) return deny(401);
  const mod = f.split('-')[0], free = freeModules.includes(mod);
  if (!free) { const t = await hasAccess(req); if (!t || (t.modules && !t.modules.includes(mod))) return deny(402); }
  res.statusCode = 200;
  res.setHeader('Content-Type', svg ? 'image/svg+xml; charset=utf-8' : 'image/webp');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (svg) res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'");
  res.setHeader('Cache-Control', 'private, max-age=86400');
  res.end(fs.readFileSync(p));
});
