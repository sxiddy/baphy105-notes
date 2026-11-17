// Module 1 diagrams. Curves are computed from the formulas (Planck, Rayleigh–Jeans, slit patterns), not traced.
// node tools/figs/m1.js  → writes figs-svg/m1-*.svg
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

// 1. EM wave
{
  const y0 = 170, x0 = 40, W = 500;
  const E = [], B = [];
  for (let i = 0; i <= 200; i++) { const x = x0 + (W * i) / 200, s = Math.sin((4 * Math.PI * i) / 200); E.push([x, y0 - 95 * s]); B.push([x + 40 * s * 0.0, y0 + 42 * s]); }
  let ticksE = '', ticksB = '';
  for (let i = 5; i < 200; i += 10) { ticksE += L(E[i][0], y0, E[i][0], E[i][1], 'dsb', 1.5, ' stroke-opacity=".6"'); ticksB += L(B[i][0], y0, B[i][0] - 0, B[i][1], 'dso', 1.5, ' stroke-opacity=".6"'); }
  write('m1-em-wave', svg(340, axes(x0, y0, W + 20, 0, '', '') + L(x0, y0, x0, 40, 'ds', 2.5, ' marker-end="url(#aw)"')
    + ticksE + ticksB + P(poly(E), 'dsb', 3.5) + P(poly(B), 'dso', 3.5)
    + T(x0 + 14, 50, 'E (electric field)', 'dtb', 24, 'start') + T(x0 + W - 10, y0 + 80, 'B (magnetic field)', 'dto', 24, 'end')
    + T(x0 + W + 18, y0 - 12, 'x', 'dt2', 24, 'end') + T(300, 300, 'E ⟂ B ⟂ direction of travel; speed c', 'dt', 24)
    + T(300, 332, 'B is drawn flattened (it points into the page)', 'dt3', 22)));
}

// 2. Constructive and destructive interference (stacked)
{
  const panel = (y, phase, title) => {
    const a = [], b = [], s = [];
    for (let i = 0; i <= 160; i++) { const x = 70 + (460 * i) / 160, t = (4 * Math.PI * i) / 160; a.push([x, y - 26 * Math.sin(t)]); b.push([x, y + 70 - 26 * Math.sin(t + phase)]); s.push([x, y + 165 - 26 * (Math.sin(t) + Math.sin(t + phase))]); }
    return T(300, y - 48, title, 'dt', 26) + P(poly(a), 'dsb', 3) + P(poly(b), 'dso', 3) + P(poly(s), 'dsg', 3.5)
      + T(60, y + 8, 'wave 1', 'dtb', 22, 'end') + T(60, y + 78, 'wave 2', 'dto', 22, 'end') + T(60, y + 173, 'sum', 'dtg', 22, 'end')
      + L(70, y + 112, 530, y + 112, 'ds3', 1.5, ' stroke-dasharray="6 6"');
  };
  write('m1-interference', svg(610, panel(70, 0, 'In phase: constructive (bigger wave)') + panel(390, Math.PI, 'Out of phase: destructive (cancel)')
));
}

