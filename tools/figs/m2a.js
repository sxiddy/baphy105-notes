// Generates the chunk-2a figures (diodes, Zener, BJT) into figs-svg/. Usage: node tools/figs/m2a.js figs-svg
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';

const MK = ['w', 'b', 'o', 'r', 'g'].map(c => `<marker id="a${c}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="13" markerHeight="13" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" class="df${c}"/></marker>`).join('');
const f1 = n => Math.round(n * 10) / 10;
const svg = (h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ${h}">\n<defs>${MK}</defs>\n${body}\n</svg>\n`;
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.size || 24}" class="${o.c || 'dt'}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.w ? ` font-weight="${o.w}"` : ''}${o.i ? ' font-style="italic"' : ''}>${s}</text>`;
const sub = (a, b) => `${a}<tspan dy="7" font-size="22">${b}</tspan>`;
const L = (x1, y1, x2, y2, o = {}) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" class="${o.c || 'ds'}" stroke-width="${o.w || 2.5}" fill="none"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.arrow ? ` marker-end="url(#a${o.arrow})"` : ''}/>`;
const P = (d, o = {}) => `<path d="${d}" class="${o.c || 'ds'}" stroke-width="${o.w || 2.5}" fill="${o.fill || 'none'}"${o.fc ? ` fill-opacity="${o.fc}"` : ''} stroke-linejoin="round" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.arrow ? ` marker-end="url(#a${o.arrow})"` : ''}/>`;
const poly = pts => pts.map(p => p.map(f1).join(' ')).join('L');
const pl = (pts, o) => P('M' + poly(pts), o);
const R = (x, y, w, h, cls, op) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${cls}" fill-opacity="${op}" stroke="none"/>`;

// resistor horizontal from (x,y) to (x+len,y)
function resH(x, y, len = 70) {
  const n = 6, step = (len - 14) / n;
  let pts = [[x, y], [x + 7, y]];
  for (let i = 0; i < n; i++) pts.push([x + 7 + step * (i + 0.5), y + (i % 2 ? 13 : -13)]);
  pts.push([x + len - 7, y], [x + len, y]);
  return pl(pts);
}
function resV(x, y, len = 70) {
  const n = 6, step = (len - 14) / n;
  let pts = [[x, y], [x, y + 7]];
  for (let i = 0; i < n; i++) pts.push([x + (i % 2 ? 13 : -13), y + 7 + step * (i + 0.5)]);
  pts.push([x, y + len - 7], [x, y + len]);
  return pl(pts);
}
// diode symbol centred at (cx,cy), pointing along angle (deg), size s (triangle height)
function diode(cx, cy, ang, o = {}) {
  const s = o.s || 22;
  return `<g transform="translate(${cx} ${cy}) rotate(${ang})">${o.noLead ? '' : L(-s - 14, 0, s + 14, 0)}${P(`M${-s} ${-s * 0.9}L${s} 0L${-s} ${s * 0.9}Z`, { fill: 'none', c: o.c || 'ds' })}${L(s, -s * 0.9, s, s * 0.9)}</g>`;
}
function acSource(cx, cy, r = 28) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" class="ds" fill="none" stroke-width="2.5"/>` + P(`M${cx - 16} ${cy}C${cx - 9} ${cy - 21} ${cx - 3} ${cy - 21} ${cx} ${cy}S${cx + 9} ${cy + 21} ${cx + 16} ${cy}`);
}
function battery(cx, cy) { // horizontal, long plate (+) on the left
  return L(cx - 40, cy, cx - 12, cy) + L(cx - 12, cy - 26, cx - 12, cy + 26, { w: 4 }) + L(cx + 12, cy - 14, cx + 12, cy + 14, { w: 4 }) + L(cx + 12, cy, cx + 40, cy);
}
function ground(x, y) { return L(x, y, x, y + 12) + L(x - 18, y + 12, x + 18, y + 12) + L(x - 11, y + 20, x + 11, y + 20) + L(x - 4, y + 28, x + 4, y + 28); }
function sine(x0, y0, w, a, periods, mode) { // mode: 'full' | 'half' | 'rect'
  const N = 120, pts = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, th = t * periods * 2 * Math.PI;
    let v = Math.sin(th);
    if (mode === 'half') v = Math.max(0, v);
    if (mode === 'rect') v = Math.abs(v);
    pts.push([x0 + t * w, y0 - v * a]);
  }
  return pl(pts, { c: 'dsb', w: 3 });
}
// transistor symbol; flip=-1 puts emitter on top (used for PNP). returns svg + terminal coordinates
function bjt(cx, cy, npn, flip = 1) {
  const s = flip;
  let g = `<circle cx="${cx}" cy="${cy}" r="62" class="ds" fill="none" stroke-width="2.5"/>`;
  g += L(cx - 110, cy, cx - 22, cy) + L(cx - 22, cy - 32, cx - 22, cy + 32, { w: 5 });
  g += L(cx - 22, cy - 16 * s, cx + 28, cy - 52 * s) + L(cx + 28, cy - 52 * s, cx + 28, cy - 110 * s);
  g += L(cx - 22, cy + 16 * s, cx + 28, cy + 52 * s) + L(cx + 28, cy + 52 * s, cx + 28, cy + 110 * s);
  // arrow on the emitter leg (lower leg for flip=1, upper leg for flip=-1 in this drawing the emitter is the leg opposite the collector)
  const ex = cx + 28, ey = cy + 52 * s, bx = cx - 22, by = cy + 16 * s;
  const dx = ex - bx, dy = ey - by, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
  let tipx, tipy, dirx, diry;
  if (npn) { tipx = bx + dx * 0.88; tipy = by + dy * 0.88; dirx = ux; diry = uy; }
  else { tipx = bx + dx * 0.18; tipy = by + dy * 0.18; dirx = -ux; diry = -uy; }
  const px = -diry, py = dirx, a = 15, b = 8;
  g += P(`M${f1(tipx)} ${f1(tipy)}L${f1(tipx - dirx * a + px * b)} ${f1(tipy - diry * a + py * b)}L${f1(tipx - dirx * a - px * b)} ${f1(tipy - diry * a - py * b)}Z`, { c: 'dsb', fill: 'currentColor' }).replace('fill="currentColor"', 'class="dfb ds" fill-opacity="1"').replace('class="dsb"', '');
  return { g, B: [cx - 110, cy], C: [cx + 28, cy - 110 * s], E: [cx + 28, cy + 110 * s] };
}
function cleanArrow(g) { return g; }

