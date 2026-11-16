// Generates the chunk-3b figures (line types, lines on a part, dimensioning systems) into figs-svg/. Usage: node tools/figs/m3b.js figs-svg
// Reuses the m3a helpers (which reuse m2a). Exports GEO for tools/check-m3.js.
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';
const { H, rect } = require('./m3a.js');
const { svg, T, L, P } = H;
const figs = {};
const GEO = {};
const THICK = 4, THIN = 1.8;

// ---- 1. IS 10714 line types A..K (Lecture 2, slides 2-3)
{
  const rows = [
    ['A', 'Continuous thick', 'Visible outlines and edges', { w: THICK }],
    ['B', 'Continuous thin', 'Dimension, extension, leader, hatching', { w: THIN }],
    ['C', 'Thin freehand', 'Limit of a partial view', 'free'],
    ['D', 'Thin with zigzags', 'Long-break line', 'zig'],
    ['E', 'Dashed thick', 'Permissible surface treatment', { w: THICK, dash: '14 7' }],
    ['F', 'Dashed thin', 'Hidden outlines and edges', { w: THIN, dash: '12 6' }],
    ['G', 'Chain thin', 'Centre lines, symmetry', { w: THIN, dash: '26 5 3 5' }],
    ['H', 'Chain thin, thick ends', 'Cutting planes', 'cut'],
    ['J', 'Chain thick', 'Special requirement', { w: THICK, dash: '26 6 3 6' }],
    ['K', 'Chain thin double-dashed', 'Adjacent parts, extreme positions', { w: THIN, dash: '26 5 3 5 3 5' }]
  ];
  GEO.lineLetters = rows.map(r => r[0]);
  let s = T(20, 32, 'IS 10714 line types', { size: 24 });
  const x1 = 56, x2 = 196;
  rows.forEach(([k, name, use, st], i) => {
    const y = 84 + i * 66;
    s += T(20, y + 8, k, { size: 24, w: 700, c: 'dtb' });
    if (st === 'free') s += P(`M${x1} ${y}c20 -14 30 12 50 0s30 -12 50 2 20 10 40 -2`, { w: THIN });
    else if (st === 'zig') s += P(`M${x1} ${y}H110l6 -14 8 28 6 -14H${x2}`, { w: THIN });
    else if (st === 'cut') s += L(x1, y, x2, y, { w: THIN, dash: '26 5 3 5' }) + L(x1, y, x1 + 24, y, { w: THICK + 1 }) + L(x2 - 24, y, x2, y, { w: THICK + 1 });
    else s += L(x1, y, x2, y, { w: st.w, dash: st.dash });
    s += T(214, y - 4, name, { size: 22, c: 'dtb' }) + T(214, y + 22, use, { size: 22 });
  });
  figs['m3-line-types'] = svg(84 + 10 * 66 - 20, s);
}

// ---- 2. Lines on a part (after Lecture 2, slide 4). 4 px = 1 mm
{
  const k = 4, bx = 60, by = 180, bw = 90 * k, bh = 15 * k, cx = 180, cy = 130, r = 5 * k;
  GEO.demo = { k, baseMM: bw / k, holeDia: 2 * r / k };
  let s = '';
  // visible outline (A)
  s += P(`M${bx} ${by + bh}V${by}H120V80H240V${by}H${bx + bw}V${by + bh}Z`, { w: THICK });
  s += `<circle cx="${cx}" cy="${cy}" r="${r}" class="ds" fill="none" stroke-width="${THICK}"/>`;
  // centre lines (G), past the outline
  s += L(cx - r - 16, cy, cx + r + 16, cy, { w: THIN, dash: '18 4 3 4', c: 'dsg' }) + L(cx, cy - r - 16, cx, cy + r + 16, { w: THIN, dash: '18 4 3 4', c: 'dsg' });
  // blind hole in the base, hidden (F), with its centre line
  s += P(`M330 ${by}V220H360V${by}`, { w: THIN, dash: '10 5', c: 'dso' }) + L(345, 168, 345, 230, { w: THIN, dash: '18 4 3 4', c: 'dsg' });
  // extension + dimension lines (B)
  s += L(bx, by + bh + 4, bx, 292, { w: THIN, c: 'dsb' }) + L(bx + bw, by + bh + 4, bx + bw, 292, { w: THIN, c: 'dsb' });
  s += L(bx + 2, 280, bx + bw, 280, { w: THIN, c: 'dsb', arrow: 'b' }) + L(bx + bw - 2, 280, bx, 280, { w: THIN, c: 'dsb', arrow: 'b' });
  s += T(bx + bw / 2, 272, '90', { anchor: 'middle', size: 22 });
  // leader + note
  const lx = cx + r * Math.SQRT1_2, ly = cy - r * Math.SQRT1_2;
  s += L(292, 66, 262, 66, { w: THIN, c: 'dsb' }) + L(262, 66, lx, ly, { w: THIN, c: 'dsb', arrow: 'b' }) + T(296, 74, 'Ø10', { size: 22 });
  // cutting-plane line (H) with P arrows, and section lines (hatching) as in the course figure
  s += L(80, 160, 280, 160, { w: THIN, dash: '26 5 3 5', c: 'dso' }) + L(80, 160, 106, 160, { w: THICK, c: 'dso' }) + L(254, 160, 280, 160, { w: THICK, c: 'dso' });
  s += L(80, 128, 80, 156, { w: 2.5, arrow: 'w' }) + L(280, 128, 280, 156, { w: 2.5, arrow: 'w' }) + T(80, 118, 'P', { size: 22, anchor: 'middle' }) + T(280, 118, 'P', { size: 22, anchor: 'middle' });
  s += T(20, 70, 'Cutting plane (H)', { size: 22, c: 'dto' }) + L(40, 78, 82, 154, { w: 1.2, c: 'ds' });
  s += '<clipPath id="hc"><rect x="470" y="84" width="90" height="40"/></clipPath><g clip-path="url(#hc)">';
  for (let t = -40; t <= 90; t += 12) s += L(470 + t, 124, 470 + t + 40, 84, { w: THIN, c: 'dsb' });
  s += '</g>' + P('M470 84H560V124H470Z', { w: THICK }) + T(430, 150, 'Section lines', { size: 22, c: 'dtb' });
  // labels
  const lab = (x, y, t, c, tx, ty) => T(x, y, t, { size: 22, c }) + L(tx[0], tx[1], ty[0], ty[1], { w: 1.2, c: 'ds' });
  s += lab(440, 198, 'Outline (A)', 'dt', [436, 192], [400, 180]);
  s += lab(440, 236, 'Hidden (F)', 'dto', [436, 230], [361, 210]);
  s += lab(262, 140, 'Centre line (G)', 'dtg', [258, 134], [cx + r + 12, cy]);
  s += T(20, 330, 'Extension and dimension lines (B)', { size: 22, c: 'dtb' }) + T(372, 74, '← leader and note', { size: 22, c: 'dtb' });
  s = T(20, 32, 'Lines on a part', { size: 24 }) + s;
  figs['m3-lines-demo'] = svg(350, s);
}

