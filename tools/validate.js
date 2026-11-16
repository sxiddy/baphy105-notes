#!/usr/bin/env node
// Validate content files against SPEC.md.
//   node tools/validate.js content/chunk-B.js
//   node tools/validate.js content/q-B.js
//   node tools/validate.js content/summary-m2.js
//   node tools/validate.js --all
// Exit code 1 on errors. Warnings are printed but do not fail.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const MODULE_IDS = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'modules.json'), 'utf8')).map((m) => m.id));

// widget ids: whatever the widget files register (VIZ.register('id', ...)) in app/js/viz and viz-paid
const VIZ_IDS = new Set((['app/js/viz', 'viz-paid'].map((d) => fs.readdirSync(path.join(ROOT, d)).filter((f) => f.endsWith('.js'))
  .map((f) => [...fs.readFileSync(path.join(ROOT, d, f), 'utf8').matchAll(/\bregister\('([a-z0-9-]+)'/g)].map((m) => m[1])))).flat(2));
const TAGS = new Set('p h3 h4 b em sub sup br ul ol li table thead tbody tr th td div span figure details summary small code'.split(' '));
const VOID = new Set(['br']);
const CLASSES = new Set('lead eq frac tbl kv vs side steps chips chip note why exam trap heads-up example worked given solve result mnemonic more'.split(' '));
const ATTRS = new Set(['class', 'data-fig', 'data-viz', 'data-label', 'colspan', 'rowspan']);
const BANNED = [
  'delve', 'crucial', 'pivotal', 'vital role', 'landscape', 'realm', 'harness', 'leverage', 'seamless', 'robust',
  'unlock', 'game-changer', 'game changer', 'in summary', 'in conclusion', 'in essence', "it's worth noting", 'it is worth noting',
  'it is important to note', "it's important to note", "let's dive", 'moreover', 'furthermore', 'additionally', 'not only',
  "isn't just", 'is not just', 'imagine ', 'tapestry', 'testament', 'showcase', 'embark', 'elevate', 'navigate the',
];
const QTYPES = new Set(['decide', 'predict', 'explain', 'troubleshoot', 'design', 'numerical', 'interpret']);
const RECALL_OPENERS = /^\s*(<p[^>]*>)?\s*(define|list|state|what is|what are|differentiate|distinguish between|write (short )?notes?|give (the )?(definition|examples?)|name the|mention)\b/i;

let errors = 0, warnings = 0;
const err = (where, msg) => { errors++; console.log(`ERROR  ${where}: ${msg}`); };
const warn = (where, msg) => { warnings++; console.log(`warn   ${where}: ${msg}`); };

function load(file) {
  const abs = path.resolve(file);
  const out = {};
  global.CHUNK = (d) => { out.chunk = d; };
  global.QUESTIONS = (d) => { out.questions = d; };
  global.SUMMARY = (d) => { out.summary = d; };
  global.PAPERS = (d) => { out.papers = d; };
  delete require.cache[abs];
  try { require(abs); } catch (e) { err(file, `does not load: ${e.message}`); return null; }
  return out;
}

function stripTags(html) { return html.replace(/<[^>]+>/g, ' '); }

function checkHtml(where, html, ctx) {
  if (typeof html !== 'string') { err(where, 'html must be a string'); return; }
  if (html.includes('`') || html.includes('${')) err(where, 'contains a backtick or ${');
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g;
  const stack = [];
  let m;
  while ((m = re.exec(html))) {
    const [, close, tagRaw, attrs] = m;
    const tag = tagRaw.toLowerCase();
    if (!TAGS.has(tag)) { err(where, `tag <${tag}> not allowed`); continue; }
    if (close) {
      const top = stack.pop();
      if (top !== tag) { err(where, `mismatched </${tag}> (expected </${top || 'nothing'}>)`); if (top) stack.push(top); }
      continue;
    }
    const are = /([a-zA-Z-:]+)(?:\s*=\s*"([^"]*)")?/g;
    let a;
    while ((a = are.exec(attrs))) {
      const [, name, val] = a;
      if (name === '/') continue;
      if (!ATTRS.has(name)) { err(where, `attribute ${name}= not allowed on <${tag}>`); continue; }
      if (name === 'class') for (const c of (val || '').split(/\s+/).filter(Boolean)) if (!CLASSES.has(c)) err(where, `class "${c}" not allowed`);
      if (name === 'data-fig') { if (tag !== 'figure') err(where, 'data-fig only on <figure>'); ctx.figRefs.push({ id: val, where }); }
      if (name === 'data-viz') { if (!VIZ_IDS.has(val)) err(where, `unknown viz id "${val}"`); ctx.vizRefs.push({ id: val, where }); }
    }
    if (!VOID.has(tag) && !/\/\s*$/.test(attrs)) stack.push(tag);
  }
  if (stack.length) err(where, `unclosed tags: ${stack.join(', ')}`);
  if (/<strong/i.test(html)) err(where, 'use <b>, not <strong>');
  const text = stripTags(html);
  const lower = text.toLowerCase();
  for (const b of BANNED) if (lower.includes(b)) warn(where, `banned/AI-ish phrase "${b.trim()}"`);
  const dashes = (text.match(/—/g) || []).length;
  if (dashes) warn(where, `${dashes} em dash(es) — rewrite with commas/periods`);
  if (/!/.test(text.replace(/!=/g, ''))) warn(where, 'exclamation mark');
  // unicode emoji
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(text)) warn(where, 'emoji-like character');
}

