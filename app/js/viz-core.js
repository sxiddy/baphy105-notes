/* viz-core.js — a tiny toolkit shared by every interactive diagram.
 *
 * A diagram file registers itself:
 *
 *   VIZ.register('bragg', {
 *     title: "Bragg's law",            // shown in the frame header
 *     kind: 'Interactive',              // 'Animation' | 'Interactive' | 'Calculator' | 'Step-through'
 *     mount(body, api) {                // body = empty <div class="viz-body">
 *       const svg = api.stage('0 0 640 360', body, 'Two X-rays reflecting off crystal planes');
 *       ...
 *       return { destroy() {} };        // optional; loops/listeners made through api are cleaned automatically
 *     }
 *   });
 *
 * The app calls VIZ.mount(hostElement, id) when a tab containing <div data-viz="id"> is shown,
 * and the returned handle's destroy() when the tab is left.
 */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const registry = Object.create(null);
  const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let uidCounter = 0;
  const injected = new Set();

  // Palette (single dark theme). Use these literals in SVG attributes.
  const C = {
    bg: '#151517', bg2: '#1b1b1e', surface: '#202024', surface2: '#27272c', line: '#2f2f35', line2: '#3a3a41',
    text: '#b3b3bb', dim: '#80808a', faint: '#5c5c66', white: '#f4f4f6',
    e: '#7cc0ff', cat: '#ffb56b', an: '#c7a4ff', hole: '#ff8da1', photon: '#ffe07a', heat: '#ff7b5c',
    good: '#86d4a9', warn: '#e9c46a', bad: '#f08c8c', metal: '#9aa0a8', graphite: '#5a5f66',
    glass: 'rgba(124,192,255,0.07)', water: 'rgba(124,192,255,0.12)'
  };

  function svg(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null) continue;
      if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else n.setAttribute(k, v);
    }
    if (parent) parent.appendChild(n);
    return n;
  }

  function el(tag, attrs, parent) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null) continue;
      if (k === 'text') n.textContent = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k === 'class') n.className = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    }
    if (parent) parent.appendChild(n);
    return n;
  }

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // Number formatting ---------------------------------------------------------
  function fmt(n, digits) {
    if (!isFinite(n)) return '—';
    const d = digits == null ? 2 : digits;
    return Number(n).toFixed(d).replace('-', '−');
  }
  // Scientific notation as HTML: sci(6e15, 2) -> "6.00 × 10<sup>15</sup>"
  function sci(n, digits) {
    if (!isFinite(n)) return '—';
    if (n === 0) return '0';
    const d = digits == null ? 2 : digits;
    const e = Math.floor(Math.log10(Math.abs(n)));
    const m = n / Math.pow(10, e);
    let ms = m.toFixed(d);
    let ee = e;
    if (Math.abs(parseFloat(ms)) >= 10) { ms = (m / 10).toFixed(d); ee = e + 1; }
    if (ee === 0) return ms.replace('-', '−');
    return ms.replace('-', '−') + ' × 10<sup>' + String(ee).replace('-', '−') + '</sup>';
  }

  // Approximate visible colour of a wavelength (380–780 nm) -> 'rgb(r,g,b)'
  function wavelengthToColor(nm, alpha) {
    let r = 0, g = 0, b = 0;
    if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
    else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
    else if (nm <= 780) { r = 1; }
    let f = 1;
    if (nm < 420) f = 0.3 + 0.7 * (nm - 380) / 40;
    else if (nm > 700) f = 0.3 + 0.7 * (780 - nm) / 80;
    if (nm < 380 || nm > 780) f = 0;
    const gam = (c) => Math.round(255 * Math.pow(c * f, 0.8));
    return alpha == null ? `rgb(${gam(r)},${gam(g)},${gam(b)})` : `rgba(${gam(r)},${gam(g)},${gam(b)},${alpha})`;
  }

  function css(key, text) {
    if (injected.has(key)) return;
    injected.add(key);
    const s = document.createElement('style');
    s.setAttribute('data-viz-css', key);
    s.textContent = text;
    document.head.appendChild(s);
  }

  function register(id, def) { registry[id] = def; }

  function mount(host, id) {
    const def = registry[id];
    host.innerHTML = '';
    host.classList.add('viz');
    if (!def) { host.classList.add('viz-missing'); return { destroy() {} }; }
    const head = el('div', { class: 'viz-head' }, host);
    el('span', { class: 'viz-kind', text: def.kind || 'Interactive' }, head);
    el('div', { class: 'viz-title', text: def.title || id }, head);
    const body = el('div', { class: 'viz-body' }, host);

    const cleanups = [];
    const loops = new Set();
    let visible = true;
    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((es) => { for (const e of es) visible = e.isIntersecting; }, { rootMargin: '120px' });
      io.observe(host);
    }

    const api = {
      id, C, reduced, svg, el, clamp, lerp, ease, fmt, sci, wavelengthToColor, css,

      uid(prefix) { return (prefix || 'vz') + '-' + id + '-' + (++uidCounter); },

      // Responsive SVG canvas. viewBox like '0 0 640 360'.
      stage(viewBox, parent, label) {
        const wrap = el('div', { class: 'viz-stage' }, parent || body);
        const s = svg('svg', { viewBox, class: 'viz-svg', role: 'img', 'aria-label': label || def.title || id, preserveAspectRatio: 'xMidYMid meet' }, wrap);
        return s;
      },

      // Arrowhead marker; returns 'url(#id)' for marker-end.
      arrow(svgRoot, color, size) {
        let defs = svgRoot.querySelector('defs') || svg('defs', null, svgRoot);
        const mid = api.uid('arr');
        const sz = size || 8;
        const m = svg('marker', { id: mid, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: sz, markerHeight: sz, orient: 'auto-start-reverse', markerUnits: 'userSpaceOnUse' }, defs);
        svg('path', { d: 'M0,0 L10,5 L0,10 z', fill: color || C.white }, m);
        return `url(#${mid})`;
      },

      // rAF loop: fn(dt seconds, t seconds). Pauses while off-screen or tab hidden. Returns {stop()}.
      loop(fn) {
        let raf = 0, last = 0, running = true;
        const tick = (ts) => {
          if (!running) return;
          if (visible && !document.hidden) {
            const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
            last = ts;
            try { fn(dt, ts / 1000); } catch (e) { console.error('viz loop ' + id, e); running = false; return; }
          } else last = 0;
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        const h = { stop() { running = false; cancelAnimationFrame(raf); loops.delete(h); } };
        loops.add(h);
        return h;
      },

      // One-shot tween over `dur` seconds: fn(eased 0..1). Resolves when done. Instant under reduced motion.
      tween(dur, fn, easing) {
        return new Promise((resolve) => {
          if (reduced || dur <= 0) { fn(1); resolve(); return; }
          let t = 0;
          const h = api.loop((dt) => {
            t += dt;
            const p = Math.min(1, t / dur);
            fn((easing || ease)(p));
            if (p >= 1) { h.stop(); resolve(); }
          });
        });
      },

      onDestroy(fn) { cleanups.push(fn); },
      listen(target, type, fn, opts) { target.addEventListener(type, fn, opts); cleanups.push(() => target.removeEventListener(type, fn, opts)); },
      timeout(fn, ms) { const t = setTimeout(fn, ms); cleanups.push(() => clearTimeout(t)); return t; },
      interval(fn, ms) { const t = setInterval(fn, ms); cleanups.push(() => clearInterval(t)); return t; },

      // ---- controls (styled by the app's CSS) ----
      controls(parent) { return el('div', { class: 'viz-controls' }, parent || body); },

      button(label, onClick, parent, opts) {
        const b = el('button', { type: 'button', class: 'vbtn' + (opts && opts.primary ? ' primary' : '') , html: label }, parent || body);
        b.addEventListener('click', onClick);
        return b;
      },

      // Segmented toggle. options: [{value, label}] ; returns {el, set(v), get()}
      segmented(options, value, onChange, parent) {
        const wrap = el('div', { class: 'vseg', role: 'group' }, parent || body);
        let cur = value;
        const btns = options.map((o) => {
          const b = el('button', { type: 'button', class: 'vseg-btn', html: o.label, 'aria-pressed': String(o.value === cur) }, wrap);
          b.addEventListener('click', () => { if (cur === o.value) return; set(o.value); onChange && onChange(o.value); });
          return { o, b };
        });
        function set(v) { cur = v; btns.forEach(({ o, b }) => { b.classList.toggle('on', o.value === v); b.setAttribute('aria-pressed', String(o.value === v)); }); }
        set(cur);
        return { el: wrap, set, get: () => cur };
      },

      // Range slider with label + live value. cfg: {label, min, max, step, value, format(v) -> string}
      slider(cfg, onInput, parent) {
        const wrap = el('label', { class: 'vslider' }, parent || body);
        const top = el('span', { class: 'vslider-top' }, wrap);
        el('span', { class: 'vslider-label', html: cfg.label || '' }, top);
        const val = el('span', { class: 'vslider-val' }, top);
        const input = el('input', { type: 'range', min: cfg.min, max: cfg.max, step: cfg.step == null ? 'any' : cfg.step, value: cfg.value }, wrap);
        const show = () => { const v = parseFloat(input.value); val.innerHTML = cfg.format ? cfg.format(v) : String(v); const p = (v - cfg.min) / (cfg.max - cfg.min) * 100; input.style.setProperty('--p', p + '%'); };
        input.addEventListener('input', () => { show(); onInput && onInput(parseFloat(input.value)); });
        show();
        return { el: wrap, input, set(v) { input.value = v; show(); }, get: () => parseFloat(input.value) };
      },

      // Number field. cfg: {label, value, step, min, max, unit}
      number(cfg, onInput, parent) {
        const wrap = el('label', { class: 'vnum' }, parent || body);
        el('span', { class: 'vnum-label', html: cfg.label || '' }, wrap);
        const row = el('span', { class: 'vnum-row' }, wrap);
        const input = el('input', { type: 'number', value: cfg.value, step: cfg.step == null ? 'any' : cfg.step, min: cfg.min, max: cfg.max, inputmode: 'decimal' }, row);
        if (cfg.unit) el('span', { class: 'vnum-unit', html: cfg.unit }, row);
        input.addEventListener('input', () => { const v = parseFloat(input.value); if (isFinite(v)) onInput && onInput(v); });
        return { el: wrap, input, set(v) { input.value = v; }, get: () => parseFloat(input.value) };
      },

      // Select dropdown. options: [{value,label}]
      select(cfg, onChange, parent) {
        const wrap = el('label', { class: 'vnum' }, parent || body);
        el('span', { class: 'vnum-label', html: cfg.label || '' }, wrap);
        const s = el('select', { class: 'vselect' }, wrap);
        cfg.options.forEach((o) => { const op = el('option', { value: o.value, text: o.label }, s); if (o.value === cfg.value) op.selected = true; });
        s.addEventListener('change', () => onChange && onChange(s.value));
        return { el: wrap, input: s, set(v) { s.value = v; }, get: () => s.value };
      },

      readouts(parent) { return el('div', { class: 'viz-readouts' }, parent || body); },
      // A label/value tile. returns {el, set(html)}
      readout(label, parent, initial) {
        const r = el('div', { class: 'vro' }, parent || body);
        el('span', { class: 'vro-label', html: label }, r);
        const v = el('span', { class: 'vro-val', html: initial == null ? '—' : initial }, r);
        return { el: r, set(html) { v.innerHTML = html; } };
      },

      caption(html, parent) {
        const p = el('p', { class: 'viz-caption', html: html || '' }, parent || body);
        return { el: p, set(h) { p.innerHTML = h; } };
      },

      // Step indicator dots for step-through diagrams. returns {el, set(i)}
      stepper(count, onPick, parent) {
        const wrap = el('div', { class: 'viz-steps' }, parent || body);
        const dots = [];
        for (let i = 0; i < count; i++) {
          const d = el('button', { type: 'button', class: 'viz-dot', 'aria-label': 'Step ' + (i + 1), text: String(i + 1) }, wrap);
          d.addEventListener('click', () => onPick && onPick(i));
          dots.push(d);
        }
        return { el: wrap, set(i) { dots.forEach((d, j) => { d.classList.toggle('on', j === i); d.classList.toggle('done', j < i); }); } };
      }
    };

    let inst = null;
    try { inst = def.mount(body, api) || null; }
    catch (e) { console.error('viz ' + id, e); body.innerHTML = '<p class="viz-error">This diagram failed to load.</p>'; }

    return {
      destroy() {
        loops.forEach((l) => l.stop());
        cleanups.forEach((f) => { try { f(); } catch (e) { /* ignore */ } });
        if (io) io.disconnect();
        if (inst && typeof inst.destroy === 'function') { try { inst.destroy(); } catch (e) { /* ignore */ } }
        host.innerHTML = '';
      }
    };
  }

  window.VIZ = { register, mount, has: (id) => !!registry[id], list: () => Object.keys(registry), C, reduced, def: (id) => registry[id] };
})();