const figs = {};

// 1. PN junction bias
{
  const panel = (y, fwd, title) => {
    const dep = fwd ? 36 : 110, x0 = 60, x1 = 540, mid = 300, h = 100;
    let s = T(20, y + 4, title, { size: 26, w: 600 });
    const top = y + 20;
    s += R(x0, top, mid - dep / 2 - x0, h, 'dfr', 0.22) + R(mid + dep / 2, top, x1 - mid - dep / 2, h, 'dfb', 0.22) + R(mid - dep / 2, top, dep, h, 'df3', 0.9);
    s += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${h}" class="ds" fill="none" stroke-width="2.5"/>`;
    s += T(x0 + 28, top + 64, 'P', { size: 36, anchor: 'middle', c: 'dtr', w: 600 }) + T(x1 - 28, top + 64, 'N', { size: 36, anchor: 'middle', c: 'dtb', w: 600 });
    // carrier arrows
    const hy = top + 62, ey = top + 62;
    if (fwd) {
      s += L(105, hy, 225, hy, { c: 'dsr', w: 3, arrow: 'r' }) + T(165, hy - 14, 'holes', { size: 22, anchor: 'middle', c: 'dtr' });
      s += L(495, ey, 375, ey, { c: 'dsb', w: 3, arrow: 'b' }) + T(435, ey - 14, 'electrons', { size: 22, anchor: 'middle', c: 'dtb' });
    } else {
      s += L(225, hy, 105, hy, { c: 'dsr', w: 3, arrow: 'r' }) + T(165, hy - 14, 'holes', { size: 22, anchor: 'middle', c: 'dtr' });
      s += L(375, ey, 495, ey, { c: 'dsb', w: 3, arrow: 'b' }) + T(435, ey - 14, 'electrons', { size: 22, anchor: 'middle', c: 'dtb' });
    }
    s += T(mid, top - 4 + h + 28 + 4, 'depletion region', { size: 22, anchor: 'middle', c: 'dt2' });
    // wires and battery
    const wy = top + h + 100;
    s += L(x0 + 30, top + h, x0 + 30, wy) + L(x1 - 30, top + h, x1 - 30, wy) + L(x0 + 30, wy, mid - 40, wy) + L(mid + 40, wy, x1 - 30, wy);
    s += battery(mid, wy);
    const left = fwd ? '+' : '−', right = fwd ? '−' : '+';
    s += T(mid - 56, wy - 12, left, { size: 28, anchor: 'middle', w: 600 }) + T(mid + 56, wy - 12, right, { size: 28, anchor: 'middle', w: 600 });
    return s;
  };
  figs['m2-pn-bias'] = svg(640, panel(34, true, 'Forward bias: barrier gone, current flows') + panel(350, false, 'Reverse bias: wider depletion region'));
}

