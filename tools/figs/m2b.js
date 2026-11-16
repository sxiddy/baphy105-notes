// Generates the chunk-2b figures (MOSFET, op-amp) into figs-svg/. Usage: node tools/figs/m2b.js figs-svg
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';
const src = fs.readFileSync(path.join(__dirname, 'm2a.js'), 'utf8').split('const figs = {};')[0].replace("process.argv[2] || 'figs-svg'", "'x'");
const H = new Function('require', 'process', src + '; return { svg, T, L, P, R, sub, pl, resH, resV, acSource, ground, sine, f1, battery };')(require, process);
const { svg, T, L, P, R, sub, pl, resH, resV, acSource, ground, sine, f1, battery } = H;

const figs = {};
const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="5" class="dfw"/>`;
const open = (x, y) => `<circle cx="${x}" cy="${y}" r="6" class="ds" fill="none" stroke-width="2.5"/>`;

// op-amp triangle: left edge x, centre y, width w, half-height hh. Inputs at +/- 40 from centre.
function opamp(x, cy, w = 170, hh = 85) {
  return P(`M${x} ${cy - hh}L${x + w} ${cy}L${x} ${cy + hh}Z`, { w: 2.5 }) +
    T(x + 12, cy - 40 + 8, '+', { size: 26, w: 600 }) + T(x + 12, cy + 40 + 8, '−', { size: 26, w: 600 });
}
const PL = 40, MI = 40; // plus lead y offset (-), minus lead y offset (+)

function sineWave(x0, y0, w, a, inv) {
  const pts = []; for (let i = 0; i <= 50; i++) { const t = i / 50; pts.push([x0 + t * w, y0 - (inv ? -1 : 1) * a * Math.sin(t * 2 * Math.PI * 1.5)]); }
  return pl(pts, { c: 'dsb', w: 3 });
}

// 1. symbol
{
  const x = 230, cy = 170;
  let s = opamp(x, cy);
  s += L(30, cy - PL, x, cy - PL) + L(30, cy + MI, x, cy + MI) + L(x + 170, cy, 560, cy);
  s += T(30, cy - PL - 36, 'Input 1 (+)', { size: 24 }) + T(30, cy - PL - 10, 'non-inverting', { size: 22, c: 'dt2' });
  s += T(30, cy + MI + 30, 'Input 2 (−)', { size: 24 }) + T(30, cy + MI + 56, 'inverting', { size: 22, c: 'dt2' });
  s += T(560, cy - 14, 'Output', { size: 24, anchor: 'end' });
  figs['m2-opamp-symbol'] = svg(300, s);
}

// 2. single-ended
{
  const panel = (y0, title, plusSig) => {
    const cy = y0 + 120, x = 250;
    let s = T(20, y0 + 28, title, { size: 26, w: 600 }) + opamp(x, cy, 160, 80);
    const sigY = plusSig ? cy - PL : cy + MI, gndY = plusSig ? cy + MI : cy - PL;
    s += L(110, sigY, x, sigY);
    const sy = plusSig ? sigY + 26 : sigY - 26; // source circle centre sits below (plus) or above (minus) the lead
    s += L(110, sigY, 110, plusSig ? sigY + 12 : sigY - 12);
    s += acSource(110, sy, 24).replace(/cx="110" cy="\d+" r="24"/, `cx="110" cy="${sy}" r="24"`);
    s += L(110, plusSig ? sy + 24 : sy - 24, 110, plusSig ? sy + 40 : sy - 40);
    s += plusSig ? ground(110, sy + 40) : `<g transform="translate(110 ${sy - 40}) rotate(180)">${ground(0, 0)}</g>`;
    s += L(200, gndY, x, gndY) + (plusSig ? L(200, gndY, 200, gndY + 14) + ground(200, gndY + 14) : L(200, gndY, 200, gndY - 14) + `<g transform="translate(200 ${gndY - 14}) rotate(180)">${ground(0, 0)}</g>`);
    s += T(70, sigY - 10 - (plusSig ? 0 : 0), sub('V', 'i'), { size: 24, c: 'dtb', anchor: 'end' });
    s += L(x + 160, cy, 560, cy);
    s += sineWave(420, cy - 36, 130, 16, !plusSig);
    s += T(560, cy + 34, plusSig ? 'same polarity' : 'opposite phase', { size: 24, anchor: 'end', c: plusSig ? 'dtg' : 'dto' });
    return s;
  };
  figs['m2-opamp-single'] = svg(560, panel(10, 'Signal on the + input', true) + panel(290, 'Signal on the − input', false));
}

// 3. differential
{
  let s = T(20, 38, 'One source between the inputs', { size: 26, w: 600 });
  let cy = 150, x = 250;
  s += opamp(x, cy, 160, 80) + L(x + 160, cy, 560, cy);
  s += L(120, cy - 24, 120, cy - PL) + L(120, cy - PL, x, cy - PL) + L(120, cy + 24, 120, cy + MI) + L(120, cy + MI, x, cy + MI);
  s += acSource(120, cy, 24).replace(/cy="\d+" r/, `cy="${cy}" r`);
  s += T(88, cy + 8, sub('V', 'd'), { size: 24, c: 'dtb', anchor: 'end' });
  s += T(560, cy - 44, 'in phase', { size: 24, anchor: 'end', c: 'dtg' }) + T(560, cy - 16, 'with ' + sub('V', 'd'), { size: 24, anchor: 'end', c: 'dtg' });
  // lower panel
  s += T(20, 300, 'Two separate signals', { size: 26, w: 600 });
  cy = 420;
  s += opamp(x, cy, 160, 80) + L(x + 160, cy, 560, cy);
  const y1 = cy - PL, y2 = cy + MI;
  s += L(134, y1, x, y1) + L(134, y2, x, y2);
  s += acSource(110, y1, 24).replace(/cy="\d+" r/, `cy="${y1}" r`) + acSource(110, y2, 24).replace(/cy="\d+" r/, `cy="${y2}" r`);
  s += L(86, y1, 50, y1) + L(86, y2, 50, y2) + L(50, y1, 50, y2) + L(50, y2, 50, y2 + 8) + ground(50, y2 + 8);
  s += T(110, y1 - 32, sub('V', 'i1'), { size: 24, c: 'dtb', anchor: 'middle' }) + T(110, y2 + 52, sub('V', 'i2'), { size: 24, c: 'dtr', anchor: 'middle' });
  s += T(560, cy - 14, sub('V', 'o') + ' follows', { size: 24, anchor: 'end' }) + T(560, cy + 34, sub('V', 'i1') + ' − ' + sub('V', 'i2'), { size: 24, anchor: 'end', c: 'dto' });
  figs['m2-opamp-diff'] = svg(560, s);
}

// 4. common mode
{
  const cy = 170, x = 250;
  let s = opamp(x, cy, 160, 80) + L(x + 160, cy, 560, cy);
  s += L(200, cy - PL, x, cy - PL) + L(200, cy + MI, x, cy + MI) + L(200, cy - PL, 200, cy + MI) + L(134, cy, 200, cy) + dot(200, cy);
  s += acSource(110, cy, 24).replace(/cy="\d+" r/, `cy="${cy}" r`) + L(86, cy, 50, cy) + L(50, cy, 50, cy + 14) + ground(50, cy + 14);
  s += T(110, cy - 34, sub('V', 'i'), { size: 24, c: 'dtb', anchor: 'middle' });
  s += T(560, cy - 14, sub('V', 'o'), { size: 24, anchor: 'end' });
  s += T(560, cy + 32, '0 V ideally,', { size: 24, anchor: 'end', c: 'dtg' }) + T(560, cy + 60, 'small in practice', { size: 24, anchor: 'end', c: 'dt2' });
  s += T(20, 38, 'Same signal on both inputs', { size: 26, w: 600 });
  figs['m2-opamp-common'] = svg(290, s);
}

// 5. 741 pinout
{
  let s = T(20, 38, 'µA741, 8-pin package', { size: 26, w: 600 });
  const x0 = 255, x1 = 345, y0 = 80, y1 = 330, pins = [130, 190, 250, 310];
  s += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="12" class="ds" fill="none" stroke-width="2.5"/>`;
  const left = ['Input offset', ['Inverting', 'input'], ['Non-inverting', 'input'], '−V' + 'CC supply'], right = ['NC', '+VCC supply', 'Output', 'Input offset'];
  pins.forEach((py, i) => {
    s += L(x0 - 50, py, x0, py) + L(x1, py, x1 + 50, py);
    s += T(x0 + 14, py + 8, String(i + 1), { size: 22, c: 'dto' }) + T(x1 - 14, py + 8, String(8 - i), { size: 22, c: 'dto', anchor: 'end' });
    const lt = left[i], rt = right[i];
    if (Array.isArray(lt)) s += T(x0 - 58, py - 2, lt[0], { size: 22, anchor: 'end' }) + T(x0 - 58, py + 22, lt[1], { size: 22, anchor: 'end' }); else s += T(x0 - 58, py + 8, lt.replace('VCC', 'V<tspan dy="7" font-size="18">CC</tspan><tspan dy="-7">'), { size: 22, anchor: 'end' }).replace('</text>', lt.includes('VCC') ? '</tspan></text>' : '</text>');
    s += T(x1 + 58, py + 8, rt.replace('VCC', 'V<tspan dy="7" font-size="18">CC</tspan><tspan dy="-7">'), { size: 22 }).replace('</text>', rt.includes('VCC') ? '</tspan></text>' : '</text>');
  });
  s += P('M285 170L285 270L335 220Z', { c: 'dsb', w: 2.5 }) + T(293, 202, '−', { size: 22, c: 'dtb' }) + T(293, 255, '+', { size: 22, c: 'dtb' }) + T(305, 226, 'A', { size: 22, c: 'dtb' });
  figs['m2-opamp-741'] = svg(370, s);
}

