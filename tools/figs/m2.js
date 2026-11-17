// Module 2 diagrams: vectors drawn from their actual components.
// node tools/figs/m2.js  → writes figs-svg/m2-*.svg
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

const defs2 = ['w', 'b', 'o', 'g', 'y', 'r'];
const arrow = (x1, y1, x2, y2, c, w = 4) => L(x1, y1, x2, y2, c === 'w' ? 'ds' : 'ds' + c, w, ` marker-end="url(#a${c})"`);

// 1. Components as projections: |ψ⟩ = c1|e1⟩ + c2|e2⟩ with c_i = ⟨e_i|ψ⟩. ψ = (3, 2) units of 80 px.
{
  const ox = 110, oy = 360, u = 80, px = ox + 3 * u, py = oy - 2 * u;
  let b = arrow(ox, oy, ox + 5.6 * u, oy, 'w', 2.5) + arrow(ox, oy, ox, oy - 3.8 * u, 'w', 2.5);
  b += arrow(ox, oy, ox + u, oy, 'b', 4) + arrow(ox, oy, ox, oy - u, 'b', 4);
  b += T(ox + u / 2, oy + 34, '|e₁⟩', 'dtb', 24) + T(ox - 14, oy - u / 2 + 8, '|e₂⟩', 'dtb', 24, 'end');
  b += L(px, py, px, oy, 'ds2', 2, ' stroke-dasharray="7 6"') + L(px, py, ox, py, 'ds2', 2, ' stroke-dasharray="7 6"');
  b += arrow(ox, oy, px, py, 'o', 4.5) + T(px + 14, py - 8, '|ψ⟩', 'dto', 26, 'start');
  b += T(px, oy + 34, 'c₁ = ⟨e₁|ψ⟩ = 3', 'dtg', 22) + T(ox + 12, py - 10, 'c₂ = ⟨e₂|ψ⟩ = 2', 'dtg', 22, 'start');
  b += T(300, 440, '|ψ⟩ = 3|e₁⟩ + 2|e₂⟩: each component is a projection', 'dt', 23);
  write('m2-projection', svg(460, b, defs2));
}

// 2. Eigenvectors keep their direction: T = [[2,1],[1,2]] has eigenvectors (1,1) (λ = 3) and (1,−1) (λ = 1).
{
  const ox = 170, oy = 300, u = 80, X = (x) => ox + x * u, Y = (y) => oy - y * u;
  const Tm = (v) => [2 * v[0] + v[1], v[0] + 2 * v[1]];
  let b = arrow(X(-1.5), oy, X(5), oy, 'w', 2) + arrow(ox, Y(-1.6), ox, Y(3.6), 'w', 2);
  const show = (v, c, lab, labT, dx = 10, dy = -8) => { const w = Tm(v); return L(ox, oy, X(v[0]), Y(v[1]), 'ds' + c, 10, ' stroke-opacity=".45"') + arrow(ox, oy, X(w[0]), Y(w[1]), c, 3.5) + T(X(w[0]) + dx, Y(w[1]) + dy, labT, 'dt' + c, 22, dx < 0 ? 'end' : 'start'); };
  b += show([1, 1], 'g', '', 'T(1,1) = 3(1,1)', -12, 4) + show([1, -1], 'b', '', 'T(1,−1) = 1·(1,−1)', 12, 24) + show([1, 0], 'o', '', 'T(1,0) = (2,1): turned', 12, 8);
  b += T(300, 452, 'thick faint = before, arrow = after T = [2 1; 1 2]', 'dt2', 22) + T(300, 484, 'Eigenvectors only stretch: λ = 3 and λ = 1', 'dt', 24);
  write('m2-eigen', svg(500, b, defs2));
}

// 3. Tensor product: C² ⊗ C² = C⁴, basis |00⟩ |01⟩ |10⟩ |11⟩; (a,b) ⊗ (c,d) = (ac, ad, bc, bd).
{
  let b = T(150, 50, 'qubit A: |0⟩, |1⟩', 'dtb', 24) + T(450, 50, 'qubit B: |0⟩, |1⟩', 'dto', 24);
  const cell = (x, y, s) => `<rect x="${x}" y="${y}" width="120" height="64" rx="10" class="dfw" fill-opacity=".08" stroke-width="2" style="stroke:var(--line-2)"/>` + T(x + 60, y + 42, s, 'dt', 26);
  b += T(165, 120, '|0⟩', 'dto', 24) + T(305, 120, '|1⟩', 'dto', 24) + T(80, 170, '|0⟩', 'dtb', 24) + T(80, 254, '|1⟩', 'dtb', 24);
  b += cell(105, 135, '|00⟩') + cell(245, 135, '|01⟩') + cell(105, 219, '|10⟩') + cell(245, 219, '|11⟩');
  b += T(470, 190, 'dimension', 'dt2', 22) + T(470, 222, '2 × 2 = 4', 'dtg', 26);
  b += T(300, 345, '(a, b) ⊗ (c, d) = (ac, ad, bc, bd)', 'dt', 26) + T(300, 385, 'each entry of the first times the whole second', 'dt2', 22);
  write('m2-tensor', svg(410, b, defs2));
}