// diode / zener axes helper
function axes(x0, y0, xl, xr, yt, yb, xlab, ylabT, ylabB, xlabL) {
  return L(xl, y0, xr, y0, { arrow: 'w', w: 2.5 }) + L(x0, yb, x0, yt, { arrow: 'w', w: 2.5 }) + L(x0, yb, x0, y0) +
    T(xr, y0 + 30, xlab, { size: 22, anchor: 'end' }) + T(xl, y0 + 30, xlabL, { size: 22 }) + T(x0 + 12, yt + 14, ylabT, { size: 22 }) + T(x0 + 12, yb, ylabB, { size: 22 });
}

// 2. Diode V-I
{
  const x0 = 300, y0 = 300;
  let s = T(20, 34, 'Diode V–I characteristic', { size: 26, w: 600 });
  s += axes(x0, y0, 40, 570, 60, 470, '+V forward', '+I', '−I', '−V reverse');
  // forward curve
  s += P(`M${x0} ${y0}C${x0 + 40} ${y0 - 2} ${x0 + 80} ${y0 - 6} ${x0 + 105} ${y0 - 22}S${x0 + 150} ${y0 - 150} ${x0 + 175} ${y0 - 215}`, { c: 'dsb', w: 4 });
  // reverse curve
  s += P(`M${x0} ${y0}L${x0 - 70} ${y0 + 6}L${x0 - 100} ${y0 + 10}C${x0 - 112} ${y0 + 14} ${x0 - 112} ${y0 + 50} ${x0 - 112} ${y0 + 160}`, { c: 'dsb', w: 4 });
  s += L(x0 + 105, y0 + 8, x0 + 105, y0 - 22, { c: 'ds3', dash: '5 5' });
  s += T(x0 + 100, y0 + 54, 'knee', { size: 22, anchor: 'middle', c: 'dt2' });
  s += T(x0 + 100, y0 + 80, '0.3 V Ge', { size: 22, anchor: 'middle', c: 'dto' }) + T(x0 + 100, y0 + 106, '0.7 V Si', { size: 22, anchor: 'middle', c: 'dto' });
  s += T(x0 + 14, 110, 'forward current', { size: 22, c: 'dt2' });
  s += T(x0 - 20, y0 + 150, 'breakdown', { size: 22, anchor: 'end', c: 'dtr' }) + T(x0 - 20, y0 + 176, 'voltage', { size: 22, anchor: 'end', c: 'dtr' });
  s += T(x0 - 130, y0 - 54, 'leakage current', { size: 22, anchor: 'middle', c: 'dt2' }) + L(x0 - 70, y0 - 40, x0 - 70, y0 + 3, { c: 'ds2', arrow: 'w', w: 2 });
  s += T(40, 500, 'Leakage: below 20 µA (Si), below 50 µA (Ge)', { size: 22, c: 'dt2' });
  figs['m2-diode-vi'] = svg(520, s);
}