// 6. amplifiers
{
  let s = '';
  // inverting
  let cy = 110, x = 270;
  s += T(20, 36, 'Inverting amplifier', { size: 26, w: 600 }) + opamp(x, cy, 150, 80);
  s += L(x, cy + MI, 200, cy + MI) + L(200, cy + MI, 200, cy + 100) + dot(200, cy + MI);
  s += open(40, cy + MI) + L(46, cy + MI, 70, cy + MI) + resH(70, cy + MI, 100) + L(170, cy + MI, 200, cy + MI);
  s += T(120, cy + MI - 20, sub('R', 'i'), { size: 24, anchor: 'middle' }) + T(34, cy + MI - 20, sub('V', 'in'), { size: 24, c: 'dtb', anchor: 'middle' });
  s += L(200, cy + 100, 280, cy + 100) + resH(280, cy + 100, 90) + L(370, cy + 100, 480, cy + 100) + L(480, cy + 100, 480, cy) + dot(480, cy);
  s += T(325, cy + 140, sub('R', 'f'), { size: 24, anchor: 'middle' });
  s += L(x, cy - PL, 230, cy - PL) + L(230, cy - PL, 230, cy - PL + 14) + ground(230, cy - PL + 14);
  s += L(x + 150, cy, 530, cy) + open(536, cy) + T(536, cy - 22, sub('V', 'out'), { size: 24, c: 'dtb', anchor: 'middle' });
  s += T(300, 285, sub('A', 'v') + ' = − ' + sub('R', 'f') + ' / ' + sub('R', 'i'), { size: 26, c: 'dto', anchor: 'middle' });
  // non-inverting
  cy = 450; const y0 = 305;
  s += T(20, y0 + 36, 'Non-inverting amplifier', { size: 26, w: 600 }) + opamp(x, cy, 150, 80);
  s += open(40, cy - PL) + L(46, cy - PL, x, cy - PL) + T(34, cy - PL - 20, sub('V', 'in'), { size: 24, c: 'dtb', anchor: 'middle' });
  s += L(x, cy + MI, 200, cy + MI) + L(200, cy + MI, 200, cy + 100) + dot(200, cy + 100);
  s += L(200, cy + 100, 280, cy + 100) + resH(280, cy + 100, 90) + L(370, cy + 100, 480, cy + 100) + L(480, cy + 100, 480, cy) + dot(480, cy);
  s += T(325, cy + 76, sub('R', '1'), { size: 24, anchor: 'middle' });
  s += resV(200, cy + 100, 70) + L(200, cy + 170, 200, cy + 180) + ground(200, cy + 180);
  s += T(172, cy + 142, sub('R', '2'), { size: 24, anchor: 'end' });
  s += L(x + 150, cy, 530, cy) + open(536, cy) + T(536, cy - 22, sub('V', 'out'), { size: 24, c: 'dtb', anchor: 'middle' });
  s += T(390, 690, sub('A', 'v') + ' = 1 + ' + sub('R', '1') + ' / ' + sub('R', '2'), { size: 26, c: 'dto', anchor: 'middle' });
  figs['m2-opamp-amps'] = svg(730, s);
}

