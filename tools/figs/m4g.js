// Generates the chunk-4g figures (mechanisms) into figs-svg/. Usage: node tools/figs/m4g.js figs-svg
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';
const src = fs.readFileSync(path.join(__dirname, 'm2a.js'), 'utf8').split('const figs = {};')[0].replace("process.argv[2] || 'figs-svg'", "'x'");
const H = new Function('require', 'process', src + '; return { svg, T, L, P, R, sub, pl, f1 };')(require, process);
const { svg, T, L, R } = H;
const figs = {};
{
  let s = T(20, 36, 'Slider crank mechanism', { size: 26, w: 600 });
  const O = [110, 200], A = [190, 140], B = [400, 200];
  // guide (frame)
  s += R(300, 214, 260, 14, 'dfg', 0.35) + `<rect x="300" y="214" width="260" height="14" class="dsg" fill="none" stroke-width="2.5"/>`;
  s += L(300, 186, 560, 186, { c: 'dsg', w: 2.5 });
  // slider
  s += R(370, 188, 70, 26, 'dfo', 0.4) + `<rect x="370" y="188" width="70" height="26" class="dso" fill="none" stroke-width="2.5"/>`;
  // links
  s += L(O[0], O[1], A[0], A[1], { c: 'dsb', w: 7 }) + L(A[0], A[1], B[0], B[1], { c: 'dsb', w: 5 });
  [O, A, B].forEach(p => { s += `<circle cx="${p[0]}" cy="${p[1]}" r="10" class="dso" fill="none" stroke-width="3"/>`; });
  // fixed pivot
  s += L(80, 232, 140, 232, { w: 3 }) + L(88, 232, 78, 246) + L(104, 232, 94, 246) + L(120, 232, 110, 246) + L(136, 232, 126, 246) + L(O[0], O[1] + 10, O[0], 232);
  s += T(130, 112, 'Crank', { c: 'dtb' }) + T(290, 150, 'Connecting rod', { c: 'dtb', anchor: 'middle' }).replace('y="150"', 'y="130"');
  s += T(405, 270, 'Slider', { anchor: 'middle', c: 'dto' }) + T(480, 176, 'Frame and guide', { anchor: 'middle', c: 'dtg' }).replace('y="176"', 'y="164"');
  s += T(110, 280, 'Frame', { anchor: 'middle', c: 'dtg' });
  figs['m4-slider-crank'] = svg(310, s);
}
for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
console.log('wrote', Object.keys(figs).length, 'figures');
