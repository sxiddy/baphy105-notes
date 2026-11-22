/* Module 2 widget (Pro): tensor product of two qubits, with the product-state test that exposes entanglement. */
(function () {
  'use strict';
  const MONO = 'JetBrains Mono, ui-monospace, monospace';
  const at = (n, a) => { for (const k in a) n.setAttribute(k, a[k]); return n; };
  const f2 = (v) => (Math.abs(v) < 0.005 ? '0' : v.toFixed(2));

  VIZ.register('tensor-product', {
    title: 'Tensor product: two qubits → four amplitudes', kind: 'Interactive',
    mount(body, api) {
      const C = api.C;
      const s = api.stage('0 0 480 250', body, 'Two qubit column vectors combine by the tensor product into a four-component vector');
      const LAB = ['|00⟩', '|01⟩', '|10⟩', '|11⟩'];
      const col = (x, y, n, label, colr) => {
        api.svg('text', { x: x + 24, y: y - 8, 'text-anchor': 'middle', 'font-size': 11, fill: colr }, s).textContent = label;
        const cells = [];
        for (let i = 0; i < n; i++) {
          api.svg('rect', { x, y: y + i * 34, width: 48, height: 30, rx: 6, fill: C.surface, stroke: colr, 'stroke-opacity': 0.6 }, s);
          cells.push(api.svg('text', { x: x + 24, y: y + i * 34 + 20, 'text-anchor': 'middle', 'font-size': 13, fill: C.white, 'font-family': MONO }, s));
        }
        return cells;
      };
      const A = col(20, 80, 2, 'qubit A', C.e);
      api.svg('text', { x: 92, y: 120, 'text-anchor': 'middle', 'font-size': 22, fill: C.dim }, s).textContent = '⊗';
      const Bc = col(112, 80, 2, 'qubit B', C.an);
      api.svg('text', { x: 186, y: 120, 'text-anchor': 'middle', 'font-size': 20, fill: C.dim }, s).textContent = '=';
      const links = api.svg('g', null, s);
      const out = [], bars = [], work = [];
      for (let i = 0; i < 4; i++) {
        const y = 40 + i * 48;
        api.svg('text', { x: 216, y: y + 19, 'font-size': 11.5, fill: C.dim, 'font-family': MONO }, s).textContent = LAB[i];
        work.push(api.svg('text', { x: 252, y: y + 19, 'font-size': 11.5, fill: C.text, 'font-family': MONO }, s));
        api.svg('rect', { x: 360, y: y + 6, width: 100, height: 18, rx: 4, fill: C.surface }, s);
        bars.push(api.svg('rect', { x: 410, y: y + 6, width: 0, height: 18, rx: 4 }, s));
        out.push(api.svg('text', { x: 410, y: y + 38, 'text-anchor': 'middle', 'font-size': 10, fill: C.dim, 'font-family': MONO }, s));
      }
      api.svg('line', { x1: 410, x2: 410, y1: 40, y2: 228, stroke: C.line2 }, s);

      const ctl = api.controls();
      let mode = 'product', ta = 0, tb = 90, cur = [1, 0, 0, 0], target = cur.slice();
      api.segmented([{ value: 'product', label: 'build a product state' }, { value: 'bell', label: 'try a Bell state' }], mode, (v) => { mode = v; sA.el.style.display = sB.el.style.display = v === 'product' ? '' : 'none'; calc(); }, ctl);
      const sA = api.slider({ label: 'qubit A angle θ<sub>A</sub>', min: -180, max: 180, step: 5, value: ta, format: (v) => v + '°' }, (v) => { ta = v; calc(); }, ctl);
      const sB = api.slider({ label: 'qubit B angle θ<sub>B</sub>', min: -180, max: 180, step: 5, value: tb, format: (v) => v + '°' }, (v) => { tb = v; calc(); }, ctl);
      const ro = api.readouts();
      const rT = api.readout('Test c<sub>00</sub>c<sub>11</sub> − c<sub>01</sub>c<sub>10</sub>', ro);
      const rV = api.readout('Verdict', ro);
      const cap = api.caption('');
      let a = [1, 0], b = [1, 0];
      function calc() {
        if (mode === 'product') {
          a = [Math.cos(ta * Math.PI / 360), Math.sin(ta * Math.PI / 360)];
          b = [Math.cos(tb * Math.PI / 360), Math.sin(tb * Math.PI / 360)];
          target = [a[0] * b[0], a[0] * b[1], a[1] * b[0], a[1] * b[1]];
        } else target = [Math.SQRT1_2, 0, 0, Math.SQRT1_2];
        while (links.firstChild) links.removeChild(links.firstChild);
        for (let i = 0; i < 2; i++) { A[i].textContent = mode === 'product' ? f2(a[i]) : '?'; Bc[i].textContent = mode === 'product' ? f2(b[i]) : '?'; }
        for (let i = 0; i < 4; i++) {
          const ia = i >> 1, ib = i & 1;
          work[i].textContent = mode === 'product' ? `${f2(a[ia])} × ${f2(b[ib])}` : (i === 0 || i === 3 ? '1/√2' : '0');
          if (mode === 'product') {
            api.svg('path', { d: `M68,${95 + ia * 34} C150,${95 + ia * 34} 180,${59 + i * 48} 212,${55 + i * 48}`, fill: 'none', stroke: C.e, 'stroke-opacity': 0.35 }, links);
            api.svg('path', { d: `M160,${95 + ib * 34} C190,${95 + ib * 34} 195,${59 + i * 48} 212,${55 + i * 48}`, fill: 'none', stroke: C.an, 'stroke-opacity': 0.35 }, links);
          }
        }
        const t = target[0] * target[3] - target[1] * target[2];
        rT.set(f2(t)); rV.set(Math.abs(t) < 1e-6 ? '<span style="color:' + C.good + '">product state</span>' : '<span style="color:' + C.hole + '">entangled</span>');
        cap.set(mode === 'product'
          ? 'Each output amplitude is (A component) × (B component): top half from a₀, bottom half from a₁. Any state built this way passes the test c₀₀c₁₁ = c₀₁c₁₀.'
          : '(|00⟩ + |11⟩)/√2 gives c₀₀c₁₁ = ½ but c₀₁c₁₀ = 0. No pair of single-qubit vectors can make it, so it is entangled: you cannot write it as |a⟩⊗|b⟩.');
      }
      api.loop((dt) => {
        let moved = false;
        for (let i = 0; i < 4; i++) { const d = target[i] - cur[i]; if (Math.abs(d) > 1e-4) { cur[i] += d * Math.min(1, dt * 9); moved = true; } else cur[i] = target[i]; }
        if (!moved && cur._drawn) return; cur._drawn = true;
        for (let i = 0; i < 4; i++) {
          const v = cur[i], w = Math.abs(v) * 50;
          at(bars[i], { x: v >= 0 ? 410 : 410 - w, width: w, fill: v >= 0 ? C.good : C.hole });
          out[i].textContent = 'c = ' + f2(v) + '   P = ' + f2(v * v);
        }
      });
      calc();
    }
  });
})();