// ---- MOSFET ----
function xsec(y0, opt) {
  // opt: channel ('none' | 'induced' | 'built-in'), batteries (bool)
  let s = '';
  const top = y0 + 110, sub0 = y0 + 110, subH = 130;
  s += R(60, sub0, 480, subH, 'dfr', 0.18) + `<rect x="60" y="${sub0}" width="480" height="${subH}" class="ds2" fill="none" stroke-width="2"/>`;
  s += R(100, sub0, 100, 55, 'dfb', 0.35) + R(400, sub0, 100, 55, 'dfb', 0.35);
  s += T(150, sub0 + 40, 'N' + '⁺', { size: 24, anchor: 'middle', c: 'dtb' }) + T(450, sub0 + 40, 'N' + '⁺', { size: 24, anchor: 'middle', c: 'dtb' });
  if (opt.channel !== 'none') s += R(200, sub0, 200, 14, 'dfb', 0.7);
  s += R(190, y0 + 88, 220, 22, 'df3', 0.9) + `<rect x="190" y="${y0 + 88}" width="220" height="22" class="ds2" fill="none" stroke-width="1.5"/>`;
  s += R(200, y0 + 62, 200, 26, 'dfo', 0.45) + `<rect x="200" y="${y0 + 62}" width="200" height="26" class="ds" fill="none" stroke-width="2"/>`;
  s += T(300, y0 + 80, 'metal gate', { size: 22, anchor: 'middle' });
  s += T(300, y0 + 104, '', {}) ;
  s += T(300, sub0 + 112, 'P-type substrate', { size: 24, anchor: 'middle', c: 'dtr' });
  if (opt.chan) s += T(300, sub0 + 46, opt.chan, { size: 22, anchor: 'middle', c: opt.channel === 'none' ? 'dtr' : 'dtb' });
  s += T(60, sub0 + subH + 92, 'dark strip under the gate: SiO' + '<tspan dy="6" font-size="18">2</tspan><tspan dy="-6"> oxide layer</tspan>', { size: 22, c: 'dt2' });
  const ty = opt.batteries ? y0 + 30 : y0 + 30;
  s += L(150, sub0, 150, ty) + L(450, sub0, 450, ty) + L(300, y0 + 62, 300, ty);
  s += L(300, sub0 + subH, 300, sub0 + subH + 30);
  s += T(300, sub0 + subH + 58, 'Body', { size: 24, anchor: 'middle' });
  if (!opt.batteries) {
    s += T(150, ty - 8, 'S', { size: 26, anchor: 'middle', w: 600 }) + T(300, ty - 8, 'G', { size: 26, anchor: 'middle', w: 600 }) + T(450, ty - 8, 'D', { size: 26, anchor: 'middle', w: 600 });
  }
  if (opt.label) s += opt.label;
  return s;
}

