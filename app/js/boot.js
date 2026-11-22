/* Collects the content files (they call these globals) before app.js runs. */
window.DATA = { chunks: [], questions: [], summaries: {}, figs: {} };
window.CHUNK = function (d) { window.DATA.chunks.push(d); };
window.QUESTIONS = function (d) {
  (d.questions || []).forEach(function (q) { q.chunk = d.chunk; window.DATA.questions.push(q); });
};
window.SUMMARY = function (d) { window.DATA.summaries[d.module] = d; };
window.FAST = function (d) { (window.DATA.fast = window.DATA.fast || {})[d.module] = d; };
// Pro companions (tools/build.js): every flashcard, formula and one-liner per topic, and the answers to the questions
window.PRO_CHUNK = function (d) { window.DATA.pro = Object.assign(window.DATA.pro || {}, d.topics || {}); };
window.QANSWERS = function (d) { window.DATA.qa = Object.assign(window.DATA.qa || {}, d); };
window.FIGDIMS = function (d) { Object.assign(window.DATA.figs, d); };
window.FIGSVG = function (d) { window.DATA.figsvg = Object.assign(window.DATA.figsvg || {}, d); };
// Question papers (CAT-1, CAT-2, FAT): papers-free.js has the actual papers (questions only), the index of every paper and
// which topics were asked; papers-pro.js adds the answer keys and the "asked in" detail. The files load in any order,
// so a paper that appears in both is merged by id (and its questions by n) instead of listed twice.
window.PAPERS = function (d) {
  var list = window.DATA.papers = window.DATA.papers || [];
  (d.papers || []).forEach(function (p) {
    var have = list.filter(function (x) { return x.id === p.id; })[0];
    if (!have) { list.push(p); return; }
    var qs = have.questions || [];
    (p.questions || []).forEach(function (q) {
      var mine = qs.filter(function (x) { return x.n === q.n; })[0];
      if (mine) Object.assign(mine, q); else qs.push(q);
    });
    Object.assign(have, p, { questions: qs });
    if (qs.every(function (q) { return /^[0-9]+$/.test(q.n); })) qs.sort(function (x, y) { return x.n - y.n; });
  });
  if (d.index) window.DATA.paperIndex = d.index;
  if (d.asked) {
    var asked = window.DATA.asked = window.DATA.asked || {};
    Object.keys(d.asked).forEach(function (id) {
      var now = [].concat(d.asked[id]), had = asked[id] ? [].concat(asked[id]) : null;
      // entries with the detail (Pro file) win over the bare paper list (free file), whichever loads first
      if (!had || (now[0] && now[0].what) || !(had[0] && had[0].what)) asked[id] = d.asked[id];
    });
  }
};