function checkChunk(file, d, globalCtx) {
  const where0 = path.basename(file);
  if (!d.chunk || !d.module) err(where0, 'chunk and module required');
  if (!/^m[0-9]+$/.test(d.module || '')) err(where0, 'module must look like m2, m5 …');
  if (!MODULE_IDS.has(d.module)) err(where0, `module ${d.module} is not listed in content/modules.json`);
  const ctx = { figRefs: [], vizRefs: [] };
  const topicIds = new Set();
  if (!Array.isArray(d.topics) || !d.topics.length) err(where0, 'topics[] required');
  for (const t of d.topics || []) {
    const w = `${where0} › ${t.id}`;
    if (!/^m[0-9]+-[a-z0-9-]+$/.test(t.id || '') || !t.id.startsWith(d.module + '-')) err(w, 'topic id must be kebab-case and start with module id');
    if (topicIds.has(t.id) || globalCtx.topicIds.has(t.id)) err(w, 'duplicate topic id');
    topicIds.add(t.id); globalCtx.topicIds.add(t.id);
    for (const k of ['title', 'short', 'blurb', 'source']) if (!t[k] || typeof t[k] !== 'string') err(w, `${k} required`);
    if (t.short && t.short.length > 24) warn(w, `short "${t.short}" is ${t.short.length} chars (max 24)`);
    if (!Array.isArray(t.tabs) || t.tabs.length < 2 || t.tabs.length > 8) err(w, 'needs 2–8 tabs');
    (t.tabs || []).forEach((tab, i) => {
      if (!tab.title) err(`${w} tab ${i + 1}`, 'title required');
      checkHtml(`${w} › tab "${tab.title}"`, tab.html, ctx);
      const words = stripTags(tab.html || '').split(/\s+/).filter(Boolean).length;
      if (words > 650) warn(`${w} › tab "${tab.title}"`, `${words} words — long for one tab; consider splitting`);
      if (words < 40) warn(`${w} › tab "${tab.title}"`, `${words} words — very thin tab`);
    });
    if (!Array.isArray(t.flashcards) || t.flashcards.length < 4) warn(w, 'fewer than 4 flashcards');
    (t.flashcards || []).forEach((c, i) => { if (!c.front || !c.back) err(`${w} flashcard ${i + 1}`, 'front/back required'); else { checkHtml(`${w} flashcard ${i + 1} front`, c.front, ctx); checkHtml(`${w} flashcard ${i + 1} back`, c.back, ctx); } });
    if (!Array.isArray(t.oneLiners) || t.oneLiners.length < 3) warn(w, 'fewer than 3 oneLiners');
    (t.oneLiners || []).forEach((s, i) => checkHtml(`${w} oneLiner ${i + 1}`, s, ctx));
    if (!Array.isArray(t.formulas)) err(w, 'formulas[] required (may be empty)');
    (t.formulas || []).forEach((f, i) => { if (!f.name || !f.html) err(`${w} formula ${i + 1}`, 'name/html required'); else checkHtml(`${w} formula ${f.name}`, f.html, ctx); });
  }
  const figIds = new Set();
  for (const f of d.figures || []) {
    const w = `${where0} › figure ${f.id}`;
    if (!/^m[0-9]+-[a-z0-9-]+$/.test(f.id || '')) err(w, 'bad id');
    if (figIds.has(f.id) || globalCtx.figIds.has(f.id)) err(w, 'duplicate figure id');
    figIds.add(f.id); globalCtx.figIds.add(f.id);
    if (!f.src || !fs.existsSync(path.join(ROOT, 'src', f.src))) err(w, `src not found: ${f.src}`);
    if (/\.wmf$/i.test(f.src || '')) err(w, 'wmf equations cannot be shown; transcribe as text');
    if (f.crop !== null && f.crop !== undefined && (!Array.isArray(f.crop) || f.crop.length !== 4)) err(w, 'crop must be null or [x,y,w,h]');
    if (!f.caption) err(w, 'caption required');
    if (!fs.existsSync(path.join(ROOT, 'figs-svg', f.id + '.svg'))) err(w, 'no redrawn figs-svg/' + f.id + '.svg yet');
    if (!f.alt) warn(w, 'alt text missing');
  }
  const used = new Map();
  for (const r of ctx.figRefs) {
    if (!figIds.has(r.id)) err(r.where, `figure "${r.id}" not defined in figures[]`);
    used.set(r.id, (used.get(r.id) || 0) + 1);
  }
  for (const id of figIds) {
    if (!used.has(id)) warn(`${where0} › figure ${id}`, 'defined but never placed');
    else if (used.get(id) > 1) err(`${where0} › figure ${id}`, 'placed more than once');
  }
  for (const r of ctx.vizRefs) {
    if (globalCtx.vizUsed.has(r.id)) err(r.where, `viz "${r.id}" already used (${globalCtx.vizUsed.get(r.id)})`);
    else globalCtx.vizUsed.set(r.id, r.where);
  }
  return { topicIds, figCount: figIds.size, vizCount: ctx.vizRefs.length, topics: (d.topics || []).length };
}