// 3. Young's double slit
{
  let b = '';
  // source and rays
  b += `<circle cx="50" cy="210" r="12" class="dfy"/>` + T(50, 255, 'source', 'dt2', 22) + T(50, 282, '(one λ)', 'dt3', 22);
  b += L(150, 60, 150, 180, 'ds', 7) + L(150, 194, 150, 226, 'ds', 7) + L(150, 240, 150, 360, 'ds', 7);
  b += T(150, 46, 'double slit', 'dt2', 22) + T(178, 192, 'S₁', 'dt', 22, 'start') + T(178, 246, 'S₂', 'dt', 22, 'start');
  b += L(62, 210, 150, 187, 'dsy', 2) + L(62, 210, 150, 233, 'dsy', 2);
  for (const r of [70, 110, 150]) b += P(`M ${150 + r * 0.42} ${187 - r * 0.9} A ${r} ${r} 0 0 1 ${150 + r * 0.42} ${187 + r * 0.9}`, 'dsb', 1.8, ' stroke-opacity=".7"') + P(`M ${150 + r * 0.42} ${233 - r * 0.9} A ${r} ${r} 0 0 1 ${150 + r * 0.42} ${233 + r * 0.9}`, 'dso', 1.8, ' stroke-opacity=".7"');
  // screen and intensity pattern I ∝ cos²(k y)
  b += L(420, 50, 420, 370, 'ds', 5) + T(420, 400, 'screen', 'dt2', 22);
  const pts = [];
  for (let i = 0; i <= 240; i++) { const y = 60 + (300 * i) / 240, u = (y - 210) / 300; const env = Math.exp(-(u * u) * 6); pts.push([430 + 120 * env * Math.cos(Math.PI * u * 7) ** 2, y]); }
  b += P(poly(pts), 'dsg', 3);
  b += T(600, 195, 'bright', 'dtg', 22, 'end') + T(590, 438, 'bright: Δx = nλ   dark: Δx = (2n+1)λ/2', 'dt', 22, 'end');
  b += L(150, 187, 420, 120, 'ds2', 1.5, ' stroke-dasharray="5 5"') + L(150, 233, 420, 120, 'ds2', 1.5, ' stroke-dasharray="5 5"') + `<circle cx="420" cy="120" r="5" class="dfw"/>` + T(405, 112, 'P', 'dt', 22, 'end');
  write('m1-ydse', svg(460, b));
}

// Planck and Rayleigh–Jeans helpers (SI)
const h = 6.626e-34, kB = 1.381e-23, c = 2.998e8;
const planck = (nu, T) => (8 * Math.PI * h * nu ** 3) / c ** 3 / (Math.exp((h * nu) / (kB * T)) - 1);
const rj = (nu, T) => (8 * Math.PI * nu * nu * kB * T) / c ** 3;

// 4. Blackbody spectra vs frequency for three temperatures (1200, 1500, 1800 K, as in the course figure)
{
  const x0 = 80, y0 = 380, W = 470, H = 320, numax = 3.0e14, Ts = [1200, 1500, 1800];
  const umax = planck(5.88e10 * 1800, 1800) * 1.08;
  const cls = ['dsr', 'dso', 'dsy'], tcls = ['dtr', 'dto', 'dty'];
  let b = axes(x0, y0, W + 20, H + 10, 'ν (frequency)', '');
  b += T(x0 + 8, y0 - H - 6, 'u(ν)', 'dt2', 24, 'start');
  Ts.forEach((T_, k) => {
    const pts = [];
    for (let i = 1; i <= 200; i++) { const nu = (numax * i) / 200; pts.push([x0 + (W * nu) / numax, y0 - (H * planck(nu, T_)) / umax]); }
    b += P(poly(pts), cls[k], 3.5);
    const nup = 5.88e10 * T_, up = planck(nup, T_), px = x0 + (W * nup) / numax, py = y0 - (H * up) / umax;
    b += `<circle cx="${f1(px)}" cy="${f1(py)}" r="5" class="dfw"/>` + T(f1(px + 10), f1(py - 10), T_ + ' K', tcls[k], 24, 'start');
  });
  b += T(300, 452, 'Peak ν<tspan dy="6" font-size="18">max</tspan><tspan dy="-6"> ∝ T (Wien); area ∝ T⁴</tspan>', 'dt', 24);
  write('m1-blackbody', svg(470, b));
}

