/* Module 3 widget (Pro): measuring S_z on a spin state many times; collapse, histogram, running mean → expectation value. */
(function () {
  'use strict';
  const MONO = 'JetBrains Mono, ui-monospace, monospace';
  const at = (n, a) => { for (const k in a) n.setAttribute(k, a[k]); return n; };

  VIZ.register('measure-spin', {
    title: 'Measurement and expectation value', kind: 'Simulation',
    mount(body, api) {
      const C = api.C;
      const s = api.stage('0 0 480 230', body, 'A spin state is measured repeatedly; each result is up or down and the running average approaches the expectation value');
      // Bloch-ish circle
      const CX = 92, CY = 112, R = 70;
      api.svg('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: C.line2 }, s);
      api.svg('line', { x1: CX, x2: CX, y1: CY - R - 8, y2: CY + R + 8, stroke: C.line, 'stroke-dasharray': '3 4' }, s);
      api.svg('text', { x: CX, y: CY - R - 12, 'text-anchor': 'middle', 'font-size': 11, fill: C.good, 'font-family': MONO }, s).textContent = '|↑⟩  +ħ/2';
      api.svg('text', { x: CX, y: CY + R + 20, 'text-anchor': 'middle', 'font-size': 11, fill: C.hole, 'font-family': MONO }, s).textContent = '|↓⟩  −ħ/2';
      const mk = api.arrow(s, C.photon, 9);
      const vec = api.svg('line', { x1: CX, y1: CY, stroke: C.photon, 'stroke-width': 3, 'marker-end': mk, 'stroke-linecap': 'round' }, s);
      const flash = api.svg('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: C.white, 'stroke-opacity': 0 }, s);
      // histogram
      const HX = 210, HB = 190;
      const bUp = api.svg('rect', { x: HX, width: 52, y: HB, height: 0, rx: 4, fill: C.good }, s);
      const bDn = api.svg('rect', { x: HX + 70, width: 52, y: HB, height: 0, rx: 4, fill: C.hole }, s);
      const tUp = api.svg('text', { x: HX + 26, y: HB + 16, 'text-anchor': 'middle', 'font-size': 11, fill: C.text, 'font-family': MONO }, s);
      const tDn = api.svg('text', { x: HX + 96, y: HB + 16, 'text-anchor': 'middle', 'font-size': 11, fill: C.text, 'font-family': MONO }, s);
      // running mean chart
      const MX0 = 352, MX1 = 470, MY = (v) => 112 - v * 70;
      api.svg('rect', { x: MX0, y: 42, width: MX1 - MX0, height: 140, fill: C.surface, rx: 6 }, s);
      api.svg('line', { x1: MX0, x2: MX1, y1: MY(0), y2: MY(0), stroke: C.line2 }, s);
      const expL = api.svg('line', { x1: MX0, x2: MX1, stroke: C.photon, 'stroke-dasharray': '4 3' }, s);
      const mean = api.svg('path', { fill: 'none', stroke: C.e, 'stroke-width': 1.8 }, s);
      api.svg('text', { x: (MX0 + MX1) / 2, y: 34, 'text-anchor': 'middle', 'font-size': 10.5, fill: C.dim }, s).textContent = 'running mean (ħ/2)';

      const ctl = api.controls();
      let th = 60, shots = [], cur = th, collapsed = null, auto = false;
      const sl = api.slider({ label: 'State angle θ from +z', min: 0, max: 180, step: 5, value: th, format: (v) => v + '°' }, (v) => { th = v; clear(); }, ctl);
      const row = api.el('div', { style: 'display:flex;flex-wrap:wrap;gap:6px;margin-top:6px' }, ctl);
      api.button('Measure once', () => measure(), row, { primary: true });
      const ab = api.button('Measure 500 (auto)', () => { auto = !auto; ab.textContent = auto ? 'Stop' : 'Measure 500 (auto)'; }, row);
      api.button('Reset', () => clear(), row);
      [['|↑⟩', 0], ['|+x⟩', 90], ['θ = 60°', 60]].forEach(([l, v]) => api.button(l, () => { th = v; sl.set(v); clear(); }, row));
      const ro = api.readouts();
      const rP = api.readout('P(↑) = cos²(θ/2)', ro), rE = api.readout('⟨S<sub>z</sub>⟩ = (ħ/2)cos θ', ro), rM = api.readout('Mean so far', ro, '—');
      const cap = api.caption('');
      const P = () => Math.cos(th * Math.PI / 360) ** 2;
      function clear() { shots = []; collapsed = null; draw(); }
      function measure() {
        const up = Math.random() < P(); shots.push(up ? 1 : -1); collapsed = { up, t: 0 };
        if (shots.length >= 500) { auto = false; ab.textContent = 'Measure 500 (auto)'; }
        draw();
      }
      function draw() {
        const p = P(), e = Math.cos(th * Math.PI / 180), n = shots.length, nu = shots.filter((x) => x > 0).length;
        rP.set(p.toFixed(3)); rE.set(e.toFixed(3) + ' × ħ/2');
        const m = n ? shots.reduce((a, b) => a + b, 0) / n : 0; rM.set(n ? m.toFixed(3) + ' × ħ/2  (' + n + ')' : '—');
        const mx = Math.max(1, nu, n - nu);
        at(bUp, { y: HB - 130 * nu / mx, height: 130 * nu / mx }); at(bDn, { y: HB - 130 * (n - nu) / mx, height: 130 * (n - nu) / mx });
        tUp.textContent = '↑ ' + nu; tDn.textContent = '↓ ' + (n - nu);
        at(expL, { y1: MY(e), y2: MY(e) });
        let d = '', run = 0; const N = Math.max(20, n);
        shots.forEach((x, i) => { run += x; d += (i ? 'L' : 'M') + (MX0 + (MX1 - MX0) * (i + 1) / N).toFixed(1) + ',' + MY(run / (i + 1)).toFixed(1); });
        at(mean, { d });
        cap.set(n === 0 ? 'Before measuring, the state is a superposition: cos(θ/2)|↑⟩ + sin(θ/2)|↓⟩. Press Measure.'
          : `Each result is only ever +ħ/2 or −ħ/2 (an eigenvalue), and the state collapses to that eigenstate. The average of many results tends to ⟨S<sub>z</sub>⟩ = ${e.toFixed(2)} ħ/2, which itself may never be a single result.`);
      }
      let acc = 0;
      api.loop((dt) => {
        if (auto) { acc += dt * 40; while (acc >= 1) { acc--; measure(); } }
        let ang = th;
        if (collapsed) { collapsed.t += dt; const k = Math.min(1, collapsed.t / 0.25); const tgt = collapsed.up ? 0 : 180; ang = collapsed.t < 0.6 ? th + (tgt - th) * k : tgt + (th - tgt) * Math.min(1, (collapsed.t - 0.6) / 0.3); at(flash, { 'stroke-opacity': Math.max(0, 0.7 - collapsed.t), stroke: collapsed.up ? C.good : C.hole }); if (collapsed.t > 0.9) collapsed = null; }
        cur += (ang - cur) * Math.min(1, dt * 18);
        const r = cur * Math.PI / 180;
        at(vec, { x2: CX + Math.sin(r) * (R - 6), y2: CY - Math.cos(r) * (R - 6) });
      });
      draw();
    }
  });
})();
