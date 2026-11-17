// Module 5 diagrams: Bloch sphere drawn from the (θ, φ) projection, Bell-state circuit, gate actions on the x–z circle.
// node tools/figs/m5.js  → writes figs-svg/m5-*.svg
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', '..', 'figs-svg');
const f1 = (n) => +n.toFixed(1);
const poly = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1])).join(' ');
const defs = (cols) => `<defs>${cols.map((c) => `<marker id="a${c}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10z" class="df${c === 'w' ? 'w' : c}"/></marker>`).join('')}</defs>`;
const T = (x, y, s, cls = 'dt', size = 24, anchor = 'middle', extra = '') => `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}" class="${cls}"${extra}>${s}</text>`;
const L = (x1, y1, x2, y2, cls = 'ds', w = 2.5, extra = '') => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="${cls}" stroke-width="${w}"${extra}/>`;
const P = (d, cls = 'ds', w = 3, extra = '') => `<path d="${d}" class="${cls}" fill="none" stroke-width="${w}"${extra}/>`;
const svg = (h, body, cols = ['w']) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ${h}">${defs(cols)}${body}</svg>\n`;
const write = (id, s) => { fs.writeFileSync(path.join(OUT, id + '.svg'), s); console.log('wrote', id); };
const dot = (x, y, c, r = 6) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" class="df${c}"/>`;

// 1. Bloch sphere. Point (θ, φ) → screen by an oblique projection: the equator is an ellipse, x̂ points toward the viewer (lower left).
{
  const cx = 300, cy = 290, R = 190, ry = 56, t0 = (120 * Math.PI) / 180;
  const pt = (th, ph) => { const t = t0 - ph; return [cx + R * Math.sin(th) * Math.cos(t), cy + ry * Math.sin(th) * Math.sin(t) - R * Math.cos(th)]; };
  const eq = (a, b) => { const p = []; for (let i = 0; i <= 90; i++) p.push(pt(Math.PI / 2, a + ((b - a) * i) / 90)); return poly(p); };
  const scale = ([x, y], s) => [cx + (x - cx) * s, cy + (y - cy) * s];
  let b = `<circle cx="${cx}" cy="${cy}" r="${R}" class="ds" fill="none" stroke-width="2.5"/>`;
  // equator: back half dashed, front half solid (front = screen-lower half, φ from −60° to 120°)
  b += P(eq((2 * Math.PI) / 3, (5 * Math.PI) / 3), 'ds3', 2, ' stroke-dasharray="7 6"') + P(eq(-Math.PI / 3, (2 * Math.PI) / 3), 'ds', 2.5);
  const [zx, zy] = scale(pt(0, 0), 1.2), [xx, xy] = scale(pt(Math.PI / 2, 0), 1.3), [yx, yy] = scale(pt(Math.PI / 2, Math.PI / 2), 1.22);
  b += L(cx, cy, zx, zy, 'ds2', 2, ' marker-end="url(#aw)"') + L(cx, cy, xx, xy, 'ds2', 2, ' marker-end="url(#aw)"') + L(cx, cy, yx, yy, 'ds2', 2, ' marker-end="url(#aw)"');
  b += L(cx, cy, cx, cy + R, 'ds3', 1.5, ' stroke-dasharray="5 5"');
  b += T(zx + 14, zy + 8, 'z', 'dt2', 22, 'start') + T(xx - 8, xy + 20, 'x', 'dt2', 22, 'end') + T(yx + 4, yy + 26, 'y', 'dt2', 22, 'start');
  // named states
  const named = (th, ph, c, lab, dx, dy, anchor, size = 24) => { const [x, y] = pt(th, ph); return dot(x, y, c) + T(x + dx, y + dy, lab, 'dt' + c, size, anchor); };
  b += named(0, 0, 'b', '|0⟩', -14, -10, 'end', 26) + named(Math.PI, 0, 'b', '|1⟩', 14, 30, 'start', 26);
  b += named(Math.PI / 2, 0, 'g', '|+⟩', -16, -6, 'end') + named(Math.PI / 2, Math.PI, 'g', '|−⟩', 14, 26, 'start');
  b += named(Math.PI / 2, Math.PI / 2, 'y', '|+i⟩', -2, -16, 'end') + named(Math.PI / 2, -Math.PI / 2, 'y', '|−i⟩', 4, -16, 'start');
  // state vector at θ = 50°, φ = 60°, with its projection on the equatorial plane
  const th = (50 * Math.PI) / 180, ph = (60 * Math.PI) / 180, [sx, sy] = pt(th, ph), [px, py] = scale(pt(Math.PI / 2, ph), Math.sin(th));
  b += L(sx, sy, px, py, 'dso', 1.5, ' stroke-dasharray="5 5"') + L(cx, cy, px, py, 'dso', 1.5, ' stroke-dasharray="5 5"');
  b += L(cx, cy, sx, sy, 'dsr', 4, ' marker-end="url(#ar)"') + T(sx + 14, sy - 6, '|ψ⟩', 'dtr', 26, 'start');
  { const p = []; for (let i = 0; i <= 30; i++) p.push(scale(pt((th * i) / 30, ph), 0.34)); b += P(poly(p), 'dso', 2.5) + T(cx + 20, cy - 74, 'θ', 'dto', 24, 'start'); }
  { const p = []; for (let i = 0; i <= 30; i++) p.push(scale(pt(Math.PI / 2, (ph * i) / 30), 0.42)); b += P(poly(p), 'dso', 2.5) + T(cx - 16, cy + 50, 'φ', 'dto', 24, 'middle'); }
  b += T(300, 546, '|ψ⟩ = cos(θ/2)|0⟩ + e<tspan baseline-shift="super" font-size="16">iφ</tspan> sin(θ/2)|1⟩', 'dt', 23);
  b += T(300, 580, 'n = (sin θ cos φ, sin θ sin φ, cos θ)', 'dt2', 22);
  write('m5-bloch', svg(596, b, ['w', 'r']));
}

