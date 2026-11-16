// Generates the chunk-2c figures (spectrum, communication block diagram, modulation) into figs-svg/.
const fs = require('fs');
const path = require('path');
const out = process.argv[2] || 'figs-svg';
const src = fs.readFileSync(path.join(__dirname, 'm2a.js'), 'utf8').split('const figs = {};')[0].replace("process.argv[2] || 'figs-svg'", "'x'");
const H = new Function('require', 'process', src + '; return { svg, T, L, P, R, sub, pl, f1 };')(require, process);
const { svg, T, L, P, R, pl } = H;
const figs = {};

// 1. spectrum table
{
  let s = T(20, 36, 'Electromagnetic spectrum', { size: 26, w: 600 });
  const hy = 80;
  s += T(24, hy, 'Band', { size: 22, c: 'dt2' }) + T(250, hy, 'Starts at', { size: 22, c: 'dt2' }) + T(430, hy, 'Wavelength', { size: 22, c: 'dt2' });
  const rows = [
    ['ELF', '30 Hz', '10⁷ m'], ['VF', '300 Hz', '10⁶ m'], ['VLF', '3 kHz', '10⁵ m'], ['LF', '30 kHz', '10⁴ m'], ['MF', '300 kHz', '10³ m'],
    ['HF', '3 MHz', '100 m'], ['VHF', '30 MHz', '10 m'], ['UHF', '300 MHz', '1 m'], ['SHF', '3 GHz', '0.1 m'], ['EHF', '30 GHz', '1 cm'],
    ['Infrared', '0.1 mm to 700 nm', ''], ['Visible light', '0.4 to 0.8 µm', ''], ['Ultraviolet', '4 to 400 nm', ''], ['X-rays, gamma rays', 'cosmic rays', '']
  ];
  const y0 = hy + 14, rh = 42;
  rows.forEach((r, i) => {
    const y = y0 + i * rh;
    const cls = i < 10 ? 'dfb' : i < 13 ? 'dfy' : 'dfr';
    s += R(14, y, 572, rh - 4, cls, i % 2 ? 0.14 : 0.24);
    s += T(24, y + 28, r[0], { size: 24, c: 'dt' });
    if (i < 10) s += T(250, y + 28, r[1], { size: 24 }) + T(430, y + 28, r[2], { size: 24, c: 'dt2' });
    else s += T(250, y + 28, r[1], { size: 22, c: 'dt2' });
  });
  const by = y0 + 10 * rh;
  s += L(8, y0, 8, by - 6, { c: 'dsb', w: 3 }) + L(8, by, 8, by + 3 * rh - 6, { c: 'dsy', w: 3 });
  s += T(24, y0 + rows.length * rh + 28, 'EHF (above 30 GHz) = millimetre waves; infrared to ultraviolet = the optical spectrum', { size: 22, c: 'dt2' }).replace('EHF (above 30 GHz) = millimetre waves; infrared to ultraviolet = the optical spectrum', 'EHF = millimetre waves').replace('</text>', '</text>');
  s += T(24, y0 + rows.length * rh + 56, 'Infrared, visible, ultraviolet = optical spectrum', { size: 22, c: 'dt2' });
  figs['m2-em-spectrum'] = svg(y0 + rows.length * rh + 80, s);
}

// 2. communication block diagram
{
  let s = T(20, 36, 'Communication system', { size: 26, w: 600 });
  const names = ['Information source', 'Input transducer', 'Transmitter', 'Channel', 'Receiver', 'Output transducer'];
  const notes = [['sound, picture,', 'speech, data'], ['information in', 'electrical form'], [], [], [], ['information in', 'original form']];
  const x = 40, w = 270, h = 52, gap = 40, y0 = 66;
  names.forEach((n, i) => {
    const y = y0 + i * (h + gap);
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="${i === 3 ? 'dsb' : 'ds'}" fill="none" stroke-width="2.5"/>` + T(x + w / 2, y + 34, n, { size: 24, anchor: 'middle' });
    if (i < 5) s += L(x + w / 2, y + h, x + w / 2, y + h + gap - 2, { arrow: 'w' });
    notes[i].forEach((t, k) => { s += T(x + w + 16, y + 22 + k * 26, t, { size: 22, c: 'dt2' }); });
  });
  const cy = y0 + 3 * (h + gap);
  s += `<rect x="440" y="${cy}" width="120" height="${h}" rx="8" class="dsr" fill="none" stroke-width="2.5"/>` + T(500, cy + 34, 'Noise', { size: 24, anchor: 'middle', c: 'dtr' }) + L(440, cy + h / 2, x + w + 2, cy + h / 2, { c: 'dsr', arrow: 'r' });
  figs['m2-comm-block'] = svg(y0 + 6 * h + 5 * gap + 24, s);
}

// 3. modulation waves
{
  let s = T(20, 36, 'Message, carrier, AM and FM', { size: 26, w: 600 });
  const x0 = 40, w = 520, a = 40, ph = 140, N = 520;
  const panel = (i, title, f, c) => {
    const cy = 70 + i * ph + 60;
    let p = T(x0, cy - a - 14, title, { size: 22, c: 'dt2' }) + L(x0, cy, x0 + w, cy, { c: 'ds3', w: 1.5 });
    const pts = []; for (let k = 0; k <= N; k++) { const t = k / N; pts.push([x0 + t * w, cy - a * f(t)]); }
    return p + pl(pts, { c, w: 2.2 });
  };
  const fm = 2, fc = 26;
  s += panel(0, 'Message signal', t => Math.sin(2 * Math.PI * fm * t), 'dsb');
  s += panel(1, 'Carrier signal', t => Math.sin(2 * Math.PI * fc * t), 'dsb');
  s += panel(2, 'Amplitude modulated (AM) wave', t => (1 + 0.6 * Math.sin(2 * Math.PI * fm * t)) * Math.sin(2 * Math.PI * fc * t) / 1.6 * 1.0, 'dsr');
  // envelope dashed
  {
    const cy = 70 + 2 * ph + 60, e1 = [], e2 = [];
    for (let k = 0; k <= 200; k++) { const t = k / 200, v = (1 + 0.6 * Math.sin(2 * Math.PI * fm * t)) / 1.6; e1.push([x0 + t * w, cy - a * v]); e2.push([x0 + t * w, cy + a * v]); }
    s += pl(e1, { c: 'dso', w: 2, dash: '6 5' }) + pl(e2, { c: 'dso', w: 2, dash: '6 5' });
  }
  s += panel(3, 'Frequency modulated (FM) wave', t => Math.sin(2 * Math.PI * (fc - 6) * t - 3.2 * Math.cos(2 * Math.PI * fm * t)), 'dsg');
  s += T(x0 + w, 70 + 2 * ph + 60 + a + 22, 'dashed: envelope', { size: 22, c: 'dto', anchor: 'end' });
  figs['m2-modulation-waves'] = svg(70 + 4 * ph + 30, s);
}

for (const [id, body] of Object.entries(figs)) fs.writeFileSync(path.join(out, id + '.svg'), body);
console.log('wrote', Object.keys(figs).length, 'figures');