// 7. mosfet family tree
{
  let s = T(20, 36, 'MOSFET', { size: 28, w: 600 });
  const box = (x, y, w, t, c = 'ds') => `<rect x="${x}" y="${y}" width="${w}" height="46" rx="8" class="${c}" fill="none" stroke-width="2.5"/>` + T(x + w / 2, y + 31, t, { size: 24, anchor: 'middle' });
  s += box(220, 60, 160, 'MOSFET');
  s += L(300, 106, 300, 130) + L(140, 130, 460, 130) + L(140, 130, 140, 160) + L(460, 130, 460, 160);
  s += box(30, 160, 220, 'Enhancement mode', 'dsb') + box(350, 160, 220, 'Depletion mode', 'dso');
  s += L(140, 206, 140, 236) + L(80, 236, 200, 236) + L(80, 236, 80, 260) + L(200, 236, 200, 260);
  s += L(460, 206, 460, 236) + L(400, 236, 520, 236) + L(400, 236, 400, 260) + L(520, 236, 520, 260);
  s += box(20, 260, 120, 'P-ch') + box(150, 260, 120, 'N-ch') + box(340, 260, 120, 'P-ch') + box(470, 260, 120, 'N-ch');
  figs['m2-mosfet-types'] = svg(340, s);
}

// 8. enhancement structure + symbol note
{
  let s = T(20, 34, 'Enhancement MOSFET (n-channel)', { size: 26, w: 600 });
  s += xsec(40, { channel: 'none', chan: 'no channel' });
  figs['m2-emosfet-structure'] = svg(480, s);
}

