/* Module 1 widgets (Pro): blackbody spectrum (Planck vs Rayleigh–Jeans) and the double slit built up one particle at a time. */
(function () {
  'use strict';
  const MONO = 'JetBrains Mono, ui-monospace, monospace';
  const at = (n, a) => { for (const k in a) n.setAttribute(k, a[k]); return n; };
  const h = 6.626e-34, c = 2.998e8, kB = 1.381e-23, WIEN = 2.898e-3;

  // ---------- planck-spectrum ----------
  VIZ.register('planck-spectrum', {
    title: 'Blackbody spectrum: Planck vs Rayleigh–Jeans', kind: 'Interactive',
    mount(body, api) {
      const C = api.C;
      const W = 480, H = 260, X0 = 46, X1 = 466, Y0 = 222, Y1 = 22;
      const LMIN = 0.05e-6, LMAX = 3e-6;
      const s = api.stage('0 0 480 260', body, 'Spectral radiance against wavelength for a blackbody, Planck curve and Rayleigh–Jeans curve');
      // visible band
      const defs = api.svg('defs', null, s);
      const grad = api.svg('linearGradient', { id: api.uid('vis'), x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
      const px = (l) => X0 + (l - LMIN) / (LMAX - LMIN) * (X1 - X0);
      [380, 440, 490, 530, 580, 620, 700].forEach((nm, i, a) => api.svg('stop', { offset: (i / (a.length - 1) * 100) + '%', 'stop-color': api.wavelengthToColor(nm), 'stop-opacity': 0.22 }, grad));
      api.svg('rect', { x: px(380e-9), y: Y1, width: px(700e-9) - px(380e-9), height: Y0 - Y1, fill: 'url(#' + grad.id + ')' }, s);
      api.svg('text', { x: (px(380e-9) + px(700e-9)) / 2, y: Y1 + 12, 'text-anchor': 'middle', 'font-size': 10, fill: C.dim }, s).textContent = 'visible';
      api.svg('line', { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: C.line2 }, s);
      api.svg('line', { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: C.line2 }, s);
      for (let um = 0.5; um <= 3; um += 0.5) {
        api.svg('line', { x1: px(um * 1e-6), x2: px(um * 1e-6), y1: Y0, y2: Y0 + 4, stroke: C.line2 }, s);
        api.svg('text', { x: px(um * 1e-6), y: Y0 + 16, 'text-anchor': 'middle', 'font-size': 10, fill: C.dim, 'font-family': MONO }, s).textContent = um;
      }
      api.svg('text', { x: X1, y: Y0 + 30, 'text-anchor': 'end', 'font-size': 10.5, fill: C.dim }, s).textContent = 'wavelength λ (μm)';
      api.svg('text', { x: 14, y: (Y0 + Y1) / 2, 'font-size': 10.5, fill: C.dim, transform: `rotate(-90 14 ${(Y0 + Y1) / 2})`, 'text-anchor': 'middle' }, s).textContent = 'radiance per λ';
      const rj = api.svg('path', { fill: 'none', stroke: C.hole, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, s);
      const area = api.svg('path', { fill: C.heat, 'fill-opacity': 0.14, stroke: 'none' }, s);
      const pl = api.svg('path', { fill: 'none', stroke: C.heat, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, s);
      const peakLine = api.svg('line', { stroke: C.photon, 'stroke-dasharray': '3 4', 'stroke-width': 1.2 }, s);
      const peakDot = api.svg('circle', { r: 5, fill: C.photon }, s);
      const peakTxt = api.svg('text', { 'font-size': 11, fill: C.photon, 'font-family': MONO }, s);
      const uvTxt = api.svg('text', { x: X0 + 8, y: Y1 + 12, 'font-size': 11, fill: C.hole }, s);
      const glow = api.svg('circle', { cx: 430, cy: 58, r: 18 }, s);
      api.svg('text', { x: 430, y: 90, 'text-anchor': 'middle', 'font-size': 10, fill: C.dim }, s).textContent = 'looks like';

      const ctl = api.controls();
      let T = 5800, shown = 5800, showRJ = true;
      const sl = api.slider({ label: 'Temperature T', min: 1000, max: 8000, step: 100, value: T, format: (v) => v + ' K' }, (v) => { T = v; }, ctl);
      const row = api.el('div', { style: 'display:flex;flex-wrap:wrap;gap:6px;margin-top:6px' }, ctl);
      [['Sun 5800 K', 5800], ['Bulb 3000 K', 3000], ['Hot iron 1500 K', 1500]].forEach(([l, v]) => api.button(l, () => { T = v; sl.set(v); }, row));
      api.segmented([{ value: true, label: 'show Rayleigh–Jeans' }, { value: false, label: 'Planck only' }], true, (v) => { showRJ = v; }, row);
      const ro = api.readouts();
      const rPeak = api.readout('Wien peak λ<sub>max</sub> = b/T', ro);
      const rPow = api.readout('Power σT⁴ (vs Sun)', ro);
      const cap = api.caption('');

      const B = (l, t) => 2 * h * c * c / Math.pow(l, 5) / (Math.exp(h * c / (l * kB * t)) - 1);
      const RJ = (l, t) => 2 * c * kB * t / Math.pow(l, 4);
      function draw(t) {
        const lp = WIEN / t, ymax = B(lp, t) * 1.18;
        const py = (v) => Y0 - Math.min(1.25, v / ymax) * (Y0 - Y1);
        let d = '', dr = '';
        for (let i = 0; i <= 220; i++) {
          const l = LMIN + (LMAX - LMIN) * i / 220;
          d += (i ? 'L' : 'M') + px(l).toFixed(1) + ',' + py(B(l, t)).toFixed(1);
          const r = RJ(l, t); if (r / ymax < 1.25) dr += (dr ? 'L' : 'M') + px(l).toFixed(1) + ',' + py(r).toFixed(1); else if (!dr) continue;
        }
        at(pl, { d }); at(area, { d: d + `L${X1},${Y0}L${X0},${Y0}Z` });
        at(rj, { d: dr, visibility: showRJ ? 'visible' : 'hidden' });
        const x = px(lp), y = py(B(lp, t));
        at(peakLine, { x1: x, x2: x, y1: Y0, y2: y }); at(peakDot, { cx: x, cy: y });
        at(peakTxt, { x: Math.min(x + 8, 380), y: y - 8 }); peakTxt.textContent = (lp * 1e9).toFixed(0) + ' nm';
        uvTxt.textContent = showRJ ? 'Rayleigh–Jeans → ∞ here: the UV catastrophe' : '';
        // colour of the glow: weighted visible light
        let r = 0, g = 0, b = 0;
        for (let nm = 400; nm <= 700; nm += 20) { const w = B(nm * 1e-9, t), col = api.wavelengthToColor(nm); const m = col.match(/\d+/g).map(Number); r += m[0] * w; g += m[1] * w; b += m[2] * w; }
        const mx = Math.max(r, g, b); const k = Math.min(1, (t - 800) / 2500);
        at(glow, { fill: `rgb(${Math.round(255 * r / mx * k)},${Math.round(255 * g / mx * k)},${Math.round(255 * b / mx * k)})`, filter: 'drop-shadow(0 0 8px rgba(255,200,120,' + (0.25 + 0.5 * k) + '))' });
        rPeak.set((lp * 1e9).toFixed(0) + ' nm');
        rPow.set('× ' + Math.pow(t / 5800, 4).toFixed(t < 5800 ? 3 : 2));
        cap.set(`At ${Math.round(t)} K the peak sits at ${(lp * 1e6).toFixed(2)} μm = 2.898×10⁻³ / ${Math.round(t)}. Hotter → peak moves left (Wien) and the area grows as T⁴ (Stefan). ${showRJ ? 'The classical curve matches only at long λ; Planck’s E = nhν cuts off the short-λ end.' : ''}`);
      }
      api.loop((dt) => { const d = T - shown; if (Math.abs(d) > 0.5) { shown += d * Math.min(1, dt * 8); draw(shown); } });
      draw(T);
    }
  });

  // ---------- double-slit ----------
  VIZ.register('double-slit', {
    title: 'Double slit, one electron at a time', kind: 'Animation',
    mount(body, api) {
      const C = api.C;
      const s = api.stage('0 0 480 240', body, 'Electrons pass a double slit one at a time and build up an interference pattern on a screen');
      const SX = 30, BX = 190, SCX = 360, HX = 372, MID = 120, NB = 60, TOP = 14, BOT = 226;
      api.svg('circle', { cx: SX, cy: MID, r: 9, fill: C.e, 'fill-opacity': 0.25, stroke: C.e }, s);
      api.svg('text', { x: SX, y: MID + 26, 'text-anchor': 'middle', 'font-size': 10, fill: C.dim }, s).textContent = 'gun';
      const wall = (y1, y2) => api.svg('rect', { x: BX - 3, y: y1, width: 6, height: y2 - y1, fill: C.line2 }, s);
      wall(TOP, MID - 30); wall(MID - 18, MID + 18); wall(MID + 30, BOT);
      const det = [MID - 24, MID + 24].map((y) => api.svg('circle', { cx: BX + 14, cy: y, r: 5, fill: 'none', stroke: C.cat, 'stroke-width': 1.5, visibility: 'hidden' }, s));
      api.svg('rect', { x: SCX - 2, y: TOP, width: 4, height: BOT - TOP, fill: C.surface2 }, s);
      const dotsG = api.svg('g', null, s);
      const bars = [];
      for (let i = 0; i < NB; i++) bars.push(api.svg('rect', { x: HX, y: TOP + i * (BOT - TOP) / NB, height: (BOT - TOP) / NB - 0.6, width: 0, fill: C.e, 'fill-opacity': 0.75, rx: 1 }, s));
      const theory = api.svg('path', { fill: 'none', stroke: C.photon, 'stroke-width': 1.3, 'stroke-dasharray': '3 3' }, s);
      const fly = api.svg('circle', { r: 3.2, fill: C.white, visibility: 'hidden' }, s);
      const ctl = api.controls();
      let watch = false, rate = 30;
      const seg = api.segmented([{ value: false, label: 'no detector' }, { value: true, label: 'watch which slit' }], false, (v) => { watch = v; reset(); }, ctl);
      api.slider({ label: 'Electrons per second', min: 2, max: 200, step: 1, value: rate }, (v) => { rate = v; }, ctl);
      const row = api.el('div', { style: 'display:flex;gap:6px;margin-top:6px' }, ctl);
      api.button('Reset screen', () => reset(), row);
      const ro = api.readouts();
      const rN = api.readout('Electrons on screen', ro, '0');
      const cap = api.caption('');
      const hist = new Array(NB).fill(0);
      let n = 0, acc = 0, flight = null;
      // probability over screen bins
      const prob = (y, w) => { const u = (y - MID) / 50; const env = Math.exp(-u * u * 1.4); if (w) return env * (Math.exp(-((y - MID + 12) ** 2) / 900) + Math.exp(-((y - MID - 12) ** 2) / 900)); return env * Math.cos(u * 9) ** 2; };
      function sample() { for (;;) { const y = TOP + Math.random() * (BOT - TOP); if (Math.random() < prob(y, watch)) return y; } }
      function reset() {
        hist.fill(0); n = 0; while (dotsG.firstChild) dotsG.removeChild(dotsG.firstChild); bars.forEach((b) => at(b, { width: 0 }));
        det.forEach((d) => at(d, { visibility: watch ? 'visible' : 'hidden' }));
        let mx = 0; const pts = []; for (let i = 0; i <= 120; i++) { const y = TOP + (BOT - TOP) * i / 120, p = prob(y, watch); mx = Math.max(mx, p); pts.push([y, p]); }
        at(theory, { d: pts.map(([y, p], i) => (i ? 'L' : 'M') + (HX + p / mx * 90).toFixed(1) + ',' + y.toFixed(1)).join('') });
        rN.set('0'); upd();
      }
      function upd() {
        cap.set(watch
          ? 'Detector on: each electron is seen at one slit, so the probabilities add: |ψ₁|² + |ψ₂|². Two plain humps, no fringes.'
          : n < 40 ? 'Each electron lands at one random spot, like a particle. Keep watching…'
            : 'No detector: the amplitudes add first, |ψ₁ + ψ₂|², so bright and dark fringes appear. Each electron goes through both slits as a wave and lands as a particle.');
      }
      function land(y) {
        n++; const i = Math.max(0, Math.min(NB - 1, Math.floor((y - TOP) / (BOT - TOP) * NB))); hist[i]++;
        if (dotsG.childNodes.length > 1500) dotsG.removeChild(dotsG.firstChild);
        api.svg('circle', { cx: SCX - 1 + (Math.random() - 0.5) * 3, cy: y, r: 1.1, fill: C.e, 'fill-opacity': 0.85 }, dotsG);
        const mx = Math.max(...hist); hist.forEach((v, j) => at(bars[j], { width: v / mx * 90 }));
        rN.set(String(n)); if (n === 40) upd();
      }
      api.loop((dt) => {
        if (flight) {
          flight.t += dt * 2.4; const t = Math.min(1, flight.t);
          const x = t < 0.5 ? SX + (BX - SX) * t * 2 : BX + (SCX - BX) * (t - 0.5) * 2;
          const y = t < 0.5 ? MID + (flight.sy - MID) * t * 2 : flight.sy + (flight.y - flight.sy) * (t - 0.5) * 2;
          at(fly, { cx: x, cy: y, visibility: 'visible' });
          if (watch && t > 0.5) at(det[flight.sy < MID ? 0 : 1], { fill: C.cat });
          if (t >= 1) { land(flight.y); flight = null; at(fly, { visibility: 'hidden' }); det.forEach((d) => at(d, { fill: 'none' })); }
        }
        acc += dt * rate;
        if (rate > 12) { while (acc >= 1) { acc--; land(sample()); } }
        else if (!flight && acc >= 1) { acc = 0; const y = sample(); flight = { t: 0, y, sy: Math.random() < 0.5 ? MID - 24 : MID + 24 }; }
      });
      reset();
    }
  });
})();
