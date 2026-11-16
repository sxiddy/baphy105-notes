// Generates the chunk-3c figures (projection principle, quadrants, symbols, six-view layout, worked block) into figs-svg/.
// Usage: node tools/figs/m3c.js figs-svg. Exports GEO (model + drawn views) for tools/check-m3.js.
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';
const { H, rect } = require('./m3a.js');
const { svg, T, L, P, R, pl } = H;
const figs = {};
const GEO = {};
const THICK = 3.5, THIN = 1.8;
const circ = (cx, cy, r, o = {}) => `<circle cx="${cx}" cy="${cy}" r="${r}" class="${o.c || 'ds'}" fill="none" stroke-width="${o.w || THICK}"/>`;

// ---- 1. Principle of orthographic projection (Lecture 3, slide 3)
{
  let s = T(20, 32, 'Orthographic projection', { size: 24 });
  // plane (parallelogram)
  s += P('M70 80L150 50V250L70 280Z', { c: 'dsb', w: 2.5 }) + `<path d="M70 80L150 50V250L70 280Z" class="dfb" fill-opacity="0.15" stroke="none"/>`;
  const A = [400, 110], B = [400, 210], ax = 110;
  s += L(A[0], A[1], B[0], B[1], { c: 'dso', w: 5 }) + L(ax, A[1], ax, B[1], { c: 'dso', w: 5 });
  // projectors: parallel, perpendicular to the plane, from the observer side
  [A[1], B[1]].forEach(y => { s += L(540, y, ax + 4, y, { w: THIN, arrow: 'w' }); });
  s += T(412, A[1] - 8, 'A', { size: 24, w: 700, c: 'dto' }) + T(412, B[1] - 8, 'B', { size: 24, w: 700, c: 'dto' });
  s += T(ax - 34, A[1] + 4, 'a′', { size: 24, w: 700, c: 'dto' }) + T(ax - 34, B[1] + 4, 'b′', { size: 24, w: 700, c: 'dto' });
  s += T(110, 306, 'Plane of projection', { size: 22, c: 'dtb', anchor: 'middle' });
  s += T(400, 250, 'Object', { size: 22, anchor: 'middle', c: 'dto' }) + T(560, 166, 'Observer', { size: 22, anchor: 'end' }) + T(560, 192, 'at infinity', { size: 22, anchor: 'end' });
  s += T(20, 346, 'Projectors are parallel to each other and', { size: 22 }) + T(20, 374, 'perpendicular to the plane: a′b′ = AB (true length).', { size: 22 });
  figs['m3-ortho-principle'] = svg(390, s);
}

// ---- 2. Four quadrants, side view of HP and VP (Lecture 3, slides 4-6). Observer on the right.
{
  let s = T(20, 32, 'The four quadrants (seen from the side)', { size: 24 });
  const ox = 300, oy = 210;
  s += L(ox, 60, ox, 360, { w: 3, c: 'dsb' }) + L(70, oy, 530, oy, { w: 3, c: 'dsg' });
  s += T(ox + 8, 76, 'VP', { size: 22, c: 'dtb', w: 700 }) + T(70, oy - 8, 'HP', { size: 22, c: 'dtg', w: 700 });
  const q = (x, y, n, a, b) => T(x, y, n, { size: 22, w: 700, anchor: 'middle' }) + T(x, y + 28, a, { size: 22, anchor: 'middle' }) + T(x, y + 56, b, { size: 22, anchor: 'middle' });
  s += q(420, 100, '1st quadrant', 'above HP', 'in front of VP');
  s += q(180, 100, '2nd quadrant', 'above HP', 'behind VP');
  s += q(180, 260, '3rd quadrant', 'below HP', 'behind VP');
  s += q(420, 260, '4th quadrant', 'below HP', 'in front of VP');
  s += L(590, 386, 530, 386, { w: 2.5, arrow: 'o', c: 'dso' }) + T(520, 394, 'Observer looks from the front', { size: 22, anchor: 'end', c: 'dto' });
  GEO.quadrants = { first: ['above HP', 'in front of VP'], third: ['below HP', 'behind VP'] };
  figs['m3-quadrants'] = svg(410, s);
}