// 9. enhancement working
{
  const y0 = 100;
  let s = T(20, 34, 'Enhancement MOSFET with gate voltage', { size: 26, w: 600 });
  s += xsec(y0, { channel: 'induced', batteries: true, chan: 'induced N-channel' });
  const ty = y0 + 30, ty2 = y0 - 20;
  s += L(150, ty, 185, ty) + battery(225, ty) + L(265, ty, 300, ty) + dot(150, ty);
  s += T(225, ty - 34, sub('V', 'GG'), { size: 22, anchor: 'middle' });
  s += L(150, ty, 150, ty2) + L(450, ty, 450, ty2) + L(150, ty2, 260, ty2) + battery(300, ty2) + L(340, ty2, 450, ty2);
  s += T(350, ty2 + 34, sub('V', 'DS'), { size: 22 });
  s += T(134, y0 + 76, 'S', { size: 24, anchor: 'end', w: 600 }) + T(466, y0 + 76, 'D', { size: 24, w: 600 }) + T(316, y0 + 62, 'G', { size: 24, w: 600 });
  figs['m2-emosfet-working'] = svg(510, s);
}

// output curve helper
function labelsY(ys, gap = 24) {
  const idx = ys.map((y, i) => i).sort((a, b) => ys[a] - ys[b]); const out = ys.slice();
  let last = -1e9; idx.forEach(i => { out[i] = Math.max(ys[i], last + gap); last = out[i]; });
  return out;
}

// 10. mosfet output curves (enhancement)
{
  const ox = 70, oy = 410, W = 380, Hh = 310;
  let s = T(20, 34, 'Drain characteristics', { size: 26, w: 600 });
  s += L(ox, oy, ox + W + 14, oy, { arrow: 'w' }) + L(ox, oy, ox, oy - Hh - 14, { arrow: 'w' });
  s += T(ox + W + 14, oy + 34, sub('V', 'DS'), { size: 22, anchor: 'end' }) + T(ox + 8, oy - Hh - 22, sub('I', 'D'), { size: 22 });
  const sc = Hh / 26, vx = W / 8, ends = [];
  const vov = [1, 2, 3, 4, 5];
  // boundary parabola
  const bp = []; for (let i = 0; i <= 50; i++) { const v = i / 50 * 5; bp.push([ox + v * vx, oy - v * v * sc]); }
  s += pl(bp, { c: 'ds3', w: 2.5, dash: '7 6' });
  vov.forEach(o => {
    const pts = []; for (let i = 0; i <= 60; i++) { const v = i / 60 * 8; const id = v < o ? 2 * o * v - v * v : o * o; pts.push([ox + v * vx, oy - id * sc * (1 + (v >= o ? 0.01 * (v - o) : 0))]); }
    s += pl(pts, { c: 'dsb', w: 3 }); ends.push(pts[pts.length - 1][1]);
  });
  const ly = labelsY(ends.map(y => y + 6), 26);
  vov.forEach((o, i) => { s += T(ox + W + 12, ly[i], sub('V', 'GS' + (i + 1)), { size: 22, c: 'dt2' }); });
  s += T(ox, oy + 62, 'dashed line: V' + '<tspan dy="6" font-size="18">DS</tspan><tspan dy="-6"> = V</tspan><tspan dy="6" font-size="18">GS</tspan><tspan dy="-6"> − V</tspan><tspan dy="6" font-size="18">th</tspan>', { size: 22, c: 'dt2' });
  s += T(ox, oy + 92, 'left of it: ohmic, right of it: active', { size: 22, c: 'dto' }) + T(ox, oy + 122, 'cut-off: V' + '<tspan dy="6" font-size="18">GS</tspan><tspan dy="-6"> below V</tspan><tspan dy="6" font-size="18">th</tspan>', { size: 22, c: 'dtr' });
  figs['m2-mosfet-curves'] = svg(560, s);
}

