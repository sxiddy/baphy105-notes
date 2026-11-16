#!/usr/bin/env node
// Headless smoke test of the built app: loads app/index.html's scripts in jsdom,
// walks every route and every tab, mounts every diagram, checks figure files exist.
//   node tools/build.js && node tools/qa.js
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('./node_modules/jsdom');
const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'app');

const errors = [];
const vc = new VirtualConsole();
vc.on('error', (...a) => errors.push('console.error: ' + a.map((x) => (x && x.stack) || String(x)).join(' ')));
vc.on('jsdomError', (e) => { const m = String(e && (e.stack || e.message)); if (!/Could not parse CSS|Not implemented: (window.scrollTo|HTMLElement.prototype.scrollIntoView|Element.prototype.scrollTo)/.test(m)) errors.push('jsdomError: ' + m.split('\n').slice(0, 3).join(' | ')); });

const html = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]).filter((s) => !/gate\.js|data-files/.test(s));
// node tools/qa.js        = a Pro student (every file); node tools/qa.js --free = a free student (free files only)
const FREE_RUN = process.argv.includes('--free');
const ACCESS = JSON.parse(fs.readFileSync(path.join(ROOT, 'api', '_access.json'), 'utf8'));
const dataFiles = fs.readdirSync(path.join(ROOT, 'protected', 'data')).filter((f) => !FREE_RUN || ACCESS.freeFiles.includes(f)).sort((a, b) => (a === 'figs.js') - (b === 'figs.js'));
const dom = new JSDOM('<!doctype html><html><head></head><body><div id="app"></div></body></html>', { url: 'http://localhost/#home', pretendToBeVisual: true, runScripts: 'outside-only', virtualConsole: vc });
const w = dom.window;
w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
w.IntersectionObserver = class { constructor(cb) { this.cb = cb; } observe(el) { this.cb([{ isIntersecting: true, target: el }]); } unobserve() {} disconnect() {} };
w.Element.prototype.scrollTo = function () {};
w.Element.prototype.scrollIntoView = function () {};
w.SVGElement.prototype.getBBox = function () { return { x: 0, y: 0, width: 0, height: 0 }; };
w.SVGElement.prototype.getTotalLength = function () { return 0; };
w.SVGElement.prototype.getPointAtLength = function () { return { x: 0, y: 0 }; };
for (const s of scripts) {
  try { w.eval(fs.readFileSync(path.join(APP, s), 'utf8') + '\n//# sourceURL=' + s); }
  catch (e) { errors.push(`${s}: ${e.stack || e.message}`); }
}
for (const f of dataFiles) { try { w.eval(fs.readFileSync(path.join(ROOT, 'protected', 'data', f), 'utf8')); } catch (e) { errors.push(f + ': ' + e.message); } }
w.PRO = !FREE_RUN;
try { w.__startApp(); } catch (e) { errors.push('start: ' + (e.stack || e.message)); }
const N = w.__notes;
if (!N) { console.log('app did not boot'); errors.forEach((e) => console.log('  ' + e)); process.exit(1); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const go = async (hash) => { const e0 = errors.length; w.history.pushState(null, '', hash); w.dispatchEvent(new w.PopStateEvent('popstate')); await sleep(30); return errors.length - e0; };
const report = { routes: 0, tabs: 0, figs: 0, figMissing: [], vizMounted: 0, vizMissing: [], vizFailed: [], emptyPanels: [] };

(async () => {
  const mods = ACCESS.freeModules;
  const base = ['#home', ...mods.map((m) => '#' + m), ...mods.map((m) => `#${m}-summary`), '#questions', ...mods.map((m) => '#questions.' + m), '#questions.mixed', '#pro', '#revise', '#mock', '#quiz', '#cards', '#formulas', '#lab', '#mine', '#guide', '#papers', '#syllabus.cat1', '#syllabus.cat2', '#battle', '#mock.fat', ...(w.DATA.papers || []).map((p) => '#papers.' + p.id)];
  for (const r of base) { const n = await go(r); report.routes++; if (n) console.log(`errors on ${r}`); }
  const doc = w.document;
  for (const t of N.TOPICS) {
    for (let i = 0; i < t.tabs.length; i++) {
      const n = await go(`#${t.id}.${i}`);
      await sleep(140);
      report.tabs++;
      const panel = doc.querySelector('.panel');
      if (!panel || panel.textContent.trim().length < 30) report.emptyPanels.push(`${t.id}.${i}`);
      doc.querySelectorAll('.panel figure[data-fig]').forEach((f) => {
        report.figs++;
        const id = f.getAttribute('data-fig');
        if (f.classList.contains('missing') || !fs.existsSync(path.join(ROOT, 'protected', 'img', id + '.svg'))) report.figMissing.push(`${t.id}.${i} ${id}`);
      });
      (t.tabs[i].html.match(/data-viz="([a-z0-9-]+)"/g) || []).forEach((m) => {
        const id = m.slice(10, -1);
        if (!w.VIZ || !w.VIZ.has(id)) report.vizMissing.push(`${t.id}.${i} ${id}`);
      });
      doc.querySelectorAll('.panel .viz').forEach((v) => { report.vizMounted++; if (v.querySelector('.viz-error')) report.vizFailed.push(`${t.id}.${i} ${v.getAttribute('data-viz')}`); });
      if (n) console.log(`errors on ${t.id}.${i}`);
    }
  }
  // quiz run-through: start and answer a few
  await go('#quiz');
  const start = doc.querySelector('[data-start]');
  if (start) { start.click(); await sleep(20); for (let k = 0; k < 3; k++) { const o = doc.querySelector('.qopt'); if (o) o.click(); const nx = doc.querySelector('[data-next]'); if (nx) nx.click(); await sleep(20); } }
  // flashcards
  await go('#cards'); const fc = doc.querySelector('.fcard'); if (fc) fc.click(); const kn = doc.querySelector('[data-know]'); if (kn) kn.click();
  // bank reveal
  await go('#questions'); const rv = doc.querySelector('[data-act="reveal"]'); if (rv) rv.click();
  // lab: open every diagram
  await go('#lab');
  const heads = [...doc.querySelectorAll('.lab-head')];
  for (const hd of heads) { hd.click(); await sleep(60); const it = hd.parentElement; if (it.querySelector('.viz-error')) report.vizFailed.push('lab ' + it.dataset.id); }
  // search index
  await go('#home');
  console.log(JSON.stringify({ topics: N.TOPICS.length, questions: N.QS.length, cards: N.CARDS.length, figuresDefined: Object.keys(N.FIGS).length, viz: w.VIZ ? w.VIZ.list().length : 0, ...report }, null, 1));
  if (errors.length) { console.log('\nERRORS (' + errors.length + '):'); [...new Set(errors)].slice(0, 40).forEach((e) => console.log('  ' + e.slice(0, 400))); }
  else console.log('\nno runtime errors');
  w.close();
  process.exit(errors.length || report.figMissing.length || report.vizMissing.length || report.vizFailed.length ? 1 : 0);
})();
