// Generates the chunk-4c figures (machining, CNC) into figs-svg/. Usage: node tools/figs/m4c.js figs-svg
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';
const src = fs.readFileSync(path.join(__dirname, 'm2a.js'), 'utf8').split('const figs = {};')[0].replace("process.argv[2] || 'figs-svg'", "'x'");
const H = new Function('require', 'process', src + '; return { svg, T, L, P, R, sub, pl, f1 };')(require, process);
const { svg, T, L, P, R } = H;
const figs = {};
const shape = (pts, cls = 'ds', fillCls = '', op = 0.25) => {
  const d = 'M' + pts.map(p => p.join(' ')).join('L') + 'Z';
  return (fillCls ? `<path d="${d}" class="${fillCls}" fill-opacity="${op}" stroke="none"/>` : '') + P(d, { c: cls });
};

// 1. turning
{
  let s = T(20, 36, 'Turning on a lathe', { size: 26, w: 600 });
  s += shape([[40, 100], [90, 100], [90, 200], [40, 200]], 'ds', 'dfg', 0.3) + T(65, 230, 'Chuck', { anchor: 'middle', c: 'dt2' });
  s += shape([[90, 125], [300, 125], [300, 110], [400, 110], [400, 190], [300, 190], [300, 175], [90, 175]], 'dsb', 'dfb', 0.3);
  s += L(40, 150, 420, 150, { c: 'ds2', dash: '10 6 2 6', w: 2 });
  s += shape([[300, 125], [330, 125], [350, 70], [380, 70], [380, 110], [320, 110]], 'dso', 'dfo', 0.45);
  s += T(365, 62, 'Tool', { anchor: 'middle', c: 'dto' });
  s += L(320, 94, 190, 94, { arrow: 'w', w: 3 }) + T(255, 84, 'Feed', { anchor: 'middle', c: 'dt2' });
  s += L(430, 110, 430, 125, { w: 2.5 }) + L(420, 110, 440, 110, { w: 2 }) + L(420, 125, 440, 125, { w: 2 }) + T(450, 130, 'Depth of cut', { c: 'dt2' });
  s += T(245, 230, 'Rotating workpiece', { anchor: 'middle', c: 'dt2' });
  figs['m4-turning'] = svg(260, s);
}

// 2. CNC control types
{
  let s = T(20, 36, 'CNC control types', { size: 26, w: 600 });
  s += T(20, 80, 'Point-to-point', { w: 600, c: 'dtb' });
  const pts = [[70, 160], [260, 115], [460, 165]];
  s += L(pts[0][0], pts[0][1], pts[1][0] - 10, pts[1][1] + 3, { arrow: 'w', w: 2.5, dash: '8 6' }) + L(pts[1][0], pts[1][1], pts[2][0] - 10, pts[2][1] - 3, { arrow: 'w', w: 2.5, dash: '8 6' });
  pts.forEach((p, i) => { s += `<circle cx="${p[0]}" cy="${p[1]}" r="10" class="dso" fill="none" stroke-width="2.5"/>` + T(p[0], p[1] + 38, 'P' + (i + 1), { anchor: 'middle', c: 'dto' }); });
  s += T(20, 270, 'Contouring', { w: 600, c: 'dtb' });
  s += R(60, 330, 480, 40, 'dfb', 0.25) + `<rect x="60" y="330" width="480" height="40" class="dsb" fill="none" stroke-width="2.5"/>`;
  s += P('M60 325C170 275 250 375 360 315S500 295 540 310', { c: 'dso', w: 3.5, arrow: 'o' });
  s += T(300, 410, 'Cuts along the whole path', { anchor: 'middle', c: 'dt2' });
  figs['m4-cnc-control'] = svg(440, s);
}

for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
console.log('wrote', Object.keys(figs).length, 'figures');