// ---- 3. Projection symbols (Lecture 3, slide 11): truncated cone, small end on the left, and its end view
{
  const sym = (x, y, circlesRight) => {
    const tx = circlesRight ? x : x + 130, cx = circlesRight ? x + 190 : x + 40;
    let s = pl([[tx, y - 22], [tx + 100, y - 40], [tx + 100, y + 40], [tx, y + 22], [tx, y - 22]], { w: THICK });
    s += circ(cx, y, 40) + circ(cx, y, 22);
    s += L(tx - 12, y, tx + 112, y, { w: THIN, dash: '16 4 3 4', c: 'dsg' }) + L(cx - 52, y, cx + 52, y, { w: THIN, dash: '16 4 3 4', c: 'dsg' }) + L(cx, y - 52, cx, y + 52, { w: THIN, dash: '16 4 3 4', c: 'dsg' });
    return s;
  };
  let s = T(20, 32, 'Projection symbols', { size: 24 });
  s += T(20, 110, 'First angle', { size: 22, w: 700, c: 'dtb' }) + T(20, 138, '(BIS, ISO)', { size: 22, c: 'dtb' }) + sym(260, 110, true);
  s += T(20, 250, 'Third angle', { size: 22, w: 700, c: 'dto' }) + T(20, 278, '(ASME)', { size: 22, c: 'dto' }) + sym(260, 250, false);
  s += T(20, 340, 'First angle: end view on the far side, opposite', { size: 22 }) + T(20, 368, 'to where it is seen from. Third: same side.', { size: 22 });
  GEO.symbols = { firstCirclesRight: true, thirdCirclesRight: false };
  figs['m3-proj-symbols'] = svg(384, s);
}

// ---- 4. Placement of the six views, first and third angle (Lecture 3, slides 10, 16)
{
  const W = 112, Hh = 46, gx = 128;
  const layout = (y0, third) => {
    // columns: 0..3 ; FV in column 1
    const row = third ? ['Left side', 'Front', 'Right side', 'Rear'] : ['Right side', 'Front', 'Left side', 'Rear'];
    const up = third ? 'Top' : 'Bottom', down = third ? 'Bottom' : 'Top';
    const x0 = 44;
    let s = '';
    const box = (c, r, t, cls) => R(x0 + c * gx, y0 + r * (Hh + 16), W, Hh, cls, 0.18) + rect(x0 + c * gx, y0 + r * (Hh + 16), W, Hh, { w: 2, c: cls.replace('df', 'ds') }) + T(x0 + c * gx + W / 2, y0 + r * (Hh + 16) + 31, t, { size: 22, anchor: 'middle' });
    s += box(1, 0, up, 'dfg');
    row.forEach((t, i) => { s += box(i, 1, t, t === 'Front' ? 'dfo' : 'dfb'); });
    s += box(1, 2, down, 'dfg');
    return s;
  };
  let s = T(20, 32, 'Where the six views go', { size: 24 });
  s += T(20, 72, 'First angle (BIS)', { size: 22, w: 700, c: 'dtb' }) + layout(86, false);
  s += T(20, 316, 'Third angle (ASME)', { size: 22, w: 700, c: 'dto' }) + layout(330, true);
  GEO.six = {
    first: { top: 'below', bottom: 'above', left: 'right', right: 'left' },
    third: { top: 'above', bottom: 'below', left: 'left', right: 'right' }
  };
  figs['m3-six-views-layout'] = svg(330 + 3 * (Hh + 16) + 10, s);
}

