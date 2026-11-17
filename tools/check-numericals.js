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

// ---- Module 2 (complex linear algebra)
{
  const C = (re, im = 0) => ({ re, im });
  const cm = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re), ca = (a, b) => C(a.re + b.re, a.im + b.im), cj = (a) => C(a.re, -a.im);
  const fmt = (z) => { const r = +z.re.toFixed(4), i = +z.im.toFixed(4); return i === 0 ? `${r}` : r === 0 ? `${i}i` : `${r}${i < 0 ? '−' : '+'}${Math.abs(i)}i`; };
  const ip = (u, v) => u.reduce((s, x, k) => ca(s, cm(cj(x), v[k])), C(0));
  const mm = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, x, k) => ca(s, cm(x, B[k][j])), C(0))));
  const dag = (A) => A[0].map((_, j) => A.map((r) => cj(r[j])));
  const M = (A) => '[' + A.map((r) => r.map(fmt).join(', ')).join('; ') + ']';
  const R = (rows) => rows.map((r) => r.map((x) => (typeof x === 'number' ? C(x) : x)));
  const det3 = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const i = C(0, 1);
  add('m2', 'Worked: |2+i|^2 + 1 = N', ip([C(2, 1), C(1)], [C(2, 1), C(1)]).re);
  add('m2', 'PP3 det[v1 v2 v3] (1,0,2),(0,1,3),(2,1,7)', det3([[1, 0, 2], [0, 1, 1], [2, 3, 7]]));
  add('m2', 'PP4 <a|a> for (2,i)', fmt(ip([C(2), i], [C(2), i])));
  add('m2', 'PP5 <phi|chi> (1,-1).(1,1)', fmt(ip([C(1), C(-1)], [C(1), C(1)])));
  add('m2', 'CAT det A,B,C = (3,0,0),(0,-2,0),(0,0,-1)', det3([[3, 0, 0], [0, -2, 0], [0, 0, -1]]));
  { const psi = [C(0, 3), C(0, -7)], chi = [C(-1), C(0, 2)]; add('m2', 'CAT <psi|chi>', fmt(ip(psi, chi))); add('m2', 'CAT <chi|psi>', fmt(ip(chi, psi))); }
  { const p = [C(1, 1), C(-3)], w = [C(2), C(-3, 3)]; add('m2', 'ec2 ratio w1/p1 = 2/(1+i)', fmt(cm(C(2), C(0.5, -0.5)))); add('m2', 'ec2 ratio w2/p2 = -3(1-i)/-3', fmt(C(1, -1))); add('m2', 'ec2 <psi|w>', fmt(ip(p, w))); add('m2', 'ec2 <w|psi>', fmt(ip(w, p))); add('m2', 'ec2 <psi|psi>', fmt(ip(p, p))); }
  add('m2', 'CAT2 normalise: 2/9 + a^2/3 + 4/9 = 1 -> a', Math.sqrt((1 - 2 / 9 - 4 / 9) * 3));
  { const s = 1 / Math.SQRT2, B = R([[s, cm(C(s), i)], [cm(C(s), i), s]]); add('m2', 'CAT2 B†B for (1/√2)[1 i; i 1]', M(mm(dag(B), B))); }
  { const A = [[2, -3], [2, -5]], tr = A[0][0] + A[1][1], dt = A[0][0] * A[1][1] - A[0][1] * A[1][0]; add('m2', 'CAT2 3x3 block: λ^2 - (tr)λ + det; tr, det', `${tr}, ${dt}`); add('m2', 'CAT2 roots', `${(tr + Math.sqrt(tr * tr - 4 * dt)) / 2}, ${(tr - Math.sqrt(tr * tr - 4 * dt)) / 2}, and 3`); add('m2', 'CAT2 check (3,1,0) for λ=1: A v', `${2 * 3 - 3 * 1}, ${2 * 3 - 5 * 1}`); add('m2', 'CAT2 check (1,2,0) for λ=-4: A v', `${2 - 6}, ${2 - 10}`); add('m2', '1/√10, 1/√5', `${(1 / Math.sqrt(10)).toFixed(4)}, ${(1 / Math.sqrt(5)).toFixed(4)}`); }
  add('m2', 'Notes T=[2 1;1 3]: λ = (5 ± √5)/2', `${((5 + Math.sqrt(5)) / 2).toFixed(4)}, ${((5 - Math.sqrt(5)) / 2).toFixed(4)}`);
  { const l1 = (5 + Math.sqrt(5)) / 2, l2 = (5 - Math.sqrt(5)) / 2; add('m2', 'T eigenvectors (1, λ-2) dot product', 1 + (l1 - 2) * (l2 - 2)); add('m2', 'norms of (1, λ-2)', `${Math.hypot(1, l1 - 2).toFixed(4)}, ${Math.hypot(1, l2 - 2).toFixed(4)}`); }
  { const v1 = [C(-1, -1), C(1)], v2 = [C(0.5, 0.5), C(1)]; add('m2', 'Hermitian A eigvecs <v1|v2>', fmt(ip(v1, v2))); add('m2', '|v1|^2, |v2|^2', `${ip(v1, v1).re}, ${ip(v2, v2).re}`); const A = R([[2, C(1, 1)], [C(1, -1), 3]]); add('m2', 'A v1 (λ=1)', M(mm(A, [[v1[0]], [v1[1]]]))); add('m2', 'A v2 (λ=4)', M(mm(A, [[v2[0]], [v2[1]]]))); }
  { const B = [[2, 0, 1], [0, 3, 0], [1, 0, 2]]; for (const l of [1, 3]) add('m2', `3x3 B det(B-${l}I)`, det3(B.map((r, k) => r.map((x, j) => x - (k === j ? l : 0))))); add('m2', 'B (1,0,-1)', `${2 - 1}, 0, ${1 - 2}`); add('m2', 'B (1,0,1)', `${2 + 1}, 0, ${1 + 2}`); }
  { const s = 1 / Math.SQRT2, U = R([[s, s], [-s, s]]); add('m2', 'U†U for (1/√2)[1 1; -1 1]', M(mm(dag(U), U))); }
  { const w = [[C(2)], [C(0)]], vb = [[C(1), cj(i)]]; const O = mm(w, vb); add('m2', 'Ex4 |w><v|', M(O)); add('m2', 'Ex4 |w><v| (1,1)', M(mm(O, R([[1], [1]])))); }
  add('m2', 'Ex13 |u1><u1| + |u2><u2|', M(R([[1 + 1, 1], [1, 1]])));
  add('m2', 'Tensor (1,2)⊗(3,4)', [1 * 3, 1 * 4, 2 * 3, 2 * 4].join(', '));
  add('m2', 'Tensor (1,2)⊗(0,3)', [0, 3, 0, 6].join(', '));
  add('m2', 'CAT tensor (1,2)⊗(3,4,5)', [3, 4, 5, 6, 8, 10].join(', '));
  { const A = [[1, 2], [3, 4]], B = [[0, 5], [6, 7]]; const K = []; for (let r = 0; r < 4; r++) K.push([0, 1, 2, 3].map((c) => A[r >> 1][c >> 1] * B[r & 1][c & 1])); add('m2', 'Kronecker A⊗B', K.map((r) => r.join(' ')).join(' | ')); }
  { const sx = R([[0, 1], [1, 0]]), sy = R([[0, C(0, -1)], [C(0, 1), 0]]), sz = R([[1, 0], [0, -1]]);
    const com = (A, B) => { const a = mm(A, B), b = mm(B, A); return a.map((r, k) => r.map((x, j) => ca(x, C(-b[k][j].re, -b[k][j].im)))); };
    add('m2', '[σx,σy]', M(com(sx, sy))); add('m2', '[σy,σz]', M(com(sy, sz))); add('m2', '[σz,σx]', M(com(sz, sx))); add('m2', '[σx,σz]', M(com(sx, sz)));
    add('m2', 'σx^2', M(mm(sx, sx))); add('m2', 'σy^2', M(mm(sy, sy))); add('m2', 'σxσy', M(mm(sx, sy)));
    add('m2', 'σy (1, i)', M(mm(sy, [[C(1)], [i]]))); add('m2', 'σy (1, -i)', M(mm(sy, [[C(1)], [C(0, -1)]]))); }
  add('m2', 'Ex12 |+><+|', '[0.5, 0.5; 0.5, 0.5]');
  add('m2', '∫ e^{-2x^2} dx = √(π/2)', Math.sqrt(Math.PI / 2));
}

const want = process.argv.slice(2);
for (const [m, lines] of Object.entries(out)) if (!want.length || want.includes(m)) console.log('## ' + m + '\n' + lines.join('\n'));
module.exports = out;
