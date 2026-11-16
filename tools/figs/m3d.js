// Generates the chunk-3d figures (projections of solids in simple positions) into figs-svg/. Usage: node tools/figs/m3d.js figs-svg
// Each solid is a 3-D model (mm): x along XY, y = distance in front of the VP, z = height above the HP.
// First angle: FV point (x, z) above XY, TV point (x, y) below XY. An edge is visible in a view when one of its two faces
// faces the viewer (exact for convex solids); otherwise it is drawn dashed. Exports GEO for tools/check-m3.js.
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';
const { H } = require('./m3a.js');
const { svg, T, L } = H;
const figs = {};
const GEO = {};
const THICK = 3, THIN = 1.6, CH = '14 4 3 4';
const rad = d => d * Math.PI / 180;
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mean = ps => ps.reduce((s, p) => s.map((v, i) => v + p[i] / ps.length), [0, 0, 0]);

// regular polygon walked counter-clockwise from p0, first edge at angle a0 (degrees), side s
function regPoly(p0, a0, n, s) { const pts = [p0]; let a = a0; for (let i = 1; i < n; i++) { const q = pts[i - 1]; pts.push([q[0] + s * Math.cos(rad(a)), q[1] + s * Math.sin(rad(a))]); a += 360 / n; } return pts; }

function prism(cap0, cap1) { // two matching caps of 3-D points
  const n = cap0.length, V = [...cap0, ...cap1], F = [[...Array(n).keys()], [...Array(n).keys()].map(i => n + i)];
  for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n + (i + 1) % n, n + i]);
  return solid(V, F);
}
function pyramid(base, apex) {
  const n = base.length, V = [...base, apex], F = [[...Array(n).keys()]];
  for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n]);
  return solid(V, F);
}
function solid(V, F) {
  const c = mean(V);
  const N = F.map(f => { let nrm = cross(sub3(V[f[1]], V[f[0]]), sub3(V[f[2]], V[f[0]])); if (dot(nrm, sub3(mean(f.map(i => V[i])), c)) < 0) nrm = nrm.map(v => -v); return nrm; });
  const E = new Map();
  F.forEach((f, fi) => f.forEach((a, i) => { const b = f[(i + 1) % f.length], key = Math.min(a, b) + '-' + Math.max(a, b); if (!E.has(key)) E.set(key, { a: Math.min(a, b), b: Math.max(a, b), faces: [] }); E.get(key).faces.push(fi); }));
  return { V, F, N, E: [...E.values()] };
}
// edges of one view: dir = viewer direction, proj = 3-D -> 2-D (mm)
function view(S, dir, proj) {
  const r = p => p.map(v => Math.round(v * 1000) / 1000);
  const segs = S.E.map(e => ({ p: r(proj(S.V[e.a])), q: r(proj(S.V[e.b])), vis: e.faces.some(fi => dot(S.N[fi], dir) > 1e-9) }))
    .filter(s => Math.hypot(s.p[0] - s.q[0], s.p[1] - s.q[1]) > 1e-6);
  // a hidden segment lying wholly on visible ones is not drawn (visible line takes precedence)
  const vis = segs.filter(s => s.vis);
  const onSeg = (pt, g) => { const [ax, ay] = g.p, [bx, by] = g.q, l = Math.hypot(bx - ax, by - ay), t = ((pt[0] - ax) * (bx - ax) + (pt[1] - ay) * (by - ay)) / (l * l);
    return t > -1e-6 && t < 1 + 1e-6 && Math.abs((pt[0] - ax) * (by - ay) - (pt[1] - ay) * (bx - ax)) / l < 1e-6; };
  const covered = g => [0, 0.25, 0.5, 0.75, 1].every(t => vis.some(v => onSeg([g.p[0] + t * (g.q[0] - g.p[0]), g.p[1] + t * (g.q[1] - g.p[1])], v)));
  return segs.filter(g => g.vis || !covered(g));
}
const FVp = p => [p[0], p[2]], TVp = p => [p[0], p[1]];
// draw a solid's FV and TV around an XY line; ox = screen x of model x = 0
function drawViews(S, ox, xyY, k, axis) {
  const fv = view(S, [0, 1, 0], FVp), tv = view(S, [0, 0, 1], TVp);
  const toF = ([x, z]) => [ox + x * k, xyY - z * k], toT = ([x, y]) => [ox + x * k, xyY + y * k];
  let s = '';
  const draw = (segs, to) => segs.sort((a, b) => a.vis - b.vis).forEach(g => { s += L(...to(g.p), ...to(g.q), g.vis ? { w: THICK } : { w: THIN, dash: '7 5', c: 'dso' }); });
  draw(fv, toF); draw(tv, toT);
  if (axis) { // axis as a chain line where it shows as a line
    const [a, b] = axis, ext = 6;
    [[FVp, toF], [TVp, toT]].forEach(([pj, to]) => { const p = pj(a), q = pj(b), d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d > 1) { const u = [(q[0] - p[0]) / d, (q[1] - p[1]) / d]; s += L(...to([p[0] - u[0] * ext, p[1] - u[1] * ext]), ...to([q[0] + u[0] * ext, q[1] + u[1] * ext]), { w: THIN, dash: CH, c: 'dsg' }); } });
  }
  return { s, fv, tv };
}
const xyLine = (y) => L(20, y, 580, y, { w: 2, c: 'dsb' }) + T(14, y + 8, 'X', { size: 22, anchor: 'end', c: 'dtb' }).replace('x="14"', 'x="18"') + T(584, y + 8, 'Y', { size: 22, c: 'dtb' }).replace('x="584"', 'x="582"');