// 11. depletion structure
{
  let s = T(20, 34, 'Depletion MOSFET (n-channel)', { size: 26, w: 600 });
  s += xsec(40, { channel: 'built-in', chan: 'N-channel built in' });
  figs['m2-dmosfet-structure'] = svg(480, s);
}

// 12. depletion curves
{
  const ox = 70, oy = 430, W = 380, Hh = 330;
  let s = T(20, 34, 'Depletion MOSFET characteristics', { size: 26, w: 600 });
  s += L(ox, oy, ox + W + 14, oy, { arrow: 'w' }) + L(ox, oy, ox, oy - Hh - 14, { arrow: 'w' });
  s += T(ox + W + 14, oy + 58, sub('V', 'DS') + ' (V)', { size: 22, anchor: 'end' }) + T(ox + 8, oy - Hh - 22, sub('I', 'D') + ' (mA)', { size: 22 });
  [5, 10, 15, 20].forEach(v => { const x = ox + v / 20 * W; s += L(x, oy, x, oy + 7, { w: 2 }) + T(x, oy + 30, String(v), { size: 22, anchor: 'middle', c: 'dt2' }); });
  [2, 4, 6, 8].forEach(i => { const y = oy - i / 10 * Hh; s += L(ox, y, ox - 7, y, { w: 2 }) + T(ox - 10, y + 7, String(i), { size: 22, anchor: 'end', c: 'dt2' }); });
  const vgs = [3, 2, 1, 0, -1, -2, -3], ends = [];
  vgs.forEach(g => {
    const isat = 3 * Math.pow(1 - g / -4, 2), vov = g + 4, pts = [];
    for (let i = 0; i <= 70; i++) { const v = i / 70 * 20; const id = v < vov ? isat * (1 - Math.pow(1 - v / vov, 2)) : isat * (1 + 0.004 * (v - vov)); pts.push([ox + v / 20 * W, oy - id / 10 * Hh]); }
    s += pl(pts, { c: g >= 0 ? 'dsb' : 'dso', w: 3 }); ends.push(pts[pts.length - 1][1]);
  });
  const ly = labelsY(ends.map(y => y + 6), 25);
  vgs.forEach((g, i) => { s += T(ox + W + 10, ly[i], (g > 0 ? '+' : g < 0 ? '−' : '') + Math.abs(g) + ' V', { size: 22, c: g >= 0 ? 'dtb' : 'dto' }); });
  s += T(ox + W + 10, oy - Hh - 26, sub('V', 'GS'), { size: 22, c: 'dt2' });
  s += T(ox, oy + 90, 'blue: V' + '<tspan dy="6" font-size="18">GS</tspan><tspan dy="-6"> ≥ 0 (enhancement side)</tspan>', { size: 22, c: 'dtb' }) + T(ox, oy + 120, 'orange: V' + '<tspan dy="6" font-size="18">GS</tspan><tspan dy="-6"> &lt; 0 (depletion side)</tspan>', { size: 22, c: 'dto' });
  figs['m2-dmosfet-curves'] = svg(570, s);
}

for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
console.log('wrote', Object.keys(figs).length, 'figures');