// 2. Bell-state circuit: H on qubit 1, then CNOT (control 1, target 2), states marked between the gates.
{
  const y1 = 96, y2 = 196;
  let b = T(36, y1 + 8, '|0⟩', 'dt', 24) + T(36, y2 + 8, '|0⟩', 'dt', 24);
  b += T(36, y1 - 34, 'q1', 'dt2', 22) + T(36, y2 + 46, 'q2', 'dt2', 22);
  b += L(66, y1, 566, y1, 'ds', 2.5) + L(66, y2, 566, y2, 'ds', 2.5);
  b += `<rect x="170" y="${y1 - 30}" width="60" height="60" rx="6" class="dsb" fill="none" stroke-width="3"/>` + T(200, y1 + 10, 'H', 'dtb', 28);
  b += dot(390, y1, 'o', 10) + L(390, y1, 390, y2 + 22, 'dso', 3) + `<circle cx="390" cy="${y2}" r="22" class="dso" fill="none" stroke-width="3"/>` + L(368, y2, 412, y2, 'dso', 3);
  b += T(390, y1 - 22, 'control', 'dt2', 22) + T(390, y2 + 50, 'target', 'dt2', 22);
  for (const [x, lab] of [[110, 'ψ₀'], [300, 'ψ₁'], [510, 'ψ₂']]) b += L(x, 44, x, 236, 'ds3', 1.5, ' stroke-dasharray="6 6"') + T(x, 34, lab, 'dty', 22);
  b += T(24, 300, '|ψ₀⟩ = |00⟩', 'dt', 23, 'start');
  b += T(24, 342, '|ψ₁⟩ = (H ⊗ I)|00⟩ = (|00⟩ + |10⟩)/√2', 'dt', 23, 'start');
  b += T(24, 384, '|ψ₂⟩ = CNOT|ψ₁⟩ = (|00⟩ + |11⟩)/√2', 'dto', 23, 'start');
  b += T(300, 426, 'CNOT flips q2 only in the |10⟩ term', 'dt2', 22);
  write('m5-bell-circuit', svg(446, b));
}

// 3. Gate actions in the x–z plane of the Bloch sphere: X (|0⟩ ↔ |1⟩), Z (|+⟩ ↔ |−⟩), H (mirror in the line midway between z and x).
{
  const cx = 300, cy = 250, R = 160;
  let b = `<circle cx="${cx}" cy="${cy}" r="${R}" class="ds" fill="none" stroke-width="2.5"/>`;
  b += L(cx, cy + R + 20, cx, cy - R - 26, 'ds2', 2, ' marker-end="url(#aw)"') + L(cx - R - 20, cy, cx + R + 26, cy, 'ds2', 2, ' marker-end="url(#aw)"');
  b += T(cx + 12, cy - R - 20, 'z', 'dt2', 22, 'start') + T(cx + R + 26, cy + 30, 'x', 'dt2', 22, 'end');
  b += dot(cx, cy - R, 'b', 7) + T(cx - 14, cy - R - 10, '|0⟩', 'dtb', 26, 'end');
  b += dot(cx, cy + R, 'b', 7) + T(cx - 14, cy + R + 30, '|1⟩', 'dtb', 26, 'end');
  b += dot(cx + R, cy, 'g', 7) + T(cx + R + 10, cy - 14, '|+⟩', 'dtg', 26, 'start');
  b += dot(cx - R, cy, 'g', 7) + T(cx - R - 10, cy - 14, '|−⟩', 'dtg', 26, 'end');
  const k = (R + 34) / Math.SQRT2; b += L(cx - k, cy + k, cx + k, cy - k, 'dsy', 2.5, ' stroke-dasharray="9 6"') + T(cx - k - 6, cy + k + 22, 'H mirror', 'dty', 22, 'end');
  { const p = []; for (let i = 4; i <= 26; i++) { const a = (Math.PI / 2) * (1 - i / 30); p.push([cx + (R + 20) * Math.cos(a), cy - (R + 20) * Math.sin(a)]); } b += P(poly(p), 'dsy', 3, ' marker-end="url(#ay)"'); }
  b += L(cx - 44, cy - R + 30, cx - 44, cy + R - 30, 'dsr', 3, ' marker-end="url(#ar)" marker-start="url(#ar)"') + T(cx - 56, cy + 96, 'X', 'dtr', 26, 'end');
  b += L(cx - R + 30, cy + 48, cx + R - 30, cy + 48, 'dso', 3, ' marker-end="url(#ao)" marker-start="url(#ao)"') + T(cx + 70, cy + 82, 'Z', 'dto', 26);
  b += T(170, 486, 'X: |0⟩ ↔ |1⟩', 'dt', 23) + T(430, 486, 'Z: |+⟩ ↔ |−⟩', 'dt', 23);
  b += T(300, 520, 'H: |0⟩ ↔ |+⟩ and |1⟩ ↔ |−⟩', 'dt', 23);
  write('m5-gate-actions', svg(540, b, ['w', 'r', 'o', 'y']));
}
