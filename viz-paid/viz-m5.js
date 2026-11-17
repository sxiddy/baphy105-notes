/* Module 5 widget: the Bloch sphere with θ, φ sliders, gates and presets (Pro). */
(function () {
  'use strict';
  const r1 = (v) => Math.round(v * 10) / 10;
  const nf = (v, d) => {
    if (!isFinite(v)) return '—';
    let s = Number(v).toFixed(d == null ? 3 : d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    if (/^-0$/.test(s)) s = '0';
    return s.replace('-', '−');
  };
  const D2R = Math.PI / 180;

  VIZ.register('bloch', {
    title: 'Bloch sphere: angles, state and gates', kind: 'Interactive',
    mount(body, api) {
      const C = api.C;
      const st = { th: 60, ph: 45, yaw: -32, el: 18, busy: false };
      api.css('m5-bloch', '.m5-bloch-svg{touch-action:none;cursor:grab}.m5-gates{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.m5-gates .vbtn{min-width:46px}');
      const s = api.stage('0 0 360 330', body, 'Bloch sphere with the state arrow; drag to turn the view');
      s.classList.add('m5-bloch-svg');
      const g = api.svg('g', null, s);
      api.caption('Drag the sphere to turn the view. Each gate turns the arrow by 180° about x, y, z, or about the (x + z) diagonal for H.');
      const ctl = api.controls();
      const sTh = api.slider({ label: 'θ (from +z)', min: 0, max: 180, step: 1, value: st.th, format: (v) => v + '°' }, (v) => { st.th = v; draw(); lastNote.set(''); }, ctl);
      const sPh = api.slider({ label: 'φ (about z, from +x)', min: 0, max: 360, step: 1, value: st.ph, format: (v) => v + '°' }, (v) => { st.ph = v; draw(); lastNote.set(''); }, ctl);
      const gates = api.el('div', { class: 'm5-gates' }, body);
      const AX = { X: [1, 0, 0], Y: [0, 1, 0], Z: [0, 0, 1], H: [Math.SQRT1_2, 0, Math.SQRT1_2] };
      const RULE = { X: '(x, −y, −z)', Y: '(−x, y, −z)', Z: '(−x, −y, z)', H: '(z, −y, x)' };
      ['X', 'Y', 'Z', 'H'].forEach((k) => api.button(k, () => gate(k), gates, { primary: true }));
      api.button('Reset', () => setAngles(0, 0), gates);
      const pres = api.el('div', { class: 'm5-gates' }, body);
      [['|0⟩', 0, 0], ['|1⟩', 180, 0], ['|+⟩', 90, 0], ['|−⟩', 90, 180], ['|+i⟩', 90, 90], ['|−i⟩', 90, 270]].forEach((p) => api.button(p[0], () => setAngles(p[1], p[2]), pres));
      const ro = api.readouts();
      const rA = api.readout('α = cos(θ/2)', ro), rB = api.readout('β = e<sup>iφ</sup> sin(θ/2)', ro);
      const rP0 = api.readout('P(0) = |α|²', ro), rP1 = api.readout('P(1) = |β|²', ro), rV = api.readout('Bloch vector (x, y, z)', ro);
      const lastNote = api.caption('');

      const vec = (th, ph) => [Math.sin(th * D2R) * Math.cos(ph * D2R), Math.sin(th * D2R) * Math.sin(ph * D2R), Math.cos(th * D2R)];
      const CX = 180, CY = 165, RAD = 118;
      function proj(p) {
        const cg = Math.cos(st.yaw * D2R), sg = Math.sin(st.yaw * D2R), ce = Math.cos(st.el * D2R), se = Math.sin(st.el * D2R);
        const x1 = p[0] * cg - p[1] * sg, y1 = p[0] * sg + p[1] * cg, z1 = p[2];
        return { u: CX + RAD * y1, v: CY - RAD * (z1 * ce - x1 * se), d: x1 * ce + z1 * se };
      }
      function T(x, y, t, o) { return api.svg('text', Object.assign({ x: r1(x), y: r1(y), 'font-size': 15, fill: C.text, 'text-anchor': 'middle', 'dominant-baseline': 'middle', text: t }, o || {}), g); }
      function ring(f, col, w) { // solid front half, dashed back half
        for (let i = 0; i < 72; i++) {
          const P = proj(f(i / 72 * 2 * Math.PI)), Q = proj(f((i + 1) / 72 * 2 * Math.PI)), fr = P.d + Q.d >= 0;
          api.svg('line', { x1: r1(P.u), y1: r1(P.v), x2: r1(Q.u), y2: r1(Q.v), stroke: col, 'stroke-width': w, opacity: fr ? 0.9 : 0.4, 'stroke-dasharray': fr ? null : '3 4' }, g);
        }
      }
      let cur = vec(st.th, st.ph);
      function render(v) {
        g.innerHTML = '';
        api.svg('circle', { cx: CX, cy: CY, r: RAD, fill: C.glass, stroke: C.line2, 'stroke-width': 1.5 }, g);
        ring((a) => [Math.cos(a), Math.sin(a), 0], C.dim, 1.4);
        ring((a) => [Math.cos(a), 0, Math.sin(a)], C.faint, 1.1);
        const O = proj([0, 0, 0]);
        [[[1, 0, 0], 'x', '|+⟩'], [[0, 1, 0], 'y', '|+i⟩'], [[0, 0, 1], 'z', '|0⟩'], [[-1, 0, 0], '', '|−⟩'], [[0, -1, 0], '', '|−i⟩'], [[0, 0, -1], '', '|1⟩']].forEach(([p, lab, ket]) => {
          const P = proj(p), L = proj(p.map((c) => c * 1.2));
          api.svg('line', { x1: O.u, y1: O.v, x2: r1(P.u), y2: r1(P.v), stroke: C.line2, 'stroke-width': 1.2, 'stroke-dasharray': P.d < 0 ? '3 4' : null }, g);
          api.svg('circle', { cx: r1(P.u), cy: r1(P.v), r: 3, fill: C.dim }, g);
          T(L.u, L.v, ket, { fill: lab ? C.white : C.dim, 'font-size': 14 });
          if (lab) { const A = proj(p.map((c) => c * 0.9)); T(A.u + 9, A.v - 9, lab, { fill: C.cat, 'font-size': 13, 'font-style': 'italic' }); }
        });
        const F = proj([v[0], v[1], 0]), P = proj(v);
        api.svg('line', { x1: O.u, y1: O.v, x2: r1(F.u), y2: r1(F.v), stroke: C.an, 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }, g);
        api.svg('line', { x1: r1(F.u), y1: r1(F.v), x2: r1(P.u), y2: r1(P.v), stroke: C.an, 'stroke-width': 1.2, 'stroke-dasharray': '4 3' }, g);
        api.svg('line', { x1: O.u, y1: O.v, x2: r1(P.u), y2: r1(P.v), stroke: C.photon, 'stroke-width': 3.2, 'marker-end': api.arrow(s, C.photon) }, g);
        api.svg('circle', { cx: r1(P.u), cy: r1(P.v), r: 5, fill: C.photon, opacity: P.d >= 0 ? 1 : 0.5 }, g);
        T(14, 18, 'yellow arrow = state |ψ⟩', { fill: C.photon, 'font-size': 13, 'text-anchor': 'start' });
      }
      function readouts(th, ph) {
        const a = Math.cos(th * D2R / 2), sn = Math.sin(th * D2R / 2), br = sn * Math.cos(ph * D2R), bi = sn * Math.sin(ph * D2R);
        rA.set(nf(a, 3));
        const im = Math.abs(bi) < 5e-4 ? '' : (Math.abs(br) < 5e-4 ? (bi < 0 ? '−' : '') : (bi < 0 ? ' − ' : ' + ')) + nf(Math.abs(bi), 3) + 'i';
        rB.set((Math.abs(br) < 5e-4 && im ? '' : nf(br, 3)) + im);
        rP0.set(nf(a * a, 3)); rP1.set(nf(sn * sn, 3));
        rV.set('(' + vec(th, ph).map((c) => nf(c, 2)).join(', ') + ')');
      }
      function draw() { cur = vec(st.th, st.ph); render(cur); readouts(st.th, st.ph); }
      function fromVec(v) {
        const z = Math.max(-1, Math.min(1, v[2]));
        const th = Math.round(Math.acos(z) / D2R);
        let ph = Math.atan2(v[1], v[0]) / D2R; if (ph < 0) ph += 360;
        return [th, th === 0 || th === 180 ? 0 : Math.round(ph) % 360];
      }
      function rot(v, k, a) { // Rodrigues rotation of v about unit axis k by angle a
        const c = Math.cos(a), sn = Math.sin(a), d = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
        const cr = [k[1] * v[2] - k[2] * v[1], k[2] * v[0] - k[0] * v[2], k[0] * v[1] - k[1] * v[0]];
        return [0, 1, 2].map((i) => v[i] * c + cr[i] * sn + k[i] * d * (1 - c));
      }
      function gate(name) {
        if (st.busy) return;
        const k = AX[name], v0 = cur.slice(), v1 = rot(v0, k, Math.PI);
        st.busy = true;
        let done = false;
        const fin = () => {
          if (done) return; done = true;
          const a = fromVec(v1); st.th = a[0]; st.ph = a[1]; sTh.set(a[0]); sPh.set(a[1]); draw(); st.busy = false;
          lastNote.set('<b>' + name + '</b> sends (x, y, z) → ' + RULE[name] + ':  (' + v0.map((c) => nf(c, 2)).join(', ') + ') → (' + v1.map((c) => nf(c, 2)).join(', ') + ')');
        };
        api.tween(650, (p) => { render(rot(v0, k, Math.PI * p)); if (p >= 1) fin(); });
        api.timeout(fin, 1100);
      }
      function setAngles(th, ph) { if (st.busy) return; st.th = th; st.ph = ph; sTh.set(th); sPh.set(ph); draw(); lastNote.set(''); }
      let drag = null;
      api.listen(s, 'pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, yaw: st.yaw, el: st.el }; try { s.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } });
      api.listen(s, 'pointermove', (e) => { if (!drag || st.busy) return; st.yaw = drag.yaw - (e.clientX - drag.x) * 0.5; st.el = Math.max(-80, Math.min(80, drag.el + (e.clientY - drag.y) * 0.4)); render(cur); });
      api.listen(s, 'pointerup', () => { drag = null; });
      api.listen(s, 'pointercancel', () => { drag = null; });
      draw();
    }
  });
})();
