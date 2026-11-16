#!/usr/bin/env node
// Headless snapshot of an interactive diagram, so you can SEE what you built.
//
//   node tools/viz-snap.js app/js/viz/viz-m4b.js bragg
//   node tools/viz-snap.js app/js/viz/viz-m4b.js bragg --wait 1200 --click "n = 2" --wait 800 --set "θ=30" --out bragg-n2
//
// Actions run in order:  --wait <ms>   --click "<button text substring>"   --set "<slider/number label substring>=<value>"
//                        --select "<label substring>=<option value>"
// Output: tmp/viz/<out or id>-<k>.png for each <svg class="viz-svg"> (open with Read),
//         plus a text dump of controls, readouts and caption, and any runtime errors.
// Notes: layout APIs (getBBox, getTotalLength, getPointAtLength, getComputedTextLength) are stubbed here
// (they return zeros), so prefer computing geometry yourself. Fonts differ slightly from the browser.
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('./node_modules/jsdom');
const sharp = require('./node_modules/sharp');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
if (args.length < 2) { console.error('usage: node tools/viz-snap.js <viz-file.js> <viz-id> [--wait ms] [--click text] [--set "label=value"] [--out name]'); process.exit(2); }
const [file, id] = args;
const actions = [];
let outName = id;
for (let i = 2; i < args.length; i += 2) {
  const k = args[i], v = args[i + 1];
  if (k === '--out') outName = v; else actions.push([k.replace(/^--/, ''), v]);
}
if (!actions.some((a) => a[0] === 'wait')) actions.push(['wait', '1200']);

const errors = [];
const vc = new VirtualConsole();
vc.on('error', (...a) => errors.push(a.map(String).join(' ')));
vc.on('jsdomError', (e) => errors.push('jsdomError: ' + (e && (e.stack || e.message))));
vc.on('warn', (...a) => console.log('[warn]', ...a));

const dom = new JSDOM('<!doctype html><html><head></head><body><div id="host"></div></body></html>', { pretendToBeVisual: true, runScripts: 'outside-only', virtualConsole: vc });
const w = dom.window;
w.SVGElement.prototype.getBBox = function () { return { x: 0, y: 0, width: 0, height: 0 }; };
w.SVGElement.prototype.getTotalLength = function () { return 0; };
w.SVGElement.prototype.getPointAtLength = function () { return { x: 0, y: 0 }; };
w.SVGElement.prototype.getComputedTextLength = function () { return 0; };
w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));

function run(src, name) {
  try { w.eval(src + '\n//# sourceURL=' + name); } catch (e) { errors.push(`${name}: ${e.stack || e.message}`); }
}
run(fs.readFileSync(path.join(ROOT, 'app/js/viz-core.js'), 'utf8'), 'viz-core.js');
run(fs.readFileSync(path.resolve(file), 'utf8'), path.basename(file));
if (!w.VIZ || !w.VIZ.has(id)) { console.log(`viz "${id}" is not registered in ${file}. Registered: ${w.VIZ ? w.VIZ.list().join(', ') : '(none)'}`); report(); process.exit(1); }

const host = w.document.getElementById('host');
let handle;
try { handle = w.VIZ.mount(host, id); } catch (e) { errors.push('mount: ' + (e.stack || e.message)); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function findByText(sel, text) {
  return [...host.querySelectorAll(sel)].find((n) => n.textContent.replace(/\s+/g, ' ').toLowerCase().includes(text.toLowerCase()));
}

(async () => {
  let shot = 0;
  for (const [k, v] of actions) {
    try {
      if (k === 'wait') await sleep(parseInt(v, 10) || 0);
      else if (k === 'click') {
        const b = findByText('button', v);
        if (!b) errors.push(`--click: no button containing "${v}". Buttons: ${[...host.querySelectorAll('button')].map((b) => JSON.stringify(b.textContent.trim())).join(', ')}`);
        else b.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
      } else if (k === 'set' || k === 'select') {
        const [label, value] = v.split('=');
        const wrap = findByText('label', label);
        const input = wrap && wrap.querySelector('input,select');
        if (!input) errors.push(`--${k}: no control labelled "${label}"`);
        else { input.value = value; input.dispatchEvent(new w.Event(k === 'select' ? 'change' : 'input', { bubbles: true })); }
      } else if (k === 'shot') { await snap(`${outName}-${v || ++shot}`); }
    } catch (e) { errors.push(`${k} ${v}: ${e.stack || e.message}`); }
  }
  await snap(outName);
  // text dump of the HTML parts
  const txt = (sel) => [...host.querySelectorAll(sel)].map((n) => n.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);
  console.log('title    :', txt('.viz-title').join(' | '));
  console.log('buttons  :', txt('button').join(' | '));
  console.log('sliders  :', [...host.querySelectorAll('.vslider')].map((s) => s.textContent.replace(/\s+/g, ' ').trim()).join(' | '));
  console.log('numbers  :', [...host.querySelectorAll('.vnum')].map((s) => s.textContent.replace(/\s+/g, ' ').trim() + ' [' + (s.querySelector('input,select') || {}).value + ']').join(' | '));
  console.log('readouts :', txt('.vro').join(' | '));
  console.log('caption  :', txt('.viz-caption').join(' | '));
  try { handle && handle.destroy(); } catch (e) { errors.push('destroy: ' + (e.stack || e.message)); }
  report();
  w.close();
  process.exit(errors.length ? 1 : 0);
})();

async function snap(name) {
  const svgs = [...host.querySelectorAll('svg.viz-svg')];
  if (!svgs.length) { console.log('(no <svg class="viz-svg"> found — did you use api.stage?)'); return; }
  const cssText = [...w.document.querySelectorAll('style[data-viz-css]')].map((s) => s.textContent).join('\n');
  fs.mkdirSync(path.join(ROOT, 'tmp', 'viz'), { recursive: true });
  for (let i = 0; i < svgs.length; i++) {
    const s = svgs[i].cloneNode(true);
    const vb = (s.getAttribute('viewBox') || '0 0 640 360').split(/[\s,]+/).map(Number);
    s.setAttribute('width', String(vb[2] * 2));
    s.setAttribute('height', String(vb[3] * 2));
    const style = w.document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = `svg{font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#b3b3bb;fill:#b3b3bb}\n${cssText}`;
    s.insertBefore(style, s.firstChild);
    const xml = new w.XMLSerializer().serializeToString(s);
    const out = path.join(ROOT, 'tmp', 'viz', `${name}${svgs.length > 1 ? '-' + (i + 1) : ''}.png`);
    try {
      await sharp(Buffer.from(xml)).flatten({ background: '#202024' }).png().toFile(out);
      console.log('snapshot :', path.relative(ROOT, out));
    } catch (e) { errors.push('rasterize: ' + e.message); }
  }
}

function report() {
  if (errors.length) { console.log('\nERRORS:'); errors.forEach((e) => console.log('  ' + e)); }
  else console.log('\nno runtime errors');
}
