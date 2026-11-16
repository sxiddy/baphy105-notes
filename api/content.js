// GET /data/<file>.js (rewritten to /api/content?f=<file>) -> notes, questions, summaries (free) and the Pro files
// (pro-*, qa-*, viz-*, papers-pro: flashcards, formulas, answers, widgets, model answers) listed by tools/build.js.
// Everything needs a signed-in VIT student (or the owner, or nothing while sign-in is switched off). Free files stop
// there; Pro files also need Pro (payment, free access, or the whole site free).
const fs = require('fs'), path = require('path');
const { hasAccess, canOpen, handle } = require('./_lib');
const ACCESS = require('./_access.json');
const FREE = new Set(ACCESS.freeFiles);
module.exports = handle(async (req, res) => {
  const f = new URL(req.url, 'http://x').searchParams.get('f') || '';
  if (!/^((chunk|pro|q|qa|summary|viz|papers)-[A-Za-z0-9-]+|figs)\.js$/.test(f)) { res.statusCode = 404; return res.end('not found'); }
  const deny = (code) => { res.statusCode = code; res.setHeader('Cache-Control', 'no-store'); return res.end(code === 401 ? '/* sign in required */' : '/* payment required */'); };
  if (!(await canOpen(req))) return deny(401);
  if (!FREE.has(f)) {
    const t = await hasAccess(req), mod = (ACCESS.fileModule || {})[f];
    if (!t || (t.modules && mod && !t.modules.includes(mod))) return deny(402);
  }
  const p = path.join(process.cwd(), 'protected', 'data', f);
  if (!fs.existsSync(p)) { res.statusCode = 404; return res.end('not found'); }
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'private, max-age=' + (FREE.has(f) ? 300 : 3600));
  res.end(fs.readFileSync(p));
});
