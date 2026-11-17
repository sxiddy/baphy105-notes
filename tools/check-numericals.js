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

// ---- Module 3
{
  const hb = h / (2 * Math.PI), num = (f, a, b, n = 200000) => { let s = 0; const d = (b - a) / n; for (let k = 0; k < n; k++) s += f(a + (k + 0.5) * d); return s * d; };
  const ages = [[14, 1], [15, 1], [16, 3], [22, 2], [24, 2], [25, 5]], N = ages.reduce((s, a) => s + a[1], 0);
  const m1_ = ages.reduce((s, a) => s + a[0] * a[1], 0) / N, m2_ = ages.reduce((s, a) => s + a[0] * a[0] * a[1], 0) / N;
  add('m3', 'ages N', N); add('m3', 'ages <j>', m1_); add('m3', 'ages <j^2> (6434/14)', m2_); add('m3', 'ages variance (130/7)', m2_ - m1_ ** 2); add('m3', 'ages sigma', Math.sqrt(m2_ - m1_ ** 2));
  add('m3', 'die <j>', 3.5); add('m3', 'die <j^2> (91/6)', 91 / 6); add('m3', 'die variance (35/12)', 91 / 6 - 12.25);
  add('m3', 'Gaussian 1/√π e^-x² : norm', num((x) => Math.exp(-x * x) / Math.sqrt(Math.PI), -10, 10)); add('m3', 'Gaussian <x^2>', num((x) => x * x * Math.exp(-x * x) / Math.sqrt(Math.PI), -10, 10));
  { const a = 1, psi2 = (x) => (3 / (2 * a ** 3)) * (a - Math.abs(x)) ** 2; add('m3', 'triangle norm (a=1)', num(psi2, -1, 1)); add('m3', 'triangle <x^2> (a=1) = a²/10', num((x) => x * x * psi2(x), -1, 1)); }
  add('m3', 'Ex4 <Sz>/ħ = (1/3 - 2/3)/2', (1 / 3 - 2 / 3) / 2);
  add('m3', 'Ex5 <A> for [2 1;1 3], (1,1)/√2', (2 + 1 + 1 + 3) / 2);
  add('m3', 'CAT <A> for [1 i;-i 1], (1,1)/√2: ½[(1+i)+(1-i)]', 0.5 * 2);
  add('m3', 'P2 3σx+4σz eigen: λ^2 = 9+16', Math.sqrt(9 + 16));
  add('m3', 'P2 λ=-5 vector (1,-3): check 4·1+3·(-3), 3·1-4·(-3)', `${4 - 9}, ${3 + 12}`);
  add('m3', 'P4 <E> weights 9/25, 16/25', `${9 / 25}, ${16 / 25}`);
  add('m3', 'P5 A e^-2|x|: norm with A=1', num((x) => Math.exp(-2 * Math.abs(x)), -30, 30)); add('m3', 'P5 <x^2>', num((x) => x * x * Math.exp(-2 * Math.abs(x)), -30, 30));
  add('m3', 'ħ = h/2π', hb, 'J s');
  add('m3', 'P6 Δp ≥ ħ/(2·1e-10)', hb / 2e-10, 'kg m/s');
  { const p = 4.5e-24, k = p / hb, E = p * p / (2 * 9.11e-31), w = E / hb; add('m3', 'P9 k', k, '1/m'); add('m3', 'P9 E', E, 'J'); add('m3', 'P9 E in eV', E / e, 'eV'); add('m3', 'P9 ω', w, 'rad/s'); }
  add('m3', 'Seq SG: 2000 → +z → +x → +z', `${2000 / 2}, ${2000 / 4}, ${2000 / 8}`);
  { const A = 1, B = 3; /* B = 3iA */ add('m3', 'P3 B=3iA: e^{ikx} coeff A/2 + B/2i, e^{-ikx} coeff A/2 - B/2i', `${A / 2 + B / 2}, ${A / 2 - B / 2}`); }
  add('m3', 'B equal weights (1+2+3)/3', 2);
}

