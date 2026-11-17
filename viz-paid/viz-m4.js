/* Module 4 widgets: particle in a box, tunnelling through a barrier (Pro).
 * Constants as tools/check-numericals.js: 1 nm box E1 ≈ 0.377 eV; E = 5, U = 10 eV, L = 0.2 nm gives T ≈ 0.040. */
(function () {
  'use strict';
  const MONO = 'JetBrains Mono, ui-monospace, monospace';
  const h = 6.626e-34, hb = h / (2 * Math.PI), me = 9.1e-31, eV = 1.6e-19;
  const r1 = (v) => Math.round(v * 10) / 10;
  const nf = (v, d) => {
    if (!isFinite(v)) return '—';
    let s = Number(v).toFixed(d == null ? 3 : d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    if (/^-0$/.test(s)) s = '0';
    return s.replace('-', '−');
  };
  // significant-figure format with × 10^n for very small or large numbers
  const sf = (v, n) => {
    if (!isFinite(v)) return '—';
    if (v === 0) return '0';
    const a = Math.abs(v);
    if (a >= 1e-3 && a < 1e5) return nf(Number(v.toPrecision(n || 3)), 6);
    const ex = Math.floor(Math.log10(a)), m = v / Math.pow(10, ex);
    return nf(Number(m.toPrecision(n || 3)), 6) + ' × 10<sup>' + String(ex).replace('-', '−') + '</sup>';
  };
  function workBox(api, parent) {
    api.css('m4-work', '.m4-work{overflow-x:auto;font-family:' + MONO + ';font-size:13px;line-height:1.6;color:#b3b3bb;margin-top:6px}.m4-work .hd{display:block;margin:8px 0 2px;color:#f4f4f6;font-weight:600}.m4-work .ln{display:block}');
    return api.el('div', { class: 'm4-work' }, parent);
  }
  function T(api, p, x, y, s, o) {
    return api.svg('text', Object.assign({ x: r1(x), y: r1(y), 'font-size': 17, fill: api.C.text, 'text-anchor': 'middle', text: s }, o || {}), p);
  }

  // ---------------------------------------------------------------- particle in a box
  VIZ.register('box-levels', {
    title: 'Particle in a box: ψₙ, |ψₙ|² and Eₙ', kind: 'Interactive',
    mount(body, api) {
      const C = api.C;
      const st = { n: 1, a: 1, show: 'psi' };
      const s = api.stage('0 0 480 260', body, 'Wavefunction inside an infinite well and an energy-level ladder');
      const g = api.svg('g', null, s);
      const ctl = api.controls();
      api.segmented([{ value: 'psi', label: 'ψ' }, { value: 'prob', label: '|ψ|²' }], st.show, (v) => { st.show = v; draw(); }, ctl);
      api.slider({ label: 'Quantum number n', min: 1, max: 8, step: 1, value: st.n, format: (v) => String(v) }, (v) => { st.n = v; draw(); }, ctl);
      api.slider({ label: 'Box width a', min: 0.2, max: 2, step: 0.05, value: st.a, format: (v) => nf(v, 2) + ' nm' }, (v) => { st.a = v; draw(); }, ctl);
      const ro = api.readouts();
      const rE = api.readout('E<sub>n</sub>', ro), rE1 = api.readout('E<sub>1</sub>', ro), rN = api.readout('Nodes inside (n − 1)', ro), rL = api.readout('Wavelength 2a/n', ro);
      const work = workBox(api, body);
      const X0 = 40, X1 = 320, YM = 140, AMP = 90;
      function draw() {
        g.innerHTML = '';
        const n = st.n, a = st.a * 1e-9;
        const E1 = h * h / (8 * me * a * a) / eV, En = n * n * E1;
        // walls
        api.svg('rect', { x: X0 - 14, y: 30, width: 14, height: 200, fill: C.metal, opacity: 0.35 }, g);
        api.svg('rect', { x: X1, y: 30, width: 14, height: 200, fill: C.metal, opacity: 0.35 }, g);
        api.svg('line', { x1: X0, y1: YM, x2: X1, y2: YM, stroke: C.line2, 'stroke-width': 1 }, g);
        T(api, g, X0, 250, 'x = 0', { fill: C.dim, 'font-size': 16 });
        T(api, g, X1, 250, 'x = a', { fill: C.dim, 'font-size': 16 });
        T(api, g, X0 - 7, 22, 'V = ∞', { fill: C.dim, 'font-size': 15 });
        T(api, g, X1 + 7, 22, 'V = ∞', { fill: C.dim, 'font-size': 15 });
        const prob = st.show === 'prob';
        let d = '', fill = 'M' + X0 + ',' + YM + ' ';
        for (let i = 0; i <= 200; i++) {
          const f = Math.sin(n * Math.PI * i / 200), y = YM - (prob ? 1.6 * AMP * f * f : AMP * f), x = X0 + (X1 - X0) * i / 200;
          d += (i ? 'L' : 'M') + r1(x) + ',' + r1(y) + ' '; fill += 'L' + r1(x) + ',' + r1(y) + ' ';
        }
        if (prob) api.svg('path', { d: fill + 'L' + X1 + ',' + YM + ' Z', fill: C.e, opacity: 0.18 }, g);
        api.svg('path', { d, fill: 'none', stroke: prob ? C.e : C.photon, 'stroke-width': 2.6 }, g);
        for (let j = 1; j < n; j++) api.svg('circle', { cx: r1(X0 + (X1 - X0) * j / n), cy: YM, r: 4, fill: C.hole }, g);
        T(api, g, (X0 + X1) / 2, 22, prob ? '|ψ|² = (2/a) sin²(nπx/a)' : 'ψ = √(2/a) sin(nπx/a)', { fill: C.white, 'font-size': 16 });
        if (n > 1) T(api, g, (X0 + X1) / 2, 250, 'red dots = nodes', { fill: C.hole, 'font-size': 15 });
        // ladder (levels ∝ n²)
        const LX = 370, LW = 70, LB = 230, LT = 40, top = 64;
        api.svg('line', { x1: LX - 6, y1: LB, x2: LX - 6, y2: LT - 6, stroke: C.line2, 'marker-end': api.arrow(s, C.line2) }, g);
        T(api, g, LX + LW / 2, 22, 'E (∝ n²)', { fill: C.dim, 'font-size': 15 });
        for (let k = 1; k <= 8; k++) {
          const y = LB - (LB - LT) * k * k / top, on = k === n;
          api.svg('line', { x1: LX, y1: r1(y), x2: LX + LW, y2: r1(y), stroke: on ? C.photon : C.faint, 'stroke-width': on ? 3 : 1.2 }, g);
          if (k >= 3 || on) T(api, g, LX + LW + 14, y + 4, String(k), { fill: on ? C.photon : C.dim, 'font-size': 15, 'font-family': MONO });
        }
        T(api, g, LX + LW + 14, LB - 2, '1,2', { fill: n <= 2 ? C.dim : C.faint, 'font-size': 13, 'font-family': MONO, opacity: n <= 2 ? 0 : 1 });
        rE.set(nf(En, En < 10 ? 3 : 1) + ' eV'); rE1.set(nf(E1, 3) + ' eV'); rN.set(String(n - 1)); rL.set(nf(2 * st.a / n, 3) + ' nm');
        work.innerHTML = '<span class="hd">Working (electron, m = 9.1 × 10<sup>−31</sup> kg)</span>' +
          '<span class="ln">E<sub>1</sub> = h²/8ma² = (6.626×10<sup>−34</sup>)² / (8 × 9.1×10<sup>−31</sup> × (' + nf(st.a, 2) + '×10<sup>−9</sup>)²)</span>' +
          '<span class="ln">E<sub>1</sub> = ' + sf(E1 * eV, 4) + ' J = ' + nf(E1, 3) + ' eV</span>' +
          '<span class="ln">E<sub>' + n + '</sub> = n²E<sub>1</sub> = ' + n * n + ' × ' + nf(E1, 3) + ' = ' + nf(En, 3) + ' eV</span>' +
          '<span class="ln">Gap to next level: E<sub>' + (n + 1) + '</sub> − E<sub>' + n + '</sub> = (2n + 1)E<sub>1</sub> = ' + nf((2 * n + 1) * E1, 3) + ' eV</span>';
      }
      draw();
    }
  });

  // ---------------------------------------------------------------- tunnelling
  // complex helpers
  const cx = (re, im) => ({ re, im: im || 0 });
  const add = (a, b) => cx(a.re + b.re, a.im + b.im), sub = (a, b) => cx(a.re - b.re, a.im - b.im);
  const mul = (a, b) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const div = (a, b) => { const q = b.re * b.re + b.im * b.im; return cx((a.re * b.re + a.im * b.im) / q, (a.im * b.re - a.re * b.im) / q); };
  const cexp = (z) => { const m = Math.exp(z.re); return cx(m * Math.cos(z.im), m * Math.sin(z.im)); };
  const half = (z) => cx(z.re / 2, z.im / 2);
  const I = cx(0, 1);

  VIZ.register('tunnel', {
    title: 'Tunnelling through a rectangular barrier', kind: 'Interactive',
    mount(body, api) {
      const C = api.C;
      const st = { E: 5, U: 10, L: 0.2 };
      const s = api.stage('0 0 480 250', body, 'A rectangular barrier with the real part of the wavefunction in three regions');
      const g = api.svg('g', null, s);
      const ctl = api.controls();
      api.slider({ label: 'Electron energy E', min: 0.5, max: 20, step: 0.5, value: st.E, format: (v) => nf(v, 1) + ' eV' }, (v) => { st.E = v; draw(); }, ctl);
      api.slider({ label: 'Barrier height U', min: 1, max: 25, step: 0.5, value: st.U, format: (v) => nf(v, 1) + ' eV' }, (v) => { st.U = v; draw(); }, ctl);
      api.slider({ label: 'Barrier width L', min: 0.05, max: 1, step: 0.01, value: st.L, format: (v) => nf(v, 2) + ' nm' }, (v) => { st.L = v; draw(); }, ctl);
      const ro = api.readouts();
      const rT = api.readout('T (exact)', ro), rA = api.readout('T (approximation)', ro), rR = api.readout('R = 1 − T', ro), rK = api.readout('k<sub>2</sub>', ro);
      const cap = api.caption('');
      const work = workBox(api, body);
      const X0 = 20, X1 = 460, YB = 200;
      function draw() {
        g.innerHTML = '';
        const E = st.E, U = st.U, L = st.L * 1e-9;
        const k1 = Math.sqrt(2 * me * E * eV) / hb;
        const over = E >= U;
        const k2 = Math.sqrt(2 * me * Math.abs(E - U) * eV) / hb;
        // region II wavenumber q: e^{iqx}; below barrier q = iκ, above q = k2'
        const q = over ? cx(Math.max(k2, 1), 0) : cx(0, k2);
        const iq = mul(I, q), ik1 = cx(0, k1);
        // transmitted wave e^{ik1 x} (amplitude 1 for now), match value and slope at x = L, then x = 0
        const pL = cexp(cx(0, k1 * L)), dL = mul(ik1, pL);
        const Cc = mul(half(add(pL, div(dL, iq))), cexp(mul(cx(-1), mul(iq, cx(L))))), Dd = mul(half(sub(pL, div(dL, iq))), cexp(mul(iq, cx(L))));
        const p0 = add(Cc, Dd), d0 = mul(iq, sub(Cc, Dd));
        const A = half(add(p0, div(d0, ik1))), B = half(sub(p0, div(d0, ik1)));
        const t = div(cx(1), A); // normalised: incident amplitude 1
        const psi = (x) => {
          let z;
          if (x < 0) z = add(mul(A, cexp(cx(0, k1 * x))), mul(B, cexp(cx(0, -k1 * x))));
          else if (x <= L) z = add(mul(Cc, cexp(mul(iq, cx(x)))), mul(Dd, cexp(mul(cx(-1), mul(iq, cx(x))))));
          else z = cexp(cx(0, k1 * x));
          return div(z, A).re;
        };
        const s2 = Math.sinh(k2 * L) ** 2, sn2 = Math.sin(k2 * L) ** 2;
        const Tex = over ? (Math.abs(E - U) < 1e-9 ? 1 / (1 + me * U * eV * L * L / (2 * hb * hb)) : 1 / (1 + U * U * sn2 / (4 * E * (E - U)))) : 1 / (1 + U * U * s2 / (4 * E * (U - E)));
        const Tap = 16 * (E / U) * (1 - E / U) * Math.exp(-2 * k2 * L);
        // geometry: window from −1.2 nm to L + 1.2 nm
        const W = 1.2e-9, span = L + 2 * W, px = (x) => X0 + (X1 - X0) * (x + W) / span;
        const Emax = Math.max(E, U) * 1.15, ey = (v) => YB - 150 * v / Emax;
        api.svg('rect', { x: r1(px(0)), y: r1(ey(U)), width: r1(px(L) - px(0)), height: r1(YB - ey(U)), fill: C.an, opacity: 0.18, stroke: C.an, 'stroke-width': 1.2 }, g);
        api.svg('line', { x1: X0, y1: YB, x2: X1, y2: YB, stroke: C.line2 }, g);
        api.svg('line', { x1: X0, y1: r1(ey(E)), x2: X1, y2: r1(ey(E)), stroke: C.cat, 'stroke-width': 1.2, 'stroke-dasharray': '6 4' }, g);
        T(api, g, X0 + 4, ey(E) - 6, 'E = ' + nf(E, 1) + ' eV', { fill: C.cat, 'font-size': 15, 'text-anchor': 'start' });
        T(api, g, px(L) + 6, ey(U) - 6, 'U = ' + nf(U, 1) + ' eV', { fill: C.an, 'font-size': 15, 'text-anchor': 'start' });
        T(api, g, (px(0) + px(L)) / 2, YB + 16, 'L', { fill: C.an, 'font-size': 16 });
        T(api, g, (X0 + px(0)) / 2, YB + 16, 'I', { fill: C.dim, 'font-size': 16 });
        T(api, g, (px(L) + X1) / 2, YB + 16, 'III', { fill: C.dim, 'font-size': 16 });
        // Re ψ drawn about the E line
        const amp = 26, base = ey(E);
        let d = '';
        for (let i = 0; i <= 480; i++) { const x = -W + span * i / 480, y = base - amp * psi(x); d += (i ? 'L' : 'M') + r1(px(x)) + ',' + r1(Math.max(4, Math.min(YB + 30, y))) + ' '; }
        api.svg('path', { d, fill: 'none', stroke: C.e, 'stroke-width': 2.2 }, g);
        T(api, g, 240, 240, 'blue: Re ψ (incident amplitude 1), drawn on the E line', { fill: C.dim, 'font-size': 15 });
        rT.set(sf(Tex, 3) + ' (' + sf(100 * Tex, 3) + ' %)');
        rA.set(over ? 'not valid (E ≥ U)' : sf(Tap, 3));
        rR.set(sf(1 - Tex, 3));
        rK.set((over ? 'k<sub>2</sub>′ = ' : 'κ = ') + sf(k2, 3) + ' m<sup>−1</sup>');
        const tCheck = t.re * t.re + t.im * t.im;
        if (over) cap.set('<b>E ≥ U: over the barrier.</b> Inside, ψ still oscillates (wavenumber k<sub>2</sub>′ = √(2m(E − U))/ℏ), so T uses sin, not sinh. Some reflection remains; T = 1 only when k<sub>2</sub>′L = nπ.');
        else cap.set('<b>E &lt; U: tunnelling.</b> Inside the barrier ψ decays (no oscillation); the wave leaving on the right has the same wavelength but amplitude |t| = ' + sf(Math.sqrt(tCheck), 3) + '.' + (k2 * L > 1 ? ' Here 2κL = ' + nf(2 * k2 * L, 2) + ' > 1, so the approximation is fair.' : ' Here 2κL = ' + nf(2 * k2 * L, 2) + ' is small, so the approximation is poor.'));
        work.innerHTML = '<span class="hd">Working (m = 9.1 × 10<sup>−31</sup> kg, ℏ = 1.055 × 10<sup>−34</sup> J s)</span>' +
          '<span class="ln">k<sub>1</sub> = √(2mE)/ℏ = ' + sf(k1, 3) + ' m<sup>−1</sup></span>' +
          (over
            ? '<span class="ln">k<sub>2</sub>′ = √(2m(E − U))/ℏ = ' + sf(k2, 3) + ' m<sup>−1</sup>,  k<sub>2</sub>′L = ' + nf(k2 * L, 3) + ' rad</span>' +
              '<span class="ln">T = [1 + U² sin²(k<sub>2</sub>′L) / 4E(E − U)]<sup>−1</sup> = [1 + ' + sf(U * U * sn2 / (4 * E * Math.max(E - U, 1e-9)), 3) + ']<sup>−1</sup> = ' + sf(Tex, 3) + '</span>'
            : '<span class="ln">κ = k<sub>2</sub> = √(2m(U − E))/ℏ = ' + sf(k2, 3) + ' m<sup>−1</sup>,  k<sub>2</sub>L = ' + nf(k2 * L, 3) + '</span>' +
              '<span class="ln">T = [1 + U² sinh²(k<sub>2</sub>L) / 4E(U − E)]<sup>−1</sup> = [1 + ' + sf(U * U * s2 / (4 * E * (U - E)), 4) + ']<sup>−1</sup> = ' + sf(Tex, 3) + '</span>' +
              '<span class="ln">T ≈ 16(E/U)(1 − E/U) e<sup>−2k₂L</sup> = 16 × ' + nf(E / U, 3) + ' × ' + nf(1 - E / U, 3) + ' × ' + sf(Math.exp(-2 * k2 * L), 3) + ' = ' + sf(Tap, 3) + '</span>') +
          '<span class="ln">Check from the matched wave: |t|² = ' + sf(tCheck, 3) + '</span>';
      }
      draw();
    }
  });
})();
