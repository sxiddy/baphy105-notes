// Pro is bought on the Notix store now, so this subject's real sales live there, not in this site's Razorpay
// payments (those only hold the payments made here directly, before Notix). The admin page asks Notix for them,
// server-to-server with the shared STORE_SECRET, so it shows the same numbers as the Notix admin page.
// The same file is used by every subject site; only STORE_CODE (from _lib.js) differs.
const { STORE_CODE } = require('./_lib');

// -> { on: false }                      STORE_URL / STORE_SECRET not set: this site still sells on its own
//    { on: true, error }                Notix could not be asked; the admin page says so instead of showing wrong numbers
//    { on: true, totals, payments, refunds }   amounts in paise
async function notixSales(email) {
  const url = process.env.STORE_URL, secret = process.env.STORE_SECRET;
  if (!url || !secret) return { on: false };
  const q = '/api/entitlement?sales=1&product=' + encodeURIComponent(STORE_CODE) + (email ? '&email=' + encodeURIComponent(email) : '');
  try {
    const r = await fetch(url.replace(/\/$/, '') + q, { headers: { Authorization: 'Bearer ' + secret }, signal: AbortSignal.timeout(8000) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.totals) return { on: true, error: j.error || 'Notix answered ' + r.status };
    return { on: true, totals: j.totals, payments: j.payments || [], refunds: j.refunds || [] };
  } catch (e) {
    return { on: true, error: e && e.name === 'TimeoutError' ? 'Notix did not answer in time' : 'could not reach Notix (' + ((e && e.message) || 'network error') + ')' };
  }
}

// Per-module numbers for the admin page's Content section. Modules and question papers come from api/_content.json,
// which tools/admin-index.js writes on every build, so a new module or paper shows up here by itself.
function contentStats(views, quizCounts) {
  let idx = { modules: [], papers: [] };
  try { idx = require('./_content.json'); } catch (e) { /* not built yet */ }
  const modules = (idx.modules || []).map((m) => {
    const pre = m.id + '-';
    let opened = 0, viewsN = 0, right = 0, wrong = 0;
    for (const k in views || {}) if (k.startsWith(pre)) { opened++; viewsN += +views[k] || 0; }
    for (const k in quizCounts || {}) {
      if (!k.startsWith(pre)) continue;
      if (k.endsWith(':r')) right += +quizCounts[k] || 0; else if (k.endsWith(':w')) wrong += +quizCounts[k] || 0;
    }
    return { ...m, opened, views: viewsN, answered: right + wrong, right };
  });
  return { modules, papers: idx.papers || [] };
}

module.exports = { notixSales, contentStats };
