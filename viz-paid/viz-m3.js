/* Module 3 widget: sequential Stern–Gerlach magnets with simulated atom counts (Pro).
 * P = |⟨out|in⟩|² from the spin-½ eigenstates; first magnet takes an unpolarised beam (½ each). */
(function () {
  'use strict';
  const MONO = 'JetBrains Mono, ui-monospace, monospace';
  const r1 = (v) => Math.round(v * 10) / 10;
  const S = Math.SQRT1_2;
  // spinors [a, b] with complex parts [re, im]
  const STATE = {
    'z+': [[1, 0], [0, 0]], 'z-': [[0, 0], [1, 0]],
    'x+': [[S, 0], [S, 0]], 'x-': [[S, 0], [-S, 0]],
    'y+': [[S, 0], [0, S]], 'y-': [[S, 0], [0, -S]]
  };
  function prob(out, inn) { // |⟨out|in⟩|²
    const a = STATE[out], b = STATE[inn];
    let re = 0, im = 0;
    for (let i = 0; i < 2; i++) { re += a[i][0] * b[i][0] + a[i][1] * b[i][1]; im += a[i][0] * b[i][1] - a[i][1] * b[i][0]; }
    return re * re + im * im;
  }
  const ket = (k) => '|' + (k[1] === '+' ? '+' : '−') + k[0] + '⟩';
  function binom(n, p) { let c = 0; for (let i = 0; i < n; i++) if (Math.random() < p) c++; return c; }
  const fmtE = (v) => (Math.abs(v - Math.round(v)) < 1e-6 ? String(Math.round(v)) : v.toFixed(1));

  VIZ.register('seq-sg', {
    title: 'Sequential Stern–Gerlach: fire atoms', kind: 'Simulation',
    mount(body, api) {
      const C = api.C;
      const N0 = 1000;
      const mags = [{ ax: 'z', keep: '+' }, { ax: 'x', keep: '+' }, { ax: 'z', keep: '+' }];
      let counts = null;
      api.css('m3-sg', '.m3-sg-row{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;margin:4px 0}.m3-sg-row .lab{min-width:74px;font-size:14px;color:#cfcfd6}.m3-sg-tbl{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:6px}.m3-sg-tbl td,.m3-sg-tbl th{padding:4px 6px;border-bottom:1px solid #2f2f35;text-align:right}.m3-sg-tbl td:first-child,.m3-sg-tbl th:first-child{text-align:left}.m3-sg-tbl .mono{font-family:' + MONO + '}');
      const s = api.stage('0 0 480 200', body, 'Oven and three Stern–Gerlach magnets in a row with beam counts');
      const g = api.svg('g', null, s);
      const ctl = api.controls();
      mags.forEach((m, i) => {
        const row = api.el('div', { class: 'm3-sg-row' }, ctl);
        api.el('span', { class: 'lab', text: 'Magnet ' + (i + 1) }, row);
        api.segmented(['x', 'y', 'z'].map((a) => ({ value: a, label: a })), m.ax, (v) => { m.ax = v; counts = null; draw(); }, row);
        api.segmented([{ value: '+', label: 'pass +' }, { value: '-', label: 'pass −' }], m.keep, (v) => { m.keep = v; counts = null; draw(); }, row);
      });
      const btns = api.el('div', { class: 'm3-sg-row' }, body);
      api.button('Fire 1000 atoms', () => { fire(); draw(); }, btns, { primary: true });
      const cap = api.caption('');
      const tblHost = api.el('div', { style: 'overflow-x:auto' }, body);

      function stages() { // probabilities of passing each magnet
        const out = [];
        let prev = null;
        mags.forEach((m) => {
          const k = m.ax + m.keep;
          out.push({ k, p: prev ? prob(k, prev) : 0.5 });
          prev = k;
        });
        return out;
      }
      function fire() {
        const sts = stages();
        let n = N0; counts = [];
        sts.forEach((x) => { const pass = binom(n, x.p); counts.push({ in: n, pass, block: n - pass }); n = pass; });
      }
      function T(x, y, t, o) { return api.svg('text', Object.assign({ x: r1(x), y: r1(y), 'font-size': 16, fill: C.text, 'text-anchor': 'middle', text: t }, o || {}), g); }
      function draw() {
        g.innerHTML = '';
        const sts = stages();
        const exp = []; let e = N0; sts.forEach((x) => { const pe = e * x.p; exp.push({ in: e, pass: pe, block: e - pe }); e = pe; });
        // oven
        api.svg('rect', { x: 6, y: 82, width: 40, height: 36, rx: 5, fill: C.heat, opacity: 0.8 }, g);
        T(26, 140, 'oven', { fill: C.dim, 'font-size': 15 });
        T(26, 74, String(N0), { fill: C.white, 'font-family': MONO });
        const MX = [80, 220, 360];
        let prevX = 46;
        sts.forEach((x, i) => {
          const m = mags[i], mx = MX[i];
          const live = (i === 0 ? N0 : (counts ? counts[i - 1].pass : exp[i - 1].pass)) > 0;
          api.svg('line', { x1: prevX, y1: 100, x2: mx, y2: 100, stroke: C.e, 'stroke-width': live ? 3 : 1, opacity: live ? 0.9 : 0.25 }, g);
          api.svg('rect', { x: mx, y: 76, width: 64, height: 48, rx: 6, fill: C.surface2, stroke: C.metal, 'stroke-width': 1.5 }, g);
          T(mx + 32, 105, 'SG ' + m.ax, { fill: C.white, 'font-size': 15, 'font-weight': 600 });
          // two outputs
          const upKeep = m.keep === '+';
          const c = counts ? counts[i] : null, ex = exp[i];
          const yUp = 62, yDn = 138, ox = mx + 64, ex2 = mx + 104;
          api.svg('line', { x1: ox, y1: 92, x2: ex2, y2: yUp, stroke: upKeep ? C.e : C.bad, 'stroke-width': 2, opacity: 0.85 }, g);
          api.svg('line', { x1: ox, y1: 108, x2: ex2, y2: yDn, stroke: upKeep ? C.bad : C.e, 'stroke-width': 2, opacity: 0.85 }, g);
          const blockY = upKeep ? yDn : yUp;
          api.svg('rect', { x: ex2 - 2, y: blockY - 9, width: 6, height: 18, fill: C.bad }, g);
          const passN = c ? String(c.pass) : fmtE(ex.pass), blkN = c ? String(c.block) : fmtE(ex.block);
          T(ex2 - 14, upKeep ? yUp - 14 : yDn + 22, (upKeep ? '+' : '−') + m.ax + ': ' + passN, { fill: C.e, 'font-family': MONO, 'font-size': 15 });
          T(ex2 - 14, upKeep ? yDn + 22 : yUp - 14, (upKeep ? '−' : '+') + m.ax + ': ' + blkN + ' ✕', { fill: C.bad, 'font-family': MONO, 'font-size': 15 });
          if (i === 2) { api.svg('line', { x1: ex2, y1: upKeep ? yUp : yDn, x2: 474, y2: upKeep ? yUp : yDn, stroke: C.e, 'stroke-width': 2, opacity: 0.85 }, g); }
          prevX = ex2;
          // re-route: next beam starts from the kept output
          if (i < 2) { api.svg('line', { x1: ex2, y1: upKeep ? yUp : yDn, x2: MX[i + 1], y2: 100, stroke: C.e, 'stroke-width': 2, opacity: 0.85 }, g); prevX = MX[i + 1]; }
        });
        T(240, 190, counts ? 'counts from the last run (random)' : 'expected counts; press Fire to simulate', { fill: C.dim, 'font-size': 15 });
        // table
        let html = '<table class="m3-sg-tbl"><thead><tr><th>Stage</th><th>P(pass)</th><th>Expected pass</th><th>Simulated pass</th></tr></thead><tbody>';
        sts.forEach((x, i) => {
          const from = i === 0 ? 'unpolarised' : ket(sts[i - 1].k);
          html += '<tr><td>' + (i + 1) + ': ' + from + ' → ' + ket(x.k) + '</td><td class="mono">' + (x.p < 1e-9 ? '0' : x.p > 1 - 1e-9 ? '1' : x.p.toFixed(2)) + '</td><td class="mono">' + fmtE(exp[i].pass) + '</td><td class="mono">' + (counts ? counts[i].pass : '—') + '</td></tr>';
        });
        tblHost.innerHTML = html + '</tbody></table>';
        cap.set(explain(sts));
      }
      function explain(sts) {
        const parts = [];
        for (let i = 1; i < 3; i++) {
          const a = sts[i - 1].k, b = sts[i].k;
          if (a === b) parts.push('Magnets ' + i + ' and ' + (i + 1) + ': same axis, same beam, so 100 % pass (the state is already ' + ket(a) + ').');
          else if (a[0] === b[0]) parts.push('Magnets ' + i + ' and ' + (i + 1) + ': same axis, opposite beam, so 0 % pass (' + ket(a) + ' and ' + ket(b) + ' are orthogonal).');
          else parts.push('Magnets ' + i + ' and ' + (i + 1) + ': different axes, P = |⟨' + ket(b).slice(1, -1) + '|' + ket(a).slice(1, -1) + '⟩|² = ½.');
        }
        if (sts[0].k[0] === sts[2].k[0] && sts[1].k[0] !== sts[0].k[0]) { const opp = sts[0].k[0] + (sts[0].k[1] === '+' ? '-' : '+'); parts.push('<b>The ' + ket(opp) + ' beam blocked by magnet 1 comes back at magnet 3:</b> measuring ' + sts[1].k[0] + ' erased the ' + sts[0].k[0] + ' information.'); }
        return parts.join(' ');
      }
      draw();
    }
  });
})();