function checkQuestion(where, q, topicIds, seen) {
  const w = `${where} › ${q.id}`;
  if (!q.id) err(where, 'question without id');
  if (seen.has(q.id)) err(w, 'duplicate question id'); seen.add(q.id);
  if (!/^m[0-9]+$/.test(q.module || '')) err(w, 'module must look like m2, m5 …');
  if (q.topic !== 'summary' && q.topic !== 'mixed' && topicIds && !topicIds.has(q.topic)) err(w, `unknown topic "${q.topic}"`);
  if (!QTYPES.has(q.type)) err(w, `type "${q.type}" not in ${[...QTYPES].join('/')}`);
  if (![1, 2, 3].includes(q.level)) err(w, 'level must be 1, 2 or 3');
  const ctx = { figRefs: [], vizRefs: [] };
  for (const k of ['q', 'answer', 'explain']) { if (!q[k]) err(w, `${k} required`); else checkHtml(`${w} ${k}`, q[k], ctx); }
  if (ctx.figRefs.length || ctx.vizRefs.length) err(w, 'no figures/viz inside questions');
  if (RECALL_OPENERS.test(q.q || '')) warn(w, 'opens like a recall question (define/list/state/differentiate); make it scenario-based');
  if (q.options != null) {
    if (!Array.isArray(q.options) || q.options.length !== 4) err(w, 'options must be 4 strings or null');
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) err(w, 'correct must be 0–3 when options exist');
    (q.options || []).forEach((o, i) => { if (typeof o !== 'string' || !o.trim()) err(w, `option ${i} empty`); });
  } else if (q.correct != null) err(w, 'correct must be null when options is null');
  if (!Array.isArray(q.points) || q.points.length < 2) warn(w, 'points[] should list 2–6 examiner points');
}

