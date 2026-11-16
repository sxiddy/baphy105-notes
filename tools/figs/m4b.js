// Generates the chunk-4b figures (welding) into figs-svg/. Usage: node tools/figs/m4b.js figs-svg
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';
const src = fs.readFileSync(path.join(__dirname, 'm2a.js'), 'utf8').split('const figs = {};')[0].replace("process.argv[2] || 'figs-svg'", "'x'");
const H = new Function('require', 'process', src + '; return { svg, T, L, P, R, sub, pl, f1 };')(require, process);
const { svg, T, L, P, R, pl } = H;
const figs = {};
const rect = (x, y, w, h, cls = 'ds', fillCls = '', op = 0.25) =>
  (fillCls ? R(x, y, w, h, fillCls, op) : '') + `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${cls}" fill="none" stroke-width="2.5"/>`;
const poly = (pts, cls, fillCls, op) => P('M' + pts.map(p => p.join(' ')).join('L') + 'Z', { c: cls }).replace('fill="none"', `fill="none"`) ;
const shape = (pts, cls = 'ds', fillCls = '', op = 0.25) => {
  const d = 'M' + pts.map(p => p.join(' ')).join('L') + 'Z';
  return (fillCls ? `<path d="${d}" class="${fillCls}" fill-opacity="${op}" stroke="none"/>` : '') + P(d, { c: cls });
};

// 1. weld zones
{
  let s = T(20, 36, 'Butt weld cross section', { size: 26, w: 600 });
  s += shape([[40, 100], [190, 100], [230, 200], [40, 200]], 'ds', 'dfb', 0.3);
  s += shape([[410, 100], [560, 100], [560, 200], [370, 200]], 'ds', 'dfb', 0.3);
  s += shape([[190, 100], [240, 100], [270, 200], [230, 200]], 'dsr', 'dfr', 0.3);
  s += shape([[360, 100], [410, 100], [370, 200], [330, 200]], 'dsr', 'dfr', 0.3);
  s += shape([[240, 100], [360, 100], [330, 200], [270, 200]], 'dso', 'dfo', 0.4);
  s += T(110, 245, 'BM', { anchor: 'middle' }) + T(490, 245, 'BM', { anchor: 'middle' });
  s += T(300, 245, 'FZ', { anchor: 'middle', c: 'dto' });
  s += T(205, 82, 'HAZ', { anchor: 'middle', c: 'dtr' }) + T(385, 82, 'HAZ', { anchor: 'middle', c: 'dtr' });
  figs['m4-weld-zones'] = svg(280, s);
}

// 2. weld joints
{
  let s = T(20, 36, 'Basic weld joints', { size: 26, w: 600 });
  const cell = (i, y0, name, draw) => { const x = 20 + (i % 3) * 190; return draw(x, y0) + T(x + 72, y0 + 120, name, { anchor: 'middle', c: 'dt2' }); };
  const pl1 = (x, y, w, h) => rect(x, y, w, h, 'ds', 'dfb', 0.3);
  const wd = (x, y, w, h) => rect(x, y, w, h, 'dso', 'dfo', 0.5);
  s += cell(0, 70, 'Butt', (x, y) => pl1(x, y + 40, 64, 16) + pl1(x + 80, y + 40, 64, 16) + wd(x + 64, y + 38, 16, 20));
  s += cell(1, 70, 'Lap', (x, y) => pl1(x, y + 30, 90, 16) + pl1(x + 54, y + 46, 90, 16) + wd(x + 90, y + 28, 10, 18));
  s += cell(2, 70, 'T', (x, y) => pl1(x, y + 60, 144, 16) + pl1(x + 64, y, 16, 60) + wd(x + 48, y + 48, 16, 12) + wd(x + 80, y + 48, 16, 12));
  s += cell(3, 230, 'Edge', (x, y) => pl1(x + 40, y + 10, 16, 80) + pl1(x + 56, y + 10, 16, 80) + wd(x + 40, y + 2, 32, 8));
  s += cell(4, 230, 'Corner', (x, y) => pl1(x, y + 60, 100, 16) + pl1(x + 84, y, 16, 60) + wd(x + 100, y + 56, 12, 20));
  figs['m4-weld-joints'] = svg(370, s);
}

// 3. power density
{
  let s = T(20, 36, 'Heat source power density', { size: 26, w: 600 });
  s += L(70, 330, 570, 330, { arrow: 'w', w: 2.5 }) + L(70, 330, 70, 60, { arrow: 'w', w: 2.5 });
  s += `<text transform="translate(40 200) rotate(-90)" font-size="22" class="dt2" text-anchor="middle">Heat input to workpiece</text>`;
  s += T(320, 372, 'Power density of heat source', { anchor: 'middle', c: 'dt2' });
  s += P('M110 110C170 190 250 230 330 262S440 292 480 300', { c: 'ds2', dash: '7 6', w: 2 });
  const el = (cx, cy, rx, ry, a) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${a} ${cx} ${cy})" class="dso" fill="none" stroke-width="2.5"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${a} ${cx} ${cy})" class="dfo" fill-opacity=".35"/>`;
  s += el(115, 118, 16, 40, -25) + el(250, 205, 18, 50, -45) + el(470, 298, 18, 46, -80);
  s += T(140, 100, 'Gas welding', { c: 'dto' }) + T(140, 128, '10 W/cm²', { c: 'dt2' });
  s += T(280, 190, 'Arc welding', { c: 'dto' }) + T(280, 218, '50 W/cm²', { c: 'dt2' });
  s += T(470, 246, 'Beam welding', { anchor: 'middle', c: 'dto' }) + T(470, 274, '10000 W/cm²', { anchor: 'middle', c: 'dt2' });
  figs['m4-power-density'] = svg(400, s);
}

for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
console.log('wrote', Object.keys(figs).length, 'figures');