// 5. Ultraviolet catastrophe: Rayleigh–Jeans vs Planck at 1500 K
{
  const x0 = 80, y0 = 380, W = 470, H = 320, numax = 2.4e14, T_ = 1500;
  const umax = planck(5.88e10 * T_, T_) * 1.9;
  let b = axes(x0, y0, W + 20, H + 10, 'ν (frequency)', '') + T(x0 + 8, y0 - H - 6, 'u(ν)', 'dt2', 24, 'start');
  const p = [], r = [];
  for (let i = 1; i <= 200; i++) { const nu = (numax * i) / 200; p.push([x0 + (W * nu) / numax, y0 - (H * planck(nu, T_)) / umax]); const ry = y0 - (H * rj(nu, T_)) / umax; if (ry > y0 - H - 10) r.push([x0 + (W * nu) / numax, ry]); }
  b += P(poly(r), 'dsr', 3.5, ' stroke-dasharray="10 6"') + P(poly(p), 'dsb', 3.5);
  b += T(r[r.length - 1][0] + 12, r[r.length - 1][1] + 26, 'Rayleigh–Jeans', 'dtr', 24, 'start') + T(r[r.length - 1][0] + 12, r[r.length - 1][1] + 54, '→ ∞ (ν² rise)', 'dtr', 22, 'start');
  b += T(560, 245, 'Planck = experiment', 'dtb', 24, 'end') + T(300, 452, 'T = 1500 K: classical theory fails at high ν', 'dt', 24);
  write('m1-uv-catastrophe', svg(470, b));
}

// 6. Compton scattering
{
  let b = defs(['b', 'o', 'g']).replace('<defs>', '').replace('</defs>', '');
  const wave = (x1, y1, x2, y2, n, cls) => { const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len; const pts = []; for (let i = 0; i <= 120; i++) { const s = (len * i) / 120, a = 9 * Math.sin((2 * Math.PI * n * i) / 120); pts.push([x1 + ux * s - uy * a, y1 + uy * s + ux * a]); } return P(poly(pts), cls, 2.8); };
  b = '';
  b += wave(30, 200, 250, 200, 9, 'dsb') + L(240, 200, 262, 200, 'dsb', 2.8, ' marker-end="url(#ab)"');
  b += T(130, 170, 'photon λ, E = hν', 'dtb', 22) + T(130, 240, 'p = h/λ', 'dtb', 22);
  b += `<circle cx="290" cy="200" r="16" class="dfg"/>` + T(290, 262, 'electron', 'dtg', 22) + T(290, 288, 'at rest', 'dtg', 22);
  const th = (40 * Math.PI) / 180;
  b += wave(306, 190, 306 + 200 * Math.cos(th), 190 - 200 * Math.sin(th), 6, 'dso') + L(306 + 200 * Math.cos(th) - 4, 190 - 200 * Math.sin(th) + 3, 306 + 214 * Math.cos(th), 190 - 214 * Math.sin(th), 'dso', 2.8, ' marker-end="url(#ao)"');
  b += T(560, 40, 'scattered photon λ′ > λ', 'dto', 22, 'end');
  const ph = (35 * Math.PI) / 180;
  b += L(306, 212, 306 + 190 * Math.cos(ph), 212 + 190 * Math.sin(ph), 'dsg', 3, ' marker-end="url(#ag)"') + T(560, 360, 'recoil electron', 'dtg', 22, 'end');
  b += L(306, 200, 560, 200, 'ds3', 1.5, ' stroke-dasharray="6 6"');
  b += P(`M ${306 + 90} 200 A 90 90 0 0 0 ${f1(306 + 90 * Math.cos(th))} ${f1(200 - 90 * Math.sin(th))}`, 'ds2', 2) + T(410, 180, 'θ', 'dt', 24, 'start');
  b += P(`M ${306 + 70} 200 A 70 70 0 0 1 ${f1(306 + 70 * Math.cos(ph))} ${f1(200 + 70 * Math.sin(ph))}`, 'ds2', 2) + T(388, 236, 'φ', 'dt', 24, 'start');
  b += T(300, 420, 'Δλ = λ′ − λ = (h / m<tspan dy="6" font-size="18">e</tspan><tspan dy="-6">c)(1 − cos θ)</tspan>', 'dt', 24);
  write('m1-compton', svg(450, b, ['b', 'o', 'g']));
}