// ---- Module 4
{
  const hb = h / (2 * Math.PI), eV = e, num = (f, a, b, n = 200000) => { let s = 0; const d = (b - a) / n; for (let k = 0; k < n; k++) s += f(a + (k + 0.5) * d); return s * d; };
  const Ebox = (n, L, m = me) => (n * n * h * h) / (8 * m * L * L);
  add('m4', 'E1 electron, 1 nm box', Ebox(1, 1e-9) / eV, 'eV'); add('m4', 'E1 electron, 1 Å box', Ebox(1, 1e-10) / eV, 'eV');
  add('m4', 'E1 electron, 2 Å box', Ebox(1, 2e-10) / eV, 'eV');
  add('m4', 'FAT 2 Å box: n=9 minus n=7 energy', (Ebox(9, 2e-10) - Ebox(7, 2e-10)) / eV, 'eV');
  add('m4', 'FAT 2 Å box: Δν = 32h/(8mL²)', (Ebox(9, 2e-10) - Ebox(7, 2e-10)) / h, 'Hz');
  add('m4', 'P(0..L/4), n=1 = 1/4 − 1/2π', 0.25 - 1 / (2 * Math.PI)); add('m4', 'numeric check', num((x) => 2 * Math.sin(Math.PI * x) ** 2, 0, 0.25));
  add('m4', 'P(0..L/4), n=2 = 1/4', num((x) => 2 * Math.sin(2 * Math.PI * x) ** 2, 0, 0.25));
  add('m4', 'P(L/4..3L/4), n=1 = 1/2 + 1/π', num((x) => 2 * Math.sin(Math.PI * x) ** 2, 0.25, 0.75));
  add('m4', 'orthonormal ∫ψ1ψ2 (a=1)', num((x) => 2 * Math.sin(Math.PI * x) * Math.sin(2 * Math.PI * x), 0, 1));
  { const c1 = (8 * Math.sqrt(15)) / Math.PI ** 3; add('m4', 'Prob1 c1 = 8√15/π³', c1); add('m4', 'Prob1 |c1|²', c1 * c1); add('m4', 'Prob1 c1 numeric', num((x) => Math.sqrt(2) * Math.sin(Math.PI * x) * Math.sqrt(30) * x * (1 - x), 0, 1)); let S = 0; for (let n = 1; n < 400; n += 2) S += (64 * 15) / (n * Math.PI) ** 6; add('m4', 'Prob1 Σ|cn|²', S); }
  { const c = (n) => (2 / (n * Math.PI)) * (1 - Math.cos((n * Math.PI) / 2)); add('m4', 'Prob2 c1..c5', [1, 2, 3, 4, 5].map((n) => c(n).toFixed(4)).join(', ')); add('m4', 'Prob2 c1 numeric', num((x) => Math.sqrt(2) * Math.sqrt(2) * Math.sin(Math.PI * x), 0, 0.5)); add('m4', 'Prob2 P(E1) = 4/π²', 4 / Math.PI ** 2); }
  { const lv = {}; for (let a = 1; a <= 4; a++) for (let b = 1; b <= 4; b++) for (let c = 1; c <= 4; c++) { const s2 = a * a + b * b + c * c; (lv[s2] = lv[s2] || []).push(`${a}${b}${c}`); } add('m4', '3D levels (n²sum: count)', Object.keys(lv).map(Number).sort((x, y) => x - y).slice(0, 7).map((k) => `${k}:${lv[k].length}`).join(' ')); }
  const tunnel = (E, U, L) => { const k2 = Math.sqrt(2 * me * (U - E) * eV) / hb; const exact = 1 / (1 + (U * U * Math.sinh(k2 * L) ** 2) / (4 * E * (U - E))); const approx = 16 * (E / U) * (1 - E / U) * Math.exp(-2 * k2 * L); return { k2, exact, approx, bare: Math.exp(-2 * k2 * L) }; };
  { const t = tunnel(5, 10, 0.2e-9); add('m4', 'FAT 5 eV, 10 eV, 0.2 nm: k2', t.k2, '1/m'); add('m4', '  2 k2 L', 2 * t.k2 * 0.2e-9); add('m4', '  T exact', t.exact); add('m4', '  T ≈ 16(E/U)(1−E/U)e^{−2k2L}', t.approx); add('m4', '  T ≈ e^{−2k2L}', t.bare); }
  add('m4', 'Two barriers: T2 = T1² for double width (bare exponential)', 0.1 ** 2);
  add('m4', 'Cube 1 nm: 3E0, 6E0', `${(3 * Ebox(1, 1e-9) / eV).toFixed(3)}, ${(6 * Ebox(1, 1e-9) / eV).toFixed(3)} eV`); add('m4', 'a,a,2a: (1,1,2) and (2,1,1) sums', `${1 + 1 + 1}, ${4 + 1 + 0.25}`);
  { const k = Math.sqrt(2 * me * 4 * eV) / hb; add('m4', 'STM φ = 4 eV: k2', k, '1/m'); add('m4', 'STM current ratio for 0.1 nm', Math.exp(2 * k * 0.1e-9)); }
}

