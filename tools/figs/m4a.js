// Generates the chunk-4a figures (casting and forming) into figs-svg/. Usage: node tools/figs/m4a.js figs-svg
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';
const src = fs.readFileSync(path.join(__dirname, 'm2a.js'), 'utf8').split('const figs = {};')[0].replace("process.argv[2] || 'figs-svg'", "'x'");
const H = new Function('require', 'process', src + '; return { svg, T, L, P, R, sub, pl, f1 };')(require, process);
const { svg, T, L, P, R, sub, pl } = H;
const figs = {};
const rect = (x, y, w, h, cls = 'ds', fillCls = '', op = 0.25) =>
  (fillCls ? R(x, y, w, h, fillCls, op) : '') + `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${cls}" fill="none" stroke-width="2.5"/>`;

// 1. sand mould section
{
  let s = T(20, 36, 'Sand mould (section)', { size: 26, w: 600 });
  s += rect(40, 110, 520, 130, 'ds', 'dfb', 0.12) + rect(40, 240, 520, 130, 'ds', 'dfb', 0.2);
  s += L(40, 240, 560, 240, { c: 'dso', dash: '8 6', w: 2.5 });
  s += T(300, 150, 'Cope', { anchor: 'middle', c: 'dt2' }) + T(300, 350, 'Drag', { anchor: 'middle', c: 'dt2' });
  // pouring basin and sprue
  s += pl([[85, 70], [175, 70], [153, 110], [107, 110]], { c: 'dso', w: 2.5 });
  s += rect(118, 110, 24, 130, 'dso', 'dfo', 0.35);
  s += T(185, 96, 'Pouring basin', { c: 'dto' });
  s += T(152, 190, 'Sprue', { c: 'dto' });
  // runner, cavity, core, riser
  s += rect(130, 233, 120, 14, 'dso', 'dfo', 0.35) + T(135, 272, 'Runner', { c: 'dto' });
  s += rect(250, 190, 170, 100, 'dso', 'dfo', 0.35);
  s += rect(300, 212, 70, 40, 'ds', 'dfg', 0.4) + T(335, 240, 'Core', { size: 22, anchor: 'middle' });
  s += T(335, 280, 'Cavity', { size: 22, anchor: 'middle', c: 'dto' });
  s += rect(458, 120, 26, 100, 'dso', 'dfo', 0.35) + L(420, 205, 458, 205, { c: 'dso', w: 14 });
  s += T(471, 100, 'Riser', { anchor: 'middle', c: 'dto' });
  s += T(560, 270, 'Parting line', { anchor: 'end', c: 'dt2' });
  figs['m4-sand-mold'] = svg(400, s);
}

// 2. extrusion
{
  let s = T(20, 36, 'Extrusion', { size: 26, w: 600 });
  s += L(8, 160, 42, 160, { arrow: 'w', w: 3 });
  s += rect(46, 130, 70, 60, 'ds', 'dfb', 0.3) + T(81, 118, 'Ram', { anchor: 'middle' });
  s += rect(116, 130, 176, 60, 'dso', 'dfo', 0.3) + T(204, 168, 'Billet', { anchor: 'middle' });
  s += L(116, 108, 340, 108, { w: 5 }) + L(116, 212, 340, 212, { w: 5 });
  s += rect(340, 108, 40, 44, 'ds', 'dfb', 0.3) + rect(340, 168, 40, 44, 'ds', 'dfb', 0.3);
  s += rect(380, 152, 200, 16, 'dsg', 'dfg', 0.4);
  s += T(228, 250, 'Container', { anchor: 'middle', c: 'dt2' }) + T(360, 250, 'Die', { anchor: 'middle', c: 'dt2' });
  s += T(480, 205, 'Extruded section', { anchor: 'middle', c: 'dtg' });
  figs['m4-extrusion'] = svg(280, s);
}

// 3. closed die forging
{
  let s = T(20, 36, 'Closed die forging', { size: 26, w: 600 });
  s += L(300, 56, 300, 100, { arrow: 'w', w: 3 }) + T(318, 86, 'Force', { c: 'dt2' });
  s += rect(120, 110, 360, 70, 'ds', 'dfb', 0.3) + T(300, 152, 'Upper die', { anchor: 'middle' });
  s += rect(220, 192, 160, 36, 'dso', 'dfo', 0.4) + T(400, 218, 'Billet', { c: 'dto' });
  s += rect(120, 240, 360, 70, 'ds', 'dfb', 0.3) + T(300, 282, 'Lower die', { anchor: 'middle' });
  figs['m4-forging-die'] = svg(330, s);
}

// 4. flat rolling
{
  let s = T(20, 36, 'Flat rolling', { size: 26, w: 600 });
  s += `<circle cx="300" cy="140" r="70" class="ds" fill="none" stroke-width="2.5"/><circle cx="300" cy="140" r="70" class="dfb" fill-opacity=".25"/>`;
  s += `<circle cx="300" cy="300" r="70" class="ds" fill="none" stroke-width="2.5"/><circle cx="300" cy="300" r="70" class="dfb" fill-opacity=".25"/>`;
  s += pl([[20, 190], [250, 190], [300, 210], [580, 210], [580, 230], [300, 230], [250, 250], [20, 250]], { c: 'dso', w: 2.5, fill: 'currentColor' }).replace('fill="currentColor"', 'class="dso dfo" fill-opacity=".35" fill="currentColor"');
  s += T(385, 110, 'Roll', { c: 'dt2' }) + T(385, 340, 'Roll', { c: 'dt2' });
  s += T(20, 172, sub('t', '0') + ' (initial)', { c: 'dto' });
  s += T(580, 270, sub('t', '1') + ' (final)', { anchor: 'end', c: 'dto' });
  s += T(300, 420, 'Draft = ' + sub('t', '0') + ' − ' + sub('t', '1'), { anchor: 'middle', w: 600 });
  figs['m4-rolling'] = svg(450, s);
}

for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
console.log('wrote', Object.keys(figs).length, 'figures');
