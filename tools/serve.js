// Local preview: static app/ plus the api/ functions and the same rewrites as vercel.json.
//   node tools/serve.js            -> uses .env keys if present, otherwise DEV_BYPASS (no payment needed)
//   PAYWALL=1 node tools/serve.js  -> force the paywall even without keys
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
process.chdir(ROOT);
// load .env (local only; on Vercel these come from Project Settings → Environment Variables)
if (fs.existsSync(path.join(ROOT, '.env'))) {
  for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}
const dir = path.join(ROOT, process.argv[2] || 'app');
const port = +(process.argv[3] || 4173);
if (!process.env.RAZORPAY_KEY_ID && !process.env.PAYWALL) process.env.DEV_BYPASS = '1';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.json': 'application/json' };
http.createServer((req, res) => {
  let u = req.url.split('?')[0];
  let m;
  if ((m = u.match(/^\/data\/([^/]+)$/))) req.url = '/api/content?f=' + m[1];
  else if ((m = u.match(/^\/img\/([^/]+)$/))) req.url = '/api/img?f=' + m[1];
  u = req.url.split('?')[0];
  if ((m = u.match(/^\/api\/([a-z-]+)$/)) && fs.existsSync(path.join(ROOT, 'api', m[1] + '.js'))) {
    return require(path.join(ROOT, 'api', m[1] + '.js'))(req, res);
  }
  let p = decodeURIComponent(u);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(dir, p);
  if (!f.startsWith(dir)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(buf);
  });
}).listen(port, () => console.log(`serving ${dir} on http://localhost:${port}${process.env.DEV_BYPASS ? ' (DEV_BYPASS: paywall off)' : process.env.RAZORPAY_KEY_ID ? ' (Razorpay ' + (process.env.RAZORPAY_KEY_ID.startsWith('rzp_test_') ? 'TEST' : 'LIVE') + ' keys)' : ''}`));
