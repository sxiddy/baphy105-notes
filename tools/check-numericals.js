// Recomputes every worked numerical in the notes (condition 8). Run: node tools/check-numericals.js [m1 m2 ...]
// Each entry prints the value the notes state; edit the notes if a line here changes.
const h = 6.626e-34, c = 3e8, me = 9.1e-31, mp = 1.67e-27, e = 1.6e-19, kB = 1.381e-23, sigma = 5.67e-8;
const deg = (x) => (x * Math.PI) / 180, rad2deg = (x) => (x * 180) / Math.PI;
const out = {};
const add = (m, label, v, unit = '') => { (out[m] = out[m] || []).push(`${label}: ${typeof v === 'number' ? v.toPrecision(4) : v} ${unit}`); };

// ---- Module 1
add('m1', 'Stefan ratio (1800/1200)^4', (1800 / 1200) ** 4);
add('m1', 'tuning fork quantum h*660', h * 660, 'J');
add('m1', 'orange light quantum h*5e14', h * 5e14, 'J');
add('m1', 'orange light quantum in eV', (h * 5e14) / e, 'eV');
add('m1', 'tuning fork 0.04 J / quantum (number of quanta)', 0.04 / (h * 660));
add('m1', 'golf ball lambda (46 g, 30 m/s)', h / (0.046 * 30), 'm');
add('m1', 'electron lambda (1e7 m/s)', h / (me * 1e7), 'm');
add('m1', 'ratio electron/golf', h / (me * 1e7) / (h / (0.046 * 30)));
add('m1', 'Ex1 frequency of 600 nm', c / 600e-9, 'Hz');
add('m1', 'Ex2 momentum of 700 nm photon', h / 700e-9, 'kg m/s');
add('m1', 'Ex3 momentum of 6e14 Hz photon', (h * 6e14) / c, 'kg m/s');
add('m1', 'Compton wavelength h/(me c)', h / (me * c), 'm');
add('m1', 'Ex4 Compton shift at 90 deg', h / (me * c), 'm');
for (const t of [0, 45, 90, 135, 180]) add('m1', `Compton shift ${t} deg`, (h / (me * c)) * (1 - Math.cos(deg(t))), 'm');
{
  const l = 0.071e-9, d = (h / (me * c)) * (1 - Math.cos(deg(60))), l2 = l + d, K = h * c / l - h * c / l2;
  add('m1', 'NQ7 shift at 60 deg', d, 'm'); add('m1', 'NQ7 lambda prime', l2 * 1e9, 'nm'); add('m1', 'NQ7 electron KE', K, 'J'); add('m1', 'NQ7 electron KE eV', K / e, 'eV');
}
{ // CAT: 90 keV photon scattered at 60 deg
  const E = 90e3 * e, l = h * c / E, l2 = l + (h / (me * c)) * (1 - Math.cos(deg(60))), E2 = h * c / l2;
  add('m1', 'CAT 90 keV: lambda', l, 'm'); add('m1', 'CAT 90 keV: lambda prime', l2, 'm'); add('m1', 'CAT 90 keV: E prime', E2 / e / 1e3, 'keV');
}
add('m1', 'NQ1 d = 500 nm / sin 12', 500 / Math.sin(deg(12)), 'nm');
add('m1', 'NQ2 theta (n=2, 650 nm, 0.25 mm)', rad2deg(Math.asin((2 * 650e-9) / 0.25e-3)), 'deg');
add('m1', 'NQ3 lambda = 0.30 mm sin 8', 0.30e-3 * Math.sin(deg(8)) * 1e9, 'nm');
add('m1', 'NQ4 star T (b = 2.892e-3)', 2.892e-3 / 480e-9, 'K');
add('m1', 'NQ4 star T (b = 2.898e-3)', 2.898e-3 / 480e-9, 'K');
add('m1', 'NQ5 sigma T^4 at 1200 K', sigma * 1200 ** 4, 'W/m2');
add('m1', 'NQ8 electron 150 V lambda', h / Math.sqrt(2 * me * e * 150), 'm');
add('m1', 'NQ8 by 12.27/sqrt(V) A', 12.27 / Math.sqrt(150), 'A');
add('m1', 'NQ9 proton 5 kV lambda', h / Math.sqrt(2 * mp * e * 5000), 'm');
add('m1', 'NQ10 electron lambda = beta d / D', (0.75e-3 * 2e-6) / 1.5, 'm');
{ const l = h / Math.sqrt(2 * me * e * 150); add('m1', 'NQ11 sin theta', l / 100e-6); add('m1', 'NQ11 theta', rad2deg(Math.asin(l / 100e-6)), 'deg'); add('m1', 'NQ11 source slip sin theta 12.23e-10/100e-6', 12.23e-10 / 100e-6); }
add('m1', 'Normalisation A for e^{-x^2}: (2/pi)^{1/4}', (2 / Math.PI) ** 0.25);
add('m1', 'Normalisation A for x(1-x) on [0,1]: sqrt(30)', Math.sqrt(30));
add('m1', 'Wien a check: nu_max/T from Planck peak (2.821 kB/h)', (2.821 * kB) / h, 'Hz/K');

const want = process.argv.slice(2);
for (const [m, lines] of Object.entries(out)) if (!want.length || want.includes(m)) console.log('## ' + m + '\n' + lines.join('\n'));
module.exports = out;