function checkSummary(file, s, topicIds, seenQ) {
  const w = path.basename(file);
  if (!/^m[0-9]+$/.test(s.module || '')) err(w, 'module required');
  const ctx = { figRefs: [], vizRefs: [] };
  if (!s.tldr) err(w, 'tldr required'); else checkHtml(`${w} tldr`, s.tldr, ctx);
  if (!Array.isArray(s.bigIdeas) || s.bigIdeas.length < 4) err(w, 'bigIdeas[] needs 4+ items');
  (s.bigIdeas || []).forEach((b, i) => { if (!b.title || !b.html) err(`${w} bigIdea ${i + 1}`, 'title/html required'); else checkHtml(`${w} bigIdea ${b.title}`, b.html, ctx); if (b.topic && topicIds && !topicIds.has(b.topic)) err(`${w} bigIdea ${b.title}`, `unknown topic ${b.topic}`); });
  (s.compare || []).forEach((c, i) => { if (!c.title || !c.html) err(`${w} compare ${i + 1}`, 'title/html required'); else checkHtml(`${w} compare ${c.title}`, c.html, ctx); });
  (s.formulas || []).forEach((f, i) => { if (!f.name || !f.html) err(`${w} formula ${i + 1}`, 'name/html required'); else checkHtml(`${w} formula ${f.name}`, f.html, ctx); });
  (s.numbers || []).forEach((n, i) => { if (!n.value || !n.what) err(`${w} number ${i + 1}`, 'value/what required'); });
  (s.traps || []).forEach((t, i) => checkHtml(`${w} trap ${i + 1}`, t, ctx));
  (s.storyline || []).forEach((t, i) => { if (!t.title || !t.html) err(`${w} storyline ${i + 1}`, 'title/html required'); else checkHtml(`${w} storyline ${t.title}`, t.html, ctx); });
  (s.questions || []).forEach((q) => checkQuestion(w, q, topicIds, seenQ));
  if (ctx.figRefs.length || ctx.vizRefs.length) err(w, 'no figures/viz inside summary');
}

// ---------------------------------------------------------------
let files = process.argv.slice(2);
const all = files[0] === '--all';
const contentDir = path.join(ROOT, 'content');
if (all || files.some((f) => /q-|summary-/.test(f))) {
  // always load all chunks first so topic ids / viz uniqueness are known
}
const chunkFiles = fs.readdirSync(contentDir).filter((f) => /^chunk-.*\.js$/.test(f)).map((f) => path.join(contentDir, f));
if (all) files = fs.readdirSync(contentDir).filter((f) => /\.js$/.test(f)).map((f) => path.join(contentDir, f));
if (all && !files.length) { console.log('no content files yet'); process.exit(0); }
if (!files.length) { console.error('usage: node tools/validate.js <file...> | --all'); process.exit(2); }

