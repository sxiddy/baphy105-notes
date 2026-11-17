// Module 3 diagrams.
// node tools/figs/m3.js  → writes figs-svg/m3-*.svg
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', '..', 'figs-svg');
const f1 = (n) => +n.toFixed(1);
const poly = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1])).join(' ');
const defs = (cols) => `<defs>${cols.map((c) => `<marker id="a${c}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z" class="df${c === 'w' ? 'w' : c}"/></marker>`).join('')}</defs>`;
const T = (x, y, s, cls = 'dt', size = 24, anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" class="${cls}"${extra}>${s}</text>`;
const L = (x1, y1, x2, y2, cls = 'ds', w = 2.5, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" stroke-width="${w}"${extra}/>`;
const P = (d, cls = 'ds', w = 3, extra = '') => `<path d="${d}" class="${cls}" fill="none" stroke-width="${w}"${extra}/>`;
const svg = (h, body, cols = ['w']) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ${h}">${defs(cols)}${body}</svg>\n`;
const write = (id, s) => { fs.writeFileSync(path.join(OUT, id + '.svg'), s); console.log('wrote', id); };

// axes helper: origin (x0,y0), width w, height h
const axes = (x0, y0, w, h, xl, yl) => L(x0, y0, x0 + w, y0, 'ds', 2.5, ' marker-end="url(#aw)"') + L(x0, y0, x0, y0 - h, 'ds', 2.5, ' marker-end="url(#aw)"')
  + T(x0 + w - 4, y0 + 34, xl, 'dt2', 24, 'end') + T(x0 - 14, y0 - h + 10, yl, 'dt2', 24, 'end');

const cols = ['w', 'b', 'o', 'g', 'r'];
const box = (x, lab) => `<rect x="${x}" y="130" width="96" height="80" rx="10" class="dfw" fill-opacity=".06" style="stroke:var(--line-2)" stroke-width="2.5"/>` + T(x + 48, 182, lab, 'dt', 26);
const block = (x, y) => L(x, y - 16, x, y + 16, 'dsr', 6) + T(x, y + 40, 'blocked', 'dtr', 22);
// Sequential Stern–Gerlach z → x → z with 2000 atoms (beam counts = N × ½ at each selection).
{
  let b = `<rect x="6" y="150" width="50" height="40" rx="6" class="dfw" fill-opacity=".1" style="stroke:var(--line-2)" stroke-width="2"/>` + T(31, 230, 'oven', 'dt2', 22);
  b += L(56, 170, 96, 170, 'dsy', 4) + T(76, 120, '2000', 'dty', 22);
  b += box(96, 'SG z') + box(276, 'SG x') + box(456, 'SG z');
  // after SG z: +z goes on, -z blocked
  b += L(192, 160, 276, 160, 'dsg', 4) + T(234, 118, '+z: 1000', 'dtg', 22);
  b += L(192, 200, 234, 236, 'dso', 4) + block(240, 240) .replace('blocked', '−z: 1000');
  b += L(372, 160, 456, 160, 'dsg', 4) + T(414, 118, '+x: 500', 'dtg', 22);
  b += L(372, 200, 414, 236, 'dso', 4) + block(420, 240).replace('blocked', '−x: 500');
  b += L(552, 160, 594, 110, 'dsb', 4) + T(590, 96, '+z: 250', 'dtb', 22, 'end');
  b += L(552, 200, 594, 250, 'dsb', 4) + T(590, 280, '−z: 250', 'dtb', 22, 'end');
  b += T(300, 340, 'The −z state comes back after the x measurement:', 'dt', 23) + T(300, 372, 'measuring Sₓ wipes out the earlier Sz result', 'dt', 23);
  write('m3-seq-sg', svg(390, b, cols));
}