// ---- 1. Cylinder and cone, base 40 diameter, axis 50, resting on the HP on their bases (Problem 13-3, L45 slide 8)
{
  const k = 2.4, xyY = 200, R = 20, h = 50, gap = 10;
  let s = T(20, 32, 'Axis perpendicular to the HP', { size: 24 });
  const circ = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" class="ds" fill="none" stroke-width="${THICK}"/>`;
  const panel = (cx, cone) => {
    const yC = gap + R; // centre distance in front of the VP
    let p = cone ? L(cx - R * k, xyY, cx, xyY - h * k, { w: THICK }) + L(cx, xyY - h * k, cx + R * k, xyY, { w: THICK }) + L(cx - R * k, xyY, cx + R * k, xyY, { w: THICK })
      : `<rect x="${cx - R * k}" y="${xyY - h * k}" width="${2 * R * k}" height="${h * k}" class="ds" fill="none" stroke-width="${THICK}"/>`;
    p += L(cx, xyY - h * k - 12, cx, xyY + 4, { w: THIN, dash: CH, c: 'dsg' });
    p += circ(cx, xyY + yC * k, R * k) + L(cx - R * k - 12, xyY + yC * k, cx + R * k + 12, xyY + yC * k, { w: THIN, dash: CH, c: 'dsg' }) + L(cx, xyY + yC * k - R * k - 12, cx, xyY + yC * k + R * k + 12, { w: THIN, dash: CH, c: 'dsg' });
    p += T(cx, 62, cone ? 'Cone' : 'Cylinder', { size: 22, anchor: 'middle', c: 'dto', w: 700 });
    return p;
  };
  s += xyLine(xyY) + panel(170, false) + panel(430, true);
  s += T(20, xyY + (gap + 2 * R) * k + 44, 'Base Ø40, axis 50: the top view (circle) is drawn first.', { size: 22 });
  GEO.cylCone = { R, h, k, fvW: 2 * R, fvH: h };
  figs['m3-solids-cyl-cone'] = svg(xyY + (gap + 2 * R) * k + 62, s);
}

