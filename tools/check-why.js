// node tools/check-why.js <repo>  — every MCQ has a why-wrong reason per wrong option (content/why-*.js).
const fs = require('fs'), path = require('path');
const C = path.resolve(process.argv[2], 'content');
const load = (f, name) => { let d; global[name] = (x) => { d = x; }; delete require.cache[path.join(C, f)]; require(path.join(C, f)); return d; };
const mods = JSON.parse(fs.readFileSync(path.join(C, 'modules.json'), 'utf8'));
let errors = 0; const err = (m) => { errors++; console.log('  ERROR ' + m); };
let nMcq = 0, nWhy = 0;
for (const m of mods) {
  const mcqs = {};
  for (const qf of [].concat(m.questions || [])) {
    const d = load(qf, 'QUESTIONS'); const wf = qf.replace(/^q-/, 'why-');
    const why = fs.existsSync(path.join(C, wf)) ? load(wf, 'WHY') : null;
    if (!why) err(`${wf} missing`);
    const ids = new Set();
    for (const q of d.questions.filter((q) => q.options)) {
      nMcq++; mcqs[q.id] = q; ids.add(q.id);
      const w = why && why[q.id];
      if (!w) { if (why) err(`${wf}: no reasons for ${q.id}`); continue; }
      nWhy++;
      if (!Array.isArray(w) || w.length !== q.options.length) { err(`${q.id}: ${w && w.length} reasons for ${q.options.length} options`); continue; }
      w.forEach((r, k) => {
        if (k === q.correct) { if (r !== '') err(`${q.id}: reason given at the correct index ${k}`); }
        else if (typeof r !== 'string' || r.trim().length < 15) err(`${q.id}: option ${'ABCD'[k]} reason missing/too short`);
        else if (r.length > 260) err(`${q.id}: option ${'ABCD'[k]} reason over 260 chars`);
      });
    }
    if (why) for (const id of Object.keys(why)) if (!ids.has(id)) err(`${wf}: ${id} is not an MCQ in ${qf}`);
  }
  console.log(`${m.id}: ${Object.keys(mcqs).length} MCQs`);
}
console.log(`\n${nWhy}/${nMcq} MCQs with reasons · ${errors} error(s)`);
process.exitCode = errors ? 1 : 0;