const g = { topicIds: new Set(), figIds: new Set(), vizUsed: new Map() };
const target = new Set(files.map((f) => path.resolve(f)));
const allTopicIds = new Set();
// Load every chunk (for cross-file checks); only report errors for targeted files.
for (const cf of chunkFiles) {
  const isTarget = target.has(path.resolve(cf));
  let d;
  if (isTarget) d = load(cf);
  else {
    const saveLog = console.log; console.log = () => {};
    const e0 = errors, w0 = warnings;
    d = load(cf);
    errors = e0; warnings = w0; console.log = saveLog;
  }
  if (!d || !d.chunk) continue;
  if (isTarget) {
    const r = checkChunk(cf, d.chunk, g);
    console.log(`\n${path.basename(cf)}: ${r.topics} topics, ${r.figCount} figures, ${r.vizCount} viz`);
  } else {
    // silent pass to register ids
    const saveLog = console.log; console.log = () => {};
    const e0 = errors, w0 = warnings;
    checkChunk(cf, d.chunk, g);
    errors = e0; warnings = w0; console.log = saveLog;
  }
  for (const t of d.chunk.topics || []) allTopicIds.add(t.id);
}
const seenQ = new Set();
for (const f of files) {
  const base = path.basename(f);
  if (/^chunk-/.test(base)) continue;
  const d = load(f);
  if (!d) continue;
  if (d.questions) {
    const qs = d.questions.questions || [];
    qs.forEach((q) => checkQuestion(base, q, allTopicIds, seenQ));
    const withOpts = qs.filter((q) => Array.isArray(q.options)).length;
    const types = {}; qs.forEach((q) => { types[q.type] = (types[q.type] || 0) + 1; });
    console.log(`\n${base}: ${qs.length} questions (${withOpts} MCQ) types ${JSON.stringify(types)}`);
  } else if (d.summary) {
    checkSummary(f, d.summary, allTopicIds, seenQ);
    console.log(`\n${base}: summary ok-ish (${(d.summary.bigIdeas || []).length} big ideas, ${(d.summary.questions || []).length} questions)`);
  } else if (d.papers) {
    // question papers (papers-free.js / papers-pro.js): HTML and style checks, topic links, asked map
    const ctx = { figRefs: [], vizRefs: [] };
    const ps = d.papers.papers || [];
    let nq = 0;
    for (const p of ps) {
      // a paper in a Pro file may be just id + the questions' n and answer (merged into the free copy by app/js/boot.js)
      if (!p.id || (!p.title && !/pro/.test(base))) err(base, 'paper without id/title');
      if (/free/.test(base)) {
        if (!['cat1', 'cat2', 'fat'].includes(p.exam)) err(base, `${p.id}: exam must be cat1, cat2 or fat`);
        if (!(d.papers.index || []).some((x) => x.id === p.id && x.exam === p.exam)) err(base, `${p.id}: not in the index (or the exam differs)`);
        const ns = (p.questions || []).map((q) => q.n);
        if (new Set(ns).size !== ns.length) err(base, `${p.id}: duplicate question numbers`);
      }
      if (p.instructions) checkHtml(`${base} › ${p.id} instructions`, p.instructions, ctx);
      for (const q of p.questions || []) {
        nq++;
        const w = `${base} › ${p.id} Q${q.n}`;
        for (const k of ['prompt', 'passage', 'answer']) if (q[k] != null) checkHtml(`${w} ${k}`, q[k], ctx);
        (q.parts || []).forEach((x, i) => checkHtml(`${w} part ${i + 1}`, x.text, ctx));
        for (const id of q.topics || []) if (!allTopicIds.has(id)) err(w, `unknown topic "${id}"`);
      }
    }
    for (const id of Object.keys(d.papers.asked || {})) if (!allTopicIds.has(id)) err(`${base} › asked`, `unknown topic "${id}"`);
    // the Pro file's papers and asked entries refer to the free file's papers
    let free = null;
    if (/pro/.test(base)) {
      const g0 = global.PAPERS; global.PAPERS = (x) => { free = x; };
      try { const fp = path.join(ROOT, 'content', 'papers-free.js'); delete require.cache[fp]; require(fp); } finally { global.PAPERS = g0; }
    }
    const known = new Set(ps.map((p) => p.id).concat((d.papers.index || []).map((x) => x.id), ((free && free.papers) || []).map((p) => p.id)));
    for (const [id, list] of Object.entries(d.papers.asked || {})) for (const x of [].concat(list)) if (!known.has(x.paper)) err(`${base} › asked ${id}`, `unknown paper "${x.paper}"`);
    if (free) for (const p of ps) for (const q of p.questions || []) if (!((free.papers.find((x) => x.id === p.id) || {}).questions || []).some((y) => y.n === q.n)) err(`${base} › ${p.id} Q${q.n}`, 'no such question in papers-free.js');
    // model answers may show the notes' own diagrams (by id); interactive viz stay in the notes
    for (const r of ctx.figRefs) if (!g.figIds.has(r.id)) err(r.where, `figure "${r.id}" is not a notes figure`);
    if (ctx.vizRefs.length) err(base, 'no viz inside papers');
    console.log(`\n${base}: ${ps.length} papers, ${nq} questions${d.papers.index ? `, index of ${d.papers.index.length}` : ''}${d.papers.asked ? `, ${Object.keys(d.papers.asked).length} asked topics` : ''}`);
  } else err(base, 'no CHUNK/QUESTIONS/SUMMARY/PAPERS call found');
}
console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
