/* Module 1 widgets (Pro): Compton scattering and the original Stern–Gerlach experiment (classical smear vs two spots). */
(function () {
  'use strict';
  const MONO = 'JetBrains Mono, ui-monospace, monospace';
  const at = (n, a) => { for (const k in a) n.setAttribute(k, a[k]); return n; };
  const LC = 2.426e-12; // Compton wavelength h/mc (m)

  VIZ.register('compton', {
    title: 'Compton scattering: photon bounces off an electron', kind: 'Animation',
    mount(body, api) {
      const C = api.C;
      const s = api.stage('0 0 480 240', body, 'An X-ray photon hits a resting electron, scatters at angle theta with a longer wavelength, and the electron recoils');
      const EX = 230, EY = 120;
      api.svg('line', { x1: 20, x2: 460, y1: EY, y2: EY, stroke: C.line, 'stroke-dasharray': '3 5' }, s);
      const arc = api.svg('path', { fill: 'none', stroke: C.photon, 'stroke-opacity': 0.5 }, s);
      const thT = api.svg('text', { 'font-size': 11, fill: C.photon, 'font-family': MONO }, s);
      const inW = api.svg('path', { fill: 'none', stroke: C.photon, 'stroke-width': 2 }, s);
      const outW = api.svg('path', { fill: 'none', stroke: C.cat, 'stroke-width': 2 }, s);
      const el = api.svg('circle', { r: 8, fill: C.e }, s);
      const elTrail = api.svg('line', { x1: EX, y1: EY, stroke: C.e, 'stroke-dasharray': '2 4', 'stroke-opacity': 0.6 }, s);
      const lab1 = api.svg('text', { x: 24, y: EY - 16, 'font-size': 11, fill: C.photon, 'font-family': MONO }, s);
      const lab2 = api.svg('text', { 'font-size': 11, fill: C.cat, 'font-family': MONO }, s);
      const ctl = api.controls();
      let th = 60, E0 = 90; // keV
      api.slider({ label: 'Scattering angle θ', min: 0, max: 180, step: 1, value: th, format: (v) => v + '°' }, (v) => { th = v; calc(); }, ctl);
      const sE = api.slider({ label: 'Incident photon energy', min: 10, max: 500, step: 1, value: E0, format: (v) => v + ' keV' }, (v) => { E0 = v; calc(); }, ctl);
      const row = api.el('div', { style: 'display:flex;flex-wrap:wrap;gap:6px;margin-top:6px' }, ctl);
      api.button('Course: 90 keV at 60°', () => { E0 = 90; sE.set(90); th = 60; calc(); }, row);
      const ro = api.readouts();
      const rD = api.readout('Δλ = (h/m<sub>e</sub>c)(1 − cos θ)', ro), rL = api.readout('λ → λ′', ro), rK = api.readout('Electron KE', ro);
      const cap = api.caption('');
      let l0, l1, phi;
      const wave = (x0, y0, ang, len, lam, phase) => { // sine along a direction; visual wavelength scaled
        const vis = 6 + lam * 1e12 * 1.1; let d = ''; const ca = Math.cos(ang), sa = Math.sin(ang);
        for (let i = 0; i <= len; i += 2) { const off = 7 * Math.sin((i - phase) / vis * 2 * Math.PI); d += (i ? 'L' : 'M') + (x0 + ca * i - sa * off).toFixed(1) + ',' + (y0 + sa * i + ca * off).toFixed(1); }
        return d;
      };
      function calc() {
        l0 = 1.2398e-6 / (E0 * 1e3); const dl = LC * (1 - Math.cos(th * Math.PI / 180)); l1 = l0 + dl;
        const E1 = 1.2398e-6 / l1 / 1e3;
        // electron recoil angle: tan φ = sin θ / ((1 + E0/mc²)(1 − cos θ))... use momentum: p = h/λ
        const p0 = 1 / l0, p1x = Math.cos(th * Math.PI / 180) / l1, p1y = Math.sin(th * Math.PI / 180) / l1;
        phi = Math.atan2(-p1y, p0 - p1x);
        rD.set((dl * 1e12).toFixed(3) + ' pm'); rL.set((l0 * 1e12).toFixed(2) + ' → ' + (l1 * 1e12).toFixed(2) + ' pm');
        rK.set((E0 - E1).toFixed(2) + ' keV');
        cap.set(`Δλ depends only on θ, not on λ: at 90° it is exactly h/m<sub>e</sub>c = 2.43 pm, at 180° it is the maximum 4.85 pm. Energy lost by the photon (${(E0 - E1).toFixed(1)} keV) is the electron's kinetic energy.`);
        const r = 34, a = -th * Math.PI / 180;
        at(arc, { d: `M${EX + r},${EY} A${r},${r} 0 ${th > 180 ? 1 : 0} 0 ${EX + r * Math.cos(a)},${EY + r * Math.sin(a)}` });
        at(thT, { x: EX + 40 * Math.cos(a / 2) + 4, y: EY + 40 * Math.sin(a / 2) }); thT.textContent = 'θ';
      }
      let t = 0;
      api.loop((dt) => {
        t = (t + dt) % 3.2; const ph = t * 60;
        const a = -th * Math.PI / 180;
        if (t < 1.4) { // incoming
          const len = Math.min(EX - 20, (t / 1.4) * (EX - 20));
          at(inW, { d: wave(EX - len, EY, 0, len, l0, ph), visibility: 'visible' }); at(outW, { visibility: 'hidden' });
          at(el, { cx: EX, cy: EY }); at(elTrail, { x2: EX, y2: EY });
        } else {
          const k = Math.min(1, (t - 1.4) / 1.4), len = k * 200;
          at(inW, { visibility: 'hidden' });
          at(outW, { d: wave(EX, EY, a, len, l1, ph), visibility: 'visible' });
          const ex = EX + Math.cos(phi) * k * 150, ey = EY - Math.sin(phi) * k * 150;
          at(el, { cx: ex, cy: ey }); at(elTrail, { x2: ex, y2: ey });
          at(lab2, { x: EX + Math.cos(a) * 150 + 6, y: EY + Math.sin(a) * 150 - 6 }); lab2.textContent = 'λ′ = ' + (l1 * 1e12).toFixed(1) + ' pm';
        }
        lab1.textContent = 'λ = ' + (l0 * 1e12).toFixed(1) + ' pm';
      });
      calc();
    }
  });

  VIZ.register('sg-experiment', {
    title: 'Stern–Gerlach: classical smear vs two spots', kind: 'Animation',
    mount(body, api) {
      const C = api.C;
      const s = api.stage('0 0 480 230', body, 'Silver atoms from an oven pass a non-uniform magnet and hit a screen, forming two spots instead of a continuous smear');
      const MID = 115;
      api.svg('rect', { x: 14, y: MID - 22, width: 36, height: 44, rx: 6, fill: C.heat, 'fill-opacity': 0.2, stroke: C.heat }, s);
      api.svg('text', { x: 32, y: MID + 38, 'text-anchor': 'middle', 'font-size': 10, fill: C.dim }, s).textContent = 'oven (Ag)';
      api.svg('path', { d: `M150,${MID - 60} L250,${MID - 60} L250,${MID - 22} L210,${MID - 10} L190,${MID - 10} L150,${MID - 22} Z`, fill: C.hole, 'fill-opacity': 0.3, stroke: C.hole }, s);
      api.svg('text', { x: 200, y: MID - 40, 'text-anchor': 'middle', 'font-size': 13, fill: C.hole, 'font-weight': 600 }, s).textContent = 'N';
      api.svg('path', { d: `M150,${MID + 60} L250,${MID + 60} L250,${MID + 22} L150,${MID + 22} Z`, fill: C.e, 'fill-opacity': 0.25, stroke: C.e }, s);
      api.svg('text', { x: 200, y: MID + 46, 'text-anchor': 'middle', 'font-size': 13, fill: C.e, 'font-weight': 600 }, s).textContent = 'S';
      api.svg('text', { x: 200, y: MID + 78, 'text-anchor': 'middle', 'font-size': 10, fill: C.dim }, s).textContent = 'non-uniform field: ∂B/∂z ≠ 0';
      api.svg('rect', { x: 400, y: 20, width: 6, height: 190, fill: C.surface2 }, s);
      const hits = api.svg('g', null, s);
      const atoms = api.svg('g', null, s);
      const ctl = api.controls();
      let mode = 'quantum';
      api.segmented([{ value: 'quantum', label: 'what happened (quantum)' }, { value: 'classical', label: 'classical prediction' }], mode, (v) => { mode = v; while (hits.firstChild) hits.removeChild(hits.firstChild); upd(); }, ctl);
      const cap = api.caption('');
      function upd() {
        cap.set(mode === 'quantum'
          ? 'Force F<sub>z</sub> = μ<sub>z</sub> ∂B/∂z. The beam splits into exactly two spots: μ<sub>z</sub> (and S<sub>z</sub> = ±ħ/2) can take only two values. Spin is quantised.'
          : 'Classically the magnetic moments point in every direction, so μ<sub>z</sub> takes every value from −μ to +μ and the beam would spread into one continuous smear.');
      }
      const list = [];
      let acc = 0;
      api.loop((dt) => {
        acc += dt * 40;
        while (acc >= 1) {
          acc--;
          const m = mode === 'quantum' ? (Math.random() < 0.5 ? 1 : -1) : Math.cos(Math.random() * Math.PI);
          list.push({ x: 50, y: MID + (Math.random() - 0.5) * 6, m, n: api.svg('circle', { r: 2, fill: C.white }, atoms) });
        }
        for (let i = list.length - 1; i >= 0; i--) {
          const a = list[i]; a.x += dt * 260;
          const dx = Math.max(0, Math.min(a.x, 250) - 150), after = Math.max(0, a.x - 250);
          const dy = -a.m * (0.0018 * dx * dx + 0.36 * after);
          at(a.n, { cx: a.x, cy: a.y + dy, fill: a.m > 0 ? C.hole : a.m < 0 ? C.e : C.white });
          if (a.x >= 400) {
            if (hits.childNodes.length > 900) hits.removeChild(hits.firstChild);
            api.svg('circle', { cx: 401 + Math.random() * 4, cy: a.y + dy + (Math.random() - 0.5) * 4, r: 1.4, fill: C.photon, 'fill-opacity': 0.7 }, hits);
            atoms.removeChild(a.n); list.splice(i, 1);
          }
        }
      });
      upd();
    }
  });
})();