// ---- Module 5 (quantum computing)
{
  const C = (re, im = 0) => ({ re, im });
  const cm = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re), ca = (a, b) => C(a.re + b.re, a.im + b.im), cj = (a) => C(a.re, -a.im);
  const fmt = (z) => { const r = +z.re.toFixed(4) + 0, i = +z.im.toFixed(4) + 0; return i === 0 ? `${r}` : r === 0 ? `${i}i` : `${r}${i < 0 ? '−' : '+'}${Math.abs(i)}i`; };
  const R = (rows) => rows.map((r) => r.map((x) => (typeof x === 'number' ? C(x) : x)));
  const mm = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, x, k) => ca(s, cm(x, B[k][j])), C(0))));
  const M = (A) => '[' + A.map((r) => r.map(fmt).join(', ')).join('; ') + ']';
  const col = (...v) => R(v.map((x) => [x])), s = 1 / Math.SQRT2, i = C(0, 1), mi = C(0, -1);
  const kron = (A, B) => { const K = []; for (let r = 0; r < A.length * B.length; r++) { K.push([]); for (let c = 0; c < A[0].length * B[0].length; c++) K[r].push(cm(A[Math.floor(r / B.length)][Math.floor(c / B[0].length)], B[r % B.length][c % B[0].length])); } return K; };
  const dag = (A) => A[0].map((_, j) => A.map((r) => cj(r[j])));
  const X = R([[0, 1], [1, 0]]), Y = R([[0, mi], [i, 0]]), Z = R([[1, 0], [0, -1]]), H = R([[s, s], [s, -s]]), I2 = R([[1, 0], [0, 1]]);
  const CN = R([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]]);
  const vec = (A) => '(' + A.map((r) => fmt(r[0])).join(', ') + ')';
  add('m5', 'A(3|0>+4i|1>): A, P0, P1', `${1 / Math.sqrt(9 + 16)}, ${9 / 25}, ${16 / 25}`);
  add('m5', '(|0>+|1>)/2 norm²', 0.25 + 0.25);
  add('m5', '(√3/2, 1/2): P0, P1', `${3 / 4}, ${1 / 4}`);
  add('m5', 'twice-as-likely angle from |0> axis, from |1> axis (deg)', `${rad2deg(Math.atan(Math.SQRT2)).toFixed(2)}, ${rad2deg(Math.atan(1 / Math.SQRT2)).toFixed(2)}`);
  const bloch = (a, b) => { const ph = Math.atan2(a.im, a.re); const ia = C(Math.cos(-ph), Math.sin(-ph)); a = cm(a, ia); b = cm(b, ia); const th = 2 * Math.acos(Math.min(1, a.re)); const phi = (rad2deg(Math.atan2(b.im, b.re)) + 360) % 360; const ab = cm(cj(a), b); return `θ=${rad2deg(th).toFixed(2)}°, φ=${Math.abs(b.re) + Math.abs(b.im) < 1e-12 ? '-' : phi.toFixed(2)}°, n=(${(2 * ab.re).toFixed(3)}, ${(2 * ab.im).toFixed(3)}, ${(a.re ** 2 - (b.re ** 2 + b.im ** 2)).toFixed(3)})`; };
  add('m5', 'Bloch (|0>+i|1>)/√2', bloch(C(s), C(0, s)));
  add('m5', 'Bloch (√3/2)|0>+(1/2)|1>', bloch(C(Math.sqrt(3) / 2), C(0.5)));
  add('m5', 'Bloch |->', bloch(C(s), C(-s)));
  add('m5', 'θ=120°, φ=0: amplitudes, P1, cosθ', `${Math.cos(deg(60)).toFixed(4)}, ${Math.sin(deg(60)).toFixed(4)}, ${(Math.sin(deg(60)) ** 2).toFixed(4)}, ${Math.cos(deg(120)).toFixed(4)}`);
  { const th = 0.7, ph = 1.1, a = C(Math.cos(th / 2)), b = C(Math.cos(ph) * Math.sin(th / 2), Math.sin(ph) * Math.sin(th / 2)), v = R([[a], [b]]);
    const ex = (S) => { const w = mm(S, v); return ca(cm(cj(a), w[0][0]), cm(cj(b), w[1][0])).re; };
    add('m5', '<σx>,<σy>,<σz> vs sinθcosφ, sinθsinφ, cosθ', `${ex(X).toFixed(5)}=${(Math.sin(th) * Math.cos(ph)).toFixed(5)}, ${ex(Y).toFixed(5)}=${(Math.sin(th) * Math.sin(ph)).toFixed(5)}, ${ex(Z).toFixed(5)}=${Math.cos(th).toFixed(5)}`);
    // X, Y, Z, H Bloch maps
    const bv = (u) => { const A = u[0][0], B = u[1][0], ab = cm(cj(A), B); return [2 * ab.re, 2 * ab.im, A.re ** 2 + A.im ** 2 - B.re ** 2 - B.im ** 2].map((x) => x.toFixed(4)).join(', '); };
    add('m5', 'Bloch n before', bv(v)); add('m5', '  after X (x,−y,−z)', bv(mm(X, v))); add('m5', '  after Y (−x,y,−z)', bv(mm(Y, v))); add('m5', '  after Z (−x,−y,z)', bv(mm(Z, v))); add('m5', '  after H (z,−y,x)', bv(mm(H, v))); }
  add('m5', 'Y(α,β) with α=1, β=2', vec(mm(Y, col(1, 2))));
  add('m5', 'X|+>, X|->', `${vec(mm(X, col(s, s)))}, ${vec(mm(X, col(s, -s)))}`);
  add('m5', 'Z|+>', vec(mm(Z, col(s, s)))); add('m5', '<+|->', s * s - s * s);
  add('m5', 'H|0>, H|1>', `${vec(mm(H, col(1, 0)))}, ${vec(mm(H, col(0, 1)))}`);
  add('m5', 'H†H', M(mm(dag(H), H))); add('m5', 'ZH', M(mm(Z, H))); add('m5', 'HZH', M(mm(H, mm(Z, H)))); add('m5', 'HXH', M(mm(H, mm(X, H))));
  add('m5', 'X², Y², Z²', `${M(mm(X, X))} ${M(mm(Y, Y))} ${M(mm(Z, Z))}`);
  { const Tg = R([[1, 0], [0, C(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4))]]); const T2 = mm(Tg, Tg); add('m5', 'T², T⁴', `${M(T2)} ${M(mm(T2, T2))}`); }
  add('m5', '|+>⊗|+>', vec(kron(col(s, s), col(s, s))));
  add('m5', 'ad−bc: |+>|+>, (|00>+|01>)/√2, Φ+, Ψ+, Ψ−', [0.25 - 0.25, s * 0 - s * 0, s * s - 0, 0 - s * s, 0 - s * -s].map((x) => +x.toFixed(4)).join(', '));
  add('m5', '<Φ+|Φ->', s * s - s * s);
  add('m5', 'CNOT (a,b,c,d)=(1,2,3,4)', vec(mm(CN, col(1, 2, 3, 4)))); add('m5', 'CNOT²', M(mm(CN, CN)));
  const HI = kron(H, I2);
  for (const [lab, v] of [['00', col(1, 0, 0, 0)], ['01', col(0, 1, 0, 0)], ['10', col(0, 0, 1, 0)], ['11', col(0, 0, 0, 1)]]) { const v1 = mm(HI, v); add('m5', `|${lab}> → H⊗I → CNOT`, `${vec(v1)} → ${vec(mm(CN, v1))}`); }
  add('m5', 'CNOT (|0>+|1>)|0>/√2', vec(mm(CN, kron(col(s, s), col(1, 0)))));
}

const want = process.argv.slice(2);
for (const [m, lines] of Object.entries(out)) if (!want.length || want.includes(m)) console.log('## ' + m + '\n' + lines.join('\n'));
module.exports = out;