// ---- 2. Hexagonal pyramid (base 30, axis 60, one base edge at 45 deg to the VP; Problem 13-5, L45 slide 15)
//         and triangular prism (base 40, axis 50, one rectangular face perpendicular to the VP; L45 slide 16)
{
  const k = 2, xyY = 208;
  let s = T(20, 32, 'Base on the HP: top view first', { size: 24 });
  // hexagon: walk CCW from a corner with the first edge at 45 deg; then shift so the nearest corner is 8 mm in front of the VP
  let hex = regPoly([0, 0], 45, 6, 30);
  const hc = mean(hex.map(p => [p[0], p[1], 0])); hex = hex.map(p => [p[0] - hc[0], p[1] - hc[1]]);
  const hy = 8 - Math.min(...hex.map(p => p[1]));
  const base = hex.map(p => [p[0], p[1] + hy, 0]), apex = [0, hy, 60];
  const HP = pyramid(base, apex);
  const d1 = drawViews(HP, 160, xyY, k, [[0, hy, 0], apex]);
  s += d1.s + T(160, 52, 'Hexagonal pyramid', { size: 22, anchor: 'middle', c: 'dto', w: 700 });
  // triangular prism: edge along y (perpendicular to XY) on the left, apex corner to the right
  const tri = [[0, 8], [0, 48], [20 * Math.sqrt(3), 28]];
  const TP = prism(tri.map(p => [p[0], p[1], 0]), tri.map(p => [p[0], p[1], 50]));
  const d2 = drawViews(TP, 400, xyY, k, null);
  s += d2.s + T(435, 52, 'Triangular prism', { size: 22, anchor: 'middle', c: 'dto', w: 700 });
  s += xyLine(xyY);
  const bottom = xyY + Math.max(...base.map(p => p[1]), 48) * k + 40;
  s += T(20, bottom, 'Hidden edges (dashed) are the slant edges and', { size: 22 }) + T(20, bottom + 28, 'long edges behind the solid.', { size: 22 });
  GEO.hexPyr = { S: HP, fv: d1.fv, tv: d1.tv, hex: base };
  GEO.triPrism = { S: TP, fv: d2.fv, tv: d2.tv };
  figs['m3-solids-axis-hp'] = svg(bottom + 44, s);
}

// ---- 3. Axis perpendicular to the VP: pentagonal prism (end edge 20, length 50, a rectangular face at 45 deg to the HP
//         towards the left; L45 slide 13) and square pyramid (base 40 in the VP, axis 65, a base edge at 30 deg to the HP,
//         a corner on the HP; Problem 13-8, L45 slide 23). Front view first.
{
  const k = 2, xyY = 206;
  let s = T(20, 32, 'Axis perpendicular to the VP: front view first', { size: 24 }).replace('font-size="24"', 'font-size="23"');
  // pentagon in the x-z plane: corner b on the HP, edge b->a at 135 deg (45 deg to the HP, rising to the left), walked CCW from a
  const b = [0, 0], a = [b[0] + 20 * Math.cos(rad(135)), b[1] + 20 * Math.sin(rad(135))];
  const pent = regPoly(a, -45, 5, 20); // a, b, c, d, e
  const PP = prism(pent.map(p => [p[0], 10, p[1]]), pent.map(p => [p[0], 60, p[1]]));
  const d1 = drawViews(PP, 150, xyY, k, null);
  s += d1.s + T(150, 62, 'Pentagonal prism', { size: 22, anchor: 'middle', c: 'dto', w: 700 });
  // square in the VP (y = 0): corner d on the HP, edge d->c at 30 deg to the HP
  const sq = regPoly([0, 0], 30, 4, 40); // d, c, b, a
  const sc = mean(sq.map(p => [p[0], p[1], 0]));
  const SP = pyramid(sq.map(p => [p[0], 0, p[1]]), [sc[0], 65, sc[1]]);
  const d2 = drawViews(SP, 400, xyY, k, [[sc[0], 0, sc[1]], [sc[0], 65, sc[1]]]);
  s += d2.s + T(430, 62, 'Square pyramid', { size: 22, anchor: 'middle', c: 'dto', w: 700 });
  s += xyLine(xyY);
  const bottom = xyY + 65 * k + 40;
  s += T(20, bottom, 'The ends (or base) are parallel to the VP, so the', { size: 22 }) + T(20, bottom + 28, 'front view shows their true shape.', { size: 22 });
  GEO.pentPrism = { S: PP, fv: d1.fv, tv: d1.tv, pent };
  GEO.sqPyr = { S: SP, fv: d2.fv, tv: d2.tv, sq };
  figs['m3-solids-axis-vp'] = svg(bottom + 44, s);
}

if (require.main === module) {
  for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
  console.log('wrote', Object.keys(figs).length, 'figures');
}
module.exports = { GEO, figs };