// 3. Rectifiers
{
  let s = T(20, 34, 'Half-wave rectifier', { size: 26, w: 600 });
  // circuit
  s += acSource(80, 110) + L(80, 82, 80, 70) + L(80, 70, 210, 70) + diode(250, 70, 0) + L(290, 70, 520, 70) + L(520, 70, 520, 92) + resV(520, 92, 56) + L(520, 148, 520, 150) + L(520, 150, 80, 150) + L(80, 150, 80, 138);
  s += T(250, 112, 'diode', { size: 22, anchor: 'middle', c: 'dt2' }) + T(556, 126, 'R', { size: 24, anchor: 'middle' }) + T(130, 182, 'AC supply', { size: 22, c: 'dt2', anchor: 'middle' });
  // waveforms
  s += T(20, 205, 'Input', { size: 22, c: 'dt2' }) + L(120, 245, 560, 245, { c: 'ds2', w: 1.5 }) + sine(120, 245, 440, 30, 2, 'full');
  s += T(20, 305, 'Output', { size: 22, c: 'dt2' }) + L(120, 335, 560, 335, { c: 'ds2', w: 1.5 }) + sine(120, 335, 440, 30, 2, 'half');
  s += T(340, 372, 'one half-cycle blocked', { size: 22, anchor: 'middle', c: 'dto' });

  const by = 410;
  s += T(20, by + 24, 'Full-wave bridge rectifier', { size: 26, w: 600 });
  const cx = 320, cy = by + 125, d = 85; // diamond centre
  const Tn = [cx, cy - d], Bn = [cx, cy + d], Ln = [cx - d, cy], Rn = [cx + d, cy];
  // diodes on edges, direction of conduction: L->T, R->T (anode at L/R), B->L, B->R
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  const edge = (a, b, name, lx, ly, anc) => { const m = mid(a, b); const ln = Math.hypot(b[0]-a[0], b[1]-a[1]), ux=(b[0]-a[0])/ln, uy=(b[1]-a[1])/ln; return L(a[0],a[1],m[0]-ux*16,m[1]-uy*16) + L(m[0]+ux*16,m[1]+uy*16,b[0],b[1]) + diode(m[0], m[1], ang(a, b), { s: 14, noLead: true }) + T(lx, ly, name, { size: 22, anchor: anc, c: 'dt2' }); };
  s += edge(Ln, Tn, sub('D', '1'), cx - d / 2 - 38, cy - d / 2 - 10, 'end');
  s += edge(Rn, Tn, sub('D', '2'), cx + d / 2 + 38, cy - d / 2 - 10, 'start');
  s += edge(Bn, Ln, sub('D', '3'), cx - d / 2 - 38, cy + d / 2 + 24, 'end');
  s += edge(Bn, Rn, sub('D', '4'), cx + d / 2 + 38, cy + d / 2 + 24, 'start');
  // trim: the diode helper draws its own leads; draw plain wire between node and diode ends via corner dots
  // source on the left connects to L node; R node loops round the bottom
  s += acSource(90, cy) + L(118, cy, Ln[0], cy) + L(90, cy + 28, 90, cy + 160) + L(90, cy + 160, 520, cy + 160) + L(520, cy + 160, 520, cy) + L(520, cy, Rn[0], cy);
  // load inside the diamond between T and B
  s += L(Tn[0], Tn[1], Tn[0], cy - 38) + resV(cx, cy - 38, 76) + L(cx, cy + 38, Bn[0], Bn[1]);
  s += T(cx + 22, cy + 8, 'Load', { size: 22, c: 'dt2' });
  s += T(cx + 14, Tn[1] - 8, '+V', { size: 24, c: 'dto' }) + T(cx - 12, Bn[1] + 34, '0 V', { size: 24, anchor: 'end', c: 'dto' });
  s += T(140, cy - 36, 'AC in', { size: 22, c: 'dt2' });
  const wy = by + 345;
  s += T(20, wy, 'Input', { size: 22, c: 'dt2' }) + L(120, wy + 40, 560, wy + 40, { c: 'ds2', w: 1.5 }) + sine(120, wy + 40, 440, 30, 2, 'full');
  s += T(20, wy + 100, 'Output', { size: 22, c: 'dt2' }) + L(120, wy + 130, 560, wy + 130, { c: 'ds2', w: 1.5 }) + sine(120, wy + 130, 440, 30, 2, 'rect');
  s += T(340, wy + 168, 'both half-cycles used', { size: 22, anchor: 'middle', c: 'dtg' });
  figs['m2-rectifiers'] = svg(wy + 190, s);
}