// 7. Double slit with classical particles vs electrons
{
  const panel = (y, quantum) => {
    const x0 = 70, W = 460, H = 150;
    let b = T(300, y - H - 18, quantum ? 'Electrons: P₁₂ = |Ψ₁ + Ψ₂|² (fringes)' : 'Tennis balls: P₁₂ = P₁ + P₂', 'dt', 24) + L(x0, y, x0 + W, y, 'ds', 2);
    const g = (u, m) => Math.exp(-((u - m) ** 2) / 0.05);
    const p1 = [], p2 = [], p12 = [];
    for (let i = 0; i <= 200; i++) { const u = -1 + (2 * i) / 200, x = x0 + (W * i) / 200; const a = g(u, -0.18), bb = g(u, 0.18); p1.push([x, y - H * 0.45 * a]); p2.push([x, y - H * 0.45 * bb]); const s = quantum ? (Math.sqrt(a) * Math.cos(u * 22) ** 0 + 0) : 0; const env = g(u, 0); p12.push([x, y - (quantum ? H * 0.95 * env * Math.cos(9 * u) ** 2 : H * 0.45 * (a + bb))]); }
    b += P(poly(p1), 'dsy', 2.5, ' stroke-dasharray="7 5"') + P(poly(p2), 'dsb', 2.5, ' stroke-dasharray="7 5"') + P(poly(p12), 'dsg', 3.5);
    return b;
  };
  let b = panel(210, false) + panel(470, true);
  b += T(300, 520, 'dashed: one slit open (P₁ yellow, P₂ blue)', 'dt2', 22) + T(300, 550, 'green: both slits open', 'dtg', 22);
  write('m1-double-slit-particles', svg(570, b));
}

// 8. Stern–Gerlach
{
  let b = '';
  b += `<rect x="20" y="170" width="80" height="80" rx="8" class="df3"/>` + T(60, 220, 'oven', 'dt', 22) + T(60, 280, 'Ag atoms', 'dt2', 22);
  b += L(130, 180, 130, 202, 'ds', 6) + L(130, 218, 130, 240, 'ds', 6) + T(130, 166, 'slit', 'dt3', 22);
  b += L(100, 210, 240, 210, 'dsy', 3);
  // magnet: N shaped wedge on top, S flat below
  b += `<path d="M 240 120 L 380 120 L 380 175 L 320 195 L 300 195 L 240 175 Z" class="dfr" fill-opacity=".35"/>` + T(310, 155, 'N', 'dt', 28);
  b += `<rect x="240" y="240" width="140" height="50" class="dfb" fill-opacity=".35"/>` + T(310, 274, 'S', 'dt', 28);
  b += T(310, 325, 'non-uniform B (mostly along z)', 'dt2', 22);
  b += P('M 240 210 C 330 210 380 190 470 150', 'dsy', 3) + P('M 240 210 C 330 210 380 230 470 270', 'dsy', 3);
  b += L(480, 90, 480, 330, 'ds', 5) + T(480, 360, 'screen', 'dt2', 22);
  b += `<ellipse cx="480" cy="148" rx="10" ry="14" class="dfg"/><ellipse cx="480" cy="272" rx="10" ry="14" class="dfg"/>`;
  b += T(500, 140, 'S<tspan dy="6" font-size="18">z</tspan><tspan dy="-6"> = +ℏ/2</tspan>', 'dtg', 22, 'start') + T(500, 290, 'S<tspan dy="6" font-size="18">z</tspan><tspan dy="-6"> = −ℏ/2</tspan>', 'dtg', 22, 'start');
  b += L(30, 60, 30, 20, 'ds2', 2, ' marker-end="url(#aw)"') + T(46, 34, 'z', 'dt2', 22, 'start');
  // expected vs observed strip
  b += T(300, 410, 'Expected (classical): one continuous smear', 'dt2', 22) + `<rect x="150" y="425" width="300" height="22" rx="11" class="dfo" fill-opacity=".45"/>`;
  b += T(300, 490, 'Observed: exactly two spots', 'dtg', 22) + `<ellipse cx="230" cy="516" rx="40" ry="11" class="dfg"/><ellipse cx="370" cy="516" rx="40" ry="11" class="dfg"/>`;
  write('m1-stern-gerlach', svg(540, b));
}
