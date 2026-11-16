// Checks that the site follows VTOP's "Course Syllabus Modules" rows (content/modules.json → syllabusRows):
// every row has at least one topic that exists, and every topic in the chunks sits under exactly one row.
// Usage: node tools/syllabus-check.js   (exit 1 on any problem)
const fs = require('fs'), path = require('path');
const C = path.join(__dirname, '..', 'content');
const M = JSON.parse(fs.readFileSync(path.join(C, 'modules.json'), 'utf8'));
const topics = {};
global.CHUNK = (c) => c.topics.forEach((t) => { topics[t.id] = c.module; });
fs.readdirSync(C).filter((f) => /^chunk-.*\.js$/.test(f)).forEach((f) => new Function(fs.readFileSync(path.join(C, f), 'utf8'))());
let bad = 0; const seen = {};
for (const m of M) {
  if (!(m.syllabusRows || []).length) { console.log(`${m.id}: no syllabusRows`); bad++; continue; }
  for (const r of m.syllabusRows) {
    const ok = r.topics.filter((id) => topics[id] === m.id);
    r.topics.filter((id) => topics[id] !== m.id).forEach((id) => console.log(`${m.id} row ${r.n}: topic "${id}" not found in ${m.id}`));
    if (!ok.length) { console.log(`${m.id} row ${r.n} "${r.text}": NO NOTES`); bad++; }
    r.topics.forEach((id) => { if (seen[id]) { console.log(`${id} is under two rows`); bad++; } seen[id] = 1; });
  }
}
Object.keys(topics).filter((id) => !seen[id]).forEach((id) => { console.log(`topic "${id}" (${topics[id]}) is under no syllabus row`); bad++; });
console.log(bad ? `${bad} problem(s)` : `OK: every VTOP row has notes, every topic sits under one row`);
process.exit(bad ? 1 : 0);