// ---- 5. Worked block (Lecture 3, slide 18): base 50 x 50 x 10 with two 10-thick ribs. First angle.
// Model axes (mm): x across the front view, y depth (0 = front, seen from A), z up.
{
  const model = {
    base: { x: [0, 50], y: [0, 50], z: [0, 10] },
    ribXZ: [[20, 10], [20, 40], [30, 40], [50, 10]], // rib profile seen from A (height 40 = 10 base + 30 rib, from the slide's views)
    ribY: [[0, 10], [40, 50]]
  };
  const k = 3, fx = 70, xyY = 240, gap = 20, sx = 350; // px per mm, FV left edge, XY line, gap to XY, LSV left edge
  // projections: FV (x, z), TV (x, y) below XY with the front of the object AWAY from the FV, LSV (y, z) on the right with the front away from the FV
  const FV = (x, z) => [fx + x * k, xyY - gap - z * k];
  const TV = (x, y) => [fx + x * k, xyY + gap + (50 - y) * k];
  const SV = (y, z) => [sx + (50 - y) * k, xyY - gap - z * k];
  const seg = (f, a, b) => L(...f(...a), ...f(...b), { w: THICK - 1 });
  let s = T(20, 32, 'Block of slide 18, first angle', { size: 24 });
  // front view
  [[[0, 0], [50, 0]], [[50, 0], [50, 10]], [[0, 10], [50, 10]], [[0, 0], [0, 10]]].forEach(([a, b]) => { s += seg(FV, a, b); });
  model.ribXZ.forEach((p, i, arr) => { if (i < arr.length - 1) s += seg(FV, p, arr[i + 1]); });
  // top view
  [[[0, 0], [50, 0]], [[50, 0], [50, 50]], [[50, 50], [0, 50]], [[0, 50], [0, 0]]].forEach(([a, b]) => { s += seg(TV, a, b); });
  model.ribY.forEach(([y1, y2]) => { const yi = y1 === 0 ? y2 : y1; s += seg(TV, [20, yi], [50, yi]) + seg(TV, [20, y1], [20, y2]) + seg(TV, [30, y1], [30, y2]); });
  // left side view (from B, on the left of the object): drawn on the right in first angle
  [[[0, 0], [50, 0]], [[50, 0], [50, 10]], [[0, 10], [50, 10]], [[0, 0], [0, 10]]].forEach(([a, b]) => { s += seg(SV, a, b); });
  model.ribY.forEach(([y1, y2]) => { s += seg(SV, [y1, 10], [y1, 40]) + seg(SV, [y1, 40], [y2, 40]) + seg(SV, [y2, 40], [y2, 10]); });
  // XY line and projectors (thin)
  s += L(40, xyY, 560, xyY, { w: 2, c: 'dsb' }) + T(32, xyY + 8, 'X', { size: 22, anchor: 'end', c: 'dtb' }) + T(566, xyY + 8, 'Y', { size: 22, c: 'dtb' });
  [0, 20, 30, 50].forEach(x => { s += L(fx + x * k, xyY - gap + 4, fx + x * k, xyY + gap - 4, { w: 1, c: 'dsg', dash: '4 4' }); });
  [10, 40].forEach(z => { s += L(fx + 50 * k + 6, xyY - gap - z * k, sx - 6, xyY - gap - z * k, { w: 1, c: 'dsg', dash: '4 4' }); });
  s += T(fx + 75, 78, 'Front view (from A)', { size: 22, anchor: 'middle', c: 'dto' });
  s += T(sx + 75, 78, 'Left side view (from B)', { size: 22, anchor: 'middle', c: 'dto' });
  s += T(fx + 75, xyY + gap + 150 + 32, 'Top view (from C)', { size: 22, anchor: 'middle', c: 'dto' });
  s += T(sx, 340, 'Top view below the FV,', { size: 22 }) + T(sx, 368, 'left view on its right:', { size: 22 }) + T(sx, 396, 'first angle.', { size: 22 });
  GEO.block = { model, k, FV, TV, SV, xyY };
  figs['m3-ortho-block'] = svg(xyY + gap + 150 + 46, s);
}

if (require.main === module) {
  for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
  console.log('wrote', Object.keys(figs).length, 'figures');
}
module.exports = { GEO, figs };
