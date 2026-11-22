#!/usr/bin/env node
// Assemble the app.
//   node tools/build.js
// Public (app/): shell, styles, payment gate. Everything with notes in it lives in protected/ and is served by api/.
// Free/Pro split (owner, 30-09-2026): the notes are FREE for everyone who can open the site; Pro features are served
// server-side only. For every content file the build writes a free copy and a Pro companion:
//   chunk-X.js  free: topics, tabs, figures, the first 3 flashcards of each topic (cardCount = how many exist)
//   pro-X.js    Pro:  every flashcard, the formulas and one-liners of each topic (formula sheet, revision pack)
//   q-*.js      free: the questions themselves (no answers)
//   qa-*.js     Pro:  correct option, answer, explanation and points of every question
//   summary-*   free (full module summaries)
//   papers-free.js free (actual papers, questions only; "asked in CAT" text without the slot detail)
//   papers-pro.js  Pro  (model answers, model papers, the full "asked in CAT" detail)
//   viz-*.js    Pro  (the interactive "Try it" widgets; free notes show a small locked card in their place)
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'app');
const PDATA = path.join(ROOT, 'protected', 'data');
const PIMG = path.join(ROOT, 'protected', 'img');
const CONTENT = path.join(ROOT, 'content');
const FREE_CARDS = 3;

const TITLE = 'BAPHY105 Notes';
const FONTS = 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400;1,8..60,500&display=swap';

fs.mkdirSync(PDATA, { recursive: true });
fs.mkdirSync(PIMG, { recursive: true });
for (const f of fs.readdirSync(PDATA)) fs.unlinkSync(path.join(PDATA, f));
fs.rmSync(path.join(APP, 'data'), { recursive: true, force: true }); // never ship notes publicly

const MODULES = JSON.parse(fs.readFileSync(path.join(CONTENT, 'modules.json'), 'utf8'));
const read = (file, name) => { // run a content file and return what it passed to its global (CHUNK, QUESTIONS, ...)
  let got = null;
  global[name] = (d) => { got = d; };
  const p = path.join(CONTENT, file); delete require.cache[p]; require(p);
  delete global[name];
  return got;
};
const js = (fn, d) => `${fn}(${JSON.stringify(d)});\n`;
const write = (f, s) => fs.writeFileSync(path.join(PDATA, f), s);
const strip = (q) => { const o = Object.assign({}, q); delete o.correct; delete o.answer; delete o.explain; delete o.points; delete o.wrong; return o; };
const answerOf = (q) => ({ correct: q.correct, answer: q.answer, explain: q.explain, points: q.points, wrong: q.wrong });
const fileModule = {}, freeFiles = [], proFiles = [];

// ---- figures: every figure is the site's own drawing (figs-svg/<id>.svg), served by api/img.js and packed into the
// module's first notes file so it shows even when a separate image request fails; the app inlines each SVG so it
// follows dark and light mode.
const SVGSRC = path.join(ROOT, 'figs-svg');
const dims = {};
for (const f of fs.readdirSync(PIMG)) fs.unlinkSync(path.join(PIMG, f));
for (const f of fs.readdirSync(SVGSRC).filter((f) => /^m\d+-[a-z0-9-]+\.svg$/.test(f))) {
  const id = f.slice(0, -4), svg = fs.readFileSync(path.join(SVGSRC, f), 'utf8');
  const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1];
  if (!vb) continue;
  const [, , w, h] = vb.trim().split(/[\s,]+/).map(Number);
  dims[id] = { w: Math.round(w), h: Math.round(h), svg: 1 };
  fs.copyFileSync(path.join(SVGSRC, f), path.join(PIMG, f));
}
write('figs.js', js('FIGDIMS', dims));
freeFiles.push('figs.js');

