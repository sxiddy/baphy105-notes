// Generates the chunk-3a figures (drawing sheets, layout, scales) into figs-svg/. Usage: node tools/figs/m3a.js figs-svg
// Exports GEO (the numbers drawn) so tools/check-m3.js can check them.
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';
const src = fs.readFileSync(path.join(__dirname, 'm2a.js'), 'utf8').split('const figs = {};')[0].replace("process.argv[2] || 'figs-svg'", "'x'");
const H = new Function('require', 'process', src + '; return { svg, T, L, P, R, sub, pl, f1 };')(require, process);
const { svg, T, L, P, R, pl } = H;
const rect = (x, y, w, h, o = {}) => `<rect x="${H.f1(x)}" y="${H.f1(y)}" width="${H.f1(w)}" height="${H.f1(h)}" class="${o.c || 'ds'}" fill="none" stroke-width="${o.w || 2.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
// dimension line with arrows both ends and a label
const dim = (x1, y1, x2, y2, label, o = {}) => L(x1, y1, x2, y2, { c: o.c || 'dsb', w: 2, arrow: 'b' }) + L(x2, y2, x1, y1, { c: o.c || 'dsb', w: 2, arrow: 'b' }) + label;

const figs = {};
const GEO = {};

// ---- 1. A-series sheet sizes: each size is the one before cut in half across its long side
{
  const A0 = [841, 1189]; // trimmed width x height, portrait
  const sizes = [A0];
  for (let i = 1; i <= 5; i++) { const [w, h] = sizes[i - 1]; sizes.push([Math.floor(h / 2), w]); }
  GEO.sheets = sizes.map(([w, h]) => [Math.min(w, h), Math.max(w, h)]);
  const k = 0.33, x0 = 30, y0 = 50;
  let s = T(20, 32, 'A-series drawing sheets (trimmed, mm)', { size: 24 });
  // cut regions: A1 bottom half, A2 right of the top half, A3 bottom of what is left, A4 right, A5 bottom
  let [x, y, w, h] = [0, 0, 841, 1189];
  const regs = [];
  for (let i = 1; i <= 5; i++) {
    if (h >= w) { const hh = h / 2; regs.push([i, x, y + hh, w, hh]); h = hh; }
    else { const ww = w / 2; regs.push([i, x + ww, y, ww, h]); w = ww; }
  }
  s += rect(x0, y0, 841 * k, 1189 * k, { w: 3 });
  regs.forEach(([i, rx, ry, rw, rh]) => {
    s += rect(x0 + rx * k, y0 + ry * k, rw * k, rh * k, { c: 'dsb', w: 2 });
    const fs_ = [44, 36, 30, 24, 22][i - 1];
    s += T(f(x0 + (rx + rw / 2) * k), f(y0 + (ry + rh / 2) * k + fs_ / 3), 'A' + i, { size: fs_, anchor: 'middle', c: 'dtb', w: 700 });
  });
  s += T(x0 + 420 * k, y0 + 1189 * k + 30, 'Whole sheet = A0', { anchor: 'middle', c: 'dto', size: 22 });
  // table on the right
  const tx = 345;
  s += T(tx, 90, 'Size', { w: 700, size: 22 }) + T(590, 90, 'mm', { w: 700, size: 22, anchor: 'end' });
  GEO.sheets.forEach(([a, b], i) => { s += T(tx, 130 + i * 40, 'A' + i, { size: 22, c: 'dtb' }) + T(590, 130 + i * 40, `${a} × ${b}`, { size: 22, anchor: 'end' }); });
  s += L(tx, 100, 590, 100, { w: 1.5 });
  s += T(tx, 400, 'Halve the long side', { size: 22, c: 'dto' }) + T(tx, 428, 'to get the next size.', { size: 22, c: 'dto' });
  figs['m3-sheet-sizes'] = svg(y0 + 1189 * k + 50, s);
}

// ---- 2. Layout of an A2 sheet: filing margin a = 30, other margins b = 20, title block 170 x 65 bottom right
{
  const W = 594, Hh = 420, a = 30, b = 20, tw = 170, th = 65, k = 0.86, x0 = 40, y0 = 46;
  GEO.layout = { W, H: Hh, a, b, tw, th, workW: W - a - b, workH: Hh - 2 * b };
  let s = T(20, 30, 'Layout of an A2 sheet (594 × 420)', { size: 24 });
  s += rect(x0, y0, W * k, Hh * k, { w: 2 });
  const fx = x0 + a * k, fy = y0 + b * k, fw = (W - a - b) * k, fh = (Hh - 2 * b) * k;
  s += R(fx, fy, fw, fh, 'dfb', 0.08) + rect(fx, fy, fw, fh, { w: 4 });
  s += R(fx + fw - tw * k, fy + fh - th * k, tw * k, th * k, 'dfo', 0.25) + rect(fx + fw - tw * k, fy + fh - th * k, tw * k, th * k, { c: 'dso', w: 2.5 });
  s += T(fx + fw - tw * k / 2, fy + fh - th * k / 2 + 8, 'Title block', { anchor: 'middle', size: 22, c: 'dto' });
  s += T(fx + fw - tw * k / 2, fy + fh + 38 + 8, '170 × 65', { anchor: 'middle', size: 22, c: 'dto' });
  s += T(fx + fw / 2 - 40, fy + fh / 2 - 10, 'Drawing area', { anchor: 'middle', size: 24, c: 'dtb' });
  // margins: letter in each strip
  s += T(x0 + a * k / 2, y0 + Hh * k / 2, 'a', { size: 24, anchor: 'middle', c: 'dtb', i: 1, w: 700 });
  s += T(x0 + W * k / 2, y0 + b * k - 1, 'b', { size: 22, anchor: 'middle', c: 'dtb', i: 1, w: 700 });
  s += T(fx + fw / 2, y0 + Hh * k - 1, 'b', { size: 22, anchor: 'middle', c: 'dtb', i: 1, w: 700 });
  s += T(fx + fw + b * k / 2, y0 + Hh * k / 2, 'b', { size: 22, anchor: 'middle', c: 'dtb', i: 1, w: 700 });
  const ly = y0 + Hh * k + 40;
  s += T(20, ly, 'a = 30 mm on the filing (binding) edge', { size: 22 }) + T(20, ly + 30, 'b = 20 mm on the other three edges', { size: 22 });
  figs['m3-sheet-layout'] = svg(ly + 46, s);
}

// ---- 3. Scale 1:2: an L bracket 100 x 100 x 10 thick drawn at half size
{
  const leg = 100, t = 10, sc = 0.5, px = 1.6; // px per drawn mm
  GEO.scale = { leg, t, sc, drawnLeg: leg * sc, drawnT: t * sc };
  let s = T(20, 32, 'Same bracket at 1 : 1 and at 1 : 2', { size: 24 });
  const Lsh = (x, y, n) => pl([[x, y], [x + t * n * px, y], [x + t * n * px, y + (leg - t) * n * px], [x + leg * n * px, y + (leg - t) * n * px], [x + leg * n * px, y + leg * n * px], [x, y + leg * n * px], [x, y]], { w: 3 });
  const y0 = 80, xA = 40, xB = 380;
  s += Lsh(xA, y0, 1) + Lsh(xB, y0 + leg * px * 0.5, sc);
  s += T(xA + 80, y0 - 18, 'Actual size', { anchor: 'middle', size: 22, c: 'dtb' }) + T(xB + 40, y0 + 50, 'Drawn at 1 : 2', { anchor: 'middle', size: 22, c: 'dto' });
  const by = y0 + leg * px + 30;
  s += dim(xA, by, xA + leg * px, by, '') + T(xA + 80, by + 30, '100', { anchor: 'middle', size: 22 });
  s += dim(xB, by, xB + leg * sc * px, by, '') + T(xB + 40, by + 30, '50', { anchor: 'middle', size: 22 });
  s += T(20, by + 74, 'Scale = drawing size : actual size = 50 : 100 = 1 : 2', { size: 22 });
  s += T(20, by + 104, 'The dimension written is still 100.', { size: 22, c: 'dto' });
  figs['m3-scale-demo'] = svg(by + 120, s);
}

function f(n) { return Math.round(n * 10) / 10; }

if (require.main === module) {
  for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
  console.log('wrote', Object.keys(figs).length, 'figures');
}
module.exports = { GEO, figs, H, rect, dim };