// 4. Zener V-I
{
  const x0 = 330, y0 = 290;
  let s = T(20, 34, 'Zener diode V–I characteristic', { size: 26, w: 600 });
  s += axes(x0, y0, 40, 575, 60, 480, '+V forward', '+I', '−I', '−V reverse');
  s += R(150, 340, x0 - 150, 100, 'dfg', 0.2);
  s += P(`M${x0} ${y0}C${x0 + 30} ${y0 - 1} ${x0 + 55} ${y0 - 5} ${x0 + 70} ${y0 - 30}S${x0 + 95} ${y0 - 150} ${x0 + 120} ${y0 - 210}`, { c: 'dsb', w: 4 });
  s += P(`M${x0} ${y0}L${150} ${y0 + 8}C${140} ${y0 + 12} ${140} ${y0 + 30} ${140} ${y0 + 180}`, { c: 'dsb', w: 4 });
  s += L(150, 340, x0, 340, { c: 'ds3', dash: '6 5', w: 2 }) + L(150, 440, x0, 440, { c: 'ds3', dash: '6 5', w: 2 });
  s += T(x0 - 8, 332, sub('I', 'Z(min)'), { size: 22, anchor: 'end', c: 'dt2' }) + T(x0 - 8, 432, sub('I', 'Z(max)'), { size: 22, anchor: 'end', c: 'dt2' });
  s += T(150, y0 - 14, sub('−V', 'Z'), { size: 24, anchor: 'middle', c: 'dto' });
  s += T(220, 392, 'breakdown', { size: 22, anchor: 'start', c: 'dtg' }).replace('x="220"', 'x="170"') + T(170, 418, 'region', { size: 22, c: 'dtg' });
  s += T(x0 + 14, 110, 'forward', { size: 22, c: 'dt2' }) + T(x0 + 14, 136, 'bias', { size: 22, c: 'dt2' });
  s += T(x0 + 95, y0 + 60, '0.3–0.7 V', { size: 22, anchor: 'middle', c: 'dto' });
  s += T(20, 510, 'Voltage stays near V', { size: 22, c: 'dt2' }).replace('</text>', '<tspan dy="7" font-size="18">Z</tspan><tspan dy="-7"> while the current changes</tspan></text>');
  figs['m2-zener-vi'] = svg(530, s);
}

// 5. Zener regulator
{
  let s = T(20, 34, 'Zener voltage regulator', { size: 26, w: 600 });
  const top = 100, bot = 250, xv = 70, xz = 300, xl = 500;
  s += L(xv, top, 130, top) + resH(130, top, 90) + L(220, top, xl, top) + L(xl, top, xl, 125) + resV(xl, 125, 70) + L(xl, 195, xl, bot) + L(xl, bot, xv, bot) + L(xv, bot, xv, top + 0);
  s += `<circle cx="${xv}" cy="${top}" r="5" class="dfw"/><circle cx="${xv}" cy="${bot}" r="5" class="dfw"/>`;
  // zener vertical, cathode (bar) on top
  s += L(xz, top, xz, 150) + `<g transform="translate(${xz} 175) rotate(-90)">${P('M-22 -20L22 0L-22 20Z', { fill: 'none' })}${L(22, -20, 22, 20)}${L(22, -20, 32, -28)}${L(22, 20, 12, 28)}</g>` + L(xz, 197, xz, bot);
  s += `<circle cx="${xz}" cy="${top}" r="5" class="dfw"/>`;
  s += T(175, top - 24, 'R', { size: 24, anchor: 'middle' }) + T(xv - 14, 180, 'V' + '<tspan dy="7" font-size="22">i</tspan>', { size: 26, anchor: 'end' });
  s += T(xz - 18, 150, sub('V', 'Z'), { size: 24, anchor: 'end' }) + T(xz - 18, 215, 'Zener', { size: 22, anchor: 'end', c: 'dt2' });
  s += L(xz + 38, 125, xz + 38, 215, { c: 'dsr', arrow: 'r', w: 2 }).replace('x1="338" y1="125" x2="338" y2="215"', 'x1="338" y1="125" x2="338" y2="215"');
  s += T(xz + 52, 175, sub('I', 'Z'), { size: 24, c: 'dtr' });
  s += L(150, top + 24, 210, top + 24, { c: 'dsr', arrow: 'r', w: 2 }).replace('y1="124"', 'y1="124"') + T(180, top + 52, 'I', { size: 24, anchor: 'middle', c: 'dtr' });
  s += L(380, top - 24, 440, top - 24, { c: 'dsr', arrow: 'r', w: 2 }) + T(410, top - 32, sub('I', 'L'), { size: 24, anchor: 'middle', c: 'dtr' });
  s += T(xl + 18, 165, sub('R', 'L'), { size: 24 }) + T(xl + 18, 215, sub('V', 'o'), { size: 24, c: 'dto' });
  // graph
  const gy = 380;
  s += T(20, 300, 'Input varies, output stays constant', { size: 24, w: 600 });
  s += L(80, 450, 80, 320) + L(80, 450, 570, 450);
  const pts = []; for (let i = 0; i <= 60; i++) { const x = 90 + i * 8; pts.push([x, 355 + 14 * Math.sin(i / 4) - 0.6 * (i % 15)]); }
  s += pl(pts, { c: 'dsb', w: 3 }) + L(90, 410, 560, 410, { c: 'dsg', w: 3 });
  s += T(110, 324, 'regulator input', { size: 22, c: 'dtb' }) + T(110, 438, 'regulator output (V', { size: 22, c: 'dtg' }).replace('</text>', '<tspan dy="7" font-size="18">Z</tspan><tspan dy="-7">)</tspan></text>');
  s += T(574, 474, 'time', { size: 22, anchor: 'end', c: 'dt2' }) + T(70, 326, 'V', { size: 22, anchor: 'end', c: 'dt2' });
  figs['m2-zener-reg'] = svg(490, s);
}