// ---- notes, flashcards, formulas, questions, summaries
const battle = { topics: {}, cards: {} }; // 1v1 battle questions come from every flashcard (api/battle.js marks on the server)
for (const m of MODULES) {
  (m.chunks || []).forEach((c, i) => {
    const file = `chunk-${c}.js`;
    if (!fs.existsSync(path.join(CONTENT, file))) return;
    const ch = read(file, 'CHUNK');
    const pro = { chunk: ch.chunk, module: m.id, topics: {} };
    const free = Object.assign({}, ch, {
      module: m.id,
      topics: (ch.topics || []).map((t) => {
        pro.topics[t.id] = { flashcards: t.flashcards || [], formulas: t.formulas || [], oneLiners: t.oneLiners || [] };
        battle.topics[t.id] = [m.id, t.short || t.title];
        battle.cards[t.id] = (t.flashcards || []).map((f) => [f.front, f.back]);
        const o = Object.assign({}, t, { flashcards: (t.flashcards || []).slice(0, FREE_CARDS), cardCount: (t.flashcards || []).length, formulaCount: (t.formulas || []).length });
        delete o.formulas; delete o.oneLiners;
        return o;
      }),
    });
    let out = js('CHUNK', free);
    if (i === 0) {
      const pack = {};
      for (const id of Object.keys(dims).filter((id) => id.startsWith(m.id + '-'))) pack[id] = fs.readFileSync(path.join(SVGSRC, id + '.svg'), 'utf8');
      if (Object.keys(pack).length) out += js('FIGSVG', pack);
    }
    write(file, out); freeFiles.push(file); fileModule[file] = m.id;
    write(`pro-${c}.js`, js('PRO_CHUNK', pro)); proFiles.push(`pro-${c}.js`); fileModule[`pro-${c}.js`] = m.id;
  });
  // the question is free, its answer is Pro
  for (const qf of [].concat(m.questions || [])) {
    if (!fs.existsSync(path.join(CONTENT, qf))) continue;
    const d = read(qf, 'QUESTIONS'), ans = {};
    // why each wrong option is wrong (Pro, like the answer): content/why-M1.js -> WHY({ 'm1-q-01': ['reason A', '', 'reason C', 'reason D'] })
    const wf = qf.replace(/^q-/, 'why-');
    const why = fs.existsSync(path.join(CONTENT, wf)) ? read(wf, 'WHY') : {};
    (d.questions || []).forEach((q) => { if (why[q.id]) q.wrong = why[q.id]; });
    const qs = (d.questions || []).map((q) => { ans[q.id] = answerOf(q); return strip(q); });
    write(qf, js('QUESTIONS', Object.assign({}, d, { questions: qs }))); freeFiles.push(qf); fileModule[qf] = m.id;
    const af = qf.replace(/^q-/, 'qa-');
    write(af, js('QANSWERS', ans)); proFiles.push(af); fileModule[af] = m.id;
  }
  // module summary: free in full; questions inside it follow the same rule
  const sf = `summary-${m.id}.js`;
  if (fs.existsSync(path.join(CONTENT, sf))) {
    const s = read(sf, 'SUMMARY'), ans = {};
    if (s.questions) s.questions = s.questions.map((q) => { ans[q.id] = answerOf(q); return strip(q); });
    write(sf, js('SUMMARY', s)); freeFiles.push(sf); fileModule[sf] = m.id;
    if (Object.keys(ans).length) { const af = `qa-${m.id}-summary.js`; write(af, js('QANSWERS', ans)); proFiles.push(af); fileModule[af] = m.id; }
  }
  // fast track: free (facts by topic, past questions, the ids of 10 must-do MCQs whose answers stay Pro)
  const ff = `fast-${m.id}.js`;
  if (fs.existsSync(path.join(CONTENT, ff))) { write(ff, js('FAST', read(ff, 'FAST'))); freeFiles.push(ff); fileModule[ff] = m.id; }
}
fs.writeFileSync(path.join(ROOT, 'api', '_battle.json'), JSON.stringify(battle) + '\n');

// ---- question papers (hand-written in the two files; copied as they are)
for (const [f, list] of [['papers-free.js', freeFiles], ['papers-pro.js', proFiles]]) {
  if (!fs.existsSync(path.join(CONTENT, f))) continue;
  fs.copyFileSync(path.join(CONTENT, f), path.join(PDATA, f)); list.push(f);
}
// ---- interactive widgets: all Pro, kept outside app/ and served like the notes
for (const f of fs.readdirSync(path.join(ROOT, 'viz-paid')).filter((f) => /^viz-[a-z0-9-]+\.js$/.test(f)).sort()) {
  fs.copyFileSync(path.join(ROOT, 'viz-paid', f), path.join(PDATA, f)); proFiles.push(f);
  const id = (f.match(/^viz-(m[0-9]+)/) || [])[1]; if (id) fileModule[f] = id;
}

// Modules (names, chunks) come from content/modules.json, the one place to add a module. Every module's notes are free.
fs.writeFileSync(path.join(APP, 'js', 'modules.js'), `window.MODULES_CONFIG = ${JSON.stringify(MODULES.map(({ id, num, title, chunks, syllabus, syllabusRows }) => ({ id, num, title, free: true, chunks, syllabus, syllabusRows: syllabusRows || [] })))};\n`);
fs.writeFileSync(path.join(ROOT, 'api', '_access.json'), JSON.stringify({ freeFiles, proFiles, freeModules: MODULES.map((m) => m.id), paidModules: MODULES.map(({ id, num, title }) => ({ id, num, title })), fileModule }, null, 1) + '\n');
// file lists the gate loads (names only, no content): free files for everyone, Pro files after payment
fs.writeFileSync(path.join(APP, 'js', 'data-files.js'), `window.FREE_FILES = ${JSON.stringify(freeFiles)};\nwindow.PRO_FILES = ${JSON.stringify(proFiles)};\nwindow.FILE_MODULE = ${JSON.stringify(fileModule)};\n`);

const vizFiles = fs.readdirSync(path.join(APP, 'js', 'viz')).filter((f) => /\.js$/.test(f)).sort();
const scripts = ['js/boot.js', 'js/modules.js', 'js/viz-core.js', ...vizFiles.map((f) => 'js/viz/' + f), 'js/app.js', 'js/data-files.js', 'js/gate.js', 'js/notix-extras.js'];
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${TITLE}</title>
<meta name="description" content="Engineering Physics (BAPHY105) as tabbed study notes with diagrams, worked numericals, interactive models and scenario questions.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="css/app.css">
</head>
<body>
<div id="app"></div>
${scripts.map((s) => `<script src="${s}"></script>`).join('\n')}
</body>
</html>
`;
fs.writeFileSync(path.join(APP, 'index.html'), html);
console.log(`free files: ${freeFiles.length} · pro files: ${proFiles.length} · figures: ${Object.keys(dims).length} · public viz files: ${vizFiles.length}`);

// the admin page's Content section (modules and question papers): api/_content.json
require('./admin-index').writeIndex();
