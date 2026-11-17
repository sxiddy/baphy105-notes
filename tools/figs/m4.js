// Module 4 diagrams: every curve computed (box sines, continuity-matched tunnelling wave, exact T formula).
// node tools/figs/m4.js  → writes figs-svg/m4-*.svg
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

const cls = ['dsb', 'dso', 'dsg'], tcls = ['dtb', 'dto', 'dtg'];

// 1. Infinite well: ψn (left) and |ψn|² (right) drawn on their energy levels (E ∝ n²).
{
  let b = '';
  const panel = (x0, sq, title) => {
    let s = L(x0, 40, x0, 410, 'ds', 5) + L(x0 + 220, 40, x0 + 220, 410, 'ds', 5) + L(x0, 410, x0 + 220, 410, 'ds', 2.5) + T(x0 + 110, 440, title, 'dt', 24);
    s += T(x0, 470, '0', 'dt2', 22) + T(x0 + 220, 470, 'a', 'dt2', 22);
    for (let n = 1; n <= 3; n++) {
      const y = 410 - n * n * 37, pts = [];
      for (let i = 0; i <= 120; i++) { const u = i / 120, v = Math.sin(n * Math.PI * u); pts.push([x0 + 220 * u, y - (sq ? 44 * v * v : 30 * v)]); }
      s += L(x0, y, x0 + 220, y, 'ds3', 1.5, ' stroke-dasharray="6 6"') + P(poly(pts), cls[n - 1], 3.5);
    }
    return s;
  };
  b += panel(40, false, 'ψₙ(x)') + panel(330, true, '|ψₙ(x)|²');
  for (let n = 1; n <= 3; n++) b += T(300, 410 - n * n * 37 + 8, ['E₁', '4E₁', '9E₁'][n - 1], tcls[n - 1], 22);
  write('m4-box', svg(490, b));
}

// 2. Tunnelling: Re ψ oscillates, decays as e^(−κx) inside, leaves with smaller amplitude (value and slope matched at both walls).
{
  const x1 = 220, x2 = 360, k1 = 0.075, kap = 0.016, y0 = 250, A = 60;
  const phi = Math.atan(kap / k1), C = 1 / Math.cos(phi), D = Math.exp(-kap * (x2 - x1)) / Math.cos(phi), pts = [];
  for (let x = 20; x <= 580; x += 2) {
    let v; if (x < x1) v = C * Math.cos(k1 * (x - x1) + phi); else if (x <= x2) v = Math.exp(-kap * (x - x1)); else v = D * Math.cos(k1 * (x - x2) + phi);
    pts.push([x, y0 - A * v]);
  }
  let b = `<rect x="${x1}" y="110" width="${x2 - x1}" height="${y0 + 90 - 110}" class="dfo" fill-opacity=".14"/>` + L(x1, 110, x2, 110, 'dso', 3) + L(x1, 110, x1, y0 + 90, 'dso', 2) + L(x2, 110, x2, y0 + 90, 'dso', 2);
  b += L(20, y0 + 90, 580, y0 + 90, 'ds', 2.5) + L(20, 170, 580, 170, 'dsy', 2, ' stroke-dasharray="8 6"') + T(24, 160, 'E', 'dty', 24, 'start') + T(x2 - 8, 100, 'U', 'dto', 24, 'end');
  b += P(poly(pts), 'dsb', 3.5);
  b += T(110, 390, 'I: incident +', 'dt2', 22) + T(110, 418, 'reflected', 'dt2', 22) + T(290, 390, 'II: decays', 'dt2', 22) + T(290, 418, 'width L', 'dt2', 22) + T(480, 390, 'III: transmitted', 'dt2', 22) + T(480, 418, '(smaller)', 'dt2', 22);
  b += T(300, 460, 'E &lt; U, yet ψ is not zero beyond the barrier', 'dt', 23);
  write('m4-tunnel', svg(480, b));
}

// 3. Transmission T from the exact formula, electron with E = 5 eV: T vs width (U = 10 eV) and T vs U − E (L = 0.2 nm).
{
  const h = 6.626e-34, hb = h / (2 * Math.PI), me = 9.1e-31, e = 1.6e-19;
  const Tx = (E, U, L) => { const k2 = Math.sqrt(2 * me * (U - E) * e) / hb; return 1 / (1 + (U * U * Math.sinh(k2 * L) ** 2) / (4 * E * (U - E))); };
  const plot = (x0, f, xmax, xl, title, ticks) => {
    const w = 210, hh = 250, y0 = 340, pts = [];
    for (let i = 1; i <= 120; i++) { const u = (xmax * i) / 120; pts.push([x0 + (w * i) / 120, y0 - hh * f(u)]); }
    let s = axes(x0, y0, w + 16, hh + 56, xl, 'T') + P(poly(pts), 'dsb', 3.5) + T(x0 + w / 2, 400, title, 'dt', 22);
    for (const [v, lab] of ticks) s += L(x0 + (w * v) / xmax, y0, x0 + (w * v) / xmax, y0 + 8, 'ds', 2) + T(x0 + (w * v) / xmax, y0 + 30, lab, 'dt2', 20);
    return s + T(x0 - 8, y0 - hh + 6, '1', 'dt2', 20, 'end');
  };
  let b = plot(50, (Lnm) => Tx(5, 10, Lnm * 1e-9), 0.6, '', 'T vs width L', [[0.2, '0.2'], [0.4, '0.4 nm']]);
  b += plot(340, (d) => Tx(5, 5 + d, 0.2e-9), 10, '', 'T vs U − E', [[5, '5'], [10, '10 eV']]);
  b += T(300, 440, 'Both fall roughly as e^(−2k₂L), k₂ = √(2m(U − E))/ℏ', 'dt', 22);
  write('m4-tplots', svg(460, b));
}

// 4. 3D cubic box: energy levels in units of E₀ = π²ℏ²/2ma² with degeneracies.
{
  const lv = [[3, '(1,1,1)', 1], [6, '(2,1,1) ×3', 3], [9, '(2,2,1) ×3', 3], [11, '(3,1,1) ×3', 3], [12, '(2,2,2)', 1], [14, '(1,2,3) ×6', 6]];
  let b = L(40, 450, 40, 30, 'ds', 2.5, ' marker-end="url(#aw)"') + T(52, 34, 'E / E₀', 'dt2', 22, 'start');
  for (const [s2, lab, g] of lv) { const y = 470 - (s2 - 2) * 34; b += L(90, y, 300, y, g > 1 ? 'dsb' : 'dso', 3.5) + T(80, y + 8, String(s2), 'dt2', 22, 'end') + T(316, y + 8, lab, 'dt', 22, 'start') + T(590, y + 8, g > 1 ? `g = ${g}` : 'g = 1', g > 1 ? 'dtb' : 'dto', 22, 'end'); }
  b += T(300, 510, 'E = E₀(nₓ² + n<tspan baseline-shift="sub" font-size="16">y</tspan>² + n<tspan baseline-shift="sub" font-size="16">z</tspan>²): same sum → same energy', 'dt', 22);
  write('m4-3d-levels', svg(530, b));
}
