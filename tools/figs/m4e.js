// Generates the chunk-4e figures (IC engines) into figs-svg/. Usage: node tools/figs/m4e.js figs-svg
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';
const src = fs.readFileSync(path.join(__dirname, 'm2a.js'), 'utf8').split('const figs = {};')[0].replace("process.argv[2] || 'figs-svg'", "'x'");
const H = new Function('require', 'process', src + '; return { svg, T, L, P, R, sub, pl, f1 };')(require, process);
const { svg, T, L, P, R } = H;
const figs = {};

// 1. four strokes
{
  let s = T(20, 36, 'Four strokes of the piston', { size: 26, w: 600 });
  const names = ['Suction', 'Compression', 'Power', 'Exhaust'];
  const py = [150, 150, 110, 150], dir = ['d', 'u', 'd', 'u'];
  names.forEach((n, i) => {
    const x = 18 + i * 146;
    s += L(x + 25, 90, x + 25, 270) + L(x + 105, 90, x + 105, 270) + L(x + 25, 90, x + 105, 90, { w: 5 });
    s += R(x + 27, py[i], 76, 20, 'dfb', 0.35) + `<rect x="${x + 27}" y="${py[i]}" width="76" height="20" class="dsb" fill="none" stroke-width="2.5"/>`;
    s += L(x + 65, py[i] + 20, x + 65, 285, { c: 'ds2', w: 3 });
    if (i === 0) s += L(x + 45, 56, x + 45, 88, { arrow: 'g', w: 3 });
    if (i === 3) s += L(x + 85, 88, x + 85, 56, { arrow: 'g', w: 3 });
    if (i === 2) s += `<circle cx="${x + 65}" cy="${py[i] - 12}" r="10" class="dfo" fill-opacity=".6"/>`;
    if (i === 1) s += `<circle cx="${x + 65}" cy="${py[i] - 12}" r="10" class="dfb" fill-opacity=".35"/>`;
    s += i === 0 ? L(x + 65, 205, x + 65, 245, { arrow: 'o', w: 3 }) : i === 2 ? L(x + 65, 180, x + 65, 225, { arrow: 'o', w: 3 }) : L(x + 65, 245, x + 65, 205, { arrow: 'o', w: 3 });
    s += T(x + 65, 325, n, { anchor: 'middle', c: 'dt2' });
  });
  figs['m4-four-stroke'] = svg(350, s);
}

// 2. Otto P-V
{
  let s = T(20, 36, 'Otto cycle (P–V)', { size: 26, w: 600 });
  s += L(100, 330, 570, 330, { arrow: 'w', w: 2.5 }) + L(100, 330, 100, 60, { arrow: 'w', w: 2.5 });
  s += T(575, 362, 'V', { anchor: 'end', c: 'dt2' }) + T(84, 74, 'P', { anchor: 'end', c: 'dt2' });
  s += P('M450 290C370 285 270 255 200 220', { c: 'dsb', w: 3.5, arrow: 'b' });
  s += L(200, 220, 200, 108, { c: 'dso', w: 3.5, arrow: 'o' });
  s += P('M200 100C270 130 370 170 450 200', { c: 'dsb', w: 3.5, arrow: 'b' });
  s += L(450, 200, 450, 282, { c: 'dsg', w: 3.5, arrow: 'g' });
  [['1', 470, 300], ['2', 180, 232], ['3', 180, 98], ['4', 470, 195]].forEach(p => { s += T(p[1], p[2], p[0], { anchor: 'middle', w: 600 }); });
  s += T(130, 175, 'heat in', { anchor: 'middle', c: 'dto', size: 22 }).replace('x="130"', 'x="150"');
  s += T(500, 250, 'heat out', { c: 'dtg', size: 22 }).replace('x="500"', 'x="470"');
  s += T(310, 300, 'compression', { anchor: 'middle', c: 'dt2', size: 22 }).replace('y="300"', 'y="316"');
  s += T(340, 128, 'expansion', { anchor: 'middle', c: 'dt2', size: 22 });
  figs['m4-otto-pv'] = svg(390, s);
}

for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
console.log('wrote', Object.keys(figs).length, 'figures');
