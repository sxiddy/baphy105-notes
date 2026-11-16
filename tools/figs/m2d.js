// Generates the chunk-2d figures (cellular, satellite, radar) into figs-svg/.
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';
const src = fs.readFileSync(path.join(__dirname, 'm2a.js'), 'utf8').split('const figs = {};')[0].replace("process.argv[2] || 'figs-svg'", "'x'");
const H = new Function('require', 'process', src + '; return { svg, T, L, P, R, sub, pl, f1, resH, ground };')(require, process);
const { svg, T, L, P, R, sub, pl, f1, resH } = H;
const figs = {};
const box = (x, y, w, h, t, c = 'ds', size = 22, lines) => {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="${c}" fill="none" stroke-width="2.5"/>`;
  const ls = lines || [t];
  ls.forEach((l, i) => { s += T(x + w / 2, y + h / 2 + 8 - (ls.length - 1) * 13 + i * 26, l, { size, anchor: 'middle' }); });
  return s;
};
const hex = (cx, cy, r, cls = 'ds', fill = '') => {
  const pts = []; for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return P('M' + pts.map(p => p.map(f1).join(' ')).join('L') + 'Z', { c: cls, w: 2.5, fill: fill ? 'currentColor' : 'none' }).replace('fill="currentColor"', fill);
};

// 1. cell layout
{
  let s = T(20, 36, 'Cells and the MTSO', { size: 26, w: 600 });
  const r = 46, dx = r * Math.sqrt(3), dy = r * 1.5;
  const cells = [];
  for (let row = 0; row < 5; row++) for (let col = 0; col < 5; col++) cells.push([80 + col * dx + (row % 2 ? dx / 2 : 0), 100 + row * dy, row, col]);
  cells.forEach(([x, y, row, col]) => { const mid = row === 2 && col === 2; s += mid ? hex(x, y, r, 'dso', 'class="dfo" fill-opacity=".3"') : hex(x, y, r, 'ds2'); });
  const m = cells.find(c => c[2] === 2 && c[3] === 2);
  s += T(m[0], m[1] + 8, 'MTSO', { size: 22, anchor: 'middle', c: 'dto' });
  const c0 = cells[0]; s += T(c0[0], c0[1] + 8, 'cell', { size: 22, anchor: 'middle', c: 'dt2' });
  s += L(m[0], m[1] + 10, m[0], 500, { c: 'dso', dash: '7 6', w: 2 }) + T(m[0] + 12, 520, 'to/from the telephone system', { size: 22, c: 'dto' });
  figs['m2-cell-layout'] = svg(540, s);
}

// 2. cell bands
{
  let s = T(20, 36, 'Cellular frequency blocks', { size: 26, w: 600 });
  const bar = (y, title, x1, w1, l1, x2, w2, l2, e1, e2, mhz) => {
    let p = T(20, y, title, { size: 24, c: 'dtb', w: 600 });
    p += R(x1, y + 40, w1, 56, 'dfb', 0.3) + `<rect x="${x1}" y="${y + 40}" width="${w1}" height="56" class="dsb" fill="none" stroke-width="2.5"/>` + T(x1 + w1 / 2, y + 74, l1, { size: 22, anchor: 'middle' });
    p += R(x2, y + 40, w2, 56, 'dfo', 0.3) + `<rect x="${x2}" y="${y + 40}" width="${w2}" height="56" class="dso" fill="none" stroke-width="2.5"/>` + T(x2 + w2 / 2, y + 74, l2, { size: 22, anchor: 'middle' });
    p += T(x1, y + 128, e1[0], { size: 22, c: 'dt2' }) + T(x1 + w1, y + 128, e1[1], { size: 22, c: 'dt2', anchor: 'end' });
    p += T(x2, y + 128, e2[0], { size: 22, c: 'dt2' }) + T(x2 + w2, y + 128, e2[1], { size: 22, c: 'dt2', anchor: 'end' });
    p += L(x1, y + 30, x1 + w1, y + 30, { arrow: 'w', w: 2 }).replace('marker-end', 'marker-start="url(#aw)" marker-end') + T(x1 + w1 / 2, y + 24, mhz, { size: 22, anchor: 'middle', c: 'dt2' });
    p += L(x2, y + 30, x2 + w2, y + 30, { arrow: 'w', w: 2 }).replace('marker-end', 'marker-start="url(#aw)" marker-end') + T(x2 + w2 / 2, y + 24, mhz, { size: 22, anchor: 'middle', c: 'dt2' });
    return p;
  };
  s += bar(80, '824–894 MHz block', 40, 200, 'Uplink', 340, 200, 'Downlink', ['824', '849'], ['869', '894'], '25 MHz');
  s += bar(260, '890–960 MHz block', 40, 200, 'Uplink', 340, 200, 'Downlink', ['890', '915'], ['935', '960'], '25 MHz');
  s += bar(440, 'PCS blocks', 40, 240, 'Uplink', 320, 240, 'Downlink', ['1850', '1910'], ['1930', '1990'], '60 MHz');
  s += T(300, 620, 'Frequencies in MHz', { size: 22, anchor: 'middle', c: 'dt2' });
  figs['m2-cell-bands'] = svg(640, s);
}

// 3. cell network
{
  let s = T(20, 36, 'Cellular network components', { size: 26, w: 600 });
  const y = 150, bx = [60, 200, 340, 480], names = ['Mobile', 'BTS', 'BSC', 'MSC'];
  bx.forEach((x, i) => { s += box(x - 50, y, 100, 60, '', 'ds', 24, [names[i]]); if (i < 3) s += L(x + 50, y + 30, bx[i + 1] - 50, y + 30); });
  s += T(60, y + 96, 'device', { size: 22, anchor: 'middle', c: 'dt2' }).replace('device', 'with SIM');
  const dbs = ['HLR', 'VLR', 'EIR', 'AuC'], dx0 = 100;
  dbs.forEach((d, i) => { const x = dx0 + i * 130; s += box(x - 50, 320, 100, 54, '', 'dso', 24, [d]); s += L(x, 320, 480, y + 60, { c: 'ds3', w: 2 }); });
  s += T(300, 420, 'databases attached to the MSC', { size: 22, anchor: 'middle', c: 'dt2' });
  s += T(300, 470, 'MSC links to the PSTN and other networks', { size: 22, anchor: 'middle', c: 'dt2' });
  s += T(480, 112, 'to PSTN', { size: 22, anchor: 'middle', c: 'dt2' }) + L(480, 150, 480, 124, { arrow: 'w', w: 2 });
  figs['m2-cell-network'] = svg(500, s);
}

// 4. satellite link
{
  let s = T(20, 36, 'Satellite link', { size: 26, w: 600 });
  // satellite
  s += `<rect x="255" y="80" width="90" height="46" rx="8" class="ds" fill="none" stroke-width="2.5"/>` + T(300, 110, 'Satellite', { size: 22, anchor: 'middle' });
  s += `<rect x="140" y="88" width="80" height="30" class="dsb" fill="none" stroke-width="2.5"/><rect x="380" y="88" width="80" height="30" class="dsb" fill="none" stroke-width="2.5"/>` + L(220, 103, 255, 103) + L(345, 103, 380, 103);
  s += T(300, 70, 'transponder inside', { size: 22, anchor: 'middle', c: 'dt2' });
  // earth stations
  const es = (x, label) => box(x, 340, 160, 50, '', 'ds', 24, [label]) + box(x, 420, 160, 60, '', 'ds', 22, ['Terrestrial', 'system']) + box(x, 510, 160, 46, '', 'ds', 24, ['User']);
  s += es(60, 'Earth station') + es(380, 'Earth station');
  s += L(140, 340, 140, 270, { c: 'dsr', arrow: 'r', w: 2.5 }) + L(140, 270, 240, 140, { c: 'dsr', arrow: 'r', w: 2.5 });
  s += L(360, 140, 460, 270, { c: 'dsg', arrow: 'g', w: 2.5 }) + L(460, 270, 460, 340, { c: 'dsg', arrow: 'g', w: 2.5 });
  s += T(110, 240, 'Uplink', { size: 24, c: 'dtr', anchor: 'middle' }) + T(490, 240, 'Downlink', { size: 24, c: 'dtg', anchor: 'middle' });
  s += L(140, 510, 140, 480, { arrow: 'w', w: 2 }) + L(140, 420, 140, 390, { arrow: 'w', w: 2 });
  s += L(460, 390, 460, 420, { arrow: 'w', w: 2 }) + L(460, 480, 460, 510, { arrow: 'w', w: 2 });
  s += T(300, 330, 'one uplink, many downlinks', { size: 22, anchor: 'middle', c: 'dt2' });
  figs['m2-sat-link'] = svg(580, s);
}

// 5. transponder block diagram
{
  let s = T(20, 36, 'Satellite transponder', { size: 26, w: 600 });
  s += box(60, 70, 210, 56, '', 'ds', 22, ['Uplink signal', '5.9 to 6.4 GHz']);
  s += L(165, 126, 165, 156, { arrow: 'w' });
  s += box(60, 156, 210, 50, 'Input filter');
  s += L(165, 206, 165, 236, { arrow: 'w' });
  s += box(60, 236, 210, 50, '6 GHz amplifier');
  s += L(165, 286, 165, 330, { arrow: 'w' });
  s += `<circle cx="165" cy="360" r="30" class="ds" fill="none" stroke-width="2.5"/>` + L(145, 340, 185, 380, { w: 2.5 }) + L(185, 340, 145, 380, { w: 2.5 }) + T(215, 366, 'Mixer', { size: 22, c: 'dt2' });
  s += box(330, 316, 230, 56, '', 'ds', 22, ['2.2 GHz', 'local oscillator']) + L(330, 344, 200, 356, { arrow: 'w' }).replace('x2="200" y2="356"', 'x2="198" y2="352"');
  s += L(165, 390, 165, 424, { arrow: 'w' });
  s += box(60, 424, 210, 50, '4 GHz amplifier');
  s += L(165, 474, 165, 504, { arrow: 'w' });
  s += `<rect x="40" y="504" width="520" height="86" rx="12" class="dsy" fill="none" stroke-width="2.5"/>` + T(300, 530, 'Transponder', { size: 22, anchor: 'middle', c: 'dty' });
  s += box(60, 540, 150, 40, 'Input MUX', 'ds', 20) + box(225, 540, 150, 40, 'TWT amp', 'ds', 20) + box(390, 540, 150, 40, 'Output MUX', 'ds', 20) + L(210, 560, 225, 560) + L(375, 560, 390, 560);
  s += L(165, 504, 165, 504);
  s += L(540, 590, 540, 626, { arrow: 'w' }) + T(540, 656, 'Downlink 3.7 to 4.2 GHz', { size: 22, anchor: 'end' });
  figs['m2-sat-block'] = svg(680, s);
}

// 6. radar principle
{
  let s = T(20, 36, 'Basic principle of radar', { size: 26, w: 600 });
  s += box(30, 90, 150, 56, 'Transmitter', 'dsb', 24) + box(30, 210, 150, 56, 'Receiver', 'ds', 24);
  s += L(180, 118, 230, 118) + L(180, 238, 230, 238) + L(230, 118, 230, 238);
  s += P('M230 178C250 150 250 206 230 178', { w: 0 });
  s += P('M255 128C285 160 285 196 255 228', { c: 'ds', w: 3 }) + T(260, 270, 'Antenna', { size: 22, c: 'dt2' });
  s += L(290, 150, 470, 150, { c: 'dsb', arrow: 'b', w: 3 }) + T(380, 130, 'transmitted signal', { size: 22, anchor: 'middle', c: 'dtb' });
  s += L(470, 210, 290, 210, { c: 'dsr', arrow: 'r', w: 2.5 }) + T(380, 244, 'echo signal', { size: 22, anchor: 'middle', c: 'dtr' });
  s += `<rect x="480" y="150" width="90" height="60" rx="30" class="dso" fill="none" stroke-width="2.5"/>` + T(525, 188, 'Target', { size: 22, anchor: 'middle', c: 'dto' });
  s += L(255, 320, 480, 320, { c: 'dsy', arrow: 'w', w: 2.5 }).replace('marker-end', 'marker-start="url(#aw)" marker-end') + T(368, 356, 'target range', { size: 24, anchor: 'middle', c: 'dty' });
  s += T(300, 400, 'range from the echo delay', { size: 22, anchor: 'middle', c: 'dt2' });
  figs['m2-radar-principle'] = svg(430, s);
}

// 7. radar block diagram
{
  let s = T(20, 36, 'Radar block diagram', { size: 26, w: 600 });
  s += T(20, 76, 'Transmitter section', { size: 24, c: 'dtb', w: 600 });
  const ty = 96;
  s += box(20, ty, 160, 56, '', 'ds', 20, ['Waveform', 'generator']) + L(180, ty + 28, 205, ty + 28, { arrow: 'w', w: 2 }) +
    box(205, ty, 160, 56, '', 'ds', 20, ['Pulse', 'modulator']) + L(365, ty + 28, 390, ty + 28, { arrow: 'w', w: 2 }) +
    box(390, ty, 190, 56, 'Transmitter', 'ds', 22);
  s += L(485, ty + 56, 485, ty + 100, { arrow: 'w', w: 2 });
  s += box(390, ty + 100, 190, 56, 'Duplexer', 'dso', 22) + L(580, ty + 128, 590, ty + 128, { w: 2 });
  s += T(300, ty + 138, 'to the antenna', { size: 22, c: 'dt2', anchor: 'end' }).replace('x="300" y="234"', 'x="370" y="240"');
  s += T(20, 316, 'Receiver section', { size: 24, c: 'dtr', w: 600 });
  const ry = 340, w = 126, gap = 14;
  const rx = [['Low noise', 'RF amp'], ['Mixer', '+ local osc.'], ['IF', 'amplifier']];
  s += L(485, ty + 156, 485, ry - 10, { c: 'ds2', dash: '6 5', w: 2 }) + L(485, ry - 10, 470, ry - 10, { c: 'ds2', dash: '6 5', w: 2 });
  rx.forEach((r, i) => { const x = 20 + i * (w + gap); s += box(x, ry, w, 56, '', 'ds', 20, r); if (i < 2) s += L(x + w, ry + 28, x + w + gap, ry + 28, { arrow: 'w', w: 2 }); });
  s += L(20 + 3 * w + 2 * gap, ry + 28, 20 + 3 * w + 2 * gap + 8, ry + 28, { w: 2 });
  const ry2 = ry + 120;
  const rx2 = [['2nd detector', ''], ['Video', 'amplifier'], ['Threshold', 'decision'], ['Display', '(PPI)']];
  rx2.forEach((r, i) => { const x = 20 + i * 143; s += box(x, ry2, 129, 56, '', 'ds', 20, r[1] ? r : [r[0]]); if (i < 3) s += L(x + 129, ry2 + 28, x + 143, ry2 + 28, { arrow: 'w', w: 2 }); });
  s += L(20 + 3 * w + 2 * gap + 8, ry + 28, 20 + 3 * w + 2 * gap + 8, ry + 80, { w: 2 }) + L(20 + 3 * w + 2 * gap + 8, ry + 80, 84, ry + 80, { w: 2 }) + L(84, ry + 80, 84, ry2, { arrow: 'w', w: 2 });
  figs['m2-radar-block'] = svg(ry2 + 90, s);
}

for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
console.log('wrote', Object.keys(figs).length, 'figures');
