// Generates the chunk-4f figures (energy conversion) into figs-svg/. Usage: node tools/figs/m4f.js figs-svg
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';
const src = fs.readFileSync(path.join(__dirname, 'm2a.js'), 'utf8').split('const figs = {};')[0].replace("process.argv[2] || 'figs-svg'", "'x'");
const H = new Function('require', 'process', src + '; return { svg, T, L, P, R, sub, pl, f1 };')(require, process);
const { svg, T, L, R } = H;
const figs = {};
{
  let s = T(20, 36, 'Steam power plant energy chain', { size: 26, w: 600 });
  const items = [['Fuel', 'primary energy'], ['Superheated', 'steam: heat'], ['Turbine shaft', 'kinetic energy'], ['Generator', 'electrical energy']];
  items.forEach((it, i) => {
    const y = 70 + i * 110;
    s += R(150, y, 300, 70, 'dfb', 0.2) + `<rect x="150" y="${y}" width="300" height="70" rx="8" class="dsb" fill="none" stroke-width="2.5"/>`;
    s += T(300, y + 32, it[0], { anchor: 'middle', w: 600 }) + T(300, y + 58, it[1], { anchor: 'middle', c: 'dt2' });
    if (i < 3) s += L(300, y + 70, 300, y + 108, { arrow: 'o', w: 3 });
  });
  figs['m4-steam-chain'] = svg(510, s);
}
for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
console.log('wrote', Object.keys(figs).length, 'figures');
