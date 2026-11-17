/* BAPHY105 Notes — app shell. Vanilla JS, no build step. Started by gate.js once the notes are unlocked. */
window.__startApp = function () {
  'use strict';
  const D = window.DATA || { chunks: [], questions: [], summaries: {}, figs: {} };
  const reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  // ================================================================ helpers
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  function h(tag, attrs) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
    for (let i = 2; i < arguments.length; i++) {
      const kids = [].concat(arguments[i]);
      for (const c of kids) { if (c == null || c === false) continue; el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); }
    }
    return el;
  }
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rt = (s) => esc(s).replace(/&lt;(\/?)(sub|sup|em|b)&gt;/g, '<$1$2>');
  const tmpDiv = document.createElement('div');
  function plain(html) { tmpDiv.innerHTML = html || ''; return (tmpDiv.textContent || '').replace(/\s+/g, ' ').trim(); }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const typing = (e) => { const t = e.target; return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable); };

  const P = {
    side: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    right: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    left: '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M9.5 2.5h5"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
    cards: '<rect x="3" y="7" width="13" height="13" rx="2"/><path d="M7.5 3.5H18a2.5 2.5 0 0 1 2.5 2.5v10.5"/>',
    q: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"/><path d="M12 17.2v.1"/>',
    quiz: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="m3.5 6 1.5 1.5L7.5 5M3.5 12l1.5 1.5 2.5-2.5M3.5 18l1.5 1.5 2.5-2.5"/>',
    sigma: '<path d="M18 5H6l6 7-6 7h12"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7.5 15h9"/>',
    pen: '<path d="m4 20 4-1 11-11-3-3L5 16z"/><path d="m14 7 3 3"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    shuffle: '<path d="M3 7h3c4 0 6 10 10 10h5"/><path d="M3 17h3c1.6 0 2.8-1.6 3.9-3.6M13 9.6C14 7.8 15.1 7 16 7h5"/><path d="m18 4 3 3-3 3M18 14l3 3-3 3"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
    keys: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M7.5 14h9"/>',
    db: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    zoom: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z"/>',
    exam: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
    warn: '<path d="M12 4 2.5 20h19z"/><path d="M12 10v4M12 17v.1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.1"/>',
    ex: '<path d="M4 6h16M4 12h10M4 18h7"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
    play: '<path d="M7 5v14l11-7z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
    flag: '<path d="M5 21V4h11l-1.5 4L16 12H5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    download: '<path d="M12 4v11"/><path d="m7 10.5 5 5 5-5"/><path d="M5 20h14"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    fire: '<path d="M12 3c.5 3.2 4.5 5.2 4.5 10a4.5 4.5 0 0 1-9 0c0-2 .9-3.3 1.8-4.3.2 1.5 1 2.4 1.9 2.8C10.6 9 11.2 5.6 12 3z"/>',
    swords: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6M16 16l4 4M19 21l2-2"/><path d="M14.5 6.5 18 3h3v3l-3.5 3.5"/><path d="m5 14 4 4M7 17l-3 3M3 19l2 2"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6"/><path d="M12 17.2v.1"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><rect x="3.5" y="4.5" width="3" height="3" rx=".6"/><rect x="3.5" y="10.5" width="3" height="3" rx=".6"/><rect x="3.5" y="16.5" width="3" height="3" rx=".6"/>',
    guide: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z"/><path d="M12 6.5v13"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4"/>',
  };
  const icon = (n, cls) => `<svg class="i${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;

  // ================================================================ store
  const KEY = 'baphy105-notes:v1';
  function blank() { return { visited: {}, done: {}, tags: {}, notes: {}, hl: {}, q: {}, cards: {}, confusing: {}, study: {}, syl: {}, resets: {}, last: null, ui: { closed: {}, lastTab: {} } }; }
  function normalize(s) {
    const b = blank();
    if (!s || typeof s !== 'object') return b;
    for (const k in b) if (s[k] && typeof s[k] === typeof b[k]) b[k] = s[k];
    b.ui.closed = b.ui.closed || {}; b.ui.lastTab = b.ui.lastTab || {};
    return b;
  }
  let S = (function () { try { const raw = localStorage.getItem(KEY); if (raw) return normalize(JSON.parse(raw)); } catch (e) { /* storage blocked */ } return blank(); })();
  let saveTimer = 0;
  const inbox = { messages: [], unread: 0 }; // the owner's replies (Messages in the sidebar), filled by loadInbox()
  function save() { clearTimeout(saveTimer); saveTimer = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } syncSoon(); }, 120); }

  // ================================================================ model
  // Modules come from content/modules.json (built into js/modules.js). Add a module there, not here.
  const MODULES = (window.MODULES_CONFIG || []).map((m) => Object.assign({}, m));
  const MOD = {};
  MODULES.forEach((m) => { MOD[m.id] = m; m.topics = []; });
  const TOPICS = [], TOPIC = {}, FIGS = {};
  const chunkOrder = {};
  MODULES.forEach((m) => m.chunks.forEach((c, i) => { chunkOrder[c] = { m: m.id, i }; }));
  const chunks = D.chunks.slice().sort((a, b) => {
    const oa = chunkOrder[a.chunk], ob = chunkOrder[b.chunk];
    const ma = MODULES.findIndex((m) => m.id === (oa ? oa.m : a.module)), mb = MODULES.findIndex((m) => m.id === (ob ? ob.m : b.module));
    return ma - mb || (oa ? oa.i : 99) - (ob ? ob.i : 99) || String(a.chunk).localeCompare(String(b.chunk));
  });
  chunks.forEach((ch) => {
    const m = MOD[ch.module];
    if (!m) return;
    (ch.topics || []).forEach((t) => {
      if (TOPIC[t.id]) return;
      t.module = m.id; t.idx = TOPICS.length; t.tabs = t.tabs || [];
      TOPICS.push(t); TOPIC[t.id] = t; m.topics.push(t);
    });
    (ch.figures || []).forEach((f) => { FIGS[f.id] = f; });
  });
  // VTOP syllabus rows (owner, 16-11-2026): each module lists VTOP's "Course Syllabus Modules" rows in VTOP's order,
  // with the topics that teach each row under it. ROW maps a topic id to its row; topics follow row order.
  const ROW = {};
  MODULES.forEach((m) => (m.syllabusRows || []).forEach((r) => r.topics.forEach((id) => { ROW[id] = r; })));
  MODULES.forEach((m) => { if (!(m.syllabusRows || []).length) return; const pos = {}; m.syllabusRows.forEach((r, i) => r.topics.forEach((id, j) => { pos[id] = i * 100 + j; })); m.topics.sort((a, b) => (pos[a.id] ?? 1e6) - (pos[b.id] ?? 1e6)); });
  TOPICS.length = 0; MODULES.forEach((m) => m.topics.forEach((t) => { t.idx = TOPICS.length; TOPICS.push(t); }));
  const rowHead = (m, t, i, cls) => { const r = ROW[t.id]; return r && (i === 0 || ROW[m.topics[i - 1].id] !== r) ? `<div class="${cls}"><span class="row-n">${esc(r.n)}</span>${esc(r.text)}</div>` : ''; };
  // Free/Pro (owner, 30-09-2026): the notes are free; Pro users also get the Pro companions (every flashcard, the
  // formulas and one-liners of each topic, the answers to every question, the interactive widgets).
  const PRO = !!window.PRO;
  TOPICS.forEach((t) => {
    const p = (D.pro || {})[t.id];
    if (p) { t.flashcards = p.flashcards; t.formulas = p.formulas; t.oneLiners = p.oneLiners; }
    t.formulas = t.formulas || []; t.oneLiners = t.oneLiners || []; t.flashcards = t.flashcards || [];
    if (t.cardCount == null) t.cardCount = t.flashcards.length;
  });
  const SUM = D.summaries || {};
  // Modules whose files were not loaded (not paid, or not in a single-module grant) show as locked.
  MODULES.forEach((m) => { m.locked = !!window.APP_LOCKED && !m.free && !m.topics.length; });

  // reading order: m2 topics, m2 summary, m3 topics, ...
  const ORDER = [];
  MODULES.forEach((m) => { m.topics.forEach((t) => ORDER.push({ key: t.id, title: t.title, kind: 'topic' })); if (m.topics.length) ORDER.push({ key: m.id + '-summary', title: `Module ${+m.num} summary`, kind: 'summary' }); });
  const orderIdx = (key) => ORDER.findIndex((o) => o.key === key);

  // questions
  const QS = [], QBY = {};
  const seenQ = new Set();
  function addQ(q) { if (!q || !q.id || seenQ.has(q.id)) return; seenQ.add(q.id); QS.push(q); }
  D.questions.forEach(addQ);
  Object.keys(SUM).forEach((mid) => (SUM[mid].questions || []).forEach((q) => { q.module = q.module || mid; q.topic = 'summary'; addQ(q); }));
  QS.forEach((q) => { const a = (D.qa || {})[q.id]; if (a) Object.assign(q, a); }); // answers: Pro only
  const modIndex = (mid) => { const i = MODULES.findIndex((m) => m.id === mid); return i < 0 ? 9 : i; };
  function qGroupKey(q) { return q.topic === 'mixed' ? 'mixed' : q.module; }
  function qSort(q) {
    if (q.topic === 'mixed') return 90000 + QS.indexOf(q);
    const t = TOPIC[q.topic];
    return modIndex(q.module) * 10000 + (t ? t.idx * 10 : 9000) + 0;
  }
  QS.sort((a, b) => qSort(a) - qSort(b) || String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
  QS.forEach((q) => { (QBY[q.topic] = QBY[q.topic] || []).push(q); });
  const QID = {}; QS.forEach((q) => { QID[q.id] = q; });

  // flashcards
  const CARDS = [];
  TOPICS.forEach((t) => (t.flashcards || []).forEach((c, i) => CARDS.push({ key: t.id + '#' + i, topic: t.id, module: t.module, front: c.front, back: c.back })));

  // where each interactive diagram lives
  const VIZ_AT = {};
  TOPICS.forEach((t) => t.tabs.forEach((tb, i) => { (tb.html || '').replace(/data-viz="([a-z0-9-]+)"/g, (_, id) => { if (!VIZ_AT[id]) VIZ_AT[id] = { topic: t.id, tab: i }; return _; }); }));
  const vizModule = (id) => (VIZ_AT[id] && TOPIC[VIZ_AT[id].topic] ? TOPIC[VIZ_AT[id].topic].module : null);
  const vizOrder = (id) => (VIZ_AT[id] ? TOPIC[VIZ_AT[id].topic].idx * 100 + VIZ_AT[id].tab : 1e9);
  const hasViz = (id) => !!(window.VIZ && window.VIZ.has(id));
  const allViz = () => (window.VIZ ? window.VIZ.list() : []).filter((id) => vizModule(id)).sort((a, b) => vizOrder(a) - vizOrder(b));

  // progress helpers
  const visited = (id) => S.visited[id] || [];
  const isDone = (id) => !!S.done[id];
  function frac(t) { if (isDone(t.id)) return 1; return t.tabs.length ? clamp(visited(t.id).length / t.tabs.length, 0, 1) : 0; }
  const doneIn = (list) => list.filter((t) => isDone(t.id)).length;
  function markVisited(t, i) {
    const v = S.visited[t.id] || (S.visited[t.id] = []);
    if (!v.includes(i)) v.push(i);
    S.ui.lastTab[t.id] = i;
    let completed = false;
    if (!isDone(t.id) && v.length >= t.tabs.length) { S.done[t.id] = true; completed = true; }
    save();
    return completed;
  }
  // Clears one module's progress in a saved copy X: topic and summary ticks, question and quiz results, known flashcards,
  // "confusing" flags. Notes, highlights, tags, study time and syllabus ticks are the student's own and stay.
  function wipeModule(X, mid) {
    const m = MOD[mid]; if (!m) return;
    const keys = m.topics.map((t) => t.id).concat(mid + '-summary');
    keys.forEach((k) => { delete X.visited[k]; delete X.done[k]; delete X.confusing[k]; if (X.ui && X.ui.lastTab) delete X.ui.lastTab[k]; });
    QS.forEach((q) => { if (q.module === mid) delete X.q[q.id]; });
    CARDS.forEach((c) => { if (c.module === mid) delete X.cards[c.key]; });
    if (X.last && X.last.hash && keys.some((k) => X.last.hash === '#' + k || String(X.last.hash).indexOf('#' + k + '.') === 0)) X.last = null;
  }
  function resetModule(mid) {
    wipeModule(S, mid);
    S.resets[mid] = Date.now(); // lets the other devices and the saved copy follow the reset instead of undoing it
    save();
  }
  // every "Reset progress" button (home page, module page) carries its module id in data-reset-mod
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-reset-mod]'); const m = b && MOD[b.getAttribute('data-reset-mod')];
    if (!m) return;
    if (!confirm(`Reset your progress in Module ${+m.num}?\n\nThis clears its topic ticks, question and quiz results, known flashcards and "confusing" flags, so you can start the module again. Your notes, highlights, tags and study time stay.`)) return;
    resetModule(m.id);
    if (window.SIGNED_IN_AS && syncOn) { syncDirty = true; syncPush(); }
    refreshAll();
    toast(`Module ${+m.num} progress reset`, 'trash');
  });

  // ================================================================ shell
  const app = h('div', { class: 'app' + (S.ui.sbCollapsed ? ' sb-collapsed' : '') });
  const sidebar = h('aside', { class: 'sidebar', 'aria-label': 'Contents' });
  const scrim = h('div', { class: 'scrim', onclick: () => closeDrawer() });
  const main = h('main', { class: 'main', id: 'main' });
  // whichever box actually scrolls the page: <main> when it has its own scrollbar, otherwise the window
  const pageScroller = () => (main.scrollHeight > main.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(main).overflowY) ? main : (document.scrollingElement || document.documentElement));
  const topbar = h('header', { class: 'topbar' });
  const host = h('div', { class: 'view-host' });
  main.append(topbar, host);
  // owner's announcement (set on /admin, delivered with /api/session); each message can be closed once
  const B = window.SITE_BANNER;
  let bannerClosed = ''; try { bannerClosed = localStorage.getItem('bn_banner_x') || ''; } catch (e) { /* ignore */ }
  if (B && B.text && B.id !== bannerClosed) {
    const bar = h('div', { class: 'site-banner', role: 'status' });
    bar.innerHTML = `<span>${esc(B.text)}</span><button class="icon-btn" aria-label="Close announcement">${icon('x')}</button>`;
    bar.querySelector('button').addEventListener('click', () => { bar.remove(); try { localStorage.setItem('bn_banner_x', B.id); } catch (e) { /* ignore */ } });
    main.insertBefore(bar, host);
  }
  // a ₹0 temporary offer from the owner: every module is free until it ends (closable once per offer)
  const FO = window.FREE_OFFER;
  let offerClosed = ''; try { offerClosed = localStorage.getItem('bn_offer_x') || ''; } catch (e) { /* ignore */ }
  if (FO && String(FO.until) !== offerClosed) {
    const bar = h('div', { class: 'site-banner offer-free', role: 'status' });
    bar.innerHTML = `<span><b class="offer-tag">FREE</b> <s>₹${esc(FO.was)}</s> Every Pro feature is free until ${esc(FO.ends)} IST.${FO.text ? ' ' + esc(FO.text) : ''}</span><button class="icon-btn" aria-label="Close">${icon('x')}</button>`;
    bar.querySelector('button').addEventListener('click', () => { bar.remove(); try { localStorage.setItem('bn_offer_x', String(FO.until)); } catch (e) { /* ignore */ } });
    main.insertBefore(bar, host);
  }
  const PRICE_RS = window.PRICE_RS || 20;
  app.append(sidebar, scrim, main);
  const toasts = h('div', { class: 'toasts', 'aria-live': 'polite' });
  const mountPoint = document.getElementById('app') || document.body;
  mountPoint.appendChild(app);
  document.body.appendChild(toasts);
  if (S.ui.recall) document.body.classList.add('recall');
  document.documentElement.dataset.mode = S.ui.theme === 'light' ? 'light' : 'dark';

  function toast(msg, ico, ms) {
    const t = h('div', { class: 'toast', html: (ico ? icon(ico) : '') + esc(msg) });
    toasts.appendChild(t);
    setTimeout(() => t.remove(), ms || 2700);
  }

  // ---------------------------------------------------------------- sidebar
  const narrow = () => window.matchMedia('(max-width: 960px)').matches;
  function toggleSidebar(force) {
    if (narrow()) { app.classList.toggle('sb-open', force == null ? !app.classList.contains('sb-open') : force); return; }
    const collapsed = force == null ? !app.classList.contains('sb-collapsed') : !force;
    app.classList.toggle('sb-collapsed', collapsed);
    S.ui.sbCollapsed = collapsed; save();
  }
  function closeDrawer() { app.classList.remove('sb-open'); }

  // ---------------------------------------------------------------- study music (Spotify's embedded player)
  // A quiet strip at the bottom of the sidebar: collapsed to one row until opened; the player (Spotify's own embed,
  // no account or approval needed, full songs for people signed in to Spotify, previews otherwise) loads only when a
  // student picks a playlist. A tiny equaliser moves while music plays (still under reduced motion).
  const MUSIC = [['37i9dQZF1DWWQRwui0ExPn', 'lofi beats'], ['37i9dQZF1DX4sWSpwq3LiO', 'Peaceful Piano'], ['37i9dQZF1DWZeKCadgRdKQ', 'Deep Focus'],
    ['37i9dQZF1DX9sIqqvKsjG8', 'Instrumental Study'], ['37i9dQZF1DX8NTLI2TtZa6', 'Intense Studying'], ['37i9dQZF1DXc8kgYqQLMfH', 'slow living']];
  const musicDock = h('div', { class: 'music-dock' });
  const music = { ctrl: null, playing: false, loading: false };
  const mState = () => S.ui.music || (S.ui.music = { open: false, ref: null, label: '' });
  function spotifyRef(txt) {
    const m = String(txt || '').trim().match(/(?:open\.spotify\.com\/(?:intl-[a-z-]+\/)?|spotify:)(playlist|album|track|artist|episode|show)[/:]([A-Za-z0-9]{10,40})/);
    return m ? m[1] + '/' + m[2] : null;
  }
  function paintMusic() {
    if (!PRO) { if (!musicDock.firstChild) musicDock.innerHTML = `<div class="music-top"><a class="music-row" href="#pro" data-from="music"><span class="m-eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="music-lbl">Study music</span><span class="pro-tag">Pro</span></a></div>`; return; }
    const st = mState();
    musicDock.classList.toggle('open', !!st.open);
    musicDock.classList.toggle('playing', music.playing);
    if (!musicDock.querySelector('.music-row')) {
      musicDock.innerHTML = `<div class="music-top"><button class="music-row" data-m="toggle" aria-expanded="false"><span class="m-eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="music-lbl">Study music</span><span class="music-now"></span>${icon('chev', 'sb-chev')}</button><button class="music-ctl" data-m="pp" hidden></button><button class="music-ctl" data-m="stop" title="Stop the music" aria-label="Stop the music" hidden><span class="m-stop"></span></button></div>
        <div class="music-body" hidden>
          <div class="music-chips">${MUSIC.map(([id, n]) => `<button class="music-chip" data-m="pick" data-ref="playlist/${id}" data-label="${esc(n)}">${esc(n)}</button>`).join('')}</div>
          <form class="music-paste" data-m="paste"><input type="url" inputmode="url" placeholder="Paste a Spotify link" aria-label="Spotify playlist, album or song link"><button class="btn small" type="submit">Play</button></form>
          <p class="music-msg" data-mmsg></p>
          <div class="music-player"><div data-mslot></div></div>
          <p class="music-hint">Tap <b>▶</b> in the player to start. No sound? <a data-mopen target="_blank" rel="noopener">Open in Spotify ↗</a></p>
          <p class="music-note">Spotify's own player. Signed in to Spotify in this browser: full songs. Otherwise 30-second previews.</p>
        </div>`;
    }
    $('.music-row', musicDock).setAttribute('aria-expanded', String(!!st.open));
    $('.music-body', musicDock).hidden = !st.open;
    $('.music-now', musicDock).textContent = st.label ? '· ' + st.label : '';
    $$('.music-chip', musicDock).forEach((b) => b.classList.toggle('on', b.dataset.ref === st.ref));
    const op = $('[data-mopen]', musicDock); if (op) { op.href = 'https://open.spotify.com/' + (st.ref || 'playlist/' + MUSIC[0][0]); }
    const hint = $('.music-hint', musicDock); if (hint) hint.hidden = !st.ref;
    // our own pause and stop buttons stay in the top row (also when the strip is folded), so sound can always be stopped
    const pp = $('[data-m=pp]', musicDock), stop = $('[data-m=stop]', musicDock);
    pp.hidden = !music.playing; stop.hidden = !music.ctrl;
    pp.textContent = '❚❚'; pp.title = 'Pause'; pp.setAttribute('aria-label', 'Pause');
  }
  function playMusic(ref, label) {
    const auto = false; // browsers block sound the site starts itself: the student taps ▶ in Spotify's player
    const st = mState(); st.ref = ref; st.label = label; save(); paintMusic();
    const uri = 'spotify:' + ref.replace('/', ':');
    if (music.ctrl) { music.ctrl.loadUri(uri); if (auto) music.ctrl.play(); return; }
    if (music.loading) return;
    music.loading = true;
    const start = (API) => {
      const slot = $('[data-mslot]', musicDock);
      API.createController(slot, { uri, width: '100%', height: 152 }, (ctrl) => {
        music.ctrl = ctrl; music.loading = false; paintMusic();
        ctrl.addListener('playback_update', (e) => { const p = !!(e && e.data && !e.data.isPaused); if (p !== music.playing) { music.playing = p; paintMusic(); } });
        if (auto) ctrl.addListener('ready', () => { try { ctrl.play(); } catch (err) { /* the student taps play */ } });
      });
    };
    if (window.__spotifyAPI) return start(window.__spotifyAPI);
    window.onSpotifyIframeApiReady = (API) => { window.__spotifyAPI = API; start(API); };
    const s = document.createElement('script'); s.src = 'https://open.spotify.com/embed/iframe-api/v1'; s.async = true;
    s.onerror = () => { music.loading = false; const m = $('[data-mmsg]', musicDock); if (m) m.textContent = 'Spotify could not load. Check your connection or ad blocker.'; };
    document.head.appendChild(s);
  }
  function stopMusic() {
    const c = music.ctrl; music.ctrl = null; music.playing = false; music.loading = false;
    try { c.pause(); } catch (err) { /* already gone */ }
    try { c.destroy(); } catch (err) { /* removed below */ }
    const box = $('.music-player', musicDock); box.innerHTML = '<div data-mslot></div>';
    const st = mState(); st.ref = null; st.label = ''; save(); paintMusic();
  }
  musicDock.addEventListener('click', (e) => {
    const t = e.target.closest('[data-m]'); if (!t) return;
    if (t.dataset.m === 'pp' && music.ctrl) { music.ctrl.pause(); return; }
    if (t.dataset.m === 'stop' && music.ctrl) { stopMusic(); return; }
    if (t.dataset.m === 'toggle') { const st = mState(); st.open = !st.open; save(); paintMusic(); if (st.open && st.ref && !music.ctrl) playMusic(st.ref, st.label); }
    else if (t.dataset.m === 'pick') playMusic(t.dataset.ref, t.dataset.label);
  });
  musicDock.addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = $('.music-paste input', musicDock), ref = spotifyRef(inp.value), m = $('[data-mmsg]', musicDock);
    if (!ref) { m.textContent = 'That is not a Spotify link. Copy it from Spotify: Share → Copy link.'; return; }
    m.textContent = ''; inp.value = ''; playMusic(ref, ref.split('/')[0] === 'playlist' ? 'Your playlist' : 'Your pick');
  });

  function buildSidebar() {
    const nQ = QS.length;
    const inner = h('div', { class: 'sb-inner' });
    inner.innerHTML = `
      <div class="sb-head">
        <a class="brand" href="#home"><span class="brand-code">BAPHY105</span><span class="brand-title">Engineering Physics</span></a>
        <button class="icon-btn" data-act="sidebar" title="Collapse sidebar ( [ )" aria-label="Collapse sidebar">${icon('side')}</button>
      </div>
      <button class="sb-search" data-act="search">${icon('search')}<span>Search notes</span><kbd>${isMac ? '⌘' : 'Ctrl'} K</kbd></button>
      <nav class="sb-nav">
        <a class="sb-link sb-guide" href="#guide" data-key="guide">${icon('guide')}<span>HOW TO USE</span></a>
        <a class="sb-link" href="#home" data-key="home">${icon('home')}<span>Home</span></a>
        ${MODULES.filter((m) => m.topics.length).map((m) => `
          <div class="sb-group${S.ui.closed[m.id] ? ' closed' : ''}" data-group="${m.id}">
            <button class="sb-group-head" data-act="group" data-g="${m.id}" aria-expanded="${!S.ui.closed[m.id]}">
              <span class="sb-num">${m.num}</span><span class="sb-gtitle">${esc(m.title)}</span>
              <span class="sb-gcount" data-count="${m.id}"></span>${icon('chev', 'sb-chev')}
            </button>
            <div class="sb-items"><div>
              ${m.topics.map((t, i) => rowHead(m, t, i, 'sb-row') + `<a class="sb-topic" href="#${t.id}" data-key="${t.id}"><span class="tick" data-tick="${t.id}"></span><span class="lbl">${rt(t.short || t.title)}</span><button class="tag-dot" data-act="tag" data-t="${t.id}" title="Colour tag" aria-label="Colour tag for ${rt(t.short || t.title)}"></button></a>`).join('')}
              <a class="sb-topic summary" href="#${m.id}-summary" data-key="${m.id}-summary">${icon('book')}<span class="lbl">Module summary</span></a>
            </div></div>
          </div>`).join('')}
        ${MODULES.filter((m) => m.locked).map((m) => `
          <div class="sb-group locked"><a class="sb-group-head" href="#unlock" title="Unlock for ₹${PRICE_RS}">
            <span class="sb-num">${m.num}</span><span class="sb-gtitle">${esc(m.title)}</span><span class="sb-gcount">${icon('lock')}</span>
          </a></div>`).join('')}
        <div class="sb-label">Practice</div>
        <div class="sb-group${S.ui.closed.qbank !== false ? ' closed' : ''}" data-group="qbank">
          <button class="sb-group-head" data-act="group" data-g="qbank" aria-expanded="${S.ui.closed.qbank === false}">
            ${icon('q')}<span class="sb-gtitle">Question bank</span><span class="sb-gcount">${nQ}</span>${icon('chev', 'sb-chev')}
          </button>
          <div class="sb-items"><div>
            <a class="sb-topic" href="#questions" data-key="questions"><span class="lbl">All questions & answers</span><span class="count">${nQ}</span></a>
            ${MODULES.filter((m) => m.topics.length).map((m) => {
              const mq = QS.filter((q) => q.module === m.id && q.topic !== 'mixed');
              return `<a class="sb-topic" href="#questions.${m.id}" data-key="questions.${m.id}"><span class="lbl">Module ${+m.num} · ${esc(m.title)}</span><span class="count">${mq.length}</span></a>` +
                m.topics.map((t) => `<a class="sb-topic sub" href="#questions.${t.id}" data-key="questions.${t.id}"><span class="lbl">${rt(t.short || t.title)}</span><span class="count">${(QBY[t.id] || []).length}</span></a>`).join('') +
                ((QBY.summary || []).some((q) => q.module === m.id) ? `<a class="sb-topic sub" href="#questions.${m.id}-summary" data-key="questions.${m.id}-summary"><span class="lbl">Across the module</span><span class="count">${QS.filter((q) => q.topic === 'summary' && q.module === m.id).length}</span></a>` : '');
            }).join('')}
            ${(QBY.mixed || []).length ? `<a class="sb-topic" href="#questions.mixed" data-key="questions.mixed"><span class="lbl">Mixed: across modules</span><span class="count">${QBY.mixed.length}</span></a>` : ''}
          </div></div>
        </div>
        <a class="sb-link" href="#quiz" data-key="quiz">${icon('quiz')}<span>Quiz</span>${PRO ? '' : '<span class="pro-tag">Pro</span>'}</a>
        <a class="sb-link" href="#cards" data-key="cards">${icon('cards')}<span>Flashcards</span><span class="count">${CARDS.length}</span></a>
        <a class="sb-link" href="#formulas" data-key="formulas">${icon('sigma')}<span>Formula sheet</span>${PRO ? '' : '<span class="pro-tag">Pro</span>'}</a>
        <a class="sb-link" href="#lab" data-key="lab">${icon('flask')}<span>Lab bench</span>${PRO ? '<span class="count" data-labcount></span>' : '<span class="pro-tag">Pro</span>'}</a>
        <a class="sb-link" href="#mine" data-key="mine">${icon('pen')}<span>Highlights & notes</span>${PRO ? '' : '<span class="pro-tag">Pro</span>'}</a>
        <a class="sb-link" href="#battle" data-key="battle">${icon('swords')}<span>1v1 Quiz battle</span></a>
        <div class="sb-label">Exams</div>
        <a class="sb-link" href="#syllabus.cat1" data-key="syllabus.cat1">${icon('list')}<span>CAT-1 syllabus</span></a>
        <a class="sb-link" href="#syllabus.cat2" data-key="syllabus.cat2">${icon('list')}<span>CAT-2 syllabus</span></a>
        <a class="sb-link" href="#syllabus.fat" data-key="syllabus.fat">${icon('list')}<span>FAT syllabus</span></a>
        <a class="sb-link" href="#syllabus.full" data-key="syllabus.full">${icon('list')}<span>Syllabus checklist</span><span class="count" data-sylcount></span></a>
        ${(D.paperIndex || D.papers || []).length ? `<a class="sb-link" href="#papers" data-key="papers">${icon('exam')}<span>Question papers</span></a>` : ''}
        <a class="sb-link" href="#mock" data-key="mock">${icon('timer')}<span>Timed mock CAT</span>${PRO ? '' : '<span class="pro-tag">Pro</span>'}</a>
        <a class="sb-link" href="#mock.fat" data-key="mock.fat">${icon('timer')}<span>Timed mock FAT</span>${PRO ? '' : '<span class="pro-tag">Pro</span>'}</a>
        <a class="sb-link" href="#revise" data-key="revise">${icon('fire')}<span>Revision pack</span>${PRO ? '' : '<span class="pro-tag">Pro</span>'}</a>
        ${PRO && !window.FREE_SITE ? '' : `<a class="sb-link sb-pro" href="#pro" data-key="pro">${icon('trophy')}<span>${window.FREE_SITE ? 'Pro (free right now)' : 'Why go Pro'}</span></a>`}
        <div class="sb-label">Talk to us</div>
        <button class="sb-link" data-act="ideas">${icon('bulb')}<span>Any ideas?</span></button>
        <button class="sb-link" data-act="help">${icon('help')}<span>Help?</span></button>
        ${window.SIGNED_IN_AS ? `<button class="sb-link" data-act="messages">${icon('mail')}<span>Messages</span><span class="badge-new" data-unread${inbox.unread ? '' : ' hidden'}>${inbox.unread || ''}</span></button>` : ''}
      </nav>
      <div class="sb-foot">
        <button data-act="keys">${icon('keys')}Shortcuts</button>
        <button data-act="backup">${icon('db')}Backup</button>
        <button data-act="theme" data-label>${themeLabel()}</button>
        ${window.SIGNED_IN_AS ? `<button data-act="devices" title="Request a device reset">${icon('phone')}Devices</button><button data-act="signout" title="Signed in as ${esc(window.SIGNED_IN_AS)}">${icon('x')}Sign out</button>` : ''}
      </div>`;
    // the study-music strip lives outside .sb-inner, so rebuilding the sidebar never restarts the music
    const old = $('.sb-inner', sidebar); if (old) old.remove();
    sidebar.insertBefore(inner, musicDock.parentNode === sidebar ? musicDock : null);
    if (musicDock.parentNode !== sidebar) { sidebar.appendChild(musicDock); paintMusic(); }
    updateSidebar();
  }
  function updateSidebar() {
    $$('[data-tick]', sidebar).forEach((el) => {
      const t = TOPIC[el.dataset.tick];
      const f = frac(t);
      el.style.setProperty('--p', Math.round(f * 100) + '%');
      el.classList.toggle('done', isDone(t.id));
    });
    MODULES.forEach((m) => { const c = $(`[data-count="${m.id}"]`, sidebar); if (c) c.textContent = `${doneIn(m.topics)}/${m.topics.length}`; });
    $$('.tag-dot', sidebar).forEach((b) => { const v = S.tags[b.dataset.t]; if (v) b.dataset.tag = v; else b.removeAttribute('data-tag'); });
    const lc = $('[data-labcount]', sidebar); if (lc) lc.textContent = allViz().length || '';
    const sc = $('[data-sylcount]', sidebar); if (sc) { const it = sylItems('full'); sc.textContent = it.length ? `${it.filter((x) => S.syl['full:' + x.id]).length}/${it.length}` : ''; }
  }
  function setActive(key) {
    $$('a', bnav).forEach((a) => a.classList.toggle('on', a.dataset.key === key || (key && a.dataset.key === 'home' && (TOPIC[key] || /summary|^m[0-9]+$/.test(key)))));
    $$('.sb-link, .sb-topic', sidebar).forEach((a) => a.classList.toggle('active', a.dataset.key === key));
    const act = $(`[data-key="${key}"]`, sidebar);
    if (act) {
      const g = act.closest('.sb-group');
      if (g && g.classList.contains('closed')) { g.classList.remove('closed'); S.ui.closed[g.dataset.group] = false; }
      const nav = $('.sb-nav', sidebar);
      const r = act.getBoundingClientRect(), nr = nav.getBoundingClientRect();
      if (r.top < nr.top + 40 || r.bottom > nr.bottom - 40) nav.scrollTo({ top: act.offsetTop - nav.clientHeight / 2, behavior: reduced ? 'auto' : 'smooth' });
    }
  }
  function cycleTag(id) {
    const v = ((S.tags[id] || 0) + 1) % 6;
    if (v) S.tags[id] = v; else delete S.tags[id];
    save(); updateSidebar();
    const b = $('[data-act="tagtopic"]'); if (b) paintTagBtn(b, id);
  }
  function paintTagBtn(b, id) {
    const v = S.tags[id];
    b.innerHTML = `<span class="tag-dot" ${v ? `data-tag="${v}"` : ''} style="${v ? '' : 'box-shadow: inset 0 0 0 1.5px var(--line-2)'}"></span>${v ? 'Tagged' : 'Tag'}`;
  }

  const themeLabel = () => (S.ui.theme === 'light' ? `${icon('moon')}Dark mode` : `${icon('sun')}Light mode`);

  // ---------------------------------------------------------------- top bar
  const FOCUS_LENS = PRO ? [30, 60, 120, 180] : [30]; // 1-3 h sessions are Pro
  const focusMin = () => (FOCUS_LENS.includes(+S.ui.focusMin) ? +S.ui.focusMin : 30);
  const lenLabel = (m) => (m < 60 ? m + ' minutes' : m / 60 + (m === 60 ? ' hour' : ' hours'));
  let timerState = { left: focusMin() * 60, running: false, iv: 0 };
  function buildTopbar() {
    topbar.innerHTML = `
      <button class="icon-btn" data-act="sidebar" title="Toggle sidebar ( [ )" aria-label="Toggle sidebar">${icon('side')}</button>
      <nav class="crumbs" aria-label="Breadcrumb"></nav>
      <div class="top-progress"><span class="lbl" data-overall></span><div class="bar"><i data-overall-bar></i></div></div>
      <a class="streak-chip" href="#home" data-streak title="Days in a row you've studied" hidden></a>
      <button class="pill" data-act="focus" title="Focus mode (F)">${icon('timer')}<span class="lbl">Focus</span><span class="timer" hidden></span></button>
      <button class="icon-btn" data-act="theme" title="Light / dark mode" aria-label="Toggle light or dark mode">${icon(S.ui.theme === 'light' ? 'moon' : 'sun')}</button>
      <button class="pill${S.ui.recall ? ' on' : ''}" data-act="recall" title="Recall mode (R): blanks every key term">${icon('eye')}<span class="lbl">Recall</span><span class="switch"></span></button>
      <div class="read-bar"></div>`;
    updateOverall(); paintStreak();
  }
  function updateOverall() {
    const d = doneIn(TOPICS), n = TOPICS.length;
    const l = $('[data-overall]', topbar); if (l) l.textContent = `${d} of ${n} done`;
    const b = $('[data-overall-bar]', topbar); if (b) b.style.width = (n ? (d / n) * 100 : 0) + '%';
  }
  function setCrumbs(parts) {
    const c = $('.crumbs', topbar);
    c.innerHTML = parts.map((p, i) => {
      const last = i === parts.length - 1;
      const cls = p.hideSm ? ' class="hide-sm"' : '';
      return (i ? `<span class="sep${p.hideSm ? ' hide-sm' : ''}">/</span>` : '') + (last ? `<span class="cur">${esc(p.t)}</span>` : `<a href="${p.href}"${cls}>${esc(p.t)}</a>`);
    }).join('');
  }
  function toggleRecall(force) {
    const on = force == null ? !document.body.classList.contains('recall') : force;
    document.body.classList.toggle('recall', on);
    S.ui.recall = on; save();
    const b = $('[data-act="recall"]', topbar); if (b) b.classList.toggle('on', on);
    $$('.prose b.shown, .recallable b.shown').forEach((x) => x.classList.remove('shown'));
    toast(on ? 'Recall on: tap a blank to reveal it' : 'Recall off', 'eye');
  }
  let focusPrevCollapsed = null;
  function toggleFocus(force) {
    const on = force == null ? !document.body.classList.contains('focus') : force;
    document.body.classList.toggle('focus', on);
    const b = $('[data-act="focus"]', topbar);
    const tEl = $('.timer', b);
    b.classList.toggle('on', on);
    if (on) {
      focusPrevCollapsed = app.classList.contains('sb-collapsed');
      if (!narrow()) app.classList.add('sb-collapsed');
      closeDrawer();
      tEl.hidden = false; timerState.left = focusMin() * 60; startTimer(true);
      // phones have no Esc key: a bar with Pause and Exit stays on screen during focus mode
      const fb = h('div', { class: 'focus-bar', role: 'group', 'aria-label': 'Focus timer' });
      fb.innerHTML = `${icon('timer')}<span class="timer" data-ftime></span><select class="focus-len" data-focuslen aria-label="Timer length" title="Timer length">${FOCUS_LENS.map((m) => `<option value="${m}"${m === focusMin() ? ' selected' : ''}>${m < 60 ? m + ' min' : m / 60 + ' h'}</option>`).join('')}${PRO ? '' : '<option disabled>1–3 h · Pro</option>'}</select><button class="btn small" data-act="focuspause">${icon('pause')}Pause</button><button class="btn small primary" data-act="focusexit">${icon('x')}Exit focus</button>`;
      document.body.appendChild(fb);
      toast(`Focus: ${lenLabel(focusMin())}. ${touchUI() ? 'Tap Exit focus to leave' : 'Esc or Exit focus to leave'}`, 'timer');
      fb.querySelector('[data-focuslen]').addEventListener('change', (ev) => {
        S.ui.focusMin = +ev.target.value; save();
        timerState.left = focusMin() * 60; startTimer(true); paintTimer();
        toast(`Timer set to ${lenLabel(focusMin())}`, 'timer');
      });
    } else {
      if (!narrow() && focusPrevCollapsed === false) app.classList.remove('sb-collapsed');
      tEl.hidden = true; startTimer(false);
      $$('.focus-bar').forEach((x) => x.remove());
    }
    paintTimer();
  }
  function startTimer(run) {
    clearInterval(timerState.iv); timerState.running = run;
    if (run) timerState.iv = setInterval(() => {
      timerState.left--; paintTimer();
      if (timerState.left <= 0) { startTimer(false); toast(`${lenLabel(focusMin())} done. Take a break.`, 'timer'); timerState.left = focusMin() * 60; paintTimer(); }
    }, 1000);
  }
  function paintTimer() {
    const L = timerState.left, hh = Math.floor(L / 3600), m = Math.floor((L % 3600) / 60), s = L % 60, p2 = (x) => String(x).padStart(2, '0');
    $$('.topbar .timer, [data-ftime]').forEach((tEl) => { tEl.textContent = hh ? `${hh}:${p2(m)}:${p2(s)}` : `${m}:${p2(s)}`; });
    const pb = $('[data-act="focuspause"]'); if (pb) pb.innerHTML = timerState.running ? `${icon('pause')}Pause` : `${icon('play')}Resume`;
  }
  const touchUI = () => !!(window.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches);

  // ================================================================ router
  let current = null;       // {view, ...route, api}
  let vizHandles = [];
  let vizIO = null;
  let pendingFind = null;   // search term to flash after navigation
  let pendingQ = null;      // question id to reveal after navigation

  function parse(hash) {
    const raw = String(hash || '').replace(/^#/, '') || 'home';
    if (raw === 'home') return { view: 'home' };
    if (raw === 'unlock' || raw === 'pro') return { view: 'pro' };
    if (MOD[raw] && MOD[raw].locked) return { view: 'unlock' };
    if (MOD[raw]) return { view: 'module', mod: raw };
    let m = raw.match(/^(m[0-9]+)-summary$/);
    if (m && MOD[m[1]] && MOD[m[1]].locked) return { view: 'unlock' };
    if (m && MOD[m[1]]) return { view: 'summary', mod: m[1] };
    m = raw.match(/^(questions|cards|quiz|formulas|lab|mine|guide|syllabus|battle|papers|revise|mock)(?:\.([a-z0-9-]+))?$/);
    if (m) return { view: m[1], arg: m[2] || null };
    m = raw.match(/^([a-z0-9-]+?)(?:\.(\d+))?$/);
    if (m && TOPIC[m[1]]) return { view: 'topic', id: m[1], tab: m[2] != null ? +m[2] : null };
    return { view: 'home' };
  }
  function hashOf(r) {
    switch (r.view) {
      case 'home': return '#home';
      case 'module': return '#' + r.mod;
      case 'summary': return '#' + r.mod + '-summary';
      case 'topic': return '#' + r.id + (r.tab != null ? '.' + r.tab : '');
      default: return '#' + r.view + (r.arg ? '.' + r.arg : '');
    }
  }
  function navigate(hash, opts) {
    opts = opts || {};
    if (hash[0] !== '#') hash = '#' + hash;
    const r = parse(hash);
    if (current && current.view === 'topic' && r.view === 'topic' && r.id === current.id && current.api) {
      if (r.tab != null) current.api.setTab(r.tab, { scroll: true });
      closeDrawer();
      return;
    }
    try { if (opts.replace) history.replaceState(null, '', hash); else if (location.hash !== hash) history.pushState(null, '', hash); } catch (e) { /* sandboxed */ }
    render(r);
  }
  function replaceHash(hash) { try { history.replaceState(null, '', hash); } catch (e) { /* ignore */ } }

  function clearMounted() {
    vizHandles.forEach((hnd) => { try { hnd.destroy(); } catch (e) { /* ignore */ } });
    vizHandles = [];
    if (vizIO) vizIO.disconnect();
    vizIO = null;
    hideSelBar();
  }

  function render(r) {
    const run = () => {
      tickStudy(); // opening the next topic adds the seconds studied since the last tick, so the clock is up to date
      clearMounted();
      if (current && current.cleanup) try { current.cleanup(); } catch (e) { /* ignore */ }
      closeDrawer();
      let view;
      switch (r.view) {
        case 'module': view = viewModule(r); break;
        case 'summary': view = viewSummary(r); break;
        case 'topic': view = viewTopic(r); break;
        case 'questions': view = viewBank(r); break;
        case 'quiz': view = PRO ? viewQuiz(r) : viewProTeaser('quiz'); break;
        case 'cards': view = viewCards(r); break;
        case 'formulas': view = PRO ? viewFormulas(r) : viewProTeaser('formulas'); break;
        case 'lab': view = PRO ? viewLab(r) : viewProTeaser('lab'); break;
        case 'mine': view = PRO ? viewMine(r) : viewProTeaser('mine'); break;
        case 'revise': view = PRO ? viewRevise(r) : viewProTeaser('revise'); break;
        case 'mock': view = PRO ? viewMock(r) : viewProTeaser('mock'); break;
        case 'pro': view = viewGoPro(r); break;
        case 'guide': view = viewGuide(r); break;
        case 'syllabus': view = viewSyllabus(r); break;
        case 'papers': view = viewPapers(r); break;
        case 'battle': view = viewBattle(r); break;
        default: view = viewHome(r);
      }
      host.innerHTML = '';
      host.appendChild(view.el);
      current = Object.assign({}, r, { api: view.api, cleanup: view.cleanup });
      main.style.scrollBehavior = 'auto';
      main.scrollTop = 0; window.scrollTo(0, 0);
      main.style.scrollBehavior = '';
      if (view.after) view.after();
      stagger(view.el);
      onScroll();
    };
    if (document.startViewTransition && !reduced && current) {
      try { const vt = document.startViewTransition(run); vt.ready.catch(() => {}); vt.finished.catch(() => {}); return; } catch (e) { /* fall through */ } // a quick second click skips the animation; not an error
    }
    run();
  }
  function stagger(root) {
    root.classList.add('enter');
    Array.from(root.children).forEach((c, i) => c.style.setProperty('--i', Math.min(i, 12)));
  }

  // ================================================================ content hydration
  const NOTE_LABEL = { why: ['bulb', 'Why it works'], exam: ['exam', 'Exam angle'], trap: ['warn', 'Common trap'], 'heads-up': ['info', 'Heads-up'], example: ['ex', 'Example'] };
  function srcLabel(src) {
    const m = String(src || '').match(/\/(?:slides|images|hi)\/s(\d+)/) || String(src || '').match(/\/(?:pages|images)\/p(\d+)/);
    if (!m) return '';
    return 'Redrawn from the VIT course material';
  }
  const svgCache = {};
  function loadSvg(id) {
    // only our own files from img/, and only the <svg> element (no scripts or event handlers survive)
    const packed = (window.DATA.figsvg || {})[id]; // shipped inside the module's notes file
    return svgCache[id] || (svgCache[id] = (packed ? Promise.resolve(packed) : fetch(`img/${id}.svg`, { credentials: 'same-origin' }).then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })).then((t) => {
      const doc = new DOMParser().parseFromString(t, 'image/svg+xml'), svg = doc.documentElement;
      if (!svg || svg.nodeName.toLowerCase() !== 'svg') throw new Error('not svg');
      svg.querySelectorAll('script, foreignObject').forEach((x) => x.remove());
      svg.querySelectorAll('*').forEach((x) => Array.from(x.attributes).forEach((a) => { if (/^on/i.test(a.name) || /javascript:/i.test(a.value)) x.removeAttribute(a.name); }));
      svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
      // arrowhead/gradient ids are prefixed with the figure id, so two diagrams on one page never borrow each other's
      let out = new XMLSerializer().serializeToString(svg);
      Array.from(svg.querySelectorAll('[id]'), (x) => x.id).forEach((old) => {
        const nu = id + '--' + old;
        out = out.split(`id="${old}"`).join(`id="${nu}"`).split(`url(#${old})`).join(`url(#${nu})`).split(`href="#${old}"`).join(`href="#${nu}"`);
      });
      return out;
    }).catch((e) => { delete svgCache[id]; throw e; }));
  }
  function hydrate(root) {
    // figures
    $$('figure[data-fig]', root).forEach((fg) => {
      const id = fg.getAttribute('data-fig');
      const f = FIGS[id];
      fg.classList.add('fig');
      if (!f) { fg.classList.add('missing'); fg.innerHTML = `<div class="fig-frame">Diagram unavailable</div>`; return; }
      const dim = D.figs[id] || {};
      const wide = dim.w && dim.h && dim.w / dim.h > 1.7;
      if (wide) fg.classList.add('wide');
      if (dim.svg) { // the site's own redrawn diagram: inlined so it takes the theme's colours (dark and light mode)
        fg.classList.add('svgfig');
        fg.innerHTML = `<div class="fig-frame" tabindex="0" role="button" aria-label="Enlarge diagram"><div class="fig-svg" role="img" aria-label="${esc(f.alt || f.caption || '')}" style="aspect-ratio:${dim.w} / ${dim.h}"></div><span class="fig-zoom">${icon('zoom')}</span></div><figcaption>${f.caption || ''}${srcLabel(f.src) ? `<span class="fig-src">${srcLabel(f.src)}</span>` : ''}</figcaption>`;
        loadSvg(id).then((svg) => { const box = $('.fig-svg', fg); if (box) box.innerHTML = svg; }, () => { const box = $('.fig-svg', fg); if (box) box.textContent = 'Diagram unavailable'; });
        return;
      }
      fg.innerHTML = `<div class="fig-frame" tabindex="0" role="button" aria-label="Enlarge diagram"><img src="img/${id}.webp" alt="${esc(f.alt || f.caption || '')}" loading="lazy" decoding="async"${dim.w ? ` width="${dim.w}" height="${dim.h}"` : ''}><span class="fig-zoom">${icon('zoom')}</span></div><figcaption>${f.caption || ''}${srcLabel(f.src) ? `<span class="fig-src">${srcLabel(f.src)}</span>` : ''}</figcaption>`;
    });
    // tables
    $$('table.tbl', root).forEach((t) => { if (!t.parentElement.classList.contains('tbl-wrap')) { const w = h('div', { class: 'tbl-wrap' }); t.parentNode.insertBefore(w, t); w.appendChild(t); } });
    // notes
    $$('.note', root).forEach((n) => {
      if (n.querySelector(':scope > .note-label')) return;
      const type = Object.keys(NOTE_LABEL).find((k) => n.classList.contains(k)) || 'why';
      const [ic, label] = NOTE_LABEL[type];
      n.insertBefore(h('div', { class: 'note-label', 'data-gen': '', html: icon(ic) + esc(label) }), n.firstChild);
    });
    // worked examples
    [['given', 'Given'], ['solve', 'Working'], ['result', 'Answer']].forEach(([cls, lab]) => {
      $$(`.worked > .${cls}`, root).forEach((el) => { if (!el.querySelector(':scope > .w-label')) el.insertBefore(h('span', { class: 'w-label', 'data-gen': '', text: lab }), el.firstChild); });
    });
    $$('.steps', root).forEach((ol) => Array.from(ol.children).forEach((li, i) => li.style.setProperty('--i', i)));
    // interactive diagrams: mount lazily
    const vz = $$('[data-viz]', root);
    if (vz.length) {
      if (!vizIO) vizIO = new IntersectionObserver((ents) => ents.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target; vizIO.unobserve(el);
        if (window.VIZ) vizHandles.push(window.VIZ.mount(el, el.getAttribute('data-viz')));
      }), { root: main, rootMargin: '500px 0px' });
      vz.forEach((el) => { if (hasViz(el.getAttribute('data-viz'))) vizIO.observe(el); else if (!PRO) el.outerHTML = proCard('Try it: interactive model', 'Play with this idea step by step and see the result. Part of Pro.', 'viz'); else el.remove(); });
    }
  }

  // ================================================================ highlights
  function hlNodes(root) {
    const out = [];
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) { const p = n.parentElement; if (!p || p.closest('figure, .viz, [data-gen]')) return NodeFilter.FILTER_REJECT; return NodeFilter.FILTER_ACCEPT; }
    });
    let n; while ((n = w.nextNode())) out.push(n);
    return out;
  }
  function rangeOffsets(root, range) {
    let acc = 0, s = -1, e = -1;
    for (const n of hlNodes(root)) {
      const len = n.nodeValue.length;
      if (range.intersectsNode(n)) {
        const a = n === range.startContainer ? range.startOffset : 0;
        const b = n === range.endContainer ? range.endOffset : len;
        if (b > a) { if (s < 0) s = acc + a; e = acc + b; }
      }
      acc += len;
    }
    return s >= 0 && e > s ? [s, e] : null;
  }
  function wrapRange(root, s, e, make) {
    let acc = 0; const made = [];
    for (const n of hlNodes(root)) {
      const len = n.nodeValue.length, ns = acc, ne = acc + len; acc = ne;
      if (ne <= s || ns >= e) continue;
      const a = Math.max(0, s - ns), b = Math.min(len, e - ns);
      if (b <= a) continue;
      let target = n;
      if (b < len) target.splitText(b);
      if (a > 0) target = target.splitText(a);
      if (!target.nodeValue.trim() && target.parentNode && /^(TR|TBODY|THEAD|TABLE|UL|OL)$/.test(target.parentNode.tagName)) continue;
      const mk = make();
      target.parentNode.insertBefore(mk, target);
      mk.appendChild(target);
      made.push(mk);
    }
    return made;
  }
  function applyHighlights(panel, topicId, tab) {
    (S.hl[topicId] || []).filter((x) => x.tab === tab).forEach((x) => {
      wrapRange(panel, x.s, x.e, () => h('mark', { class: 'hl c' + x.c, 'data-h': x.id }));
    });
  }
  let selBar = null;
  function hideSelBar() { if (selBar) { selBar.remove(); selBar = null; } }
  function showSelBar(rect, buttons) {
    hideSelBar();
    selBar = h('div', { class: 'sel-bar', role: 'toolbar' });
    buttons.forEach((b) => selBar.appendChild(h('button', { type: 'button', html: b.html, title: b.title || '', 'aria-label': b.title || '', onmousedown: (e) => e.preventDefault(), onclick: (e) => { e.stopPropagation(); b.fn(); hideSelBar(); } })));
    document.body.appendChild(selBar);
    const bw = selBar.offsetWidth, bh = selBar.offsetHeight;
    let x = rect.left + rect.width / 2 - bw / 2, y = rect.top - bh - 10;
    if (y < 64) y = rect.bottom + 10;
    x = clamp(x, 8, window.innerWidth - bw - 8);
    selBar.style.left = x + 'px'; selBar.style.top = y + 'px';
  }
  function onSelectionEnd(e) {
    if (e && e.target && e.target.closest && e.target.closest('.sel-bar')) return;
    setTimeout(() => {
      if (!current || current.view !== 'topic') return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) { if (!(e && e.target && e.target.closest && e.target.closest('mark.hl'))) hideSelBar(); return; }
      const range = sel.getRangeAt(0);
      const panel = $('.panel');
      if (!panel || !panel.contains(range.commonAncestorContainer)) { hideSelBar(); return; }
      const anc = range.commonAncestorContainer.nodeType === 1 ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;
      if (anc.closest('figure, .viz')) return;
      if (sel.toString().trim().length < 2) return;
      const off = rangeOffsets(panel, range);
      if (!off) return;
      const rect = range.getBoundingClientRect();
      const add = (c) => {
        const t = current.id, tab = current.api.tab();
        const text = sel.toString().replace(/\s+/g, ' ').trim().slice(0, 400);
        (S.hl[t] = S.hl[t] || []).push({ id: Date.now().toString(36), tab, s: off[0], e: off[1], c, text });
        save();
        sel.removeAllRanges();
        current.api.refresh();
        toast('Highlighted', 'pen');
      };
      showSelBar(rect, [
        { html: '<span class="sw c1"></span>', title: 'Highlight white', fn: () => add(1) },
        { html: '<span class="sw c2"></span>', title: 'Highlight amber', fn: () => add(2) },
        { html: '<span class="sw c3"></span>', title: 'Highlight blue', fn: () => add(3) },
      ]);
    }, 10);
  }
  document.addEventListener('mouseup', onSelectionEnd);
  document.addEventListener('touchend', onSelectionEnd);
  document.addEventListener('keyup', (e) => { if (e.shiftKey) onSelectionEnd(e); });

  // ================================================================ views
  // ================================================================ Pro
  // A small locked card in place of a Pro feature; tapping it opens the Go Pro page.
  function proCard(title, text, from) {
    return `<a class="pro-lock" href="#pro" data-from="${esc(from || '')}"><span class="lock-ico">${icon('lock')}</span><span class="pro-lock-txt"><strong>${esc(title)}</strong><span>${esc(text)}</span></span><span class="pro-tag">Pro</span></a>`;
  }
  const PRO_FEATURES = {
    quiz: ['Quiz', 'A quiz from every module, a weak-spot quiz that goes after what you got wrong, and mastery per topic.'],
    formulas: ['Formula sheet', 'Every formula, the numbers worth remembering and the classic traps, on one page per module.'],
    lab: ['Interactive models', 'Every "Try it" model from the notes in one place: waves, optics, quantum and more.'],
    mine: ['Bookmarks and My notes', 'Your highlights and notes in one place, synced between your phone and laptop.'],
    revise: ['Night-before revision pack', 'The formulas, one-liners and traps of every module, ready to read in 20 minutes or save as a PDF.'],
    mock: ['Timed mock CAT', 'A real CAT paper with a 90-minute timer. When time is up you get the model answers.'],
  };
  function viewProTeaser(key) {
    const [title, text] = PRO_FEATURES[key] || ['Pro feature', ''];
    setCrumbs([{ t: 'Home', href: '#home' }, { t: title }]); setActive(key); document.title = `${title} · BAPHY105 Notes`;
    const el = h('div', { class: 'view' });
    el.innerHTML = `
      <div class="eyebrow"><span class="code">Pro</span><span>${esc(title)}</span></div>
      <h1 class="h-display">${esc(title)}</h1>
      <p class="blurb">${esc(text)}</p>
      ${proCard('Get Pro for ₹' + (window.PRICE_RS || 20), 'One payment for the whole semester. The notes stay free.', key)}
      <p class="muted" style="margin-top:14px"><a href="#pro" style="color:inherit">See everything in Pro →</a></p>`;
    return { el };
  }
  // The "Why go Pro" page (owner's brief, 30-09-2026): outcome first, benefits grouped by what they do for you, real
  // previews, honest price, Terms and Refund next to Pay. No countdowns, no invented numbers.
  function viewGoPro() {
    setCrumbs([{ t: 'Home', href: '#home' }, { t: 'Go Pro' }]); setActive('pro'); document.title = 'Go Pro · BAPHY105 Notes';
    try { if (!sessionStorage.getItem('bn_gopro')) { sessionStorage.setItem('bn_gopro', '1'); beacon({ funnel: 'gopro' }); } } catch (e) { /* ignore */ }
    const rs = window.PRICE_RS || 20, days = 120, perDay = (rs / days).toFixed(2).replace(/\.?0+$/, '');
    const was = window.PRICE_WAS;
    const free = !!window.FREE_SITE;
    const sampleQ = QS.find((q) => q.answer || q.q);
    const groups = [
      ['exam', 'Practise like the exam', 'Sit a real CAT paper against a 90-minute timer, then check yourself against model answers written from these notes.', ['Timed mock CAT', 'Model papers', 'Model answers for every paper']],
      ['brain', 'Remember it', 'Short daily recall beats rereading. The quiz keeps coming back to what you got wrong until it sticks.', ['All flashcards', 'Quiz and weak-spot quiz', 'Mastery per topic']],
      ['bolt', 'Revise fast', 'The night before, read one page per module instead of the whole module.', ['Night-before revision pack', 'Formula sheet', 'PDF summaries to keep']],
      ['sync', 'Never lose progress', 'Start on your laptop, finish on your phone in the bus. Your ticks, highlights and notes follow you.', ['Sync across phone and laptop', 'Bookmarks and My notes']],
      ['target', 'Study smarter', 'Know what was actually asked and where you stand.', ['Focus timer up to 3 h with stats', 'Study music', '"N% read" progress', 'Full "asked in CAT" detail', 'Answers to every practice question', 'Every interactive model', 'Unlimited quiz battles']],
    ];
    const el = h('div', { class: 'view gopro' });
    el.innerHTML = `
      <div class="eyebrow"><span class="code">BAPHY105</span><span>Pro</span></div>
      <h1 class="h-display">Score more in your CAT with less time</h1>
      <p class="blurb">The notes, diagrams and summaries are free and stay free. Pro adds the tools that turn reading into marks: practice under exam conditions, answers you can check yourself against, and a fast way to revise.</p>
      ${free ? '<div class="note example"><p>Pro is <b>free for everyone right now</b>. Everything below is already open for you.</p></div>' : ''}
      <div class="gopro-price">
        <div><span class="gp-big">${was ? `<s>₹${was}</s> ` : ''}₹${rs}</span><span class="gp-sub">one payment · whole semester · no subscription</span></div>
        <p>That is about ₹${perDay} a day over a semester of prep, less than a canteen snack.${was && window.SALE_TEXT ? ' ' + esc(window.SALE_TEXT) : ''}</p>
        ${free || PRO ? '' : `<button class="btn" data-act="pay">${icon('lock')}Get Pro for ₹${rs} (UPI)</button>`}
        ${PRO && !free ? '<p><b>You have Pro.</b> Thank you for supporting the site.</p>' : ''}
        <p class="gp-legal">UPI only. Read the <a href="terms.html" target="_blank">Terms</a> and the <a href="refund.html" target="_blank">Refund policy</a> before you pay. Questions? <a href="contact.html" target="_blank">Contact</a>.</p>
      </div>
      <div class="gopro-groups">${groups.map(([ic, t, why, items]) => `
        <section class="gp-group"><h2 class="h-sec">${esc(t)}</h2><p>${esc(why)}</p><ul class="gp-ticks">${items.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul></section>`).join('')}</div>
      <h2 class="h-sec" style="margin-top:26px">Try before you pay</h2>
      <ul class="prose gp-taste">
        <li>Every topic shows <b>3 sample flashcards</b> for free. Open <a href="#cards">Flashcards</a>.</li>
        <li>You get <b>one preview quiz battle</b> on a topic. Open <a href="#battle">1v1 battle</a>.</li>
        <li>Topics asked in a CAT carry an <b>"asked in CAT"</b> badge. Pro shows which slot and what was asked.</li>
      </ul>
      ${sampleQ && !PRO ? `<div class="gp-blur"><div class="gp-blur-in prose">${sampleQ.q}<p><b>Answer.</b> The verdict comes first, then the reasoning tied to the notes, then the points an examiner looks for…</p></div>${proCard('Model answers for every question', 'This is what a Pro answer looks like, blurred.', 'preview')}</div>` : ''}
      <h2 class="h-sec" style="margin-top:26px">Who makes this</h2>
      <p class="blurb">Made by a student for students. The notes are checked against the course material and every number in a worked example is recomputed. If something is wrong, tap Help? and it gets fixed.</p>`;
    const pay = $('[data-act="pay"]', el);
    if (pay) pay.addEventListener('click', () => { if (window.__showPaywall) window.__showPaywall(); else toast('Payments are paused right now', 'info'); });
    return { el };
  }

  // Night-before revision pack (Pro): the formulas, one-liners, numbers and traps of every module on one page; Print saves a PDF.
  function viewRevise() {
    setCrumbs([{ t: 'Home', href: '#home' }, { t: 'Revision pack' }]); setActive('revise'); document.title = 'Revision pack · BAPHY105 Notes';
    const el = h('div', { class: 'view revise' });
    el.innerHTML = `
      <div class="eyebrow"><span class="code">Pro</span><span>Night-before revision pack</span></div>
      <h1 class="h-display">Revision pack</h1>
      <p class="blurb">Everything to read the night before, one module after another. <button class="btn small ghost no-print" data-act="print">${icon('download')}Save as PDF</button></p>
      ${MODULES.filter((m) => m.topics.length).map((m) => {
        const s = SUM[m.id] || {};
        const forms = [].concat(...m.topics.map((t) => t.formulas));
        const lines = [].concat(...m.topics.map((t) => t.oneLiners));
        return `<section class="rv-mod"><h2 class="h-sec">Module ${+m.num} · ${esc(m.title)}</h2>
          ${forms.length ? `<h3>Formulas</h3><div class="forms">${forms.map((f) => `<div class="form"><div class="fname">${rt(f.name)}</div><div class="eq">${f.html}</div>${f.note ? `<div class="fnote">${f.note}</div>` : ''}</div>`).join('')}</div>` : ''}
          ${lines.length ? `<h3>One-liners</h3><ul class="prose">${lines.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}
          ${s.traps && s.traps.length ? `<h3>Traps</h3><ul class="prose">${s.traps.map((x) => `<li>${typeof x === 'string' ? x : (x.html || x.text || '')}</li>`).join('')}</ul>` : ''}
        </section>`;
      }).join('')}`;
    $('[data-act="print"]', el).addEventListener('click', () => window.print());
    return { el };
  }

  // Timed mock CAT (Pro): a real CAT paper (questions only), a 90-minute timer, then its model answers.
  function viewMock(r) {
    const FAT = !!(r && r.arg === 'fat'), KIND = FAT ? 'FAT' : 'CAT', MINUTES = FAT ? 180 : 90;
    setCrumbs([{ t: 'Home', href: '#home' }, { t: 'Mock ' + KIND }]); setActive(FAT ? 'mock.fat' : 'mock'); document.title = 'Mock ' + KIND + ' · BAPHY105 Notes';
    const el = h('div', { class: 'view mock' });
    const papers = (D.papers || []).filter((pp) => pp.questions && pp.questions.length && (pp.exam === 'fat') === FAT);
    let timer = null;
    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    function list() {
      el.innerHTML = `
        <div class="eyebrow"><span class="code">Pro</span><span>Timed mock ${KIND}</span></div>
        <h1 class="h-display">Mock ${KIND}</h1>
        <p class="blurb">Pick a paper. You get the questions and a ${MINUTES}-minute timer, just like the exam hall. Write your answers on paper. When the time is up, or you press Finish, the model answers open.</p>
        ${papers.length ? papers.map((pp, i) => `<button class="next-topic" data-i="${i}"><div><small>${esc(pp.sub || '')}</small><strong>${esc(pp.title)}</strong></div><span class="arrow">${icon('play')}</span></button>`).join('') : `<div class="empty">The ${KIND} papers are added after the modules are done. Check back soon.</div>`}`;
      $$('[data-i]', el).forEach((b) => b.addEventListener('click', () => run(papers[+b.dataset.i])));
    }
    function run(pp) {
      let left = MINUTES * 60;
      el.innerHTML = `
        <div class="mock-bar"><b>${esc(pp.title)}</b><span class="mock-time" data-t>${fmt(left)}</span><button class="btn small" data-act="finish">Finish</button></div>
        ${pp.instructions ? `<div class="note heads-up"><p>${pp.instructions}</p></div>` : ''}
        <div class="prose">${pp.questions.map((q) => `<div class="mock-q"><div class="mock-n">Q${esc(q.n)}${q.marks ? ` · ${esc(q.marks)} marks` : ''}</div>${q.prompt}${q.passage ? `<div class="paper-passage">${q.passage}</div>` : ''}${q.parts ? `<ol class="paper-parts">${q.parts.map((x) => `<li>${x.text}${x.marks ? ` <span class="ew-score">(${esc(x.marks)} marks)</span>` : ''}</li>`).join('')}</ol>` : ''}</div>`).join('')}</div>`;
      hydrate(el);
      const finish = () => { clearInterval(timer); timer = null; navigate('#papers.' + pp.id); };
      $('[data-act="finish"]', el).addEventListener('click', finish);
      timer = setInterval(() => { left--; const t = $('[data-t]', el); if (t) t.textContent = fmt(Math.max(0, left)); if (left <= 0) { toast('Time is up. Here are the model answers.', 'check'); finish(); } }, 1000);
    }
    list();
    return { el, cleanup: () => { if (timer) clearInterval(timer); } };
  }

  function lockedNames() {
    const l = MODULES.filter((m) => m.locked).map((m) => 'Module ' + (+m.num));
    return l.length > 1 ? l.slice(0, -1).join(', ') + ' and ' + l[l.length - 1] : l[0] || 'everything';
  }
  function topicRow(t) {
    const f = frac(t);
    return `<a class="trow" href="#${t.id}">
      <span class="tick${isDone(t.id) ? ' done' : ''}" style="--p:${Math.round(f * 100)}%"></span>
      <div><h3>${rt(t.title)}</h3><p>${rt(t.blurb)}</p></div>
      <span class="meta">${t.tabs.length} tabs <span class="arrow">→</span></span>
    </a>`;
  }
  function summaryRow(m) {
    return `<a class="trow summary" href="#${m.id}-summary">
      <span class="tick" style="--p:0%;box-shadow:none;background:none">${icon('book')}</span>
      <div><h3>Module ${+m.num} summary</h3><p>Big ideas, comparison tables, every equation, the numbers to remember and the classic traps, on one page.</p></div>
      <span class="meta">final recap <span class="arrow">→</span></span>
    </a>`;
  }

  // ---------------------------------------------------------------- home
  // Subjects (owner, 30-09-2026): one card per subject site, searchable; this subject opens here, the others link out.
  // Thumbnails are small line drawings in the theme colours, so they work in dark and light mode.
  const SUBJECTS = [
    { code: 'BAPHY105', name: 'Engineering Physics', href: '#home', here: true, words: 'physics optics laser fibre quantum waves interference diffraction semiconductor',
      art: '<path d="M10 40h14l5-10 8 20 8-20 8 20 5-10h12" class="dsb"/><circle cx="96" cy="40" r="14" class="dso"/><path d="M88 40h16M96 32v16" class="dso"/>' },
    { code: 'BACHY105', name: 'Applied Chemistry', href: 'https://bachy105.vercel.app', words: 'chemistry batteries fuel cells nanomaterials spectroscopy xrd',
      art: '<path d="M44 14v18L28 62h48L60 32V14" class="dsg"/><path d="M40 14h24" class="dsg"/><path d="M34 50h36" class="dsb"/><circle cx="48" cy="56" r="3" class="dsb"/><circle cx="58" cy="54" r="2" class="dsb"/>' },
    { code: 'BAENG101', name: 'English', href: 'https://baeng101.vercel.app', words: 'english communication writing grammar reading',
      art: '<path d="M20 18h30q8 0 8 8v40q0-8-8-8H20z" class="dsp"/><path d="M96 18H66q-8 0-8 8v40q0-8 8-8h30z" class="dsp"/><path d="M28 30h20M28 40h20M68 30h20M68 40h14" class="dsy"/>' },
  ];
  function subjectCard(x) {
    const mods = MODULES.filter((m) => m.topics.length).length;
    return `<a class="subj" href="${x.href}"${x.here ? '' : ' rel="noopener"'} data-words="${esc((x.code + ' ' + x.name + ' ' + x.words).toLowerCase())}">
      <svg viewBox="0 0 116 76" class="subj-art" aria-hidden="true" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${x.art}</svg>
      <span class="subj-txt"><small>${x.code}</small><strong>${esc(x.name)}</strong><span>${x.here ? `${mods} module${mods === 1 ? '' : 's'} · you are here` : 'Opens its own site'}</span></span>
      <span class="subj-tags"><span class="tag-free">Free notes</span><span class="pro-tag">Pro</span></span></a>`;
  }
  function viewHome() {
    setCrumbs([{ t: 'Home' }]); setActive('home'); document.title = 'BAPHY105 Notes';
    const d = doneIn(TOPICS), n = TOPICS.length;
    const nViz = allViz().length;
    const el = h('div', { class: 'view' });
    const last = S.last && S.last.hash ? S.last : null;
    const words = ['Engineering', 'Physics'];
    el.innerHTML = `
      <section class="hero">
        <div class="eyebrow"><span class="code">BAPHY105</span><span>Engineering Physics</span><span class="dot">·</span><span>Fall semester 2026–27</span></div>
        <h1 class="h-display">${words.map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(' ')}</h1>
        <p class="blurb">The course rebuilt as short tabbed notes with every diagram from the course material redrawn, worked numericals checked line by line, and ${QS.length} questions that make you use what you read. White text is what you must remember. Everything else is there so it makes sense. The notes are free.</p>
        <p class="credit">Based on the BAPHY105 Engineering Physics course material taught at VIT. Diagrams are redrawn for this site from the course material (redrawn from the VIT course material); the notes, questions and interactive models are written for this site. <a href="privacy.html">Privacy</a></p>
        <div class="stat-line"><span class="stat-big">${d}/${n}</span><span class="muted">topics done</span><div class="bar"><i style="width:${n ? (d / n) * 100 : 0}%"></i></div><button class="btn small" data-act="share">${icon('share')}Share progress</button></div>
        <div class="study-line">${icon('fire')}<span><b>${streakDays()}</b> day${streakDays() === 1 ? '' : 's'} in a row</span><span class="dot">·</span><span><b data-today>${fmtDur(todaySecs())}</b> today</span><span class="dot">·</span><span><b data-total>${fmtDur(totalSecs())}</b> in total</span></div>
        ${last ? `<div class="continue"><a class="btn primary" href="${last.hash}">Continue: ${rt(last.title)} ${icon('right')}</a></div>` : (TOPICS[0] ? `<div class="continue"><a class="btn primary" href="#${TOPICS[0].id}">Start with ${rt(TOPICS[0].title)} ${icon('right')}</a></div>` : '')}
      </section>
      <section class="subjects">
        <div class="subj-head"><h2 class="h-sub">Subjects</h2><input class="subj-search" type="search" placeholder="Search subjects" aria-label="Search subjects" data-subjq></div>
        <div class="subj-list">${SUBJECTS.map(subjectCard).join('')}</div>
        <p class="muted subj-none" hidden>No subject matches. Notes for more subjects are on the way.</p>
        ${PRO && !window.FREE_SITE ? '' : '<p class="subj-pro"><a href="#pro" data-from="home">Why go Pro →</a></p>'}
      </section>
      <div class="how">
        <div><h3>Read tab by tab</h3><p>Each topic is split into small tabs. Arrow keys move between them, and a topic ticks itself once every tab has been opened.</p></div>
        <div><h3>Make it yours</h3><p>Select any line to highlight it, colour-tag topics in the sidebar, and keep your own notes at the bottom of each topic.</p></div>
        <div><h3>Test yourself</h3><p>Recall mode (R) blanks every key term until you tap it. The question bank, quiz and flashcards cover every topic.</p></div>
      </div>
      ${MODULES.filter((m) => m.topics.length).map((m) => `
        <section class="mod-sec">
          <div class="mod-head"><span class="mod-num">Module ${m.num}</span><h2 class="h-sec"><a href="#${m.id}" style="text-decoration:none">${esc(m.title)}</a></h2><span class="count">${doneIn(m.topics)}/${m.topics.length} done</span><button class="btn small ghost mod-reset" type="button" data-reset-mod="${m.id}" title="Start this module again from zero">${icon('trash')}Reset progress</button></div>
          <p class="mod-syl">${esc(m.syllabus)}</p>
          <div>${m.topics.map((t, i) => rowHead(m, t, i, 'row-head') + topicRow(t)).join('')}${summaryRow(m)}</div>
        </section>`).join('')}
      ${MODULES.filter((m) => m.locked).map((m) => `
        <section class="mod-sec">
          <div class="mod-head"><span class="mod-num">Module ${m.num}</span><h2 class="h-sec">${esc(m.title)}</h2><span class="count">${icon('lock')} locked</span></div>
          <p class="mod-syl">${esc(m.syllabus)}</p>
          <a class="lock-card" href="#unlock"><span class="lock-ico">${icon('lock')}</span><div><strong>Unlock ${lockedNames()} for ₹${PRICE_RS}</strong><p>Notes, diagrams, interactive models, questions, quiz, flashcards and summary. One-time UPI payment.</p></div><span class="arrow">${icon('right')}</span></a>
        </section>`).join('')}
      <section class="mod-sec">
        <div class="mod-head"><h2 class="h-sec">Practice</h2></div>
        <p class="mod-syl">Once you've read a module, test it. Everything below draws from the same notes.</p>
        <div class="tiles">
          <a class="tile" href="#questions"><span class="tt">${icon('q')}Question bank</span><span class="big">${QS.length}</span><p>Scenario questions with full answers and the points an examiner looks for, sorted by module and topic.</p></a>
          <a class="tile" href="#quiz"><span class="tt">${icon('quiz')}Quiz</span><span class="big">${QS.filter((q) => q.options).length}</span><p>Multiple choice or open, 10 to 30 at a time, weighted toward what you haven't seen or got wrong.</p></a>
          <a class="tile" href="#cards"><span class="tt">${icon('cards')}Flashcards</span><span class="big">${CARDS.length}</span><p>Flip, then sort into "know it" and "still learning". The deck remembers.</p></a>
          <a class="tile" href="#formulas"><span class="tt">${icon('sigma')}Formula sheet</span><p>Every equation, the numbers worth memorising and the classic traps, per module.</p></a>
          <a class="tile" href="#lab"><span class="tt">${icon('flask')}Lab bench</span>${nViz ? `<span class="big">${nViz}</span>` : ''}<p>All the interactive models and calculators in one place: waves, optics, quantum and more.</p></a>
          <a class="tile" href="#mine"><span class="tt">${icon('pen')}Highlights & notes</span><p>Your highlighted lines, personal notes, tagged topics and questions to revisit.</p></a>
          <a class="tile" href="#battle"><span class="tt">${icon('swords')}1v1 Quiz battle</span><p>Challenge a friend with a link: 10 questions, 10 seconds each, live scores.</p></a>
          ${PINDEX.length ? `<a class="tile" href="#papers"><span class="tt">${icon('exam')}Question papers</span><p>Real CAT papers and model papers in the same pattern, with model answers.</p></a>` : ''}
          <a class="tile" href="#syllabus.full"><span class="tt">${icon('list')}Syllabus</span><p>The whole course syllabus as a checklist, each line linked to its notes.</p></a>
          <a class="tile" href="#mock"><span class="tt">${icon('timer')}Timed mock CAT</span><p>A real CAT paper against a 90-minute timer, then the model answers.</p></a>
          <a class="tile" href="#revise"><span class="tt">${icon('fire')}Revision pack</span><p>Formulas, one-liners and traps of every module for the night before. Save it as a PDF.</p></a>
        </div>
      </section>
      <section class="data-box">
        <h2 class="h-sub">Your data</h2>
        <p class="muted">Progress, tags, highlights and notes are saved in this browser only. Back them up to move them to another device.</p>
        <div class="btn-row"><button class="btn" data-act="backup">${icon('db')}Back up or restore</button></div>
      </section>`;
    const q = $('[data-subjq]', el);
    q.addEventListener('input', () => {
      const v = q.value.trim().toLowerCase(); let shown = 0;
      $$('.subj', el).forEach((c) => { const ok = !v || v.split(/\s+/).every((w) => c.dataset.words.includes(w)); c.hidden = !ok; shown += ok; });
      $('.subj-none', el).hidden = !!shown;
    });
    return { el };
  }

  // ---------------------------------------------------------------- module
  function viewModule(r) {
    const m = MOD[r.mod];
    setCrumbs([{ t: 'Home', href: '#home' }, { t: `Module ${+m.num}` }]); setActive(null); document.title = `${m.title} · BAPHY105 Notes`;
    const d = doneIn(m.topics), n = m.topics.length;
    const nq = QS.filter((q) => q.module === m.id && q.topic !== 'mixed').length;
    const nc = CARDS.filter((c) => c.module === m.id).length;
    const tabs = m.topics.reduce((a, t) => a + t.tabs.length, 0);
    const next = m.topics.find((t) => !isDone(t.id)) || m.topics[0];
    const el = h('div', { class: 'view' });
    el.innerHTML = `
      <div class="mod-hero"><div class="mod-big">${m.num}</div>
        <div><div class="eyebrow"><span class="code">Module ${m.num}</span><span>${n} topics · ${tabs} tabs</span></div>
        <h1 class="h-display" style="margin-bottom:6px">${esc(m.title)}</h1></div></div>
      <p class="blurb">${esc(m.syllabus)}</p>
      <div class="mod-stats">
        <div class="ring" style="--p:${n ? Math.round((d / n) * 100) : 0}"><span>${n ? Math.round((d / n) * 100) : 0}%</span></div>
        <div class="btn-row">
          ${next ? `<a class="btn primary" href="#${next.id}">${d ? 'Continue' : 'Start reading'} ${icon('right')}</a>` : ''}
          <a class="btn" href="#${m.id}-summary">${icon('book')}Summary</a>
          <a class="btn" href="#questions.${m.id}">${icon('q')}Questions <span class="n">${nq}</span></a>
          <a class="btn" href="#cards.${m.id}">${icon('cards')}Flashcards <span class="n">${nc}</span></a>
          <a class="btn" href="#quiz.${m.id}">${icon('quiz')}Quiz</a>
          <button class="btn ghost" type="button" data-reset-mod="${m.id}" title="Start this module again from zero">${icon('trash')}Reset progress</button>
        </div>
      </div>
      <div>${m.topics.map((t, i) => rowHead(m, t, i, 'row-head') + topicRow(t)).join('')}${summaryRow(m)}</div>`;
    return { el };
  }

  // ---------------------------------------------------------------- topic
  function viewTopic(r) {
    const t = TOPIC[r.id], m = MOD[t.module];
    const n = t.tabs.length;
    let i = r.tab != null && r.tab < n ? r.tab : (S.ui.lastTab[t.id] != null && S.ui.lastTab[t.id] < n ? S.ui.lastTab[t.id] : 0);
    setActive(t.id);
    trackTopic(t.id);
    document.title = `${plain(t.title)} · BAPHY105 Notes`;
    const oi = orderIdx(t.id);
    const nx = ORDER[oi + 1];
    const nq = (QBY[t.id] || []).length, nc = (t.flashcards || []).length;
    const el = h('article', { class: 'view topic' });
    el.innerHTML = `
      <div class="eyebrow"><span class="code">M${+m.num}</span><a href="#${m.id}" style="text-decoration:none">${esc(m.title)}</a></div>
      <h1 class="h-display">${rt(t.title)}</h1>
      <p class="blurb">${rt(t.blurb)}</p>
      ${askedBadge(t.id)}
      <div class="t-actions">
        <button class="btn" data-act="done"></button>
        <button class="btn" data-act="tagtopic" title="Colour-tag this topic"></button>
        ${nq ? `<a class="btn" href="#questions.${t.id}">${icon('q')}Questions <span class="n">${nq}</span></a>` : ''}
        ${nc ? `<a class="btn" href="#cards.${t.id}">${icon('cards')}Flashcards <span class="n">${nc}</span></a>` : ''}
      </div>
      <div class="t-progress"><div class="bar"><i></i></div><span data-tp></span><span class="faint">· ticks itself when every tab is read</span></div>
      <div class="tabs-wrap"><div class="tabs" role="tablist" aria-label="Sections">
        ${t.tabs.map((tb, k) => `<button class="tab" role="tab" data-i="${k}" id="tab-${k}"><span class="seen"></span>${rt(tb.title)}</button>`).join('')}
        <span class="tab-ink"></span></div></div>
      <div class="panel prose" role="tabpanel" aria-live="polite"></div>
      <div class="tab-nav"></div>
      <section class="topic-check" data-check hidden></section>
      ${nx ? `<a class="next-topic" href="#${nx.key}"><div><small>Up next</small><strong>${rt(nx.title)}</strong></div><span class="arrow">${icon('right')}</span></a>` : ''}
      <details class="mynotes"${S.notes[t.id] ? ' open' : ''}><summary>${icon('pen')}My notes on this topic</summary>
        <textarea id="note-${t.id}" placeholder="Write it in your own words. Saved in this browser as you type."></textarea><div class="saved" data-saved></div></details>`;

    const panel = $('.panel', el), tabsEl = $('.tabs', el), ink = $('.tab-ink', el), nav = $('.tab-nav', el);
    const doneBtn = $('[data-act="done"]', el), tagBtn = $('[data-act="tagtopic"]', el);
    const ta = $('textarea', el), saved = $('[data-saved]', el);
    ta.value = S.notes[t.id] || '';
    let noteTimer = 0;
    ta.addEventListener('input', () => {
      clearTimeout(noteTimer);
      noteTimer = setTimeout(() => { const v = ta.value; if (v.trim()) S.notes[t.id] = v; else delete S.notes[t.id]; save(); saved.textContent = 'Saved'; setTimeout(() => { saved.textContent = ''; }, 1400); }, 350);
    });
    paintTagBtn(tagBtn, t.id);
    tagBtn.addEventListener('click', () => cycleTag(t.id));

    function paintDone() {
      const dn = isDone(t.id);
      doneBtn.classList.toggle('is-done', dn);
      doneBtn.innerHTML = `<span class="check-ico">${dn ? icon('check') : ''}</span>${dn ? 'Done' : 'Mark as done'}`;
      const v = visited(t.id).length;
      $('.t-progress .bar > i', el).style.width = (dn ? 100 : (v / n) * 100) + '%';
      $('[data-tp]', el).textContent = `${Math.min(v, n)} of ${n} tabs read`;
      $$('.tab', tabsEl).forEach((b) => b.classList.toggle('visited', visited(t.id).includes(+b.dataset.i)));
    }
    doneBtn.addEventListener('click', () => {
      if (isDone(t.id)) delete S.done[t.id]; else { S.done[t.id] = true; toast('Topic marked as done', 'check'); }
      save(); paintDone(); updateSidebar(); updateOverall();
    });

    function moveInk() {
      const b = $(`.tab[data-i="${i}"]`, tabsEl);
      if (!b) return;
      ink.style.left = b.offsetLeft + 12 + 'px';
      ink.style.width = Math.max(0, b.offsetWidth - 24) + 'px';
      const target = b.offsetLeft - tabsEl.clientWidth / 2 + b.offsetWidth / 2;
      tabsEl.scrollTo({ left: Math.max(0, target), behavior: reduced ? 'auto' : 'smooth' });
    }
    function paintNav() {
      const prev = t.tabs[i - 1], next = t.tabs[i + 1];
      const conf = (S.confusing[t.id] || []).includes(i);
      nav.innerHTML = `
        <div class="tn-row">
          ${prev ? `<button class="btn" data-go="${i - 1}" title="${esc(plain(prev.title))}">${icon('left')}<span class="lbl">${rt(prev.title)}</span></button>` : '<span></span>'}
          <span class="pos">${i + 1} / ${n}</span>
          ${next ? `<button class="btn primary" data-go="${i + 1}" title="Next: ${esc(plain(next.title))}"><span class="lbl">Next: ${rt(next.title)}</span>${icon('right')}</button>`
            : (nx ? `<a class="btn primary" href="#${nx.key}" title="Next: ${esc(plain(nx.title))}"><span class="lbl">Next: ${rt(nx.title)}</span>${icon('right')}</a>` : '<span></span>')}
        </div>
        <div class="tn-tools">
          <button class="btn small ghost conf-btn${conf ? ' on' : ''}" data-act="confusing" data-t="${t.id}" data-i="${i}" title="Add this tab to My weak spots">${icon('flag')}<span class="lbl">${conf ? 'Marked confusing' : 'Confusing?'}</span></button>
          <button class="btn small ghost conf-btn" data-act="help" data-t="${t.id}" data-i="${i}" title="A mistake, a suggestion or a problem? Tell us">${icon('help')}<span class="lbl">Help?</span></button>
        </div>`;
    }
    const checkEl = $('[data-check]', el);
    const checkQs = (QBY[t.id] || []).filter((q) => q.options).slice(0, 2);
    function paintCheck() {
      const show = i === n - 1 && checkQs.length;
      checkEl.hidden = !show;
      if (!show) { checkEl.innerHTML = ''; return; }
      if (checkEl.childElementCount) return;
      checkEl.appendChild(h('h2', { class: 'h-sub', html: `Check yourself <small class="faint" style="font-family:var(--mono);font-size:12px">${checkQs.length} quick question${checkQs.length > 1 ? 's' : ''}</small>` }));
      checkQs.forEach((q) => checkEl.appendChild(qCard(q)));
      if ((QBY[t.id] || []).length > checkQs.length) checkEl.appendChild(h('a', { class: 'btn small', href: `#questions.${t.id}`, html: `All ${(QBY[t.id] || []).length} questions on this topic ${icon('right')}` }));
    }
    function fill(animate) {
      clearMounted();
      panel.innerHTML = t.tabs[i].html || '';
      hydrate(panel);
      applyHighlights(panel, t.id, i);
      paintCheck();
      if (animate) { panel.classList.remove('enter'); void panel.offsetWidth; stagger(panel); }
      if (pendingFind) { flashFind(panel, pendingFind); pendingFind = null; }
    }
    function setTab(k, opts) {
      opts = opts || {};
      k = clamp(k, 0, n - 1);
      const changed = k !== i;
      i = k;
      $$('.tab', tabsEl).forEach((b) => { const on = +b.dataset.i === i; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
      moveInk();
      const completed = markVisited(t, i);
      paintDone(); paintNav(); updateSidebar(); updateOverall();
      if (completed) { toast('Topic complete. Every tab read.', 'check'); if (autoTick([t.id])) updateSidebar(); }
      replaceHash(`#${t.id}.${i}`);
      S.last = { hash: `#${t.id}.${i}`, title: t.title }; save();
      setCrumbs([{ t: 'Home', href: '#home' }, { t: `Module ${+m.num}`, href: '#' + m.id, hideSm: true }, { t: t.short || t.title, href: `#${t.id}.0`, hideSm: true }, { t: t.tabs[i].title }]);
      if (changed && !reduced && opts.animate !== false) {
        panel.classList.add('leave');
        setTimeout(() => { panel.classList.remove('leave'); fill(true); }, 110);
      } else fill(opts.animate !== false && changed);
      if (opts.scroll) {
        const wrap = $('.tabs-wrap', el);
        // bring the start of the new tab to the top of the screen, just under the top bar and the tab strip
        const sc = pageScroller(), origin = sc === main ? main.getBoundingClientRect().top : 0;
        const panelTop = sc.scrollTop + panel.getBoundingClientRect().top - origin;
        const top = Math.max(0, panelTop - topbar.offsetHeight - wrap.offsetHeight - 6);
        if (Math.abs(sc.scrollTop - top) > 4) sc.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
      }
    }
    tabsEl.addEventListener('click', (e) => { const b = e.target.closest('.tab'); if (b) setTab(+b.dataset.i, { scroll: true }); });
    tabsEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); e.stopPropagation();
        const r = e.key === 'ArrowRight';
        if ((r && i === n - 1) || (!r && i === 0)) { (r ? goNext : goPrev)(); return; }
        setTab(i + (r ? 1 : -1), { scroll: true }); $(`.tab[data-i="${i}"]`, tabsEl).focus();
      }
    });
    nav.addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b) setTab(+b.dataset.go, { scroll: true }); });
    panel.addEventListener('click', (e) => {
      const mk = e.target.closest('mark.hl');
      if (mk && !document.body.classList.contains('recall')) {
        const sel = window.getSelection(); if (sel && !sel.isCollapsed) return;
        const hid = mk.dataset.h;
        showSelBar(mk.getBoundingClientRect(), [{ html: icon('trash') + 'Remove highlight', title: 'Remove highlight', fn: () => { S.hl[t.id] = (S.hl[t.id] || []).filter((x) => x.id !== hid); save(); fill(false); } }]);
      }
    });
    // arrow keys run on past the ends of a topic: last tab → the next topic, first tab → the previous topic's last tab
    function goNext() { if (i < n - 1) setTab(i + 1, { scroll: true }); else if (nx) navigate('#' + nx.key); }
    function goPrev() {
      if (i > 0) { setTab(i - 1, { scroll: true }); return; }
      const pv = ORDER[oi - 1]; if (!pv) return;
      const pt = TOPIC[pv.key];
      navigate('#' + pv.key + (pt && pt.tabs && pt.tabs.length ? '.' + (pt.tabs.length - 1) : ''));
    }
    const onResize = () => moveInk();
    window.addEventListener('resize', onResize);
    return {
      el,
      after() { setTab(i, { animate: false }); requestAnimationFrame(moveInk); if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInk); },
      cleanup() { window.removeEventListener('resize', onResize); },
      api: { setTab, tab: () => i, next: goNext, prev: goPrev, refresh: () => fill(false), topic: t },
    };
  }

  function flashFind(root, term) {
    const words = term.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return;
    const nodes = hlNodes(root);
    let full = '', map = [];
    nodes.forEach((n) => { map.push([full.length, n]); full += n.nodeValue; });
    const idx = full.toLowerCase().indexOf(words[0]);
    if (idx < 0) return;
    const made = wrapRange(root, idx, idx + words[0].length, () => h('mark', { class: 'find' }));
    if (made[0]) setTimeout(() => made[0].scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' }), 250);
  }

  // ---------------------------------------------------------------- summary
  function viewSummary(r) {
    const m = MOD[r.mod], s = SUM[m.id];
    setCrumbs([{ t: 'Home', href: '#home' }, { t: `Module ${+m.num}`, href: '#' + m.id }, { t: 'Summary' }]);
    setActive(m.id + '-summary'); document.title = `Module ${+m.num} summary · BAPHY105 Notes`;
    S.last = { hash: `#${m.id}-summary`, title: `Module ${+m.num} summary` }; save();
    const el = h('div', { class: 'view sumpage' });
    const mqs = QS.filter((q) => q.module === m.id && q.topic === 'summary');
    const figs = m.topics.flatMap((t) => t.tabs.flatMap((tb, k) => Array.from((tb.html || '').matchAll(/data-fig="([a-z0-9-]+)"/g), (x) => ({ id: x[1], t, k })))).filter((f, i, a) => FIGS[f.id] && a.findIndex((y) => y.id === f.id) === i);
    const forms = s && s.formulas && s.formulas.length ? s.formulas : [].concat(...m.topics.map((t) => t.formulas || []));
    const nx = ORDER[orderIdx(m.id + '-summary') + 1];
    el.innerHTML = `
      <div class="eyebrow"><span class="code">Module ${m.num}</span><span>${esc(m.title)}</span><span class="dot">·</span><span>Final summary</span></div>
      <h1 class="h-display">${esc(m.title)}, on one page</h1>
      ${s && s.tldr ? `<div class="sum-tldr recallable">${s.tldr}</div>` : `<p class="blurb">${esc(m.syllabus)}</p>`}
      <div class="btn-row" style="margin-top:22px">
        <a class="btn primary" href="#quiz.${m.id}">${icon('quiz')}Quiz this module</a>
        <a class="btn" href="#cards.${m.id}">${icon('cards')}Flashcards</a>
        <a class="btn" href="#questions.${m.id}">${icon('q')}All questions</a>
      </div>
      ${s && s.storyline && s.storyline.length ? `<section class="sum-sec"><h2 class="h-sec">How it fits together</h2><ol class="story prose">${s.storyline.map((x) => `<li><h4>${rt(x.title)}</h4><div>${x.html}</div></li>`).join('')}</ol></section>` : ''}
      <section class="sum-sec"><h2 class="h-sec">Big ideas <small>${m.topics.length} topics</small></h2>
        <div class="ideas">${(s && s.bigIdeas && s.bigIdeas.length ? s.bigIdeas : m.topics.map((t) => ({ title: t.title, topic: t.id, html: `<ul>${(t.oneLiners || []).map((x) => `<li>${x}</li>`).join('')}</ul>` }))).map((b) => `
          <div class="idea"><h3>${rt(b.title)}</h3><div class="prose">${b.html}</div>${b.topic && TOPIC[b.topic] ? `<a href="#${b.topic}">Open the notes ${icon('right')}</a>` : ''}</div>`).join('')}</div></section>
      <section class="sum-sec"><h2 class="h-sec">Key points, topic by topic <small>${m.topics.reduce((a, t) => a + (t.oneLiners || []).length, 0)}</small></h2>
        <div class="kps">${m.topics.filter((t) => (t.oneLiners || []).length).map((t) => `<div class="kp"><h3><a href="#${t.id}">${rt(t.title)}</a></h3><ul class="prose recallable">${t.oneLiners.map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div></section>
      ${figs.length ? `<section class="sum-sec"><h2 class="h-sec">Diagrams <small>${figs.length}</small></h2><div class="sum-figs">${figs.map((f) => `<div class="sum-fig"><figure data-fig="${f.id}"></figure><a href="#${f.t.id}.${f.k}">${rt(f.t.short || f.t.title)} › ${rt(f.t.tabs[f.k].title)} ${icon('right')}</a></div>`).join('')}</div></section>` : ''}
      ${s && s.compare && s.compare.length ? `<section class="sum-sec"><h2 class="h-sec">Side by side</h2>${s.compare.map((c) => `<div class="cmp prose"><h3>${rt(c.title)}</h3>${c.html}</div>`).join('')}</section>` : ''}
      ${forms.length ? `<section class="sum-sec"><h2 class="h-sec">Equations to write from memory <small>${forms.length}</small></h2><div class="forms">${forms.map((f) => `<div class="form"><div class="fname">${rt(f.name)}</div><div class="fbody">${f.html}</div>${f.note ? `<div class="fnote">${f.note}</div>` : ''}</div>`).join('')}</div></section>` : ''}
      ${s && s.numbers && s.numbers.length ? `<section class="sum-sec"><h2 class="h-sec">Numbers to remember <small>${s.numbers.length}</small></h2><div class="nums">${s.numbers.map((x) => `<div><div class="nv">${x.value}</div><div class="nw">${x.what}</div></div>`).join('')}</div></section>` : ''}
      ${s && s.traps && s.traps.length ? `<section class="sum-sec"><h2 class="h-sec">Traps <small>${s.traps.length}</small></h2><ul class="traps prose">${s.traps.map((x) => `<li>${x}</li>`).join('')}</ul></section>` : ''}
      ${mqs.length ? `<section class="sum-sec"><h2 class="h-sec">Put it together <small>${mqs.length} questions</small></h2><div data-qs></div></section>` : ''}
      ${nx ? `<a class="next-topic" style="margin-top:56px" href="#${nx.key}"><div><small>Up next</small><strong>${rt(nx.title)}</strong></div><span class="arrow">${icon('right')}</span></a>` : ''}`;
    hydrate(el);
    const qh = $('[data-qs]', el);
    if (qh) mqs.forEach((q) => qh.appendChild(qCard(q)));
    return { el };
  }

  // ---------------------------------------------------------------- question card
  const TYPE_LABEL = { decide: 'Decide', predict: 'Predict', explain: 'Explain', troubleshoot: 'Troubleshoot', design: 'Design', numerical: 'Numerical', interpret: 'Interpret' };
  function qState(id) { return S.q[id] || (S.q[id] = { seen: 0, right: 0, wrong: 0 }); }
  function levelDots(l) { return `<span class="qlevel" title="Level ${l} of 3">${[1, 2, 3].map((k) => `<i class="${k <= l ? 'on' : ''}"></i>`).join('')}</span>`; }
  function statusTag(id) { const st = S.q[id] && S.q[id].status; return st === 'got' ? '<span class="qstatus got">Got it</span>' : st === 'revisit' ? '<span class="qstatus revisit">Revisit</span>' : ''; }
  function topicName(q) { if (q.topic === 'mixed') return 'Across modules'; if (q.topic === 'summary') return `Module ${+MOD[q.module].num} · across topics`; const t = TOPIC[q.topic]; return t ? (t.short || t.title) : ''; }
  function answerHTML(q) {
    return `<div class="qans-inner">
      <div class="verdict prose">${q.answer || ''}</div>
      ${q.explain ? `<div class="why prose">${q.explain}</div>` : ''}
      ${q.points && q.points.length ? `<div class="pts-title">What the examiner wants to see</div><ul class="pts prose">${q.points.map((p) => `<li>${p}</li>`).join('')}</ul>` : ''}
    </div>`;
  }
  function qCard(q, opts) {
    opts = opts || {};
    const card = h('article', { class: 'qcard', id: 'q-' + q.id });
    const letters = 'ABCD';
    card.innerHTML = `
      <div class="qmeta"><span class="qtype">${TYPE_LABEL[q.type] || q.type}</span>${levelDots(q.level || 2)}<span>${esc(topicName(q))}</span><span data-st>${statusTag(q.id)}</span></div>
      <div class="qtext prose">${q.q}</div>
      ${q.options ? `<ol class="qopts">${q.options.map((o, k) => `<li><button class="qopt" data-k="${k}"><span class="k">${letters[k]}</span><span>${o}</span></button></li>`).join('')}</ol>` : ''}
      <div class="qactions">
        <button class="btn small" data-act="reveal">Show answer</button>
        <button class="btn small ghost" data-act="got">${icon('check')}Got it</button>
        <button class="btn small ghost" data-act="revisit">${icon('rotate')}Revisit</button>
      </div>
      <div class="qans${opts.open ? ' open' : ''}"><div>${q.answer != null || q.correct != null ? answerHTML(q) : proCard('Answer and explanation', 'The verdict, the reasoning and what the examiner wants to see, for every question. Part of Pro.', 'answer')}</div></div>`;
    hydrate(card);
    const ans = $('.qans', card), rev = $('[data-act="reveal"]', card);
    const paintRev = () => { rev.textContent = ans.classList.contains('open') ? 'Hide answer' : 'Show answer'; };
    paintRev();
    const markSeen = () => { const st = qState(q.id); st.seen++; save(); };
    rev.addEventListener('click', () => { ans.classList.toggle('open'); if (ans.classList.contains('open')) markSeen(); paintRev(); });
    const setStatus = (v) => { const st = qState(q.id); st.status = st.status === v ? undefined : v; save(); $('[data-st]', card).innerHTML = statusTag(q.id); toast(st.status === 'got' ? 'Marked: got it' : st.status === 'revisit' ? 'Added to revisit' : 'Cleared', st.status === 'revisit' ? 'rotate' : 'check'); };
    $('[data-act="got"]', card).addEventListener('click', () => setStatus('got'));
    $('[data-act="revisit"]', card).addEventListener('click', () => setStatus('revisit'));
    if (q.options) $('.qopts', card).addEventListener('click', (e) => {
      const b = e.target.closest('.qopt'); if (!b || b.disabled) return;
      if (q.correct == null) { ans.classList.add('open'); paintRev(); return; } // free: no marking, the answer card says why
      const k = +b.dataset.k, right = k === q.correct;
      $$('.qopt', card).forEach((x) => { x.disabled = true; const kk = +x.dataset.k; if (kk === q.correct) x.classList.add('right'); else if (kk === k) x.classList.add('wrong'); else x.classList.add('dim'); });
      const st = qState(q.id); st.seen++; if (right) st.right++; else { st.wrong++; st.status = 'revisit'; } save();
      $('[data-st]', card).innerHTML = statusTag(q.id);
      ans.classList.add('open'); paintRev();
      trackAnswer(q, right);
      if (opts.onAnswer) opts.onAnswer(right);
    });
    return card;
  }

  // ---------------------------------------------------------------- question bank
  const bankUI = { mod: 'all', topic: 'all', type: 'all', level: 0, status: 'all', open: false };
  function viewBank(r) {
    if (r.arg) {
      if (MOD[r.arg]) { bankUI.mod = r.arg; bankUI.topic = 'all'; }
      else if (TOPIC[r.arg]) { bankUI.mod = TOPIC[r.arg].module; bankUI.topic = r.arg; }
      else if (r.arg === 'mixed') { bankUI.mod = 'mixed'; bankUI.topic = 'all'; }
      else { const mm = r.arg.match(/^(m[0-9]+)-summary$/); if (mm) { bankUI.mod = mm[1]; bankUI.topic = 'summary'; } }
    } else { bankUI.mod = 'all'; bankUI.topic = 'all'; }
    setCrumbs([{ t: 'Home', href: '#home' }, { t: 'Question bank' }]);
    setActive(r.arg ? 'questions.' + r.arg : 'questions'); document.title = 'Question bank · BAPHY105 Notes';
    const el = h('div', { class: 'view' });
    const types = Array.from(new Set(QS.map((q) => q.type))).filter(Boolean);
    const got = QS.filter((q) => S.q[q.id] && S.q[q.id].status === 'got').length;
    const rv = QS.filter((q) => S.q[q.id] && S.q[q.id].status === 'revisit').length;
    el.innerHTML = `
      <div class="eyebrow"><span class="code">Practice</span><span>${QS.length} questions</span><span class="dot">·</span><span>${got} got it · ${rv} to revisit</span></div>
      <h1 class="h-display">Question bank</h1>
      <p class="blurb">Each one puts you in a situation and asks you to reason it out. Answer it in your head or on paper first, then open the answer. Mark each as <b style="color:var(--white)">got it</b> or <b style="color:var(--white)">revisit</b>.</p>
      <div class="filters">
        <div class="frow"><span class="flabel">Module</span>${[['all', 'All'], ...MODULES.filter((m) => m.topics.length).map((m) => [m.id, `Module ${+m.num}`]), ...((QBY.mixed || []).length ? [['mixed', 'Mixed']] : [])].map(([v, l]) => `<button class="fchip" data-f="mod" data-v="${v}">${l}</button>`).join('')}</div>
        <div class="frow"><span class="flabel">Topic</span><select class="fselect" data-f="topic" aria-label="Topic"></select></div>
        <div class="frow"><span class="flabel">Type</span>${[['all', 'All'], ...types.map((t) => [t, TYPE_LABEL[t] || t])].map(([v, l]) => `<button class="fchip" data-f="type" data-v="${v}">${l}</button>`).join('')}</div>
        <div class="frow"><span class="flabel">Level</span>${[[0, 'Any'], [1, 'Warm-up'], [2, 'Solid'], [3, 'Stretch']].map(([v, l]) => `<button class="fchip" data-f="level" data-v="${v}">${l}</button>`).join('')}</div>
        <div class="frow"><span class="flabel">Status</span>${[['all', 'All'], ['unseen', 'Unseen'], ['revisit', 'Revisit'], ['got', 'Got it']].map(([v, l]) => `<button class="fchip" data-f="status" data-v="${v}">${l}</button>`).join('')}</div>
        <div class="frow" style="justify-content:space-between"><button class="pill" data-f="open"><span>Show all answers</span><span class="switch"></span></button><span class="muted" data-count style="font-size:13px"></span><button class="btn small" data-act="practice">${icon('play')}Practise these one by one</button></div>
      </div>
      <div data-list></div>`;
    const list = $('[data-list]', el), sel = $('[data-f="topic"]', el);
    function fillTopics() {
      const mods = bankUI.mod === 'all' ? MODULES : bankUI.mod === 'mixed' ? [] : [MOD[bankUI.mod]];
      sel.innerHTML = `<option value="all">All topics</option>` + mods.map((m) => m.topics.map((t) => `<option value="${t.id}">${rt(t.short || t.title)} (${(QBY[t.id] || []).length})</option>`).join('') + (QS.some((q) => q.topic === 'summary' && q.module === m.id) ? `<option value="summary">Module ${+m.num}: across topics</option>` : '')).join('');
      sel.value = bankUI.topic; if (sel.value !== bankUI.topic) { bankUI.topic = 'all'; sel.value = 'all'; }
      sel.disabled = bankUI.mod === 'mixed';
    }
    function filtered() {
      return QS.filter((q) => {
        if (bankUI.mod === 'mixed') { if (q.topic !== 'mixed') return false; }
        else if (bankUI.mod !== 'all' && (q.module !== bankUI.mod || q.topic === 'mixed')) return false;
        if (bankUI.topic !== 'all' && q.topic !== bankUI.topic) return false;
        if (bankUI.type !== 'all' && q.type !== bankUI.type) return false;
        if (bankUI.level && q.level !== bankUI.level) return false;
        const st = S.q[q.id];
        if (bankUI.status === 'unseen' && st && st.seen) return false;
        if (bankUI.status === 'revisit' && !(st && st.status === 'revisit')) return false;
        if (bankUI.status === 'got' && !(st && st.status === 'got')) return false;
        return true;
      });
    }
    function paint() {
      $$('.fchip', el).forEach((b) => b.classList.toggle('on', String(bankUI[b.dataset.f]) === b.dataset.v));
      $('[data-f="open"]', el).classList.toggle('on', bankUI.open);
      const qs = filtered();
      $('[data-count]', el).textContent = `${qs.length} shown`;
      list.innerHTML = '';
      if (!qs.length) { list.appendChild(h('div', { class: 'empty', text: 'No questions match these filters.' })); return; }
      let lastG = null, lastT = null, grp = null;
      qs.forEach((q) => {
        const g = qGroupKey(q);
        if (g !== lastG) {
          grp = h('section', { class: 'qgroup' });
          grp.appendChild(h('h2', { text: g === 'mixed' ? 'Mixed: across modules' : `Module ${+MOD[g].num} · ${MOD[g].title}` }));
          list.appendChild(grp); lastG = g; lastT = null;
        }
        if (q.topic !== lastT && q.topic !== 'mixed') {
          const t = TOPIC[q.topic];
          grp.appendChild(h('h3', { html: t ? `<a href="#${t.id}">${rt(t.title)}</a><span class="faint">${(QBY[t.id] || []).length}</span>` : 'Across the module' }));
          lastT = q.topic;
        }
        grp.appendChild(qCard(q, { open: bankUI.open }));
      });
      if (pendingQ) {
        const c = document.getElementById('q-' + pendingQ);
        if (c) { $('.qans', c).classList.add('open'); setTimeout(() => c.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' }), 200); c.style.borderColor = 'var(--white)'; setTimeout(() => { c.style.borderColor = ''; }, 2400); }
        pendingQ = null;
      }
    }
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-f]');
      if (b && b.tagName === 'BUTTON') {
        const f = b.dataset.f;
        if (f === 'open') bankUI.open = !bankUI.open;
        else { bankUI[f] = f === 'level' ? +b.dataset.v : b.dataset.v; if (f === 'mod') { bankUI.topic = 'all'; fillTopics(); } }
        paint();
      }
      if (e.target.closest('[data-act="practice"]')) { quizUI.preset = filtered().map((q) => q.id); navigate('#quiz'); }
    });
    sel.addEventListener('change', () => { bankUI.topic = sel.value; paint(); });
    fillTopics(); paint();
    return { el };
  }

  // ---------------------------------------------------------------- quiz
  const quizUI = { mods: null, format: 'mcq', count: 10, smart: true, run: null, preset: null };
  function viewQuiz(r) {
    setCrumbs([{ t: 'Home', href: '#home' }, { t: 'Quiz' }]); setActive('quiz'); document.title = 'Quiz · BAPHY105 Notes';
    const el = h('div', { class: 'view' });
    if (r.arg && MOD[r.arg]) quizUI.mods = [r.arg];
    if (!quizUI.mods) quizUI.mods = MODULES.filter((m) => m.topics.length).map((m) => m.id);
    let keyHandler = null;
    function pool() {
      if (quizUI.preset) return quizUI.preset.map((id) => QID[id]).filter(Boolean);
      return QS.filter((q) => (quizUI.mods.includes(q.module)) && (quizUI.format === 'mixed' || (quizUI.format === 'mcq' ? q.options : !q.options)));
    }
    function pick() {
      let p = pool();
      if (quizUI.preset) { quizUI.preset = null; return p; }
      if (quizUI.smart) {
        const w = (q) => { if ((S.confusing[q.topic] || []).length) return -1; const st = S.q[q.id]; if (!st || !st.seen) return 0; if (st.status === 'revisit' || st.wrong > st.right) return 1; return 2; };
        p = shuffle(p).sort((a, b) => w(a) - w(b));
      } else p = shuffle(p);
      return quizUI.count ? p.slice(0, quizUI.count) : p;
    }
    function quizLabel(list) {
      const tops = [...new Set(list.map((q) => q.topic))], mods = [...new Set(list.map((q) => q.module))];
      if (tops.length === 1 && TOPIC[tops[0]]) return TOPIC[tops[0]].title;
      if (mods.length === 1 && MOD[mods[0]]) return `Module ${+MOD[mods[0]].num}: ${MOD[mods[0]].title}`;
      return 'Modules ' + mods.filter((x) => MOD[x]).map((x) => +MOD[x].num).join(', ');
    }
    function setup() {
      el.innerHTML = `
        <div class="eyebrow"><span class="code">Practice</span><span>Quiz</span></div>
        <h1 class="h-display">Quiz</h1>
        <p class="blurb">Pick what to cover. Multiple-choice questions are marked for you; open ones you mark yourself after reading the model answer.</p>
        <div class="filters quiz-setup">
          <div class="frow"><span class="flabel">Modules</span>${MODULES.filter((m) => m.topics.length).map((m) => `<button class="fchip" data-m="${m.id}">Module ${+m.num} · ${esc(m.title)}</button>`).join('')}</div>
          <div class="frow"><span class="flabel">Format</span>${[['mcq', 'Multiple choice'], ['open', 'Open (self-marked)'], ['mixed', 'Both']].map(([v, l]) => `<button class="fchip" data-fmt="${v}">${l}</button>`).join('')}</div>
          <div class="frow"><span class="flabel">Length</span>${[[10, '10'], [20, '20'], [30, '30'], [0, 'All']].map(([v, l]) => `<button class="fchip" data-n="${v}">${l}</button>`).join('')}</div>
          <div class="frow"><span class="flabel">Order</span><button class="pill" data-smart><span>Weak spots, unseen and missed first</span><span class="switch"></span></button></div>
          <div class="frow"><button class="btn primary" data-start></button></div>
        </div>`;
      const paint = () => {
        $$('[data-m]', el).forEach((b) => b.classList.toggle('on', quizUI.mods.includes(b.dataset.m)));
        $$('[data-fmt]', el).forEach((b) => b.classList.toggle('on', b.dataset.fmt === quizUI.format));
        $$('[data-n]', el).forEach((b) => b.classList.toggle('on', +b.dataset.n === quizUI.count));
        $('[data-smart]', el).classList.toggle('on', quizUI.smart);
        const n = pool().length, c = quizUI.count ? Math.min(quizUI.count, n) : n;
        const s = $('[data-start]', el); s.innerHTML = `${icon('play')}Start ${c} question${c === 1 ? '' : 's'}`; s.disabled = !c;
      };
      el.onclick = (e) => {
        const m = e.target.closest('[data-m]'), f = e.target.closest('[data-fmt]'), n = e.target.closest('[data-n]');
        if (m) { const id = m.dataset.m; quizUI.mods = quizUI.mods.includes(id) ? quizUI.mods.filter((x) => x !== id) : quizUI.mods.concat(id); if (!quizUI.mods.length) quizUI.mods = [id]; }
        if (f) quizUI.format = f.dataset.fmt;
        if (n) quizUI.count = +n.dataset.n;
        if (e.target.closest('[data-smart]')) quizUI.smart = !quizUI.smart;
        if (e.target.closest('[data-start]')) { start(pick()); return; }
        paint();
      };
      paint();
    }
    function start(list, mastery) {
      // mastery carries over from round to round while the student keeps focusing on the questions they missed
      mastery = mastery || { start: Date.now(), rounds: 0, label: quizLabel(list), total: list.length };
      mastery.rounds++;
      quizUI.run = { list, i: 0, right: 0, wrong: 0, open: 0, missed: [], mastery };
      el.onclick = null;
      step();
    }
    function step() {
      const run = quizUI.run;
      if (run.i >= run.list.length) return finish();
      const q = run.list[run.i];
      el.innerHTML = `
        <div class="eyebrow"><span class="code">Quiz</span><span>${esc(topicName(q))}</span></div>
        <div class="quiz-top"><span>${run.i + 1} / ${run.list.length}</span><div class="bar"><i style="width:${(run.i / run.list.length) * 100}%"></i></div><span>${run.right} right</span></div>
        <div data-card></div>
        <div class="btn-row" style="margin-top:16px;justify-content:space-between"><button class="btn ghost" data-quit>End quiz</button><button class="btn primary" data-next hidden>${run.i + 1 === run.list.length ? 'See results' : 'Next question'} ${icon('right')}</button></div>`;
      const holder = $('[data-card]', el);
      const next = $('[data-next]', el);
      let answered = false;
      const card = qCard(q, {
        onAnswer(right) { answered = true; if (right) run.right++; else { run.wrong++; run.missed.push(q.id); } next.hidden = false; next.focus({ preventScroll: true }); }
      });
      card.classList.add('quiz-card');
      if (q.options) $('.qactions', card).remove();
      else {
        const acts = $('.qactions', card);
        acts.innerHTML = `<button class="btn small" data-act="reveal2">Show model answer</button>`;
        $('[data-act="reveal2"]', acts).addEventListener('click', () => {
          $('.qans', card).classList.add('open'); qState(q.id).seen++; save();
          acts.innerHTML = `<span class="muted" style="font-size:13.5px">How did you do?</span><button class="btn small" data-self="1">${icon('check')}I had it</button><button class="btn small" data-self="0">${icon('rotate')}Not yet</button>`;
          acts.addEventListener('click', (e) => {
            const b = e.target.closest('[data-self]'); if (!b || answered) return;
            answered = true; const ok = b.dataset.self === '1';
            const st = qState(q.id); st.status = ok ? 'got' : 'revisit'; if (ok) { st.right++; run.right++; } else { st.wrong++; run.wrong++; run.missed.push(q.id); } save();
            run.open++;
            b.classList.add('primary');
            next.hidden = false; next.focus({ preventScroll: true });
          });
        });
      }
      holder.appendChild(card);
      next.addEventListener('click', () => { run.i++; step(); pageScroller().scrollTo({ top: 0 }); });
      $('[data-quit]', el).addEventListener('click', finish);
      if (keyHandler) document.removeEventListener('keydown', keyHandler);
      keyHandler = (e) => {
        if (typing(e) || !current || current.view !== 'quiz') return;
        if (/^[1-4]$/.test(e.key) && q.options && !answered) { const b = $(`.qopt[data-k="${+e.key - 1}"]`, card); if (b) b.click(); }
        if (e.key === 'Enter' && !next.hidden) { e.preventDefault(); next.click(); }
      };
      document.addEventListener('keydown', keyHandler);
    }
    function finish() {
      const run = quizUI.run; quizUI.run = null;
      const total = run.right + run.wrong;
      const pct = total ? Math.round((run.right / total) * 100) : 0;
      const M = run.mastery;
      if (total && !run.wrong && total === run.list.length) { // every question right: the topic is mastered
        const secs = Math.max(1, Math.round((Date.now() - M.start) / 1000));
        el.innerHTML = `
        <div class="eyebrow"><span class="code">Quiz</span><span>Mastered</span></div>
        <div class="mastered">${icon('trophy')}<h1 class="h-display">${M.rounds === 1 ? 'Perfect score!' : 'You mastered it!'}</h1>
          <p class="blurb">${M.rounds === 1 ? `All ${total} right on the first try` : `Every question right after ${M.rounds} rounds`} on <b style="color:var(--white)">${rt(M.label)}</b>. It took you <b style="color:var(--white)">${fmtDur(secs, true)}</b> to master ${M.total} question${M.total === 1 ? '' : 's'}.</p></div>
        <div class="btn-row"><button class="btn primary" data-sharem>${icon('share')}Share this</button><button class="btn" data-new>${icon('quiz')}New quiz</button><a class="btn" href="#battle">${icon('swords')}Battle a friend</a></div>`;
        el.onclick = (e) => {
          if (e.target.closest('[data-sharem]')) openShareCard({ kind: 'mastery', label: plain(M.label), secs, rounds: M.rounds, total: M.total });
          if (e.target.closest('[data-new]')) setup();
        };
        stagger(el);
        return;
      }
      el.innerHTML = `
        <div class="eyebrow"><span class="code">Quiz</span><span>Results</span></div>
        <h1 class="h-display">${pct >= 80 ? 'Strong work.' : pct >= 50 ? 'Getting there.' : 'Worth another pass.'}</h1>
        <div class="score"><div class="ring" style="--p:${pct}"><span>${pct}%</span></div>
          <div><p class="blurb" style="margin:0">${run.right} right, ${run.wrong} to review${total < run.list.length ? `, ${run.list.length - total} skipped` : ''}.</p><p class="muted" style="margin:6px 0 0;font-size:14px">Missed questions are saved to Revisit in the question bank.</p></div></div>
        ${run.missed.length ? `<p class="muted" style="font-size:14.5px;margin:0 0 12px">Focus on your weak spots: a quick round of just the ${run.missed.length} you missed. Keep going until you get them all right${M.rounds > 1 ? ` (round ${M.rounds + 1})` : ''}.</p>` : ''}
        <div class="btn-row">${run.missed.length ? `<button class="btn primary" data-retry>${icon('flag')}Focus on weak spots (${run.missed.length})</button>` : ''}<button class="btn" data-new>${icon('quiz')}New quiz</button><a class="btn" href="#questions">${icon('q')}Question bank</a></div>
        ${run.missed.length ? `<section class="sum-sec"><h2 class="h-sec">Review these</h2><div data-missed></div></section>` : ''}`;
      const mh = $('[data-missed]', el);
      if (mh) run.missed.forEach((id) => mh.appendChild(qCard(QID[id], { open: true })));
      el.onclick = (e) => {
        if (e.target.closest('[data-retry]')) start(shuffle(run.missed.map((id) => QID[id])), M);
        if (e.target.closest('[data-new]')) setup();
      };
      stagger(el);
    }
    if (quizUI.preset) start(pick()); else setup();
    return { el, cleanup() { if (keyHandler) document.removeEventListener('keydown', keyHandler); } };
  }

  // ---------------------------------------------------------------- flashcards
  function viewCards(r) {
    setCrumbs([{ t: 'Home', href: '#home' }, { t: 'Flashcards' }]); setActive('cards'); document.title = 'Flashcards · BAPHY105 Notes';
    const el = h('div', { class: 'view' });
    const state = { mod: 'all', topic: 'all', learning: false, deck: [], i: 0, flipped: false };
    if (r.arg) { if (MOD[r.arg]) state.mod = r.arg; else if (TOPIC[r.arg]) { state.mod = TOPIC[r.arg].module; state.topic = r.arg; } }
    el.innerHTML = `
      <div class="eyebrow"><span class="code">Practice</span><span>${CARDS.length} cards</span></div>
      <h1 class="h-display">Flashcards</h1>
      ${PRO ? '' : proCard(`3 sample cards per topic · ${TOPICS.reduce((n, t) => n + (t.cardCount || 0), 0)} cards in all`, 'Pro opens every card, with the still-learning pile kept between visits.', 'cards')}
      <p class="blurb">Say the answer out loud, then flip. Sort each card with the arrow keys: <kbd>←</kbd> still learning, <kbd>→</kbd> know it, <kbd>Space</kbd> to flip.</p>
      <div class="deck-bar">
        ${[['all', 'All'], ...MODULES.filter((m) => m.topics.length).map((m) => [m.id, `Module ${+m.num}`])].map(([v, l]) => `<button class="fchip" data-cm="${v}">${l}</button>`).join('')}
        <select class="fselect" data-ct aria-label="Topic"></select>
        <button class="pill" data-learn><span>Still learning only</span><span class="switch"></span></button>
        <button class="btn small" data-shuf>${icon('shuffle')}Shuffle</button>
      </div>
      <div class="card-stage"><div class="fcard" tabindex="0" aria-live="polite"><div class="fface front"></div><div class="fface back"></div></div></div>
      <div class="card-ctrl"><button class="btn" data-again>${icon('rotate')}Still learning</button><button class="btn" data-flip>Flip</button><button class="btn primary" data-know>${icon('check')}Know it</button></div>
      <div class="card-count"></div>`;
    const card = $('.fcard', el), sel = $('[data-ct]', el);
    function fillTopics() {
      const mods = state.mod === 'all' ? MODULES : [MOD[state.mod]];
      sel.innerHTML = `<option value="all">All topics</option>` + mods.map((m) => m.topics.map((t) => `<option value="${t.id}">${rt(t.short || t.title)} (${(t.flashcards || []).length})</option>`).join('')).join('');
      sel.value = state.topic; if (sel.value !== state.topic) { state.topic = 'all'; sel.value = 'all'; }
    }
    function build(shuf) {
      let d = CARDS.filter((c) => (state.mod === 'all' || c.module === state.mod) && (state.topic === 'all' || c.topic === state.topic));
      if (state.learning) d = d.filter((c) => S.cards[c.key] !== 'know');
      state.deck = shuf ? shuffle(d) : d; state.i = 0; state.flipped = false;
      paint(true);
    }
    function paint(swap) {
      $$('[data-cm]', el).forEach((b) => b.classList.toggle('on', b.dataset.cm === state.mod));
      $('[data-learn]', el).classList.toggle('on', state.learning);
      const known = state.deck.filter((c) => S.cards[c.key] === 'know').length;
      const c = state.deck[state.i];
      card.classList.toggle('flip', state.flipped);
      if (swap) { card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap'); }
      const front = $('.front', card), back = $('.back', card);
      if (!c) {
        front.innerHTML = `<span class="ftag">Deck</span><div class="ftext">${state.deck.length ? 'Deck finished.' : 'No cards here.'}</div><div class="fhint">${state.deck.length ? 'Shuffle or pick another deck to go again.' : 'Try another filter.'}</div>`;
        back.innerHTML = '';
        $('.card-count', el).textContent = `${known} of ${state.deck.length} known`;
        return;
      }
      const t = TOPIC[c.topic];
      front.innerHTML = `<span class="ftag">${rt(t ? t.short || t.title : '')}</span><div class="ftext">${c.front}</div><div class="fhint">Tap or press Space to flip</div>`;
      back.innerHTML = `<span class="ftag">Answer${S.cards[c.key] === 'know' ? ' · known' : ''}</span><div class="ftext">${c.back}</div><div class="fhint">← still learning · know it →</div>`;
      $('.card-count', el).textContent = `Card ${state.i + 1} of ${state.deck.length} · ${known} known`;
    }
    const flip = () => { if (!state.deck[state.i]) return; state.flipped = !state.flipped; paint(false); };
    const rate = (v) => { const c = state.deck[state.i]; if (!c) return; S.cards[c.key] = v; save(); state.i++; state.flipped = false; paint(true); };
    card.addEventListener('click', flip);
    el.addEventListener('click', (e) => {
      const m = e.target.closest('[data-cm]');
      if (m) { state.mod = m.dataset.cm; state.topic = 'all'; fillTopics(); build(false); }
      if (e.target.closest('[data-learn]')) { state.learning = !state.learning; build(false); }
      if (e.target.closest('[data-shuf]')) build(true);
      if (e.target.closest('[data-again]')) rate('again');
      if (e.target.closest('[data-know]')) rate('know');
      if (e.target.closest('[data-flip]')) flip();
    });
    sel.addEventListener('change', () => { state.topic = sel.value; build(false); });
    const onKey = (e) => {
      if (typing(e) || !current || current.view !== 'cards' || document.querySelector('.overlay')) return;
      if (e.key === ' ') { e.preventDefault(); flip(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); rate('know'); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); rate('again'); }
    };
    document.addEventListener('keydown', onKey);
    fillTopics(); build(false);
    return { el, cleanup() { document.removeEventListener('keydown', onKey); } };
  }

  // ---------------------------------------------------------------- formula sheet
  function viewFormulas() {
    setCrumbs([{ t: 'Home', href: '#home' }, { t: 'Formula sheet' }]); setActive('formulas'); document.title = 'Formula sheet · BAPHY105 Notes';
    const el = h('div', { class: 'view' });
    let tab = 'f';
    el.innerHTML = `
      <div class="eyebrow"><span class="code">Practice</span><span>Formula sheet</span></div>
      <h1 class="h-display">Formula sheet</h1>
      <p class="blurb">Everything you should be able to write from memory, grouped by module. Turn on Recall to test the key values.</p>
      <div class="vseg" style="margin-bottom:10px"><button class="vseg-btn" data-t="f">Equations</button><button class="vseg-btn" data-t="n">Numbers</button><button class="vseg-btn" data-t="x">Traps</button></div>
      <div data-body></div>`;
    const body = $('[data-body]', el);
    function paint() {
      $$('[data-t]', el).forEach((b) => b.classList.toggle('on', b.dataset.t === tab));
      body.innerHTML = MODULES.filter((m) => m.topics.length).map((m) => {
        const s = SUM[m.id] || {};
        let inner = '';
        if (tab === 'f') {
          const sumF = s.formulas && s.formulas.length;
          inner = sumF ? `<div class="forms">${s.formulas.map((f) => `<div class="form recallable"><div class="fname">${rt(f.name)}</div><div class="fbody">${f.html}</div>${f.note ? `<div class="fnote">${f.note}</div>` : ''}</div>`).join('')}</div>`
            : m.topics.filter((t) => (t.formulas || []).length).map((t) => `<h3 class="h-sub" style="font-size:18px;margin-top:22px"><a href="#${t.id}" style="text-decoration:none">${rt(t.title)}</a></h3><div class="forms">${t.formulas.map((f) => `<div class="form recallable"><div class="fname">${rt(f.name)}</div><div class="fbody">${f.html}</div>${f.note ? `<div class="fnote">${f.note}</div>` : ''}</div>`).join('')}</div>`).join('');
        } else if (tab === 'n') {
          inner = s.numbers && s.numbers.length ? `<div class="nums recallable">${s.numbers.map((x) => `<div><div class="nv"><b>${x.value}</b></div><div class="nw">${x.what}</div></div>`).join('')}</div>`
            : `<ul class="prose">${[].concat(...m.topics.map((t) => t.oneLiners || [])).map((x) => `<li>${x}</li>`).join('')}</ul>`;
        } else {
          inner = s.traps && s.traps.length ? `<ul class="traps prose">${s.traps.map((x) => `<li>${x}</li>`).join('')}</ul>` : '<p class="muted">No traps listed yet.</p>';
        }
        return `<section class="sum-sec" style="margin-top:44px"><h2 class="h-sec">Module ${+m.num} <small>${esc(m.title)}</small></h2>${inner || '<p class="muted">Nothing here yet.</p>'}</section>`;
      }).join('');
      stagger(body);
    }
    el.addEventListener('click', (e) => { const b = e.target.closest('[data-t]'); if (b) { tab = b.dataset.t; paint(); } });
    paint();
    return { el };
  }

  // ---------------------------------------------------------------- lab bench
  function viewLab() {
    setCrumbs([{ t: 'Home', href: '#home' }, { t: 'Lab bench' }]); setActive('lab'); document.title = 'Lab bench · BAPHY105 Notes';
    const el = h('div', { class: 'view' });
    const ids = allViz();
    el.innerHTML = `
      <div class="eyebrow"><span class="code">Practice</span><span>${ids.length} interactive models</span></div>
      <h1 class="h-display">Lab bench</h1>
      <p class="blurb">Every animation, model and calculator from the notes, in one place. Open one, play with it, then jump to the tab where it's explained.</p>
      ${ids.length ? '' : '<div class="empty">Interactive models are still loading.</div>'}
      ${MODULES.map((m) => {
        const mine = allViz().filter((id) => vizModule(id) === m.id);
        if (!mine.length) return '';
        return `<section class="sum-sec" style="margin-top:40px"><h2 class="h-sec">Module ${+m.num} <small>${esc(m.title)}</small></h2><div class="lab-grid">${mine.map((id) => {
          const d = window.VIZ.def(id) || {};
          return `<div class="lab-item" data-id="${id}"><button class="lab-head" aria-expanded="false"><span class="k">${esc(d.kind || 'Interactive')}</span><span class="t">${esc(d.title || id)}</span>${icon('chev', 'sb-chev')}</button><div class="lab-body" hidden></div></div>`;
        }).join('')}</div></section>`;
      }).join('')}`;
    let open = null;
    el.addEventListener('click', (e) => {
      const hd = e.target.closest('.lab-head'); if (!hd) return;
      const item = hd.parentElement, id = item.dataset.id, body = $('.lab-body', item);
      if (open && open.item !== item) { open.hnd.destroy(); $('.lab-body', open.item).hidden = true; $('.lab-head', open.item).setAttribute('aria-expanded', 'false'); open = null; }
      if (open && open.item === item) { open.hnd.destroy(); body.hidden = true; hd.setAttribute('aria-expanded', 'false'); open = null; return; }
      body.hidden = false; hd.setAttribute('aria-expanded', 'true');
      body.innerHTML = '<div class="viz-host"></div>';
      const at = VIZ_AT[id];
      if (at && TOPIC[at.topic]) body.appendChild(h('p', { class: 'where', html: `Explained in <a href="#${at.topic}.${at.tab}">${rt(TOPIC[at.topic].title)} › ${rt(TOPIC[at.topic].tabs[at.tab].title)}</a>` }));
      const hnd = window.VIZ.mount($('.viz-host', body), id);
      open = { item, hnd };
      setTimeout(() => item.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' }), 50);
    });
    return { el, cleanup() { if (open) open.hnd.destroy(); } };
  }

  // ---------------------------------------------------------------- mine
  function viewMine() {
    setCrumbs([{ t: 'Home', href: '#home' }, { t: 'Highlights & notes' }]); setActive('mine'); document.title = 'Highlights & notes · BAPHY105 Notes';
    const el = h('div', { class: 'view' });
    const hl = [];
    TOPICS.forEach((t) => (S.hl[t.id] || []).forEach((x) => hl.push({ t, x })));
    const notes = TOPICS.filter((t) => S.notes[t.id]);
    const weak = []; TOPICS.forEach((t) => (S.confusing[t.id] || []).forEach((i) => { if (t.tabs[i]) weak.push({ t, i }); }));
    const tagged = TOPICS.filter((t) => S.tags[t.id]);
    const rv = QS.filter((q) => S.q[q.id] && S.q[q.id].status === 'revisit');
    const learning = CARDS.filter((c) => S.cards[c.key] === 'again').length;
    el.innerHTML = `
      <div class="eyebrow"><span class="code">Yours</span><span>${hl.length} highlights · ${notes.length} notes · ${rv.length} to revisit</span></div>
      <h1 class="h-display">Highlights & notes</h1>
      <p class="blurb">Everything you've marked, in one place. Select text in any topic to add a highlight.</p>
      <section class="sum-sec" style="margin-top:36px"><h2 class="h-sec">My weak spots <small>${weak.length}</small></h2>
        ${weak.length ? `<div>${weak.map(({ t, i }) => `<a class="trow" href="#${t.id}.${i}"><span class="tick" style="box-shadow:none;background:none;color:var(--warn)">${icon('flag')}</span><div><h3>${rt(t.tabs[i].title)}</h3><p>${rt(t.title)}</p></div><span class="meta">revisit <span class="arrow">→</span></span></a>`).join('')}</div><p class="muted" style="font-size:14px;margin-top:10px">The quiz asks about these topics first.</p>` : '<div class="empty">Tap "Confusing?" at the bottom of any tab to collect it here.</div>'}
      </section>
      <section class="sum-sec"><h2 class="h-sec">Highlights <small>${hl.length}</small></h2>
        ${hl.length ? hl.map(({ t, x }) => `<div class="hl-item"><span class="sw c${x.c}"></span><div><q>${esc(x.text)}</q><a href="#${t.id}.${x.tab}">${rt(t.title)} › ${esc((t.tabs[x.tab] || {}).title || '')}</a></div><button class="icon-btn" data-del="${t.id}|${x.id}" aria-label="Remove highlight">${icon('x')}</button></div>`).join('') : '<div class="empty">No highlights yet. Select any line in a topic and pick a colour.</div>'}
      </section>
      <section class="sum-sec"><h2 class="h-sec">My notes <small>${notes.length}</small></h2>
        ${notes.length ? notes.map((t) => `<div class="hl-item"><span class="sw c1" style="opacity:.3"></span><div><div style="white-space:pre-wrap;color:var(--text-2);font-size:15px">${esc(S.notes[t.id])}</div><a href="#${t.id}">${rt(t.title)}</a></div><span></span></div>`).join('') : '<div class="empty">No notes yet. Each topic has a notes box at the bottom.</div>'}
      </section>
      <section class="sum-sec"><h2 class="h-sec">Tagged topics <small>${tagged.length}</small></h2>
        ${tagged.length ? `<div>${tagged.map(topicRow).join('')}</div>` : '<div class="empty">Tag topics with the dot next to them in the sidebar.</div>'}
      </section>
      <section class="sum-sec"><h2 class="h-sec">Questions to revisit <small>${rv.length}</small></h2><div data-rv></div>
        ${rv.length ? '' : '<div class="empty">Questions you miss or mark "Revisit" land here.</div>'}
        ${learning ? `<p class="muted" style="margin-top:14px">${learning} flashcards marked still learning. <a href="#cards">Open flashcards</a></p>` : ''}
      </section>`;
    const rh = $('[data-rv]', el);
    rv.forEach((q) => rh.appendChild(qCard(q)));
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-del]'); if (!b) return;
      const [tid, hid] = b.dataset.del.split('|');
      S.hl[tid] = (S.hl[tid] || []).filter((x) => x.id !== hid); save();
      b.closest('.hl-item').remove(); toast('Highlight removed', 'trash');
    });
    return { el };
  }

  // ================================================================ overlays
  function overlay(build, opts) {
    const ov = h('div', { class: 'overlay', role: 'dialog', 'aria-modal': 'true' });
    const close = () => { ov.remove(); document.removeEventListener('keydown', onKey, true); if (opts && opts.onClose) opts.onClose(); };
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    ov.addEventListener('mousedown', (e) => { if (e.target === ov) close(); });
    document.addEventListener('keydown', onKey, true);
    ov.appendChild(build(close));
    document.body.appendChild(ov);
    return close;
  }

  // ---------------------------------------------------------------- search
  let INDEX = null;
  function buildIndex() {
    INDEX = [];
    TOPICS.forEach((t) => {
      INDEX.push({ k: 'Topic', title: t.title, text: t.blurb, href: '#' + t.id, w: 6 });
      t.tabs.forEach((tb, i) => INDEX.push({ k: 'Section', title: `${t.short || t.title} › ${tb.title}`, text: plain(tb.html), href: `#${t.id}.${i}`, w: 3, find: true }));
      (t.flashcards || []).forEach((c) => INDEX.push({ k: 'Flashcard', title: plain(c.front), text: plain(c.back), href: '#cards.' + t.id, w: 1 }));
    });
    MODULES.forEach((m) => {
      const s = SUM[m.id]; if (!s) return;
      INDEX.push({ k: 'Summary', title: `Module ${+m.num} summary`, text: plain([s.tldr].concat((s.bigIdeas || []).map((b) => b.html), (s.traps || [])).join(' ')), href: `#${m.id}-summary`, w: 2 });
      (s.formulas || []).forEach((f) => INDEX.push({ k: 'Formula', title: f.name, text: plain(f.html + ' ' + (f.note || '')), href: '#formulas', w: 2 }));
    });
    QS.forEach((q) => INDEX.push({ k: 'Question', title: plain(q.q).slice(0, 110), text: plain(q.q + ' ' + q.answer + ' ' + (q.explain || '')), href: '#questions' + (TOPIC[q.topic] ? '.' + q.topic : q.topic === 'mixed' ? '.mixed' : '.' + q.module), qid: q.id, w: 1 }));
    INDEX.forEach((e) => { e.lt = e.title.toLowerCase(); e.lx = e.text.toLowerCase(); });
  }
  function searchQ(query) {
    const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 0);
    if (!words.length) return [];
    const out = [];
    for (const e of INDEX) {
      let score = 0, ok = true;
      for (const w of words) {
        const ti = e.lt.indexOf(w), xi = e.lx.indexOf(w);
        if (ti < 0 && xi < 0) { ok = false; break; }
        score += (ti >= 0 ? 12 + (ti === 0 ? 4 : 0) : 0) + (xi >= 0 ? 2 + Math.max(0, 2 - xi / 400) : 0);
      }
      if (ok) out.push({ e, score: score + e.w });
    }
    out.sort((a, b) => b.score - a.score);
    return out.slice(0, 40).map((x) => x.e);
  }
  function snippet(text, words) {
    const lx = text.toLowerCase();
    let i = -1; for (const w of words) { i = lx.indexOf(w); if (i >= 0) break; }
    let s = i < 0 ? 0 : Math.max(0, i - 50);
    let out = (s > 0 ? '…' : '') + text.slice(s, s + 180) + (s + 180 < text.length ? '…' : '');
    out = esc(out);
    words.forEach((w) => { if (w.length > 1) out = out.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); });
    return out;
  }
  function openSearch() {
    if (document.querySelector('.overlay')) return;
    if (!INDEX) buildIndex();
    let results = [], sel = 0;
    overlay((close) => {
      const box = h('div', { class: 'modal' });
      box.innerHTML = `<div class="modal-head">${icon('search')}<input class="search-in" id="search-input" type="search" placeholder="Search topics, sections, questions, formulas" autocomplete="off" aria-label="Search"><kbd>Esc</kbd></div><ul class="sres" role="listbox"></ul><div class="search-foot"><span>↑↓ to move</span><span>Enter to open</span><span>${TOPICS.length} topics · ${QS.length} questions indexed</span></div>`;
      const inp = $('input', box), ul = $('.sres', box);
      const paint = () => {
        const words = inp.value.toLowerCase().split(/\s+/).filter(Boolean);
        ul.innerHTML = results.length ? results.map((e, i) => `<li><a href="${e.href}" data-i="${i}" class="${i === sel ? 'sel' : ''}"><div class="st"><span class="sk">${e.k}</span>${esc(e.title)}</div><div class="ss">${snippet(e.text, words)}</div></a></li>`).join('')
          : (inp.value.trim() ? '<li class="empty" style="margin:10px">Nothing found. Try a shorter word.</li>' : '<li class="muted" style="padding:14px;font-size:14px">Try "Nafion", "Bragg", "sol-gel", "hypsochromic", "zone refining"…</li>');
        const s = $('a.sel', ul); if (s) s.scrollIntoView({ block: 'nearest' });
      };
      const go = (e) => {
        close();
        const words = inp.value.trim();
        if (e.find) pendingFind = words;
        if (e.qid) pendingQ = e.qid;
        navigate(e.href);
      };
      inp.addEventListener('input', () => { results = searchQ(inp.value); sel = 0; paint(); });
      inp.addEventListener('keydown', (ev) => {
        if (ev.key === 'ArrowDown') { ev.preventDefault(); sel = Math.min(results.length - 1, sel + 1); paint(); }
        else if (ev.key === 'ArrowUp') { ev.preventDefault(); sel = Math.max(0, sel - 1); paint(); }
        else if (ev.key === 'Enter') { ev.preventDefault(); if (results[sel]) go(results[sel]); }
      });
      ul.addEventListener('click', (ev) => { const a = ev.target.closest('a[data-i]'); if (!a) return; ev.preventDefault(); ev.stopPropagation(); go(results[+a.dataset.i]); });
      setTimeout(() => inp.focus(), 20);
      paint();
      return box;
    });
  }

  // ---------------------------------------------------------------- shortcuts, backup, lightbox
  function openKeys() {
    overlay((close) => {
      const m = h('div', { class: 'modal' });
      const k = (s) => s.split(' ').map((x) => `<kbd>${x}</kbd>`).join('');
      m.innerHTML = `<div class="modal-head"><h2>Keyboard shortcuts</h2><button class="icon-btn" data-x aria-label="Close">${icon('x')}</button></div>
        <div class="modal-body"><div class="keys">
          <span>${k(isMac ? '⌘ K' : 'Ctrl K')}${k('/')}</span><span>Search everything</span>
          <span>${k('←')}${k('→')}</span><span>Previous / next tab, running on to the next or previous topic at the ends (flashcards: still learning / know it)</span>
          <span>${k('N')}${k('P')}</span><span>Next / previous topic</span>
          <span>${k('R')}</span><span>Recall mode: blank every key term</span>
          <span>${k('F')}</span><span>Focus mode with a timer (30 min, 1, 2 or 3 hours)</span>
          <span>${k('[')}</span><span>Show or hide the sidebar</span>
          <span>${k('Space')}</span><span>Flip a flashcard</span>
          <span>${k('1')}${k('2')}${k('3')}${k('4')}</span><span>Pick an option in the quiz, <kbd>Enter</kbd> for next</span>
          <span>${k('?')}</span><span>This list</span>
          <span>${k('Esc')}</span><span>Close a dialog or leave focus mode</span>
        </div></div>`;
      $('[data-x]', m).addEventListener('click', close);
      return m;
    });
  }
  function openBackup() {
    overlay((close) => {
      const m = h('div', { class: 'modal' });
      m.innerHTML = `<div class="modal-head"><h2>Back up or restore</h2><button class="icon-btn" data-x aria-label="Close">${icon('x')}</button></div>
        <div class="modal-body">
          <p class="muted" style="margin-top:0;font-size:14.5px">This is everything the app has saved in this browser: progress, tags, highlights, notes, question and flashcard history. Copy it somewhere safe. To restore, paste a backup below and press Restore.</p>
          <textarea class="backup" id="backup-text" spellcheck="false"></textarea>
          <div class="btn-row" style="margin-top:12px">
            <button class="btn primary" data-copy>${icon('copy')}Copy backup</button>
            <button class="btn" data-restore>${icon('rotate')}Restore from the box</button>
            <button class="btn ghost" data-reset style="margin-left:auto">${icon('trash')}Reset everything</button>
          </div><p class="muted" data-msg style="font-size:13px;min-height:1.4em;margin:10px 0 0"></p>
        </div>`;
      const ta = $('textarea', m), msg = $('[data-msg]', m);
      ta.value = JSON.stringify(S);
      $('[data-x]', m).addEventListener('click', close);
      $('[data-copy]', m).addEventListener('click', () => {
        const done = () => { msg.textContent = 'Copied to clipboard.'; };
        const fallback = () => { ta.focus(); ta.select(); msg.textContent = 'Selected. Press ' + (isMac ? '⌘' : 'Ctrl') + '+C to copy.'; };
        try { navigator.clipboard.writeText(ta.value).then(done, fallback); } catch (e) { fallback(); }
      });
      $('[data-restore]', m).addEventListener('click', () => {
        try { const obj = JSON.parse(ta.value); if (!obj || typeof obj !== 'object' || !obj.visited) throw new Error('bad'); S = normalize(obj); save(); msg.textContent = 'Restored.'; refreshAll(); }
        catch (e) { msg.textContent = 'That text is not a valid backup. Paste the whole backup exactly as copied.'; }
      });
      let armed = false;
      $('[data-reset]', m).addEventListener('click', (e) => {
        const b = e.currentTarget;
        if (!armed) { armed = true; b.innerHTML = icon('trash') + 'Click again to erase'; b.classList.remove('ghost'); setTimeout(() => { armed = false; b.innerHTML = icon('trash') + 'Reset everything'; b.classList.add('ghost'); }, 4000); return; }
        S = blank(); save(); ta.value = JSON.stringify(S); msg.textContent = 'Everything reset.'; refreshAll();
      });
      return m;
    });
  }
  function openLightbox(src, caption, alt, svg) {
    const lb = h('div', { class: 'lightbox', role: 'dialog', 'aria-modal': 'true' });
    lb.innerHTML = `<button class="icon-btn lb-close" aria-label="Close">${icon('x')}</button><div class="lb-frame${svg ? ' lb-svg' : ''}">${svg ? `<div role="img" aria-label="${esc(alt || '')}">${svg}</div>` : `<img src="${src}" alt="${esc(alt || '')}">`}</div>${caption ? `<p>${caption}</p>` : ''}`;
    const close = () => { lb.remove(); document.removeEventListener('keydown', onKey, true); };
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    lb.addEventListener('click', (e) => { if (e.target.closest('.lb-frame')) { $('.lb-frame', lb).classList.toggle('zoom'); return; } close(); });
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(lb);
  }
  function refreshAll() { buildSidebar(); updateOverall(); if (current) render(parse(hashOf(current))); }

  // "Help?": a mistake in the notes, a suggestion, something not working, or anything else. Goes to the owner's page.
  function openHelp(tid, ti, idea) {
    const t = TOPIC[tid], tabTitle = t && t.tabs[ti] ? t.tabs[ti].title : '';
    const kinds = [['mistake', 'Mistake in the notes'], ['suggestion', 'Suggestion'], ['bug', "Something isn't working"], ['other', 'Other']];
    let kind = t ? 'mistake' : 'suggestion';
    overlay((close) => {
      const m = h('div', { class: 'modal' });
      m.innerHTML = `<div class="modal-head"><h2>${idea ? 'Any ideas?' : 'Help?'}</h2><button class="icon-btn" data-x aria-label="Close">${icon('x')}</button></div>
        <form class="modal-body report-form">
          ${idea ? `<p class="muted" style="margin-top:0;font-size:14.5px">A feature you want, a topic that needs more, a better way to explain something: anything that would make this site better for you. The owner reads every one.</p>`
            : `<div class="kind-row" role="radiogroup" aria-label="What is it about?">${kinds.map(([k, l]) => `<button type="button" class="fchip${k === kind ? ' on' : ''}" data-kind="${k}" role="radio" aria-checked="${k === kind}">${l}</button>`).join('')}</div>
          ${t ? `<p class="muted" style="margin:0;font-size:14px">About: <b style="color:var(--white)">${rt(t.title)}${tabTitle ? ' › ' + rt(tabTitle) : ''}</b></p>` : ''}`}
          <label>${idea ? 'Your idea' : 'Tell us more'}<textarea id="rep-text" required minlength="5" maxlength="1500" placeholder="${idea ? 'e.g. A timer that shows how long I spend on each module' : 'e.g. The Compton shift at 90° says 4.85 pm but the notes say 2.43 pm'}"></textarea></label>
          <input id="rep-web" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
          <p class="muted" style="margin:0;font-size:13px">Sent with your student email${window.SIGNED_IN_AS ? ` (${esc(window.SIGNED_IN_AS)})` : ''} so the owner can reply.</p>
          <div class="btn-row"><button class="btn primary" type="submit">${idea ? 'Send idea' : 'Send'}</button></div>
          <p class="gate-msg" data-msg role="alert"></p>
        </form>`;
      $('[data-x]', m).addEventListener('click', close);
      $$('[data-kind]', m).forEach((b) => b.addEventListener('click', () => { kind = b.dataset.kind; $$('[data-kind]', m).forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); }); }));
      $('form', m).addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = $('[data-msg]', m), btn = $('button[type=submit]', m);
        btn.disabled = true; msg.textContent = 'Sending…';
        try {
          const r = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: idea ? 'idea' : kind, topic: tid || '', tab: tabTitle, text: $('#rep-text', m).value, website: $('#rep-web', m).value }) });
          const j = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(j.error || 'Could not send. Try again in a moment.');
          close(); toast(idea ? 'Thanks! Idea sent' : 'Thanks! Sent to the owner', 'check');
        } catch (err) { msg.textContent = err.message; btn.disabled = false; }
      });
      setTimeout(() => $('#rep-text', m).focus(), 30);
      return m;
    });
  }
  // Signed out on a phone you use, or someone else has your account? Ask the owner to clear your devices (once a week).
  function openDevices() {
    overlay((close) => {
      const m = h('div', { class: 'modal' });
      m.innerHTML = `<div class="modal-head"><h2>Your devices</h2><button class="icon-btn" data-x aria-label="Close">${icon('x')}</button></div>
        <form class="modal-body report-form">
          <p style="margin:0;font-size:14.5px">Your account works on <b style="color:var(--white)">1 phone + 1 laptop/PC</b>. Signing in on a new one signs out the old one of the same kind.</p>
          <p class="muted" style="margin:0;font-size:14px">If something looks wrong, ask the owner to reset your devices. After it's approved, every device is signed out and you sign in again on the ones you use now.</p>
          <label>Why do you need a reset? <span class="muted">(optional)</span><textarea id="dev-why" maxlength="300" placeholder="e.g. I got a new phone and my old one still shows my account"></textarea></label>
          <div class="btn-row"><button class="btn primary" type="submit">${icon('rotate')}Request a device reset</button></div>
          <p class="muted" style="margin:0;font-size:13px">You can only request a device reset once every week, and it's done only when the owner approves it.</p>
          <p class="gate-msg" data-msg role="alert"></p>
        </form>`;
      $('[data-x]', m).addEventListener('click', close);
      $('form', m).addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = $('[data-msg]', m), btn = $('button[type=submit]', m);
        btn.disabled = true; msg.textContent = 'Sending…';
        try {
          const r = await fetch('/api/restore', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reset-devices', reason: $('#dev-why', m).value }) });
          const j = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(j.error || 'Could not send. Try again in a moment.');
          msg.textContent = 'Request sent. The owner will approve it soon.'; btn.hidden = true;
        } catch (err) { msg.textContent = err.message; btn.disabled = false; }
      });
      return m;
    });
  }

  // Messages: the owner's replies to your Help? requests and ideas (sent from /admin). Opening the list marks them read.
  const KIND_LABEL = { mistake: 'Mistake in the notes', suggestion: 'Suggestion', bug: "Something isn't working", other: 'Other', idea: 'Idea' };
  function paintUnread() {
    const b = $('[data-unread]', sidebar); if (!b) return;
    b.hidden = !inbox.unread; b.textContent = inbox.unread || '';
  }
  async function loadInbox(greet) {
    try {
      const r = await fetch('/api/feedback', { cache: 'no-store' });
      if (!r.ok) return;
      const j = await r.json();
      inbox.messages = Array.isArray(j.messages) ? j.messages : []; inbox.unread = +j.unread || 0;
      paintUnread();
      if (greet && inbox.unread) toast(inbox.unread === 1 ? 'The owner replied to your message. Open Messages in the sidebar.' : `The owner replied to ${inbox.unread} of your messages. Open Messages in the sidebar.`, 'mail', 6000);
    } catch (e) { /* offline: try again next time */ }
  }
  function openMessages() {
    const unread = inbox.unread;
    overlay((close) => {
      const m = h('div', { class: 'modal' });
      const list = inbox.messages.map((x, i) => `<div class="inbox-item${i < unread ? ' new' : ''}">
          <small>You wrote${x.kind ? ' · ' + esc(KIND_LABEL[x.kind] || x.kind) : ''}</small><p class="you">${esc(x.msg)}</p>
          <small>Owner's reply · ${esc(new Date(x.at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit' }))}</small><p class="owner">${esc(x.reply)}</p></div>`).join('');
      m.innerHTML = `<div class="modal-head"><h2>Messages</h2><button class="icon-btn" data-x aria-label="Close">${icon('x')}</button></div>
        <div class="modal-body">${list || `<p class="muted" style="margin:0">No replies yet. When the owner answers something you sent with <b>Help?</b> or <b>Any ideas?</b>, it shows up here.</p>`}</div>`;
      $('[data-x]', m).addEventListener('click', close);
      return m;
    });
    if (unread) { inbox.unread = 0; paintUnread(); fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'read' }) }).catch(() => {}); }
  }
  if (window.SIGNED_IN_AS) setTimeout(() => loadInbox(true), 1500);

  // anonymous counters: one "visit" per browser per day, one "open" per topic per session
  function beacon(data) {
    try { const b = new Blob([JSON.stringify(data)], { type: 'application/json' }); if (!(navigator.sendBeacon && navigator.sendBeacon('/api/track', b))) fetch('/api/track', { method: 'POST', body: b, keepalive: true }).catch(() => {}); } catch (e) { /* ignore */ }
  }
  function trackTopic(id) {
    try { const k = 'bn_seen_' + id; if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, '1'); } catch (e) { return; }
    beacon({ topic: id });
  }
  // first answer to each question per session, so the owner can see which questions trip people up
  const short = (s) => plain(s).slice(0, 140);
  function trackAnswer(q, right) {
    try { const k = 'bn_ans_' + q.id; if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, '1'); } catch (e) { return; }
    beacon({ quiz: q.id, ok: !!right, label: short(q.q) });
  }
  function trackConfusing(tid, ti, on) {
    const t = TOPIC[tid], tb = t && t.tabs[ti];
    beacon({ confusing: tid, tab: ti, on: !!on, label: short((t ? t.short || t.title : tid) + ' › ' + (tb ? tb.title : 'tab ' + (ti + 1))) });
  }
  try { const d = new Date().toISOString().slice(0, 10); if (localStorage.getItem('bn_visit') !== d) { localStorage.setItem('bn_visit', d); beacon({ visit: true }); } } catch (e) { /* ignore */ }

  // ================================================================ study time and streaks
  // Active study time is counted in this browser: 15 s at a time while the page is open, visible and used in the last
  // 3 minutes, or at any time while the focus timer runs (students read for long stretches without touching the page,
  // and taps inside the music player never reach it). A day counts toward the streak once it has at least a minute.
  // Days are Indian time.
  const DAYMS = 864e5, ISTMS = 5.5 * 3600e3;
  const dayKey = (ms) => new Date(ms + ISTMS).toISOString().slice(0, 10);
  const todaySecs = () => +S.study[dayKey(Date.now())] || 0;
  const totalSecs = () => Object.values(S.study).reduce((a, v) => a + (+v || 0), 0);
  function streakDays() {
    let n = 0, t = Date.now();
    if ((+S.study[dayKey(t)] || 0) < 60) t -= DAYMS; // today not started yet: the streak so far still counts
    while ((+S.study[dayKey(t)] || 0) >= 60) { n++; t -= DAYMS; }
    return n;
  }
  function fmtDur(sec, exact) {
    sec = Math.round(sec || 0);
    if (exact && sec < 3600) { const mm = Math.floor(sec / 60), ss = sec % 60; return mm ? `${mm} min ${ss} s` : `${ss} s`; }
    const mm = Math.floor(sec / 60);
    return mm < 60 ? mm + ' min' : Math.floor(mm / 60) + ' h ' + (mm % 60) + ' min';
  }
  function paintStreak() {
    // the home page's "today" and "in total" keep counting while it stays open
    $$('[data-today]').forEach((x) => { x.textContent = fmtDur(todaySecs()); });
    $$('[data-total]').forEach((x) => { x.textContent = fmtDur(totalSecs()); });
    const c = $('[data-streak]', topbar); if (!c) return;
    const n = streakDays();
    c.hidden = !n; c.innerHTML = icon('fire') + '<b>' + n + '</b>';
    c.title = `${n} day${n === 1 ? '' : 's'} in a row · ${fmtDur(todaySecs())} today`;
  }
  let lastAct = Date.now();
  ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll', 'mousemove'].forEach((ev) => document.addEventListener(ev, () => { lastAct = Date.now(); }, { passive: true, capture: true }));
  // every 15 s, and on each page change: adds the real seconds since the last tick (at most 15)
  let lastTick = Date.now();
  function tickStudy() {
    const now = Date.now(), secs = Math.min(15, Math.round((now - lastTick) / 1000));
    lastTick = now;
    if (secs <= 0 || document.visibilityState !== 'visible' || (now - lastAct > 180000 && !timerState.running)) return;
    const d = dayKey(now), before = +S.study[d] || 0;
    S.study[d] = before + secs;
    if (before < 60 && S.study[d] >= 60) { const n = streakDays(); if (n >= 2) toast(`You've studied ${n} days in a row. Keep it going!`, 'fire'); }
    const keys = Object.keys(S.study); if (keys.length > 400) keys.sort().slice(0, keys.length - 400).forEach((k) => delete S.study[k]);
    save(); paintStreak();
  }
  setInterval(tickStudy, 15000);

  // ================================================================ share cards (a picture, like a run summary)
  // First name = the part of the student email before the first "." (siddharth.duddu2026@… -> Siddharth)
  function firstName() {
    const w = String(window.SIGNED_IN_AS || '').split('@')[0].split('.')[0].replace(/[^a-z]/gi, '');
    return w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : '';
  }
  const SITE_URL = /baphy105\.vercel\.app/.test(location.host) ? 'https://baphy105.vercel.app' : location.origin;
  const modsDone = () => MODULES.filter((m) => m.topics.length && doneIn(m.topics) === m.topics.length).length;

  // ================================================================ progress sync (follows the account)
  // On start the account's saved copy (/api/sync) is merged into this browser's, then a copy goes back ~10 s after
  // each change and when the page is hidden. Merging never loses work from either side: lists are joined, done/ticks
  // are kept if set anywhere, study time takes each day's larger number, and local notes/tags/cards win.
  const obj = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
  const uniq = (a, b) => Array.from(new Set([].concat(Array.isArray(a) ? a : [], Array.isArray(b) ? b : [])));
  function mergeProgress(L, R) {
    R = normalize(R);
    // a module reset wins over older progress on the other side: the newer reset is applied here, or the other side's old progress is ignored
    new Set(Object.keys(obj(L.resets)).concat(Object.keys(obj(R.resets)))).forEach((mid) => {
      const lr = +L.resets[mid] || 0, rr = +R.resets[mid] || 0;
      if (rr > lr) { wipeModule(L, mid); L.resets[mid] = rr; } else if (lr > rr) wipeModule(R, mid);
    });
    for (const k in R.visited) L.visited[k] = uniq(L.visited[k], R.visited[k]);
    for (const k in R.done) if (R.done[k]) L.done[k] = true;
    for (const k in R.study) L.study[k] = Math.max(+L.study[k] || 0, +R.study[k] || 0);
    for (const k in R.syl) if (R.syl[k]) L.syl[k] = 1;
    for (const k in R.q) {
      const a = obj(L.q[k]), b = obj(R.q[k]), m = Object.assign({}, b, a);
      ['seen', 'right', 'wrong'].forEach((f) => { m[f] = Math.max(+a[f] || 0, +b[f] || 0); });
      L.q[k] = m;
    }
    ['cards', 'tags', 'notes'].forEach((f) => { for (const k in R[f]) if (!(k in L[f])) L[f][k] = R[f][k]; });
    for (const k in R.hl) {
      const have = new Set((L.hl[k] || []).map((x) => x && x.id));
      const add = (Array.isArray(R.hl[k]) ? R.hl[k] : []).filter((x) => x && x.id && !have.has(x.id));
      if (add.length) L.hl[k] = (L.hl[k] || []).concat(add);
    }
    for (const k in R.confusing) L.confusing[k] = uniq(L.confusing[k], R.confusing[k]);
    if (!L.last && R.last) L.last = R.last;
    return L;
  }
  // at most one save a minute while studying (the study clock saves every 15 s), to stay inside the free store's limits
  var syncOn = false, syncTimer = 0, syncDirty = false, syncLast = 0;
  const syncBody = () => JSON.stringify({ data: S, mods: modsDone() });
  function syncSoon() {
    if (!syncOn) return; syncDirty = true;
    if (!syncTimer) syncTimer = setTimeout(syncPush, Math.max(10000, 60000 - (Date.now() - syncLast)));
  }
  function syncPush() {
    clearTimeout(syncTimer); syncTimer = 0; if (!syncOn || !syncDirty) return; syncDirty = false; syncLast = Date.now();
    fetch('/api/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: syncBody(), keepalive: true })
      .then((r) => { if (r.status === 401 || r.status === 413) syncOn = false; }).catch(() => { syncDirty = true; });
  }
  let syncPulled = 0;
  async function syncPull() {
    syncPulled = Date.now();
    if (!PRO) return false; // progress sync is a Pro feature; free progress stays in this browser
    try {
      const r = await fetch('/api/sync', { cache: 'no-store' });
      if (!r.ok) return false;
      const j = await r.json();
      const before = JSON.stringify(S);
      if (j.data) mergeProgress(S, j.data);
      const changed = JSON.stringify(S) !== before;
      syncOn = true;
      if (changed) { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } refreshAll(); paintStreak(); }
      // send the merged copy back when this browser had something the account didn't
      const core = (x) => JSON.stringify(Object.assign({}, x, { ui: 0, last: 0 }));
      if (!j.data || core(normalize(j.data)) !== core(S)) { syncDirty = true; syncPush(); }
      return true;
    } catch (e) { return false; }
  }
  if (window.SIGNED_IN_AS) {
    syncPull();
    document.addEventListener('visibilitychange', () => {
      if (!syncOn) return;
      if (document.visibilityState === 'hidden') {
        if (!syncDirty) return; syncDirty = false; clearTimeout(syncTimer); syncTimer = 0; syncLast = Date.now();
        try { if (!navigator.sendBeacon('/api/sync', new Blob([syncBody()], { type: 'application/json' }))) syncDirty = true; } catch (e) { syncDirty = true; }
      } else if (Date.now() - syncPulled > 30000) syncPull(); // back from the other device: pick up what was done there
    });
  }
  async function drawCard(o) {
    const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    try { await Promise.all(['700 120px "Hanken Grotesk"', '500 40px "Hanken Grotesk"', '500 30px "JetBrains Mono"'].map((f) => document.fonts.load(f))); } catch (e) { /* system font */ }
    const F = (w, px, mono) => `${w} ${px}px ${mono ? '"JetBrains Mono", Consolas, monospace' : '"Hanken Grotesk", "Segoe UI", Roboto, sans-serif'}`;
    const fit = (text, w, px, maxW, mono) => { let n = px; g.font = F(w, n, mono); while (n > 20 && g.measureText(text).width > maxW) { n -= 2; g.font = F(w, n, mono); } };
    const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#202026'); bg.addColorStop(1, '#0e0e10');
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const glow = g.createRadialGradient(W - 120, 90, 10, W - 120, 90, 620); glow.addColorStop(0, 'rgba(255,181,107,0.30)'); glow.addColorStop(1, 'rgba(255,181,107,0)');
    g.fillStyle = glow; g.fillRect(0, 0, W, H);
    g.fillStyle = '#8a8a94'; g.font = F(500, 28, true); g.fillText('BAPHY105 · ENGINEERING PHYSICS', 80, 118);
    g.textAlign = 'right'; g.fillText(o.date, W - 80, 118); g.textAlign = 'left';
    g.fillStyle = '#f4f4f6'; fit(o.name, 700, 132, W - 160); g.fillText(o.name, 80, 290);
    g.fillStyle = '#ffb56b'; fit(o.subtitle, 600, 44, W - 160); g.fillText(o.subtitle, 80, 368);
    o.stats.forEach(([label, value], i) => {
      const x = 80 + (i % 2) * 480, y = 500 + Math.floor(i / 2) * 215;
      g.fillStyle = '#8a8a94'; g.font = F(500, 27, true); g.fillText(label.toUpperCase(), x, y);
      g.fillStyle = '#f4f4f6'; fit(value, 700, 86, 440); g.fillText(value, x, y + 96);
    });
    if (o.week) { // minutes studied on each of the last 7 days
      const top = 960, hgt = 150, bw = 92, gap = (W - 160 - bw * 7) / 6, max = Math.max(1, ...o.week.map((d) => d.v));
      g.fillStyle = '#8a8a94'; g.font = F(500, 27, true); g.fillText('LAST 7 DAYS', 80, top - 26);
      o.week.forEach((d, i) => {
        const x = 80 + i * (bw + gap), bh = d.v ? Math.max(10, (d.v / max) * hgt) : 4;
        g.fillStyle = i === 6 ? '#ffb56b' : d.v ? '#cfcfd6' : '#3a3a41';
        g.beginPath(); if (g.roundRect) g.roundRect(x, top + hgt - bh, bw, bh, 10); else g.rect(x, top + hgt - bh, bw, bh); g.fill();
        g.fillStyle = '#8a8a94'; g.font = F(500, 26, true); g.textAlign = 'center'; g.fillText(d.l, x + bw / 2, top + hgt + 42); g.textAlign = 'left';
      });
    } else if (o.line) { g.fillStyle = '#cfcfd6'; fit(o.line, 500, 40, W - 160); g.fillText(o.line, 80, 1010); }
    g.fillStyle = '#ffb56b'; g.fillRect(80, H - 178, 64, 6);
    g.fillStyle = '#f4f4f6'; g.font = F(700, 46); g.fillText(SITE_URL.replace(/^https?:\/\//, ''), 80, H - 104);
    g.fillStyle = '#8a8a94'; g.font = F(500, 30); g.fillText('Engineering Physics study notes for VIT students', 80, H - 58);
    return c;
  }
  async function openShareCard(o) {
    const name = firstName();
    const now = new Date(Date.now() + ISTMS);
    const date = now.getUTCDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getUTCMonth()] + ' ' + now.getUTCFullYear();
    const streak = streakDays();
    let spec, text;
    if (o.kind === 'mastery') {
      spec = { name: name || 'Mastered', date, subtitle: 'Mastered ' + o.label, line: o.rounds === 1 ? 'Every question right on the first try.' : `Every question right after ${o.rounds} rounds of weak-spot practice.`,
        stats: [['Time to master', fmtDur(o.secs, true)], ['Rounds', String(o.rounds)], ['Questions', String(o.total)], ['Streak', `${streak} day${streak === 1 ? '' : 's'}`]] };
      text = `I mastered ${o.label} on BAPHY105 Notes in ${fmtDur(o.secs, true)}. ${SITE_URL}`;
    } else {
      const week = Array.from({ length: 7 }, (_, i) => { const t = Date.now() - (6 - i) * DAYMS; return { v: Math.round((+S.study[dayKey(t)] || 0) / 60), l: 'SMTWTFS'[new Date(t + ISTMS).getUTCDay()] }; });
      spec = { name: name || 'My study day', date, subtitle: `${doneIn(TOPICS)} of ${TOPICS.length} topics done`, week,
        stats: [['Today', fmtDur(todaySecs())], ['Total study', fmtDur(totalSecs())], ['Streak', `${streak} day${streak === 1 ? '' : 's'}`], ['Modules done', `${modsDone()}/${MODULES.length}`]] };
      text = `${fmtDur(todaySecs())} of Engineering Physics today on BAPHY105 Notes. ${streak} day${streak === 1 ? '' : 's'} in a row, ${fmtDur(totalSecs())} in total, ${modsDone()}/${MODULES.length} modules done. ${SITE_URL}`;
    }
    const canvas = await drawCard(spec);
    const blob = await new Promise((ok) => canvas.toBlob(ok, 'image/png'));
    const file = new File([blob], `baphy105-${o.kind}.png`, { type: 'image/png' });
    const src = URL.createObjectURL(blob);
    overlay((close) => {
      const m = h('div', { class: 'modal share-modal' });
      m.innerHTML = `<div class="modal-head"><h2>Share</h2><button class="icon-btn" data-x aria-label="Close">${icon('x')}</button></div>
        <div class="modal-body"><img class="share-img" src="${src}" alt="Your share card">
          <p class="muted share-text">${esc(text)}</p>
          <div class="btn-row"><button class="btn primary" data-sh>${icon('share')}Share</button><a class="btn" href="${src}" download="${file.name}">${icon('db')}Save picture</a><button class="btn" data-cp>${icon('copy')}Copy text</button></div>
          <p class="muted" data-msg style="font-size:13px;min-height:1.4em;margin:10px 0 0"></p></div>`;
      const msg = $('[data-msg]', m);
      $('[data-x]', m).addEventListener('click', close);
      const copy = () => { try { navigator.clipboard.writeText(text).then(() => { msg.textContent = 'Text copied with the link.'; }, () => { msg.textContent = text; }); } catch (e) { msg.textContent = text; } };
      $('[data-cp]', m).addEventListener('click', copy);
      $('[data-sh]', m).addEventListener('click', async () => {
        try {
          if (navigator.canShare && navigator.canShare({ files: [file] })) await navigator.share({ files: [file], text, title: 'BAPHY105 Notes' });
          else if (navigator.share) await navigator.share({ text, url: SITE_URL, title: 'BAPHY105 Notes' });
          else { copy(); msg.textContent = 'Text copied. Save the picture to post it too.'; }
        } catch (e) { /* closed the share sheet */ }
      });
      return m;
    }, { onClose: () => setTimeout(() => URL.revokeObjectURL(src), 1000) });
  }

  // ================================================================ CAT syllabus checklists
  // Each syllabus line links to the topics that cover it. Titles are kept here too, so locked modules still list them.
  const SYL = {
    full: [{"mod":"m1","title":"Wave-Particle Duality","lines":[["Dual nature of radiation",[["m1-dual-nature","Dual nature of radiation: waves, superposition and photons"]]],["Young's double slit experiment",[["m1-ydse","Young’s double slit experiment"]]],["Blackbody radiation",[["m1-blackbody","Blackbody radiation and the ultraviolet catastrophe"]]],["Planck's hypothesis",[["m1-planck","Planck’s hypothesis and radiation formula"]]],["de Broglie hypothesis",[["m1-de-broglie","de Broglie hypothesis: matter waves"]]],["Wavefunction",[["m1-wavefunction","The wavefunction"]]],["Stern-Gerlach experiment",[["m1-stern-gerlach","The Stern–Gerlach experiment"]]]]},{"mod":"m2","title":"Mathematical Foundations of Quantum Mechanics","lines":[["Introduction to linear vector space",[["m2-vector-space","Linear vector spaces"]]],["Basis vectors",[["m2-basis","Linear independence, basis vectors and dimension"]]],["Orthonormal sets",[["m2-orthonormal","Inner product, norm and orthonormal sets"]]],["Hilbert space",[["m2-hilbert","Hilbert space"]]],["Representation of quantum states using Dirac notation",[["m2-dirac","Dirac notation: kets, bras and probability amplitudes"]]],["Inner and outer products",[["m2-outer","Outer products, projection operators and completeness"]]],["Tensor product of vector spaces",[["m2-tensor","Tensor product of vector spaces"]]],["Linear operators",[["m2-operators","Linear operators and matrix algebra"]]],["Matrix algebra: Hermitian, Unitary and Projection operators",[["m2-hermitian","Hermitian, unitary and projection operators"]]],["Eigenvalues and eigenvectors, Pauli matrices, commutation relations",[["m2-eigen","Eigenvalues and eigenvectors"],["m2-pauli","Pauli matrices and commutation relations"]]]]},{"mod":"m3","title":"Postulates of Quantum Mechanics","lines":[["Observables",[["m3-observables","Postulates of quantum mechanics and observables"]]],["Expectation values",[["m3-expectation","Expectation values"]]],["Measurement in Quantum Mechanics",[["m3-measurement","Measurement, collapse and uncertainty"]]],["Sequential Stern Gerlach Experiment",[["m3-seq-sg","Sequential Stern–Gerlach experiment"]]],["Time dependent Schrödinger equation",[["m3-tdse","Time-dependent Schrödinger equation"]]],["Time independent Schrödinger equation; numerical problems",[["m3-tise","Time-independent Schrödinger equation and stationary states"]]]]},{"mod":"m4","title":"Applications of Quantum Mechanics","lines":[["Particle in a one-dimensional potential well",[["m4-box1d","Particle in a one-dimensional infinite potential well"]]],["Extension to three-dimensional potential wells",[["m4-box3d","Particle in a three-dimensional box"]]],["Energy eigenvalues and eigenfunctions",[["m4-eigen","Energy eigenvalues and eigenfunctions: orthonormality and expansions"]]],["Degeneracy of energy levels",[["m4-degeneracy","Degeneracy of energy levels"]]],["Quantum tunneling phenomenon",[["m4-tunnelling","Quantum tunnelling through a barrier"]]],["Tunneling probability",[["m4-tunnel-prob","Tunnelling probability and the STM"]]],["Numerical problems",[["m4-numericals","Numerical problems: box and tunnelling"]]]]},{"mod":"m5","title":"Elements of Quantum Computing","lines":[["Introduction to qubits",[["m5-qubits","Introduction to qubits: classical bits versus quantum bits"]]],["Single qubit states",[["m5-single-qubit","Single-qubit states: amplitudes, normalisation and phase"]]],["the Bloch Sphere",[["m5-bloch","The Bloch sphere"]]],["Two-qubit systems",[["m5-two-qubit","Two-qubit systems and the tensor product"]]],["Quantum entanglement",[["m5-entanglement","Quantum entanglement"]]],["Bell states",[["m5-bell","Bell states"]]],["Single qubit gates",[["m5-gates","Single-qubit gates and reversible logic"]]],["Pauli and Hadamard Gates",[["m5-pauli-h","Pauli and Hadamard gates"]]],["Two-qubit gates- CNOT gates",[["m5-cnot","Two-qubit gates: the CNOT gate"]]],["Generation of entangled states.",[["m5-bell-gen","Generation of entangled states"]]]]}],
    cat1: null, // coming soon
    cat2: null, // coming soon
    fat: null, // coming soon
  };
  const sylItems = (cat) => { const seen = new Set(); return (SYL[cat] || []).flatMap((g) => g.lines.flatMap(([, tl]) => tl.map(([id]) => ({ id, mod: g.mod })))).filter((x) => !seen.has(x.id) && seen.add(x.id)); };
  // a topic read to the end ticks itself on every syllabus that lists it; a tick the student removed by hand (0) stays off
  function autoTick(ids) {
    let changed = false;
    Object.keys(SYL).forEach((cat) => sylItems(cat).forEach((x) => { const k = cat + ':' + x.id; if ((!ids || ids.includes(x.id)) && S.syl[k] === undefined && isDone(x.id)) { S.syl[k] = 1; changed = true; } }));
    if (changed) save();
    return changed;
  }
  function viewSyllabus(r) {
    const cat = r.arg in SYL ? r.arg : 'full', label = { cat1: 'CAT-1', cat2: 'CAT-2', fat: 'FAT', full: 'Course' }[cat];
    setCrumbs([{ t: 'Home', href: '#home' }, { t: label + ' syllabus' }]); setActive('syllabus.' + cat); document.title = `${label} syllabus · BAPHY105 Notes`;
    const el = h('div', { class: 'view syl' });
    const groups = SYL[cat];
    if (!groups) {
      el.innerHTML = `<div class="eyebrow"><span class="code">Exams</span><span>${label}</span></div><h1 class="h-display">${label} syllabus</h1>
        <div class="empty">The ${label} syllabus hasn't been added yet. It will show up here as a checklist, linked to the notes, as soon as it's in.</div>
        <p style="margin-top:18px"><a class="btn" href="#syllabus.full">${icon('list')}Open the course syllabus</a></p>`;
      return { el };
    }
    function paint() {
      autoTick(); // topics read before this feature existed tick themselves too
      const items = sylItems(cat), ticked = items.filter((x) => S.syl[cat + ':' + x.id]).length;
      const pct = items.length ? Math.round((ticked / items.length) * 100) : 0;
      el.innerHTML = `<div class="eyebrow"><span class="code">Exams</span><span>${label}</span><span class="dot">·</span><span>${items.length} topics</span></div>
        <h1 class="h-display">${label} syllabus</h1>
        <p class="blurb">Every line of the ${label} syllabus, linked to the notes that cover it. A topic ticks itself when you finish reading every tab of it. You can also tick or untick one yourself.</p>
        <div class="syl-top"><div class="ring" style="--p:${pct}"><span>${pct}%</span></div><div><b>${ticked} of ${items.length}</b> ticked<br><span class="muted" style="font-size:14px">Saved in this browser.</span></div>${ticked ? `<button class="btn small ghost" data-clear>${icon('rotate')}Clear ticks</button>` : ''}</div>
        ${groups.map((g) => { const M = MOD[g.mod] || { num: g.mod.slice(1) }; const locked = !!M.locked; const gi = sylItems(cat).filter((x) => x.mod === g.mod);
          return `<section class="syl-mod"><div class="mod-head"><span class="mod-num">Module ${+M.num}</span><h2 class="h-sec">${esc(g.title)}</h2><span class="count">${gi.filter((x) => S.syl[cat + ':' + x.id]).length}/${gi.length}${locked ? ` · ${icon('lock')} locked` : ''}</span></div>
            ${g.lines.map(([line, tl]) => `<div class="syl-line"><div class="syl-lt">${esc(line)}</div>${tl.length ? '' : '<div class="syl-item"><span class="syl-name muted">Notes coming</span></div>'}${tl.map(([id, name]) => { const on = !!S.syl[cat + ':' + id], t = TOPIC[id];
              return locked || !t ? `<a class="syl-item locked" href="#unlock"><span class="syl-box">${icon('lock')}</span><span class="syl-name">${esc(name)}</span><span class="syl-tag">Unlock</span></a>`
                : `<div class="syl-item${on ? ' on' : ''}"><button class="syl-box" role="checkbox" aria-checked="${on}" aria-label="Tick ${esc(name)}" data-tick="${id}">${on ? icon('check') : ''}</button><a class="syl-name" href="#${id}">${rt(t.title)}</a>${on || !PRO ? '' : `<span class="syl-tag">${Math.round(frac(t) * 100)}% read</span>`}</div>`; }).join('')}</div>`).join('')}
          </section>`; }).join('')}`;
    }
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tick]');
      if (b) { const k = cat + ':' + b.dataset.tick; S.syl[k] = S.syl[k] ? 0 : 1; save(); paint(); updateSidebar(); return; }
      if (e.target.closest('[data-clear]') && confirm(`Clear all ${label} ticks?`)) { sylItems(cat).forEach((x) => { S.syl[cat + ':' + x.id] = 0; }); save(); paint(); updateSidebar(); }
    });
    paint();
    return { el };
  }

  // ================================================================ CAT question papers
  // papers-free.js: the actual papers (questions only), the index of all papers and which topics were asked.
  // papers-pro.js: the answer keys and the "asked in" detail, loaded with full access. Locked papers are listed from the index.
  // No papers file yet: the sidebar link and home tile stay hidden and #papers says they are coming.
  const PAPERS = (D.papers || []).slice(), PAPER = {};
  PAPERS.forEach((p) => { PAPER[p.id] = p; });
  const PINDEX = D.paperIndex || PAPERS.map((p) => ({ id: p.id, kind: p.kind, title: p.title, sub: p.sub }));
  const ASKED = D.asked || {};
  // exam types, in the order the papers are listed
  const EXAMS = [['cat1', 'CAT-1'], ['cat2', 'CAT-2'], ['fat', 'FAT']];
  const examOf = (x) => { const e = (PAPER[x.paper] || PINDEX.find((y) => y.id === x.paper) || {}).exam; return (EXAMS.find((v) => v[0] === e) || [])[1] || ''; };
  function askedBadge(id) {
    // one entry, or a list when the topic came up in more than one paper
    const list = [].concat(ASKED[id] || []);
    if (!list.length) return '';
    const kinds = EXAMS.map((v) => v[1]).filter((k) => list.some((x) => examOf(x) === k));
    const where = kinds.length ? kinds.join(', ').replace(/, ([^,]*)$/, ' and $1') + ' papers' : 'a past paper';
    if (!PRO || !list[0].what) return `<div class="note exam cat2-asked"><p><b>This topic was asked in ${esc(where)}.</b> <a href="#pro" data-from="asked">Which paper and what was asked: Pro ${icon('right')}</a></p></div>`;
    const slot = (x) => { const p = PAPER[x.paper] || PINDEX.find((y) => y.id === x.paper); return p ? (p.short || p.title).replace(/ paper$/, '') : ''; };
    const lines = list.map((x) => `<b>${esc([examOf(x), slot(x)].filter(Boolean).join(' '))}</b> (${esc(x.where)}): ${esc(x.what)}. <a href="#papers.${esc(x.paper)}">See the question paper ${icon('right')}</a>`);
    return `<div class="note exam cat2-asked"><p><b>This topic was asked in ${esc(where)}${list.length > 1 ? `, ${list.length} times` : ''}</b>${list.length > 1 ? ':</p><p>' + lines.join('</p><p>') : ' ' + lines[0]}</p></div>`;
  }
  function viewPapers(r) {
    const p = r.arg && PAPER[r.arg];
    const el = h('div', { class: 'view papers' });
    if (!p) {
      setCrumbs([{ t: 'Home', href: '#home' }, { t: 'Question papers' }]); setActive('papers'); document.title = 'Question papers · BAPHY105 Notes';
      const row = (x) => { const open = !!PAPER[x.id];
        return open ? `<a class="next-topic" href="#papers.${esc(x.id)}"><div><small>${esc(x.sub || '')}</small><strong>${esc(x.title)}</strong></div><span class="arrow">${icon('right')}</span></a>`
          : `<a class="lock-card" href="#unlock"><span class="lock-ico">${icon('lock')}</span><div><strong>${esc(x.title)}</strong><p>${esc(x.sub || '')} · unlock with full access for ₹${PRICE_RS}</p></div><span class="arrow">${icon('right')}</span></a>`; };
      const actual = PINDEX.filter((x) => x.kind === 'actual'), model = PINDEX.filter((x) => x.kind === 'model');
      // actual papers are grouped by exam type (CAT-1, CAT-2, FAT); a paper without one stays under "Actual papers"
      const groups = EXAMS.map(([k, label]) => [label + ' papers', actual.filter((x) => x.exam === k)]).concat([['Actual papers', actual.filter((x) => !EXAMS.some((v) => v[0] === x.exam))]]).filter((g) => g[1].length);
      el.innerHTML = `<div class="eyebrow"><span class="code">Exams</span><span>CAT · FAT</span><span class="dot">·</span><span>${actual.length} actual${model.length ? ` · ${model.length} model` : ""}</span></div>
        <h1 class="h-display">Question papers</h1>
        ${PINDEX.length ? `<p class="blurb">Real CAT and FAT papers, typed out cleanly, grouped by exam. Try each question on paper first, then open the answer where there is one.</p>
        ${groups.map(([t, l]) => `<section class="sum-sec"><h2 class="h-sec">${esc(t)} <small>${l.length}</small></h2><div class="paper-list">${l.map(row).join('')}</div></section>`).join('')}
        ${model.length ? `<section class="sum-sec"><h2 class="h-sec">Model papers <small>${model.length}</small></h2><div class="paper-list">${model.map(row).join('')}</div></section>` : ''}`
          : '<p class="blurb">Question papers are coming soon: the actual CAT papers with model answers, and model papers in the same pattern.</p>'}`;
      stagger(el);
      return { el };
    }
    setCrumbs([{ t: 'Home', href: '#home' }, { t: 'Question papers', href: '#papers', hideSm: true }, { t: p.short || p.title }]); setActive('papers');
    document.title = `${p.title} · BAPHY105 Notes`;
    const notesLinks = (refs) => refs.map((r) => { const [id, i] = r.split('.'); const t = TOPIC[id]; if (!t) return ''; const m = MOD[t.module], tb = t.tabs[+i];
      return `<a href="#${id}.${+i}">Module ${+m.num} › ${rt(t.short || t.title)}${tb ? ` › ${rt(tb.title)}` : ''}</a>`; }).filter(Boolean).join('<span class="sep"> · </span>');
    const topicLinks = (ids) => (ids || []).filter((id) => TOPIC[id]).map((id) => `<a href="#${id}">${rt(TOPIC[id].short || TOPIC[id].title)}</a>`).join(' · ');
    el.innerHTML = `<div class="eyebrow"><span class="code">${p.kind === 'actual' ? 'Actual paper' : 'Model paper'}</span><span>${esc(p.sub || '')}</span></div>
      <h1 class="h-display">${esc(p.title)}</h1>
      ${p.meta ? `<div class="kv paper-meta">${p.meta.map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>` : ''}
      ${p.instructions ? `<div class="note heads-up"><p>${p.instructions}</p></div>` : ''}
      ${(p.questions || []).map((q) => `<section class="paper-q prose">
        <div class="paper-qhead"><span class="paper-qn">Q${esc(q.n)}</span><span class="ew-score">${esc(q.marks)} marks${q.co ? ' · CO' + esc(q.co) : ''}${q.bl ? ' · BL' + esc(q.bl) : ''}</span></div>
        <div class="paper-prompt">${q.prompt}</div>
        ${q.passage ? `<div class="paper-passage">${q.passage}</div>` : ''}
        ${q.parts ? `<ol class="paper-parts">${q.parts.map((x) => `<li>${x.text}${x.marks ? ` <span class="ew-score">(${esc(x.marks)} marks)</span>` : ''}</li>`).join('')}</ol>` : ''}
        ${q.answer ? `<details class="more paper-ans"><summary>Model answer</summary>${q.answer}</details>` : ''}
        ${q.notes && q.notes.length ? `<p class="paper-rev paper-notes">Notes: ${notesLinks(q.notes)}</p>` : q.topics && q.topics.length ? `<p class="paper-rev">Revise: ${topicLinks(q.topics)}</p>` : ''}
      </section>`).join('')}
      <p style="margin-top:32px"><a class="btn" href="#papers">${icon('left')}All question papers</a></p>`;
    // the answers reuse the notes' own diagrams; one from a module this student can't open yet shows a lock card instead
    $$('figure[data-fig]', el).forEach((fg) => {
      const id = fg.getAttribute('data-fig');
      if (FIGS[id]) return;
      const m = MODULES.find((x) => id.startsWith(x.id + '-'));
      fg.outerHTML = `<a class="lock-card" href="#unlock"><span class="lock-ico">${icon('lock')}</span><div><strong>Diagram from ${esc(m ? 'Module ' + (+m.num) + ' notes' : 'the notes')}</strong><p>Unlock with full access for ₹${PRICE_RS} to see it here</p></div><span class="arrow">${icon('right')}</span></a>`;
    });
    hydrate(el);
    return { el };
  }

  // ================================================================ how to use
  function viewGuide() {
    setCrumbs([{ t: 'Home', href: '#home' }, { t: 'How to use' }]); setActive('guide'); document.title = 'How to use · BAPHY105 Notes';
    const el = h('div', { class: 'view guide' });
    const ex = (id, tab, text) => (TOPIC[id] ? `<a href="#${id}${tab != null ? '.' + tab : ''}">${text}</a>` : `<b>${text}</b>`);
    const sec = (ic, title, body) => `<section class="g-sec"><h2>${icon(ic)}${title}</h2>${body}</section>`;
    el.innerHTML = `
      <div class="eyebrow"><span class="code">Guide</span><span>Every feature, with examples from the notes</span></div>
      <h1 class="h-display">How to use this site</h1>
      <p class="blurb">A quick tour. Every example below is a real link: tap it to try the feature, then come back here from the sidebar.</p>
      ${sec('book', 'Read a topic tab by tab', `<p>Each topic is split into short tabs. Read one, then tap <b>Next</b> (or press <kbd>→</kbd>). A topic ticks itself in the sidebar once every tab is opened. You can also tap <b>Mark as done</b>.</p><p class="g-ex">Try it: ${ex('m1-dual-nature', 4, 'Dual nature of radiation › Compton effect')}, then the next tab, Compton numericals.</p>`)}
      ${sec('eye', 'Recall mode: test yourself while you read', `<p>Turn on <b>Recall</b> in the top bar (or press <kbd>R</kbd>). Every white key term turns into a blank. Say the word in your head, then tap the blank to check.</p><p class="g-ex">Try it: open ${ex('m1-stern-gerlach', 2, 'Stern–Gerlach experiment › Result and meaning')} with Recall on and fill in the conclusions.</p>`)}
      ${sec('pen', 'Highlights, notes and colour tags', `<p><b>Select any line</b> in a topic and pick a colour to highlight it. Each topic has a <b>My notes</b> box at the bottom, saved as you type. The dot next to each topic in the sidebar sets a colour tag (tap again to change it). Everything you mark is collected in ${'<a href="#mine">Highlights &amp; notes</a>'}.</p>`)}
      ${sec('flag', '"Confusing?" and your weak spots', `<p>At the bottom of every tab there is a <b>Confusing?</b> button. Tap it on anything that didn't click. Those tabs are listed under <b>My weak spots</b> in ${'<a href="#mine">Highlights &amp; notes</a>'}, and the quiz asks about them first.</p>`)}
      ${sec('search', 'Search everything', `<p>Tap <b>Search</b> (or press <kbd>Ctrl</kbd> <kbd>K</kbd>). It looks through every tab, question, flashcard, formula and summary.</p><p class="g-ex">Try searching <b>Compton</b>, <b>Hermitian</b> or <b>Bell state</b>.</p>`)}
      ${sec('q', 'Question bank', `<p>Scenario questions with full model answers and the points an examiner looks for. Filter by module, topic, type and level. Mark each one <b>Got it</b> or <b>Revisit</b>.</p><p class="g-ex">Try it: <a href="#questions.m2">Module 2 questions</a>.</p>`)}
      ${sec('quiz', 'Quiz, then focus on your weak spots', `<p>Pick modules and a length and go. At the end, tap <b>Focus on weak spots</b> for a quick round of only the questions you missed. Keep going until you get every one right: you'll see how long it took you to master it, and you can share that as a picture.</p><p class="g-ex">Try it: <a href="#quiz.m2">a Module 2 quiz</a>.</p>`)}
      ${sec('swords', '1v1 Quiz battle', `<p>Pick one or more topics and tap <b>Create battle link</b>. Send the link to one friend: when they join, you both see the rules and tap <b>Understood</b> (tick <b>Never ask again</b> to skip them next time), then you get the same 10 questions at the same time, 10 seconds each. Faster right answers score more. Switching tabs or apps during a question counts as wrong. Full access gets unlimited battles; free accounts get one preview battle on one Module 2 topic.</p><p class="g-ex">Try it: <a href="#battle">start a battle</a>.</p>`)}
      ${sec('cards', 'Flashcards', `<p>Say the answer out loud, then flip. Sort each card into <b>Know it</b> or <b>Still learning</b>; the deck remembers, and "Still learning only" gives you just the hard ones.</p><p class="g-ex">Try it: ${TOPIC['m2-pauli'] ? '<a href="#cards.m2-pauli">Pauli matrices flashcards</a>' : '<a href="#cards">flashcards</a>'}.</p>`)}
      ${sec('sigma', 'Formula sheet and Lab bench', `<p>The <a href="#formulas">Formula sheet</a> has every equation, the numbers worth memorising and the classic traps, per module. The <a href="#lab">Lab bench</a> collects the interactive models as they are added, each linked to the tab that explains it. Every worked numerical in the notes is already checked by script.</p>`)}
      ${sec('exam', 'Question papers', `<p>Six recent CAT-1, CAT-2 and FAT papers, typed out, with a model answer for every question and a <b>Notes</b> link under each one to the exact tab that answers it.</p><p class="g-ex">Try it: <a href="#papers">Question papers</a>.</p>`)}
      ${sec('list', 'CAT syllabus checklists', `<p>The <a href="#syllabus.full">course syllabus</a> lists every syllabus line with links to the topics that cover it. Tick a topic when you can explain it without looking, and watch the percentage climb. The CAT-1, CAT-2 and FAT lists are coming soon.</p>`)}
      ${sec('timer', 'Focus mode', `<p>Tap <b>Focus</b> in the top bar (or press <kbd>F</kbd>) for a focus timer with fewer distractions. Pick <b>30 minutes, 1, 2 or 3 hours</b> in the bar at the bottom, which also lets you <b>Pause</b> or <b>Exit focus</b> at any time (on a computer, <kbd>Esc</kbd> works too).</p>`)}
      ${sec('fire', 'Study time, streaks and share cards', `<p>The site counts the time you actually study here each day (it pauses after 3 minutes without a tap or scroll, except while the Focus timer is running). Study at least a minute a day to keep your streak going (the flame in the top bar). Tap <b>Share progress</b> on the home page for a picture with today's time, your total, your streak and the modules you've finished.</p>`)}
      ${sec('help', 'Help? and Any ideas?', `<p>Found a mistake, have a suggestion, or something isn't working? Tap <b>Help?</b> (at the bottom of any tab, or in the sidebar). Want a new feature? Tap <b>Any ideas?</b> in the sidebar. Both go straight to the owner. When the owner replies, you get a note when you open the site and the reply appears under <b>Messages</b> in the sidebar.</p>`)}
      ${sec('phone', 'Your account and devices', `<p>Your student account works on <b>1 phone + 1 laptop/PC</b>. Signing in on a new one signs out the old one of the same kind. If something looks wrong, tap <b>Devices</b> at the bottom of the sidebar to request a device reset (once a week; the owner approves it).</p>`)}
      ${sec('db', 'Your data', `<p>Your progress follows your account: topics done, quiz scores, flashcards, highlights, notes, syllabus ticks and study time are saved to your student account and appear on your phone and your laptop once you sign in on both (give it a minute, or reopen the tab). <b>Backup</b> at the bottom of the sidebar still makes a copy you can keep. Switch between light and dark mode with the sun/moon button.</p>`)}`;
    return { el };
  }

  // ================================================================ 1v1 quiz battle
  function viewBattle(r) {
    setCrumbs([{ t: 'Home', href: '#home' }, { t: '1v1 Quiz battle' }]); setActive('battle'); document.title = '1v1 Quiz battle · BAPHY105 Notes';
    const el = h('div', { class: 'view battle' });
    const id = r.arg && /^[a-f0-9]{10}$/.test(r.arg) ? r.arg : null;
    let alive = true, tmr = 0, raf = 0, off = 0, st = null, shown = '', picked = {}, switchedAt = -1, wall = null;
    const now = () => Date.now() + off;
    const opp = () => (st && st.role === 'host' ? 'guest' : 'host');
    async function call(data) {
      const t0 = Date.now();
      const res = await fetch('/api/battle' + (id && !data ? '?id=' + id : ''), data ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) } : { cache: 'no-store' });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(j.error || 'Something went wrong. Try again.'), { status: res.status });
      if (j.now) off = j.now - (t0 + Date.now()) / 2; // the server keeps the clock for both players
      return j;
    }
    const rules = `<ul class="bt-rules"><li>${icon('timer')}10 questions, 10 seconds each</li><li>${icon('swords')}1v1: one friend joins your link</li><li>${icon('warn')}Switching tabs or apps during a question counts as wrong</li></ul>`;
    const head = (sub) => `<div class="eyebrow"><span class="code">Practice</span><span>1v1 Quiz battle</span>${sub ? `<span class="dot">·</span><span>${sub}</span>` : ''}</div>`;

    // ---- choose topics and create the link
    async function setup() {
      el.innerHTML = `${head()}<h1 class="h-display">Quiz battle</h1><p class="blurb">Challenge one friend. Pick the topics, send the link, and you both get the same questions at the same time. Right answers score 100, plus up to 50 for speed.</p>${rules}<div data-pick><p class="muted">Loading…</p></div>`;
      const pick = $('[data-pick]', el);
      let acc;
      try { acc = await call(); } catch (e) { pick.innerHTML = `<div class="empty">${esc(e.message)}</div>`; return; }
      if (!alive) return;
      if (acc.access === 'used') {
        pick.innerHTML = `<a class="lock-card" href="#unlock"><span class="lock-ico">${icon('lock')}</span><div><strong>You've used your free preview battle</strong><p>Pro (₹${PRICE_RS}) lets you battle on any topics, as often as you like.</p></div><span class="arrow">${icon('right')}</span></a>`;
        return;
      }
      const preview = acc.access !== 'full';
      const mods = MODULES.filter((m) => m.topics.length && (!preview || m.free));
      const chosen = new Set();
      pick.innerHTML = `${preview ? `<div class="bt-note">${icon('info')}<p><b>Free preview:</b> one battle on a single Module 2 topic. <a href="#unlock">Unlock full access</a> for unlimited battles on every topic.</p></div>` : ''}
        ${mods.map((m) => `<div class="bt-mod"><div class="bt-mhead"><b>Module ${+m.num} · ${esc(m.title)}</b>${preview ? '' : `<button class="btn small ghost" data-all="${m.id}">Select all</button>`}</div>
          <div class="bt-topics">${m.topics.filter((t) => (t.flashcards || []).length >= 4).map((t) => `<button class="fchip" data-t="${t.id}" aria-pressed="false">${rt(t.short || t.title)}</button>`).join('')}</div></div>`).join('')}
        <div class="bt-go"><button class="btn primary" data-create disabled>${icon('swords')}Create battle link</button><span class="muted" data-info>Pick ${preview ? 'one topic' : 'one or more topics'}</span></div><p class="gate-msg" data-msg role="alert"></p>`;
      const paint = () => {
        $$('[data-t]', pick).forEach((b) => { const on = chosen.has(b.dataset.t); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
        $('[data-create]', pick).disabled = !chosen.size;
        $('[data-info]', pick).textContent = chosen.size ? `${chosen.size} topic${chosen.size === 1 ? '' : 's'} selected` : `Pick ${preview ? 'one topic' : 'one or more topics'}`;
      };
      pick.addEventListener('click', async (e) => {
        const t = e.target.closest('[data-t]'), all = e.target.closest('[data-all]');
        if (t) { const k = t.dataset.t; if (chosen.has(k)) chosen.delete(k); else { if (preview) chosen.clear(); chosen.add(k); } paint(); }
        if (all) { const ts = $$(`.bt-mod [data-t]`, all.closest('.bt-mod')).map((b) => b.dataset.t); const every = ts.every((x) => chosen.has(x)); ts.forEach((x) => (every ? chosen.delete(x) : chosen.add(x))); paint(); }
        const cb = e.target.closest('[data-create]');
        if (cb && chosen.size) {
          cb.disabled = true; $('[data-msg]', pick).textContent = 'Creating…';
          try { const j = await call({ action: 'create', topics: [...chosen] }); navigate('#battle.' + j.id); }
          catch (err) { $('[data-msg]', pick).textContent = err.message; cb.disabled = false; }
        }
      });
    }

    // ---- a battle in progress: the server decides what is on screen, we fetch at the right moments
    async function poll() {
      clearTimeout(tmr);
      if (!alive) return;
      try { st = await call(); }
      catch (e) { if (!st) { el.innerHTML = `${head()}<h1 class="h-display">Quiz battle</h1><div class="empty">${esc(e.message)}</div><p style="margin-top:16px"><a class="btn" href="#battle">${icon('swords')}Start a new battle</a></p>`; return; } tmr = setTimeout(poll, 1500); return; }
      if (!alive) return;
      paint(); plan();
    }
    function plan() {
      const s = st; let wait = 2000;
      if (!s.role) { if (s.guest) return; wait = 3000; }
      else if (!s.guest) wait = 2000;
      else if (!s.start) wait = 1500; // waiting for both players to accept the rules
      else if (s.done) return;
      else {
        const t = now(), slot = s.qt + s.gap;
        if (t < s.start) wait = s.start - t + 60;
        else {
          const i = Math.floor((t - s.start) / slot), qs0 = s.start + i * slot, qEnd = qs0 + s.qt + 1600;
          if (i >= s.n) wait = 400;
          else if (t < qEnd) wait = s.current && s.current.i === i ? qEnd - t + 60 : 300;
          else wait = s.results.length > i ? qs0 + slot - t + 60 : 400;
        }
      }
      tmr = setTimeout(poll, Math.max(150, wait));
    }
    const board = () => { const s = st, me = s.role, o = opp(); return `<div class="bt-board"><div><small>You</small><b>${s.scores[me]}</b></div><span class="vs">vs</span><div><small>${esc(s[o] ? s[o].name : '…')}</small><b>${s.scores[o]}</b></div></div>`; };
    function loop(fn) { cancelAnimationFrame(raf); const f = () => { if (!alive) return; if (fn() !== false) raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); }
    function paint() {
      const s = st, t = now();
      const screen = !s.role ? (s.guest ? 'full' : 'join') : !s.guest ? 'lobby' : !s.start ? 'rules' + (s.ready[s.role] ? 1 : 0) : s.done ? 'done' : t < s.start ? 'count' : s.current ? 'q' + s.current.i : 'r' + (s.results.length - 1);
      if (screen === shown) return;
      shown = screen;
      if (screen[0] !== 'q') hideWall();
      if (!screen.startsWith('rules')) hideRules();
      const topics = s.topics.map((x) => esc(plain(x))).join(', ');
      if (screen.startsWith('rules')) {
        const ready = s.ready[s.role];
        el.innerHTML = `${head(topics)}<div class="bt-count"><p>${esc(s.host.name)} <span class="vs">vs</span> ${esc(s.guest.name)}</p><p class="bt-wait" style="justify-content:center"><span class="bt-dot"></span>${ready ? `Waiting for ${esc(s[opp()].name)} to read the rules…` : 'Read the rules to start the battle'}</p>${ready ? '' : `<button class="btn" data-rules>${icon('info')}Show the rules</button>`}</div>`;
        if (!ready) {
          $('[data-rules]', el).addEventListener('click', showRules);
          if (S.ui.battleRulesOk) sendReady(); else showRules();
        }
        return;
      }
      if (screen === 'full') { el.innerHTML = `${head()}<h1 class="h-display">This battle is full</h1><p class="blurb">${esc(s.host.name)} and ${esc(s.guest.name)} are already playing. Battles are 1v1.</p><a class="btn primary" href="#battle">${icon('swords')}Start your own battle</a>`; return; }
      if (screen === 'join') {
        el.innerHTML = `${head()}<h1 class="h-display">${esc(s.host.name)} challenges you</h1><p class="blurb">A 1v1 quiz battle on <b style="color:var(--white)">${topics}</b>.</p>${rules}<div class="bt-go"><button class="btn primary" data-join>${icon('swords')}Join the battle</button></div><p class="gate-msg" data-msg role="alert"></p>`;
        $('[data-join]', el).addEventListener('click', async (e) => {
          e.currentTarget.disabled = true; $('[data-msg]', el).textContent = 'Joining…';
          try { await call({ action: 'join', id }); shown = ''; poll(); }
          catch (err) { $('[data-msg]', el).innerHTML = esc(err.message) + (err.status === 402 ? ` <a href="#unlock">Unlock full access</a>` : ''); $('[data-join]', el).disabled = false; }
        });
        return;
      }
      if (screen === 'lobby') {
        const link = location.origin + '/#battle.' + id;
        el.innerHTML = `${head(topics)}<h1 class="h-display">Send this link to one friend</h1><p class="blurb">When they join, you both see the rules, and the battle starts once you both tap Understood. Topics: <b style="color:var(--white)">${topics}</b>.</p>
          <div class="bt-link"><code>${esc(link)}</code><div class="btn-row"><button class="btn primary" data-share>${icon('share')}Share link</button><button class="btn" data-copy>${icon('copy')}Copy</button></div></div>
          <p class="bt-wait"><span class="bt-dot"></span>Waiting for your opponent…</p>${rules}`;
        const text = `${firstName() || 'I'} challenged you to a 1v1 Engineering Physics quiz battle on BAPHY105 Notes (${plain(s.topics.join(', '))}). Join here: ${link}`;
        const copy = () => { try { navigator.clipboard.writeText(link).then(() => toast('Link copied', 'copy'), () => toast(link)); } catch (e) { toast(link); } };
        $('[data-copy]', el).addEventListener('click', copy);
        $('[data-share]', el).addEventListener('click', () => { if (navigator.share) navigator.share({ title: 'Quiz battle', text, url: link }).catch(() => {}); else copy(); });
        return;
      }
      if (screen === 'count') {
        el.innerHTML = `${head(topics)}<div class="bt-count"><p>${esc(s.host.name)} <span class="vs">vs</span> ${esc(s.guest.name)}</p><div class="bt-big" data-n></div><p class="muted">Get ready. Stay on this tab until the end.</p></div>`;
        loop(() => { const left = Math.ceil((s.start - now()) / 1000); $('[data-n]', el).textContent = left > 0 ? left : 'Go!'; return left > -1; });
        return;
      }
      if (screen[0] === 'q') {
        const c = s.current, mine = picked[c.i];
        el.innerHTML = `${head(`Question ${c.i + 1} of ${s.n}`)}${board()}
          <div class="bt-timer"><i data-bar></i></div><div class="bt-secs" data-secs></div>
          <div class="bt-q"><small>${rt(c.topic)}</small><div class="prose">${c.front}</div></div>
          <ol class="qopts bt-opts">${c.options.map((o, k) => `<li><button class="qopt" data-k="${k}"><span class="k">${'ABCD'[k]}</span><span>${o}</span></button></li>`).join('')}</ol>
          <p class="bt-state muted" data-state></p>`;
        const lock = (k, textMsg) => { $$('.qopt', el).forEach((b) => { b.disabled = true; if (+b.dataset.k === k) b.classList.add('picked'); else b.classList.add('dim'); }); $('[data-state]', el).textContent = textMsg; };
        if (mine != null || c.answered) lock(mine, 'Answer locked in. Waiting for the timer…');
        if (c.switched || switchedAt === c.i) { $('[data-state]', el).textContent = 'You switched tabs, so this one counts as wrong.'; }
        $('.bt-opts', el).addEventListener('click', async (e) => {
          const b = e.target.closest('.qopt'); if (!b || b.disabled || picked[c.i] != null) return;
          const k = +b.dataset.k; picked[c.i] = k; lock(k, 'Answer locked in. Waiting for the timer…');
          try { await call({ action: 'answer', id, i: c.i, k }); } catch (err) { $('[data-state]', el).textContent = err.message; }
        });
        loop(() => {
          const left = c.startsAt + s.qt - now();
          const bar = $('[data-bar]', el); if (!bar) return false;
          bar.style.width = Math.max(0, Math.min(100, (left / s.qt) * 100)) + '%';
          bar.classList.toggle('low', left < 3000);
          $('[data-secs]', el).textContent = left > 0 ? Math.ceil(left / 1000) + ' s' : "Time's up";
          if (left <= 0) { if (picked[c.i] == null && !c.answered) lock(-1, "Time's up. Waiting for the result…"); return false; }
        });
        return;
      }
      if (screen[0] === 'r') {
        const x = s.results[s.results.length - 1]; if (!x) return;
        const me = x[s.role], o = x[opp()];
        const line = (p, who) => (p.switched ? `${who}: tab switch, counts as wrong` : p.ok ? `${who}: right, +${p.pts}` : p.k == null ? `${who}: no answer` : `${who}: wrong`);
        el.innerHTML = `${head(`Question ${x.i + 1} of ${s.n}`)}${board()}
          <div class="bt-q"><div class="prose">${x.front}</div></div>
          <ol class="qopts bt-opts">${x.options.map((op, k) => `<li><button class="qopt ${k === x.c ? 'right' : k === me.k ? 'wrong' : 'dim'}" disabled><span class="k">${'ABCD'[k]}</span><span>${op}</span></button></li>`).join('')}</ol>
          <div class="bt-res"><p class="${me.ok ? 'ok' : 'bad'}">${me.ok ? icon('check') : icon('x')}${esc(line(me, 'You'))}</p><p class="${o.ok ? 'ok' : 'bad'}">${o.ok ? icon('check') : icon('x')}${esc(line(o, s[opp()].name))}</p></div>
          <p class="muted" data-next></p>`;
        const next = s.start + (x.i + 1) * (s.qt + s.gap);
        loop(() => { const n = Math.ceil((next - now()) / 1000); const e = $('[data-next]', el); if (!e) return false; e.textContent = x.i + 1 < s.n ? (n > 0 ? `Next question in ${n}…` : 'Here it comes…') : 'Final scores…'; return n > 0; });
        return;
      }
      // done
      const me = s.role, o = opp(), a = s.scores[me], b = s.scores[o], on = s[o].name;
      const rights = (who) => s.results.filter((x) => x[who].ok).length;
      el.innerHTML = `${head('Final')}<div class="bt-final-top">${icon('trophy')}<h1 class="h-display">${a > b ? 'You win!' : a < b ? esc(on) + ' wins' : "It's a draw!"}</h1></div>
        <div class="bt-board big"><div><small>You</small><b>${a}</b><em>${rights(me)}/${s.n} right</em></div><span class="vs">vs</span><div><small>${esc(on)}</small><b>${b}</b><em>${rights(o)}/${s.n} right</em></div></div>
        <div class="btn-row" style="margin:18px 0 8px"><a class="btn primary" href="#battle">${icon('swords')}New battle</a><button class="btn" data-sharer>${icon('share')}Share result</button></div>
        ${s.preview ? `<a class="lock-card" href="#unlock"><span class="lock-ico">${icon('lock')}</span><div><strong>That was your free preview battle</strong><p>Unlock full access for unlimited battles on every topic, plus Modules 3 and 4.</p></div><span class="arrow">${icon('right')}</span></a>` : ''}
        <section class="sum-sec" style="margin-top:36px"><h2 class="h-sec">Answers</h2>${s.results.map((x) => `<div class="bt-rev"><div class="prose">${x.front}</div><p class="bt-ans">${x.answer}</p><p class="bt-who"><span class="${x[me].ok ? 'ok' : 'bad'}">You ${x[me].ok ? '✓ +' + x[me].pts : x[me].switched ? '✗ tab switch' : '✗'}</span><span class="${x[o].ok ? 'ok' : 'bad'}">${esc(on)} ${x[o].ok ? '✓ +' + x[o].pts : x[o].switched ? '✗ tab switch' : '✗'}</span></p></div>`).join('')}</section>`;
      $('[data-sharer]', el).addEventListener('click', () => {
        const text = `${a > b ? 'I beat ' + on : a < b ? on + ' beat me' : 'I drew with ' + on} ${Math.max(a, b)}–${Math.min(a, b)} in a 1v1 Engineering Physics quiz battle on BAPHY105 Notes. ${SITE_URL}`;
        if (navigator.share) navigator.share({ text, title: 'Quiz battle' }).catch(() => {}); else { try { navigator.clipboard.writeText(text).then(() => toast('Copied', 'copy')); } catch (e) { toast(text); } }
      });
      stagger(el);
    }

    // ---- the rules, before every battle: it starts only when both players tap Understood ("Never ask again" skips this)
    let rulesOv = null, sentReady = false;
    function hideRules() { if (rulesOv) { rulesOv.remove(); rulesOv = null; } }
    function showRules() {
      if (rulesOv || sentReady) return;
      rulesOv = h('div', { class: 'overlay bt-rules-ov', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'bt-rules-t' });
      rulesOv.innerHTML = `<div class="modal"><div class="modal-head">${icon('swords')}<h2 id="bt-rules-t">Battle rules</h2></div><div class="modal-body">
        <ol class="bt-rule-list">
          <li><b>10 questions, 10 seconds each.</b> You both get the same question at the same moment.</li>
          <li><b>A right answer scores 100</b>, plus up to 50 more the faster you tap. Wrong or no answer scores 0.</li>
          <li><b>Your first tap is final.</b> You can't change an answer.</li>
          <li><b>Stay on this tab.</b> Switching tabs or apps during a question counts as a wrong answer, even if you already answered it.</li>
          <li>The battle starts once you both tap <b>Understood</b>.</li>
        </ol>
        <label class="bt-never"><input type="checkbox" data-never> Never ask again</label>
        <div class="btn-row" style="margin-top:16px"><button class="btn primary" data-ok>${icon('check')}Understood</button></div></div></div>`;
      document.body.appendChild(rulesOv);
      const ok = $('[data-ok]', rulesOv);
      ok.addEventListener('click', () => { if ($('[data-never]', rulesOv).checked) { S.ui.battleRulesOk = true; save(); } hideRules(); sendReady(); });
      setTimeout(() => { if (ok.isConnected) ok.focus({ preventScroll: true }); }, 60);
    }
    async function sendReady() {
      if (sentReady) return;
      sentReady = true;
      try { await call({ action: 'ready', id }); } catch (e) { sentReady = false; toast(e.message, 'warn'); return; }
      shown = ''; poll();
    }

    // ---- leaving the tab during a question: it counts as wrong, and a full-screen notice waits for the timer
    function hideWall() { if (wall) { wall.remove(); wall = null; } }
    function onLeave() {
      const s = st; if (!s || !s.role || !s.current) return;
      const c = s.current, t = now();
      if (t < c.startsAt || t > c.startsAt + s.qt || switchedAt === c.i) return;
      switchedAt = c.i;
      call({ action: 'switch', id, i: c.i }).catch(() => {});
      hideWall();
      wall = h('div', { class: 'bt-wall', role: 'alertdialog', 'aria-live': 'assertive' });
      wall.innerHTML = `<div>${icon('warn')}<h2>You switched tabs</h2><p>Leaving the battle during a question counts as a wrong answer, so this one is marked wrong. Wait for the timer to finish and the next question will start.</p><div class="bt-big" data-w></div></div>`;
      document.body.appendChild(wall);
      const until = c.startsAt + s.qt;
      const tick = () => { if (!wall) return; const left = Math.ceil((until - now()) / 1000); if (left <= 0) { hideWall(); return; } $('[data-w]', wall).textContent = left + ' s'; setTimeout(tick, 250); };
      tick();
    }
    const onVis = () => { if (document.visibilityState === 'hidden') onLeave(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('blur', onLeave);

    if (id) { el.innerHTML = `${head()}<p class="muted">Loading the battle…</p>`; poll(); } else setup();
    return { el, cleanup() { alive = false; clearTimeout(tmr); cancelAnimationFrame(raf); hideWall(); hideRules(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('blur', onLeave); } };
  }

  // bottom tab bar (phones)
  const bnav = h('nav', { class: 'bnav', 'aria-label': 'Quick navigation' });
  bnav.innerHTML = [['#home', 'home', 'Notes', 'home'], [null, 'search', 'Search', 'search'], ['#quiz', 'quiz', 'Quiz', 'quiz'], ['#cards', 'cards', 'Cards', 'cards'], [null, 'menu', 'Menu', 'sidebar']]
    .map(([href, ic, label, key]) => href ? `<a href="${href}" data-key="${key}">${icon(ic)}<span>${label}</span></a>` : `<button type="button" data-act="${key}">${icon(ic)}<span>${label}</span></button>`).join('');
  document.body.appendChild(bnav);

  // ================================================================ global events
  document.addEventListener('click', (e) => {
    const tagDot = e.target.closest('.tag-dot[data-act="tag"]');
    if (tagDot) { e.preventDefault(); e.stopPropagation(); cycleTag(tagDot.dataset.t); return; }
    const a = e.target.closest('a[href^="#"]');
    if (a && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      navigate(a.getAttribute('href'));
      return;
    }
    const act = e.target.closest('[data-act]');
    if (act) {
      const k = act.dataset.act;
      if (k === 'sidebar') toggleSidebar();
      else if (k === 'search') openSearch();
      else if (k === 'recall') toggleRecall();
      else if (k === 'focus') { if (document.body.classList.contains('focus') && e.target.closest('.timer')) { startTimer(!timerState.running); paintTimer(); } else toggleFocus(); }
      else if (k === 'keys') openKeys();
      else if (k === 'backup') openBackup();
      else if (k === 'theme') { S.ui.theme = S.ui.theme === 'light' ? 'dark' : 'light'; save(); document.documentElement.dataset.mode = S.ui.theme; $$('[data-act="theme"]').forEach((b) => { b.innerHTML = b.hasAttribute('data-label') ? themeLabel() : icon(S.ui.theme === 'light' ? 'moon' : 'sun'); }); }
      else if (k === 'confusing') {
        const tid = act.dataset.t, ti = +act.dataset.i, list = S.confusing[tid] || (S.confusing[tid] = []);
        const on = !list.includes(ti); if (on) list.push(ti); else list.splice(list.indexOf(ti), 1); if (!list.length) delete S.confusing[tid]; save();
        act.classList.toggle('on', on); act.querySelector('.lbl').textContent = on ? 'Marked confusing' : 'Confusing?';
        toast(on ? 'Added to My weak spots' : 'Removed from weak spots', 'flag');
        trackConfusing(tid, ti, on);
      }
      else if (k === 'share') openShareCard({ kind: 'progress' });
      else if (k === 'focusexit') toggleFocus(false);
      else if (k === 'focuspause') { startTimer(!timerState.running); paintTimer(); }
      else if (k === 'ideas') openHelp(null, 0, true);
      else if (k === 'messages') openMessages();
      else if (k === 'devices') openDevices();
      else if (k === 'signout') { if (confirm('Sign out of ' + (window.SIGNED_IN_AS || 'your account') + ' on this device?') && window.__signOut) window.__signOut(); }
      else if (k === 'help') openHelp(act.dataset.t || (current && current.view === 'topic' ? current.id : null), act.dataset.i != null ? +act.dataset.i : (current && current.api && current.api.tab ? current.api.tab() : 0));
      else if (k === 'tag') { e.preventDefault(); e.stopPropagation(); cycleTag(act.dataset.t); }
      else if (k === 'group') {
        const g = act.closest('.sb-group'); const id = act.dataset.g;
        const closed = !g.classList.contains('closed');
        g.classList.toggle('closed', closed); act.setAttribute('aria-expanded', String(!closed));
        S.ui.closed[id] = closed; save();
      }
      return;
    }
    const b = e.target.closest('.recallable b, .prose b');
    if (b && document.body.classList.contains('recall')) { b.classList.add('shown'); return; }
    const fr = e.target.closest('.fig-frame');
    if (fr && !fr.closest('.missing')) {
      const img = $('img', fr), sv = $('.fig-svg', fr), fig = fr.closest('figure');
      const cap = $('figcaption', fig);
      if (sv) openLightbox(null, cap ? cap.innerHTML : '', sv.getAttribute('aria-label'), sv.innerHTML);
      else if (img) openLightbox(img.getAttribute('src'), cap ? cap.innerHTML : '', img.alt);
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); openSearch(); return; }
    if (typing(e) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (document.querySelector('.overlay, .lightbox')) return;
    if (e.key === 'Enter' && e.target.closest && e.target.closest('.fig-frame')) { e.target.click(); return; }
    const k = e.key;
    if (k === '/') { e.preventDefault(); openSearch(); }
    else if (k === '?') openKeys();
    else if (k === 'r' || k === 'R') toggleRecall();
    else if (k === 'f' || k === 'F') toggleFocus();
    else if (k === '[') toggleSidebar();
    else if (k === 'Escape') { if (document.body.classList.contains('focus')) toggleFocus(false); hideSelBar(); closeDrawer(); }
    else if (current && current.view === 'topic' && current.api) {
      if (k === 'ArrowRight') { e.preventDefault(); current.api.next(); }
      else if (k === 'ArrowLeft') { e.preventDefault(); current.api.prev(); }
    }
    else if (current && current.view === 'summary' && (k === 'ArrowRight' || k === 'ArrowLeft')) {
      // a module summary sits between topics in the reading order, so the arrows carry on through it
      const o = ORDER[orderIdx(current.mod + '-summary') + (k === 'ArrowRight' ? 1 : -1)];
      if (o) { e.preventDefault(); const pt = TOPIC[o.key]; navigate('#' + o.key + (k === 'ArrowLeft' && pt ? '.' + (pt.tabs.length - 1) : '')); }
    }
    if ((k === 'n' || k === 'p') && current && (current.view === 'topic' || current.view === 'summary')) {
      const key = current.view === 'topic' ? current.id : current.mod + '-summary';
      const o = ORDER[orderIdx(key) + (k === 'n' ? 1 : -1)];
      if (o) navigate('#' + o.key);
    }
  });
  function onScroll() {
    const bar = $('.read-bar', topbar); if (!bar) return;
    const show = current && (current.view === 'topic' || current.view === 'summary');
    const sc = pageScroller(), max = sc.scrollHeight - sc.clientHeight;
    bar.style.width = show && max > 40 ? (sc.scrollTop / max) * 100 + '%' : '0';
  }
  main.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  main.addEventListener('scroll', () => { if (selBar) hideSelBar(); }, { passive: true });
  function onHistory() {
    const r = parse(location.hash);
    if (current && r.view === current.view) {
      if (r.view === 'topic' && r.id === current.id) { if (r.tab != null && current.api && r.tab !== current.api.tab()) current.api.setTab(r.tab, { scroll: true }); return; }
      if (hashOf(r) === hashOf(current)) return;
    }
    render(r);
  }
  window.addEventListener('popstate', onHistory);
  window.addEventListener('hashchange', onHistory);

  // ================================================================ boot
  autoTick();
  buildSidebar();
  buildTopbar();
  let startHash = location.hash;
  if (!startHash || startHash === '#') startHash = '#home';
  render(parse(startHash));
  window.__notes = { TOPICS, QS, CARDS, FIGS, S: () => S };
};