// 6. BJT symbols
{
  let s = T(20, 34, 'Transistor symbols', { size: 26, w: 600 });
  const n = bjt(190, 190, true, 1), p = bjt(190, 520, false, -1);
  s += n.g + p.g;
  s += T(n.B[0] - 8, n.B[1] + 8, 'B', { size: 26, anchor: 'end', w: 600 }) + T(n.C[0] + 14, n.C[1] + 6, 'C', { size: 26, w: 600 }) + T(n.E[0] + 14, n.E[1] + 6, 'E', { size: 26, w: 600 });
  s += T(p.B[0] - 8, p.B[1] + 8, 'B', { size: 26, anchor: 'end', w: 600 }) + T(p.C[0] + 14, p.C[1] + 6, 'C', { size: 26, w: 600 }) + T(p.E[0] + 14, p.E[1] + 6, 'E', { size: 26, w: 600 });
  s += T(330, 160, 'NPN', { size: 28, c: 'dtb', w: 600 }) + T(330, 195, 'arrow: base to emitter', { size: 22, c: 'dt2' }) + T(330, 225, 'base, collector positive', { size: 22, c: 'dt2' }) + T(330, 253, 'to the emitter', { size: 22, c: 'dt2' });
  s += T(330, 490, 'PNP', { size: 28, c: 'dtb', w: 600 }) + T(330, 525, 'arrow: emitter to base', { size: 22, c: 'dt2' }) + T(330, 555, 'emitter positive to base', { size: 22, c: 'dt2' }) + T(330, 583, 'and to collector', { size: 22, c: 'dt2' });
  s += T(20, 650, 'The arrowhead is always on the emitter.', { size: 24, c: 'dto' });
  figs['m2-bjt-symbols'] = svg(680, s);
}

// 7. BJT currents
{
  let s = T(20, 34, 'Transistor currents', { size: 26, w: 600 });
  const n = bjt(200, 220, true, 1), p = bjt(200, 580, false, -1);
  s += n.g + p.g;
  const lab = (t, x, y, a = 'start') => T(x, y, t, { size: 24, anchor: a, c: 'dt' });
  // NPN: IC down into collector, IB into base, IE out of emitter
  s += L(n.C[0] - 22, n.C[1] + 4, n.C[0] - 22, n.C[1] + 56, { c: 'dsr', arrow: 'r', w: 2.5 }) + lab(sub('I', 'C'), n.C[0] - 34, n.C[1] + 34, 'end');
  s += L(n.B[0] + 12, n.B[1] - 18, n.B[0] + 70, n.B[1] - 18, { c: 'dsr', arrow: 'r', w: 2.5 }) + lab(sub('I', 'B'), n.B[0] + 40, n.B[1] - 28, 'middle');
  s += L(n.E[0] - 22, n.E[1] - 56, n.E[0] - 22, n.E[1] - 4, { c: 'dsr', arrow: 'r', w: 2.5 }) + lab(sub('I', 'E'), n.E[0] - 34, n.E[1] - 24, 'end');
  s += T(n.B[0] - 6, n.B[1] + 8, 'B', { size: 24, anchor: 'end', w: 600 }) + T(n.C[0] + 14, n.C[1] + 6, 'C', { size: 24, w: 600 }) + T(n.E[0] + 14, n.E[1] + 6, 'E', { size: 24, w: 600 });
  s += T(340, 180, 'NPN', { size: 28, c: 'dtb', w: 600 }) + T(340, 215, sub('I', 'E') + ' = ' + sub('I', 'B') + ' + ' + sub('I', 'C'), { size: 26, c: 'dto' });
  s += T(340, 250, 'Emitter–base: forward', { size: 22, c: 'dt2' }) + T(340, 278, 'Collector–base: reverse', { size: 22, c: 'dt2' });
  // PNP (emitter on top): IE down into emitter, IC down out of collector, IB out of base
  s += L(p.E[0] - 22, p.E[1] + 4, p.E[0] - 22, p.E[1] + 56, { c: 'dsr', arrow: 'r', w: 2.5 }) + lab(sub('I', 'E'), p.E[0] - 34, p.E[1] + 34, 'end');
  s += L(p.C[0] - 22, p.C[1] - 56, p.C[0] - 22, p.C[1] - 4, { c: 'dsr', arrow: 'r', w: 2.5 }) + lab(sub('I', 'C'), p.C[0] - 34, p.C[1] - 24, 'end');
  s += L(p.B[0] + 70, p.B[1] - 18, p.B[0] + 12, p.B[1] - 18, { c: 'dsr', arrow: 'r', w: 2.5 }) + lab(sub('I', 'B'), p.B[0] + 40, p.B[1] - 28, 'middle');
  s += T(p.B[0] - 6, p.B[1] + 8, 'B', { size: 24, anchor: 'end', w: 600 }) + T(p.E[0] + 14, p.E[1] + 6, 'E', { size: 24, w: 600 }) + T(p.C[0] + 14, p.C[1] + 6, 'C', { size: 24, w: 600 });
  s += T(340, 540, 'PNP', { size: 28, c: 'dtb', w: 600 }) + T(340, 575, sub('I', 'E') + ' = ' + sub('I', 'B') + ' + ' + sub('I', 'C'), { size: 26, c: 'dto' });
  s += T(340, 610, 'about 1–2 % of ' + sub('I', 'E') + ' is ' + sub('I', 'B'), { size: 22, c: 'dt2' }) + T(340, 638, 'and 98–99 % is ' + sub('I', 'C'), { size: 22, c: 'dt2' });
  figs['m2-bjt-currents'] = svg(740, s);
}

