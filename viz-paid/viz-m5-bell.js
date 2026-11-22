/* Module 5 widget (Pro): making a Bell state with H then CNOT, step by step, then measuring both qubits. */
(function () {
  'use strict';
  const MONO = 'JetBrains Mono, ui-monospace, monospace';
  const at = (n, a) => { for (const k in a) n.setAttribute(k, a[k]); return n; };
  const R = Math.SQRT1_2;
  const LAB = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];
  const H1 = (v) => [R * (v[0] + v[2]), R * (v[1] + v[3]), R * (v[0] - v[2]), R * (v[1] - v[3])]; // H on qubit 1 (left)
  const CNOT = (v) => [v[0], v[1], v[3], v[2]]; // control = qubit 1
  const name = (v) => {
    const k = v.map((x) => Math.round(x * 100) / 100);
    if (k[1] === 0 && k[2] === 0) return k[3] > 0 ? '|Φ⁺⟩' : '|Φ⁻⟩';
    if (k[0] === 0 && k[3] === 0) return k[2] > 0 ? '|Ψ⁺⟩' : '|Ψ⁻⟩';
    return '';
  };
  const ket = (v) => {
    const t = []; v.forEach((x, i) => { if (Math.abs(x) > 1e-6) t.push((x < 0 ? '− ' : t.length ? '+ ' : '') + (Math.abs(Math.abs(x) - 1) < 1e-6 ? '' : Math.abs(Math.abs(x) - R) < 1e-6 ? '(1/√2)' : Math.abs(x).toFixed(2)) + LAB[i]); });
    return t.join(' ');
  };

  VIZ.register('bell-circuit', {
    title: 'Making a Bell state: H then CNOT', kind: 'Step-through',
    mount(body, api) {
      const C = api.C;
      const s = api.stage('0 0 480 230', body, 'Two-qubit circuit: Hadamard on qubit 1 then CNOT, with the four amplitudes shown at each step');
      const Y1 = 40, Y2 = 90, XS = [40, 150, 260, 360];
      [Y1, Y2].forEach((y, i) => { api.svg('line', { x1: 60, x2: 380, y1: y, y2: y, stroke: C.line2, 'stroke-width': 2 }, s); });
      const inL = [api.svg('text', { x: 50, y: Y1 + 5, 'text-anchor': 'end', 'font-size': 13, fill: C.white, 'font-family': MONO }, s), api.svg('text', { x: 50, y: Y2 + 5, 'text-anchor': 'end', 'font-size': 13, fill: C.white, 'font-family': MONO }, s)];
      api.svg('rect', { x: 130, y: Y1 - 16, width: 32, height: 32, rx: 5, fill: C.surface2, stroke: C.e }, s);
      api.svg('text', { x: 146, y: Y1 + 6, 'text-anchor': 'middle', 'font-size': 16, fill: C.e, 'font-weight': 600 }, s).textContent = 'H';
      api.svg('line', { x1: 260, x2: 260, y1: Y1, y2: Y2 + 12, stroke: C.an, 'stroke-width': 2 }, s);
      api.svg('circle', { cx: 260, cy: Y1, r: 6, fill: C.an }, s);
      api.svg('circle', { cx: 260, cy: Y2, r: 12, fill: 'none', stroke: C.an, 'stroke-width': 2 }, s);
      api.svg('line', { x1: 248, x2: 272, y1: Y2, y2: Y2, stroke: C.an, 'stroke-width': 2 }, s);
      const pulse = api.svg('rect', { y: Y1 - 26, width: 4, height: Y2 - Y1 + 52, rx: 2, fill: C.photon, 'fill-opacity': 0.5 }, s);
      const bars = [], vals = [];
      for (let i = 0; i < 4; i++) {
        const x = 40 + i * 110;
        api.svg('line', { x1: x, x2: x + 80, y1: 180, y2: 180, stroke: C.line2 }, s);
        bars.push(api.svg('rect', { x: x + 20, width: 40, y: 180, height: 0, rx: 4 }, s));
        api.svg('text', { x: x + 40, y: 222, 'text-anchor': 'middle', 'font-size': 12, fill: C.dim, 'font-family': MONO }, s).textContent = LAB[i];
        vals.push(api.svg('text', { x: x + 40, y: 200, 'text-anchor': 'middle', 'font-size': 11, fill: C.text, 'font-family': MONO }, s));
      }
      const ctl = api.controls();
      let input = 0, step = 0, cur = [1, 0, 0, 0];
      api.segmented(LAB.map((l, i) => ({ value: i, label: 'start ' + l })), 0, (v) => { input = v; go(0); }, ctl);
      const st = api.stepper(3, (i) => go(i), ctl);
      const row = api.el('div', { style: 'display:flex;flex-wrap:wrap;gap:6px;margin-top:6px' }, ctl);
      api.button('← Back', () => go(Math.max(0, step - 1)), row);
      api.button('Next →', () => go(Math.min(2, step + 1)), row, { primary: true });
      api.button('Measure both', () => meas(), row);
      const ro = api.readouts();
      const rS = api.readout('State', ro), rM = api.readout('Measurements (q1 q2)', ro, '—');
      const cap = api.caption('');
      let log = [];
      const stateAt = (k) => { let v = [0, 0, 0, 0]; v[input] = 1; if (k >= 1) v = H1(v); if (k >= 2) v = CNOT(v); return v; };
      async function go(k) {
        const from = cur.slice(), to = stateAt(k); step = k; st.set(k); log = []; rM.set('—');
        const b = LAB[input].slice(1, 3); inL[0].textContent = '|' + b[0] + '⟩'; inL[1].textContent = '|' + b[1] + '⟩';
        rS.set(ket(to) + (k === 2 ? '  = ' + name(to) : ''));
        cap.set([
          'Start in a plain product state ' + LAB[input] + '. One basis state, probability 1.',
          'H on qubit 1 makes it a superposition: |0⟩ → (|0⟩+|1⟩)/√2, |1⟩ → (|0⟩−|1⟩)/√2. The state is still a product: (H|q₁⟩)⊗|q₂⟩.',
          'CNOT flips qubit 2 only where qubit 1 is 1. That swaps the |10⟩ and |11⟩ amplitudes and ties the qubits together: now ' + name(to) + ', which is maximally entangled. Measure: the two results always agree (Φ) or always disagree (Ψ).'][k]);
        const px = [XS[0] + 30, 146, 260][k];
        await api.tween(0.6, (p) => { for (let i = 0; i < 4; i++) cur[i] = from[i] + (to[i] - from[i]) * p; at(pulse, { x: px - 2, 'fill-opacity': 0.6 * (1 - p) + 0.15 }); paint(); });
      }
      function paint() {
        for (let i = 0; i < 4; i++) {
          const v = cur[i], hgt = Math.abs(v) * 70;
          at(bars[i], { y: v >= 0 ? 180 - hgt : 180, height: hgt, fill: v >= 0 ? C.good : C.hole });
          vals[i].textContent = 'P ' + (v * v).toFixed(2);
        }
      }
      function meas() {
        const v = stateAt(step); let r = Math.random(), k = 0;
        for (; k < 3; k++) { r -= v[k] * v[k]; if (r < 0) break; }
        log.unshift(LAB[k].slice(1, 3)); log = log.slice(0, 8); rM.set(log.join('  '));
      }
      go(0);
    }
  });
})();
