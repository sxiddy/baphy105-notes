// Writes api/_content.json: the modules (with topic and question counts) and the question papers on this site,
// for the admin page's Content section. tools/build.js runs it at the end of every build, so adding a module to
// content/modules.json or a paper to content/papers-*.js shows up on the admin page with no other change.
// Run it on its own:  node tools/admin-index.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTENT = path.join(ROOT, 'content');

function read(file, name) { // run a content file and return what it passed to its global (CHUNK, QUESTIONS, PAPERS)
  const p = path.join(CONTENT, file);
  if (!fs.existsSync(p)) return null;
  let got = null;
  const had = Object.prototype.hasOwnProperty.call(global, name), old = global[name];
  global[name] = (d) => { got = d; };
  try { delete require.cache[p]; require(p); } finally { if (had) global[name] = old; else delete global[name]; }
  return got;
}

function buildIndex() {
  const modules = JSON.parse(fs.readFileSync(path.join(CONTENT, 'modules.json'), 'utf8')).map((m) => {
    let topics = 0, questions = 0;
    for (const c of [].concat(m.chunks || [])) { const d = read('chunk-' + c + '.js', 'CHUNK'); topics += ((d && d.topics) || []).length; }
    for (const f of [].concat(m.questions || [])) { const d = read(f, 'QUESTIONS'); questions += ((d && d.questions) || []).length; }
    return { id: m.id, num: m.num, title: m.title, free: !!m.free, topics, questions };
  });

  // papers: the index (in papers-free.js) lists every paper in order; the papers themselves sit in papers-free.js
  // (questions open to everyone) or in a Pro file (papers-paid.js / papers-pro.js)
  const files = fs.readdirSync(CONTENT).filter((f) => /^papers-.*\.js$/.test(f)).sort();
  const byId = {}, order = [];
  for (const f of files) {
    const d = read(f, 'PAPERS') || {};
    const pro = !/free/.test(f);
    for (const x of d.index || []) if (!byId[x.id]) { byId[x.id] = { id: x.id, kind: x.kind || '', title: x.title || x.id, sub: x.sub || '', questions: 0, access: 'pro' }; order.push(x.id); }
    for (const x of d.papers || []) {
      const p = byId[x.id] || (byId[x.id] = { id: x.id, kind: x.kind || '', title: x.title || x.id, sub: x.sub || '', questions: 0, access: 'pro' });
      if (!order.includes(x.id)) order.push(x.id);
      p.questions = Math.max(p.questions, (x.questions || []).length);
      if (!pro) p.access = 'free';
    }
  }
  return { modules, papers: order.map((id) => byId[id]) };
}

function writeIndex() {
  const idx = buildIndex();
  fs.writeFileSync(path.join(ROOT, 'api', '_content.json'), JSON.stringify(idx, null, 1) + '\n');
  return idx;
}

module.exports = { buildIndex, writeIndex };
if (require.main === module) {
  const idx = writeIndex();
  console.log(`api/_content.json: ${idx.modules.length} modules, ${idx.papers.length} papers`);
}