// 8. Configurations
{
  let s = T(20, 34, 'Transistor configurations', { size: 26, w: 600 });
  const rows = [
    ['Common-base (CB)', 'B', 'Input: emitter', 'Output: collector'],
    ['Common-emitter (CE)', 'E', 'Input: base', 'Output: collector'],
    ['Common-collector (CC)', 'C', 'Input: base', 'Output: emitter']
  ];
  rows.forEach((r, i) => {
    const cy = 270 + i * 350;
    const t = bjt(150, cy, true, 1);
    s += t.g;
    s += T(20, cy - 170, r[0], { size: 26, c: 'dtb', w: 600 });
    s += T(t.B[0] - 6, t.B[1] + 8, 'B', { size: 24, anchor: 'end', w: 600 }) + T(t.C[0] + 14, t.C[1] + 6, 'C', { size: 24, w: 600 }) + T(t.E[0] + 14, t.E[1] + 6, 'E', { size: 24, w: 600 });
    const pt = r[1] === 'B' ? t.B : r[1] === 'E' ? t.E : t.C;
    s += `<circle cx="${pt[0]}" cy="${pt[1]}" r="5" class="dfo"/>`;
    // ground symbol near the common terminal
    if (r[1] === 'B') s += L(pt[0], pt[1], pt[0] - 0, pt[1]) + L(pt[0], pt[1], pt[0], pt[1] + 20) + ground(pt[0], pt[1] + 20).replace(/^<line[^>]*\/>/, '');
    else if (r[1] === 'E') s += L(pt[0], pt[1], pt[0], pt[1] + 10) + ground(pt[0], pt[1] + 10);
    else s += L(pt[0], pt[1], pt[0], pt[1] - 10) + `<g transform="translate(${pt[0]} ${pt[1] - 10}) rotate(180)">${ground(0, 0)}</g>`;
    s += T(330, cy - 40, r[2], { size: 24 }) + T(330, cy - 8, r[3], { size: 24 }) + T(330, cy + 24, 'Common: ' + (r[1] === 'B' ? 'base' : r[1] === 'E' ? 'emitter' : 'collector'), { size: 24, c: 'dto' });
    s += T(330, cy + 56, '(grounded)', { size: 22, c: 'dt2' });
  });
  figs['m2-bjt-config'] = svg(1130, s);
}

