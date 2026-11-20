// Builds dist/ for Cloudflare (run after tools/build.js): the public site (app/) plus the protected files under
// dist/_p/, which only the Worker can hand out (wrangler.jsonc sends /_p/* through the Worker, and it refuses them).
// Notes files are joined into bundles so a visit asks for 1-7 files instead of 57:
//   free.<hash>.js        every free file
//   pro-<module>.<hash>.js the Pro files of one module (single-module buyers get only theirs)
//   pro-common.<hash>.js   Pro files that belong to no module (any Pro buyer)
// The hash changes whenever the content does, so browsers can keep a bundle for a day without seeing stale notes.
// Writes api/_bundles.json (for the Worker's checks) and appends window.BUNDLES to dist/js/data-files.js.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.join(__dirname, '..'), DIST = path.join(ROOT, 'dist');
const A = require('../api/_access.json');

fs.rmSync(DIST, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'app'), DIST, { recursive: true });
fs.mkdirSync(path.join(DIST, '_p', 'data'), { recursive: true });
fs.cpSync(path.join(ROOT, 'protected', 'img'), path.join(DIST, '_p', 'img'), { recursive: true });

const groups = [['free', null, A.freeFiles]];
const byMod = {};
for (const f of A.proFiles) (byMod[A.fileModule[f] || 'common'] = byMod[A.fileModule[f] || 'common'] || []).push(f);
for (const m of Object.keys(byMod)) groups.push(['pro-' + m, m === 'common' ? null : m, byMod[m]]);

const bundles = {}; // name -> { free, module }
const list = { free: [], pro: {} }; // what the page loads
let bytes = 0;
for (const [base, mod, files] of groups) {
  const body = files.map((f) => {
    const s = fs.readFileSync(path.join(ROOT, 'protected', 'data', f), 'utf8');
    return '/* ' + f + ' */\n' + s + '\n;\n';
  }).join('');
  const name = base + '.' + crypto.createHash('sha256').update(body).digest('hex').slice(0, 10) + '.js';
  fs.writeFileSync(path.join(DIST, '_p', 'data', name), body);
  bundles[name] = { free: base === 'free', module: mod };
  if (base === 'free') list.free.push(name); else list.pro[mod || 'common'] = name;
  bytes += body.length;
  console.log(name.padEnd(28), files.length + ' files', (body.length / 1024).toFixed(0) + ' KB');
}
fs.writeFileSync(path.join(ROOT, 'api', '_bundles.json'), JSON.stringify(bundles, null, 1) + '\n');
fs.appendFileSync(path.join(DIST, 'js', 'data-files.js'), '\nwindow.BUNDLES = ' + JSON.stringify(list) + ';\n');
console.log('bundles:', Object.keys(bundles).length, '| total', (bytes / 1024).toFixed(0), 'KB | images:', fs.readdirSync(path.join(DIST, '_p', 'img')).length);