// ---- 3. Aligned vs unidirectional dimensioning (Lecture 2, slides 8-10). 50 x 30 plate, 3 px = 1 mm
{
  const k = 3, w = 50 * k, h = 30 * k;
  GEO.dimsys = { k, w: w / k, h: h / k };
  const panel = (x0, title, uni) => {
    const x = x0 + 70, y = 90;
    let s = T(x0 + 145, 56, title, { anchor: 'middle', size: 22, c: 'dtb', w: 700 });
    s += rect(x, y, w, h, { w: THICK - 1 });
    // horizontal dimension under the plate
    const dy = y + h + 36;
    s += L(x, y + h + 4, x, dy + 10, { w: THIN, c: 'dsb' }) + L(x + w, y + h + 4, x + w, dy + 10, { w: THIN, c: 'dsb' });
    // vertical dimension left of the plate
    const dx = x - 36;
    s += L(x - 4, y, dx - 10, y, { w: THIN, c: 'dsb' }) + L(x - 4, y + h, dx - 10, y + h, { w: THIN, c: 'dsb' });
    const arr = (x1, y1, x2, y2) => L(x1, y1, x2, y2, { w: THIN, c: 'dsb', arrow: 'b' });
    if (!uni) {
      s += arr(x + w / 2, dy, x, dy) + arr(x + w / 2, dy, x + w, dy) + T(x + w / 2, dy - 8, '50', { anchor: 'middle', size: 22 });
      s += arr(dx, y + h / 2, dx, y) + arr(dx, y + h / 2, dx, y + h);
      s += `<text x="${dx - 8}" y="${y + h / 2}" font-size="22" class="dt" text-anchor="middle" transform="rotate(-90 ${dx - 8} ${y + h / 2})">30</text>`;
    } else {
      s += arr(x + w / 2 - 20, dy, x, dy) + arr(x + w / 2 + 20, dy, x + w, dy) + T(x + w / 2, dy + 8, '50', { anchor: 'middle', size: 22 });
      s += arr(dx, y + h / 2 - 16, dx, y) + arr(dx, y + h / 2 + 16, dx, y + h) + T(dx, y + h / 2 + 8, '30', { anchor: 'middle', size: 22 });
    }
    return s;
  };
  let s = T(20, 26, 'Two systems of dimensioning', { size: 24 });
  s += panel(0, 'Aligned', false) + panel(300, 'Unidirectional', true);
  s += T(20, 290, 'Aligned: figures above the line, read from', { size: 22 }) + T(20, 318, 'the bottom or the right side.', { size: 22 });
  s += T(20, 352, 'Unidirectional: figures always horizontal,', { size: 22, c: 'dto' }) + T(20, 380, 'in a break in the dimension line.', { size: 22, c: 'dto' });
  figs['m3-dim-systems'] = svg(396, s);
}

if (require.main === module) {
  for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
  console.log('wrote', Object.keys(figs).length, 'figures');
}
module.exports = { GEO, figs };