// 9. CE input characteristic
{
  const ox = 90, oy = 400, W = 440, H = 300; // axes box, V 0..1.0, I 0..80
  let s = T(20, 34, 'CE input characteristic', { size: 26, w: 600 });
  s += L(ox, oy, ox + W + 20, oy, { arrow: 'w' }) + L(ox, oy, ox, oy - H - 20, { arrow: 'w' });
  [0.2, 0.4, 0.6, 0.8, 1.0].forEach(v => { const x = ox + v * W; s += L(x, oy, x, oy + 8, { w: 2 }) + T(x, oy + 32, String(v), { size: 22, anchor: 'middle', c: 'dt2' }); });
  [20, 40, 60, 80].forEach(i => { const y = oy - i / 80 * H; s += L(ox, y, ox - 8, y, { w: 2 }) + T(ox - 12, y + 7, String(i), { size: 22, anchor: 'end', c: 'dt2' }); });
  s += T(ox + W + 20, oy + 62, sub('V', 'BE') + ' (V)', { size: 22, anchor: 'end' }) + T(ox + 4, oy - H - 28, sub('I', 'B') + ' (µA)', { size: 22 });
  [[0, 0.78, 'dsb', 'dtb'], [10, 0.86, 'dso', 'dto'], [20, 0.94, 'dsg', 'dtg']].forEach(([vce, vend, c, tc], k) => {
    const pts = []; for (let i = 0; i <= 80; i++) { const v = i / 80 * Math.min(vend, 1.0); const y = 80 * Math.exp((v - vend) / 0.09); pts.push([ox + v * W, oy - Math.min(y, 80) / 80 * H]); }
    s += pl(pts, { c, w: 4 });
    s += T(ox + 24, oy - H + 20 + k * 32, sub('V', 'CE') + ' = ' + vce + ' V', { size: 22, c: tc });
  });
  figs['m2-ce-input'] = svg(480, s);
}

// 10. CE output characteristic
{
  const ox = 90, oy = 400, W = 440, H = 300; // VCE 0..8, IC 0..7 mA
  let s = T(20, 34, 'CE output characteristic', { size: 26, w: 600 });
  s += R(ox, oy - H, 70, H, 'dfr', 0.12) + L(ox, oy, ox + W + 20, oy, { arrow: 'w' }) + L(ox, oy, ox, oy - H - 20, { arrow: 'w' });
  [2, 4, 6, 8].forEach(v => { const x = ox + v / 8 * W; s += L(x, oy, x, oy + 8, { w: 2 }) + T(x, oy + 32, String(v), { size: 22, anchor: 'middle', c: 'dt2' }); });
  [2, 4, 6].forEach(i => { const y = oy - i / 7 * H; s += L(ox, y, ox - 8, y, { w: 2 }) + T(ox - 12, y + 7, String(i), { size: 22, anchor: 'end', c: 'dt2' }); });
  s += T(ox + W + 20, oy + 62, sub('V', 'CE') + ' (V)', { size: 22, anchor: 'end' }) + T(ox + 4, oy - H - 28, sub('I', 'C') + ' (mA)', { size: 22 });
  [10, 20, 30, 40, 50, 60].forEach(ib => {
    const ic = ib / 10; const yv = v => oy - (ic * (1 - Math.exp(-v / 0.35)) * (1 + 0.012 * v)) / 7 * H;
    const pts = []; for (let i = 0; i <= 60; i++) { const v = i / 60 * 8; pts.push([ox + v / 8 * W, yv(v)]); }
    s += pl(pts, { c: 'dsb', w: 3 });
    s += T(ox + W + 24, yv(8) + 6, ib + ' µA', { size: 22, c: 'dt2' }).replace('x="' + (ox + W + 24) + '"', 'x="' + (ox + W - 4) + '"').replace('<text', '<text text-anchor="end" dy="-8"').replace(' text-anchor="end" dy="-8" x', ' x');
  });
  s += L(ox, oy + 0.5, ox + W, oy + 0.5, { c: 'dsr', w: 4 });
  s += T(ox, oy + 96, 'shaded strip: saturation region', { size: 22, c: 'dtr' });
  s += T(ox + 230, oy - H - 6, 'active region', { size: 22, c: 'dtb' }) + T(ox + 220, oy - 14, 'cut-off (I', { size: 22, c: 'dtr' }).replace('</text>', '<tspan dy="7" font-size="18">B</tspan><tspan dy="-7"> = 0)</tspan></text>');
  figs['m2-ce-output'] = svg(520, s);
}

for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
console.log('wrote', Object.keys(figs).length, 'figures');
