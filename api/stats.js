// Owner-only admin API. Send the ADMIN_KEY (Vercel env var) in the "x-admin-key" header.
//   GET  /api/stats -> payments, visits, topic views, funnel, quiz + "Confusing?" insights, feedback, lists, settings
//   POST /api/stats { action, ... }:
//     unlock-me                          owner access cookie on this browser (no device limit)
//     lookup { email }                   everything about one student: payments, free access, limits, devices
//     grant { email, name?, modules?, until? }   free access (until = ms: temporary) (modules: ['m3'] for one module, empty/absent = all)
//     revoke { email }                   remove free access
//     set-limits { email, phones, pcs, until? }  custom device limits (until = ms: temporary, then 1 + 1 again);  clear-limits { email }  back to 1 + 1
//     reset-devices { email }            free that student's device slots
//     set-price { rupees }               normal price for new payments
//     set-sale { rupees, hours, text? } / end-sale   temporary price that ends by itself, with an optional message (₹0 = every module free until then)
//     set-banner { text, on }            announcement shown at the top of the site
//     set-paused { on, text? }           pause payments: the paywall shows a notice instead of the Pay button
//     set-signin { on }                  Google sign-in on, or off (anyone opens the site as a guest; see siteMode in _lib.js)
//     set-mode { free }                  the whole site free (every module open) or paid (as usual)
//     set-business { name }              the business name shown on the terms, refund and contact pages
//     feedback-status { id, status }     mark a Help? request or an idea open / fixed / ignored
//     reply { id, text }                 answer a Help? request or an idea: saved in hash replies and sent to the
//                                        student's inbox (list inbox:<email>, read with GET /api/feedback)
//     bulk-grant { emails: [...], name?, modules? }       free access for many students at once
//     bulk-limits { emails: [...], phones, pcs, until? }        the same device limit for many students
//     approve-reset { email } / decline-reset { email }   a student's device reset request (hash "devreq")
const crypto = require('crypto');
const { send, body, env, safeEqual, razorpay, isOurs, settings, siteMode, MAX_DEVICES, deviceKeys, normEmail, isStudentEmail, DOMAIN, ownerCookie, parseLimits, limitUntil, reviewOn, handle } = require('./_lib');
const store = require('./_store');
const { notixSales, contentStats } = require('./_notix');
const { paidModules = [], freeModules = [] } = require('./_access.json');

async function paidPayments(pages) {
  // no Razorpay keys (this subject sells only on Notix): the rest of the admin page still works, just without them
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return [];
  const from = Math.floor(Date.now() / 1000) - 400 * 24 * 3600, out = [];
  for (let page = 0; page < pages; page++) {
    const list = await razorpay('GET', `/payments?from=${from}&count=100&skip=${page * 100}`);
    const items = list.items || [];
    out.push(...items.filter(isOurs));
    if (items.length < 100) break;
  }
  return out;
}
// the admin page still opens when Razorpay refuses (wrong/rotated keys, test vs live mix-up); it says why instead
async function tryPayments(pages) {
  try { return { pays: await paidPayments(pages), razorpayError: null }; }
  catch (e) { return { pays: [], razorpayError: e.message || 'Razorpay request failed' }; }
}
const iso = (sec) => new Date(sec * 1000).toISOString();

// Sales for the admin page. When this subject sells on Notix (STORE_URL set), the numbers are Notix's, exactly as the
// Notix admin page shows them for this subject; payments made on this site directly (before Notix) are listed apart
// in "before". If Notix cannot be asked, the totals are null and the page says why, rather than showing wrong numbers.
function salesSummary(pays, nx, byDay) {
  const direct = { count: pays.length, revenue: pays.reduce((a, p) => a + p.amount, 0) / 100, fees: pays.reduce((a, p) => a + (p.fee || 0), 0) / 100 };
  const directRecent = pays.map((p) => ({ at: iso(p.created_at), email: normEmail((p.notes || {}).email) || '(before sign-in)', id: p.id, amount: p.amount / 100, via: nx.on ? 'this site' : '' }));
  if (!nx.on) return { source: 'site', ...direct, byDay, recent: directRecent.slice(0, 15) };
  const ok = !nx.error, t = nx.totals || {};
  const nxRecent = (nx.payments || []).filter((p) => p.status === 'paid' || p.status === 'refunded')
    .map((p) => ({ at: p.at, email: p.email, id: p.id, amount: (p.amount || 0) / 100, via: 'Notix', status: p.status, bundle: !!p.bundle }));
  return {
    source: 'notix', notixError: nx.error || null,
    count: ok ? t.count : null, revenue: ok ? t.revenue / 100 : null, manual: ok ? t.manual : null,
    refunds: ok ? t.refunds : null, refunded: ok ? t.refunded / 100 : null,
    fees: direct.fees, before: direct, byDay,
    recent: [...nxRecent, ...directRecent].sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, 30),
  };
}
const feedbackId = (x) => x.id || crypto.createHash('sha1').update(String(x.at) + '|' + String(x.text)).digest('hex').slice(0, 12);
const parseJSON = (s, d) => { try { return JSON.parse(s) ?? d; } catch (e) { return d; } };
const IST = 5.5 * 3600e3; // days in Indian time
const istDay = (ms) => new Date(ms + IST).toISOString().slice(0, 10);
const lastDays = (n) => Array.from({ length: n }, (_, i) => istDay(Date.now() - i * 864e5));
// a student's synced summary as of now: "today" only counts if it was saved today, and a streak last saved before
// yesterday has since been broken
function progress(p) {
  if (!p || typeof p !== 'object') return null;
  const [td, yd] = lastDays(2);
  return { total: +p.total || 0, today: p.day === td ? +p.today || 0 : 0, streak: p.day === td || p.day === yd ? +p.streak || 0 : 0, topics: +p.topics || 0, mods: +p.mods || 0, at: p.at || '' };
}

module.exports = handle(async (req, res) => {
  const key = req.headers['x-admin-key'] || '';
  if (!key || !safeEqual(key, env('ADMIN_KEY'))) return send(res, 401, { error: 'Wrong admin key.' });

  if (req.method === 'POST') {
    const b = await body(req);
    const a = b.action;
    if (a === 'unlock-me') return send(res, 200, { ok: true }, { 'Set-Cookie': ownerCookie() });
    if (!store.configured()) return send(res, 400, { error: 'Storage is not set up yet (Vercel → Storage → Upstash).' });

    if (a === 'set-price') {
      const rs = Number(b.rupees);
      if (!Number.isInteger(rs) || rs < 0 || rs > 5000) return send(res, 400, { error: 'Enter a whole number of rupees, from 0 (free) to 5000.' });
      await store.pipeline([['HSET', 'config', 'price', String(rs * 100)]]);
      return send(res, 200, { ok: true });
    }
    if (a === 'set-sale') {
      const rs = Number(b.rupees), hours = Number(b.hours);
      if (!Number.isInteger(rs) || rs < 0 || rs > 5000) return send(res, 400, { error: 'Enter a whole number of rupees, from 0 (free) to 5000.' });
      if (!(hours > 0 && hours <= 24 * 60)) return send(res, 400, { error: 'Pick how long the offer lasts (up to 60 days).' });
      const until = Date.now() + Math.round(hours * 3600e3);
      const text = String(b.text || '').split('').filter((ch) => ch.charCodeAt(0) >= 32).join('').trim().slice(0, 140);
      await store.pipeline([['HSET', 'config', 'sale', JSON.stringify({ price: rs * 100, until, text })]]);
      return send(res, 200, { ok: true, until });
    }
    if (a === 'end-sale') {
      await store.pipeline([['HDEL', 'config', 'sale']]);
      return send(res, 200, { ok: true });
    }
    if (a === 'set-banner') {
      const text = String(b.text || '').trim().slice(0, 240);
      if (b.on && !text) return send(res, 400, { error: 'Type the announcement first.' });
      const prev = parseJSON((await store.pipeline([['HGET', 'config', 'banner']]))[0], {}) || {};
      const id = text && text === prev.text ? prev.id : crypto.randomBytes(4).toString('hex'); // new text shows again to people who closed the old one
      await store.pipeline([['HSET', 'config', 'banner', JSON.stringify({ id, text, on: !!b.on })]]);
      return send(res, 200, { ok: true });
    }
    if (a === 'set-paused') {
      const text = String(b.text || '').split('').filter((ch) => ch.charCodeAt(0) >= 32).join('').trim().slice(0, 240);
      await store.pipeline([b.on ? ['HSET', 'config', 'paused', JSON.stringify({ on: true, text })] : ['HDEL', 'config', 'paused']]);
      return send(res, 200, { ok: true });
    }
    if (a === 'set-signin') {
      await store.pipeline([['HSET', 'config', 'signin', b.on ? 'on' : 'off']]);
      return send(res, 200, { ok: true });
    }
    if (a === 'set-mode') {
      await store.pipeline([['HSET', 'config', 'mode', b.free ? 'free' : 'paid']]);
      return send(res, 200, { ok: true });
    }
    if (a === 'set-business') {
      const name = String(b.name || '').split('').filter((ch) => ch.charCodeAt(0) >= 32).join('').trim().slice(0, 120);
      await store.pipeline([name ? ['HSET', 'config', 'business', name] : ['HDEL', 'config', 'business']]);
      return send(res, 200, { ok: true });
    }
    if (a === 'feedback-status') {
      const id = String(b.id || '');
      if (!/^[a-f0-9]{6,16}$/.test(id) || !['open', 'fixed', 'ignored'].includes(b.status)) return send(res, 400, { error: 'Bad report id or status.' });
      await store.pipeline([b.status === 'open' ? ['HDEL', 'feedbackStatus', id] : ['HSET', 'feedbackStatus', id, b.status]]);
      return send(res, 200, { ok: true });
    }

    if (a === 'reply') {
      const id = String(b.id || '');
      const text = String(b.text || '').split('').filter((ch) => ch.charCodeAt(0) >= 32 || ch === '\n').join('').trim().slice(0, 1500);
      if (!/^[a-f0-9]{6,16}$/.test(id)) return send(res, 400, { error: 'Bad message id.' });
      if (text.length < 2) return send(res, 400, { error: 'Type a reply first.' });
      const [list] = await store.pipeline([['LRANGE', 'feedback', 0, 999]]);
      const it = (list || []).map((x) => parseJSON(x, {}) || {}).find((x) => feedbackId(x) === id);
      if (!it) return send(res, 404, { error: 'That message is no longer in the list.' });
      if (!isStudentEmail(it.email)) return send(res, 400, { error: 'This message was sent without a student email, so the reply cannot reach anyone.' });
      const at = new Date().toISOString();
      await store.pipeline([
        ['HSET', 'replies', id, JSON.stringify({ text, at })],
        ['LPUSH', 'inbox:' + it.email, JSON.stringify({ id, at, kind: it.kind || 'mistake', msg: String(it.text || '').slice(0, 200), reply: text })],
        ['LTRIM', 'inbox:' + it.email, 0, 49],
      ]);
      return send(res, 200, { ok: true, at });
    }

    if (a === 'bulk-grant' || a === 'bulk-limits') {
      const list = [...new Set((Array.isArray(b.emails) ? b.emails : []).map(normEmail))].slice(0, 2000);
      const good = list.filter(isStudentEmail), bad = list.filter((e) => !isStudentEmail(e));
      if (!good.length) return send(res, 400, { error: `No VIT student emails (…@${DOMAIN}) found.` });
      let cmds;
      if (a === 'bulk-grant') {
        const ids = paidModules.map((m) => m.id);
        const mods = Array.isArray(b.modules) ? b.modules.filter((m) => ids.includes(m)) : [];
        const u = limitUntil(b.until); if (u.error) return send(res, 400, { error: u.error });
        const item = JSON.stringify({ name: String(b.name || '').trim().slice(0, 60), at: new Date().toISOString(), modules: mods.length && mods.length < ids.length ? mods : null, ...(u.until ? { until: u.until } : {}) });
        cmds = good.map((e) => ['HSET', 'free', e, item]);
      } else {
        const n = (v) => parseInt(v, 10);
        const lim = { phone: n(b.phones), pc: n(b.pcs) }, u = limitUntil(b.until);
        if (![lim.phone, lim.pc].every((x) => Number.isInteger(x) && x >= 0 && x <= 20)) return send(res, 400, { error: 'Use whole numbers from 0 to 20.' });
        if (u.error) return send(res, 400, { error: u.error });
        if (u.until) lim.until = u.until;
        cmds = good.map((e) => ['HSET', 'limits', e, JSON.stringify(lim)]);
      }
      for (let i = 0; i < cmds.length; i += 200) await store.pipeline(cmds.slice(i, i + 200));
      return send(res, 200, { ok: true, done: good.length, invalid: bad.slice(0, 50) });
    }

    if (!['lookup', 'reset-devices', 'approve-reset', 'decline-reset', 'grant', 'revoke', 'set-limits', 'clear-limits'].includes(a)) return send(res, 400, { error: 'Unknown action.' });
    const email = normEmail(b.email);
    if (!isStudentEmail(email)) return send(res, 400, { error: `Enter a VIT student email (…@${DOMAIN}).` });

    if (a === 'grant') {
      const ids = paidModules.map((m) => m.id);
      const mods = Array.isArray(b.modules) ? b.modules.filter((m) => ids.includes(m)) : [];
      const u = limitUntil(b.until); if (u.error) return send(res, 400, { error: u.error });
      const item = { name: String(b.name || '').trim().slice(0, 60), at: new Date().toISOString(), modules: mods.length && mods.length < ids.length ? mods : null };
      if (u.until) item.until = u.until; // temporary: access ends by itself (checked in hasAccess)
      await store.pipeline([['HSET', 'free', email, JSON.stringify(item)]]);
      return send(res, 200, { ok: true });
    }
    if (a === 'revoke') {
      await store.pipeline([['HDEL', 'free', email]]);
      return send(res, 200, { ok: true });
    }
    if (a === 'set-limits') {
      const n = (v) => parseInt(v, 10);
      const lim = { phone: n(b.phones), pc: n(b.pcs) }, u = limitUntil(b.until);
      if (![lim.phone, lim.pc].every((x) => Number.isInteger(x) && x >= 0 && x <= 20)) return send(res, 400, { error: 'Use whole numbers from 0 to 20.' });
      if (u.error) return send(res, 400, { error: u.error });
      if (u.until) lim.until = u.until;
      await store.pipeline([['HSET', 'limits', email, JSON.stringify(lim)]]);
      return send(res, 200, { ok: true });
    }
    if (a === 'clear-limits') {
      await store.pipeline([['HDEL', 'limits', email]]);
      return send(res, 200, { ok: true });
    }
    if (a === 'reset-devices' || a === 'approve-reset') {
      await store.pipeline([['DEL', ...deviceKeys(email), `devices:${email}:phone`, `devices:${email}:pc`], ['HDEL', 'devreq', email]]);
      return send(res, 200, { ok: true });
    }
    if (a === 'decline-reset') {
      await store.pipeline([['HDEL', 'devreq', email]]);
      return send(res, 200, { ok: true });
    }

    // lookup
    const { pays: all, razorpayError } = await tryPayments(20);
    const mine = all.filter((p) => normEmail((p.notes || {}).email) === email);
    const [paidRaw, freeRaw, limRaw, ...counts] = await store.pipeline([['HGET', 'paid', email], ['HGET', 'free', email], ['HGET', 'limits', email], ...deviceKeys(email).map((k) => ['ZCARD', k])]);
    const pd = paidRaw != null ? parseJSON(paidRaw, {}) : null;
    let fr = freeRaw != null ? parseJSON(freeRaw, {}) : null;
    if (fr && fr.until && fr.until <= Date.now()) fr = null; // a temporary grant that has ended
    const lim = parseLimits(limRaw);
    const payments = mine.map((p) => ({ id: p.id, at: iso(p.created_at), amount: p.amount / 100 }));
    if (pd && pd.id && !payments.some((p) => p.id === pd.id)) payments.push({ id: pd.id, at: pd.at, amount: (pd.amount || 0) / 100 }); // e.g. an older payment claimed by ID
    const nx = await notixSales(email);
    (nx.payments || []).forEach((p) => payments.push({ id: p.id || (p.manual ? 'given by hand on Notix' : ''), at: p.at, amount: (p.amount || 0) / 100, via: 'Notix', status: p.status }));
    return send(res, 200, {
      email,
      paid: !!pd || (nx.payments || []).some((p) => p.status === 'paid' || p.status === 'manual'),
      notixError: nx.error || null,
      payments, razorpayError,
      free: fr ? { name: fr.name || '', at: fr.at || '', modules: fr.modules || null, until: fr.until ? new Date(fr.until).toISOString() : null } : null,
      limits: { phones: lim.phone, pcs: lim.pc, custom: limRaw != null && !lim.expired, until: lim.until ? new Date(lim.until).toISOString() : null },
      devices: { phones: counts[0] || 0, pcs: counts[1] || 0 },
    });
  }

  // the Notix admin reads this endpoint too (with the Bearer secret); it has its own sales, so do not ask it back
  const nxAsk = /^Bearer /i.test(String(req.headers.authorization || '')) ? Promise.resolve({ on: false }) : notixSales();
  const [{ pays, razorpayError }, cfg, mode] = await Promise.all([tryPayments(10), settings(), siteMode(true)]);
  const nx = await nxAsk;
  const byDay = {};
  pays.forEach((p) => { const d = istDay(p.created_at * 1000); byDay[d] = (byDay[d] || 0) + 1; });
  (nx.payments || []).forEach((p) => { if (p.status !== 'paid' || !p.at) return; const d = istDay(Date.parse(p.at)); byDay[d] = (byDay[d] || 0) + 1; });
  let quizRaw = {};
  let visits = null, views = null, feedback = null, free = [], limits = [], quiz = [], confusing = [], funnel = null, banner = null, students = [], resetRequests = [], battles = null;
  if (store.configured()) {
    const [v, w, f, fr, lm, qz, ql, cf, cl, fn, fs, bn, dr, bt, rp] = await store.pipeline([
      ['HGETALL', 'visits'], ['HGETALL', 'views'], ['LRANGE', 'feedback', 0, 399], ['HGETALL', 'free'], ['HGETALL', 'limits'],
      ['HGETALL', 'quiz'], ['HGETALL', 'quizLabel'], ['HGETALL', 'confusing'], ['HGETALL', 'confusingLabel'], ['HGETALL', 'funnel'],
      ['HGETALL', 'feedbackStatus'], ['HGET', 'config', 'banner'], ['HGETALL', 'devreq'], ['HGETALL', 'battles'], ['HGETALL', 'replies'],
    ]);
    for (let i = 0; dr && i < dr.length; i += 2) { const x = parseJSON(dr[i + 1], {}) || {}; resetRequests.push({ email: dr[i], at: x.at || '', reason: x.reason || '', kind: x.kind || '' }); }
    resetRequests.sort((a, b) => (b.at > a.at ? 1 : -1));
    battles = store.pairs(bt);
    visits = store.pairs(v); views = store.pairs(w);
    const gone = [];
    for (let i = 0; lm && i < lm.length; i += 2) { const l = parseLimits(lm[i + 1]); if (l.expired) gone.push(lm[i]); else limits.push({ email: lm[i], phones: l.phone, pcs: l.pc, until: l.until ? new Date(l.until).toISOString() : null }); }
    if (gone.length) await store.pipeline([['HDEL', 'limits', ...gone]]); // temporary limits that have ended
    const ended = [];
    for (let i = 0; fr && i < fr.length; i += 2) {
      const x = parseJSON(fr[i + 1], {}) || {};
      if (x.until && x.until <= Date.now()) { ended.push(fr[i]); continue; }
      free.push({ email: fr[i], name: x.name || '', at: x.at || '', modules: x.modules || null, until: x.until ? new Date(x.until).toISOString() : null });
    }
    if (ended.length) await store.pipeline([['HDEL', 'free', ...ended]]); // temporary free access that has ended
    free.sort((a, b) => (b.at > a.at ? 1 : -1));
    const status = store.pairs(fs), replies = {};
    for (let i = 0; rp && i < rp.length; i += 2) replies[rp[i]] = parseJSON(rp[i + 1], null);
    feedback = (f || []).map((x) => { const it = parseJSON(x, { text: String(x) }) || {}; const id = feedbackId(it); return { ...it, kind: it.kind || 'mistake', id, status: status[id] || 'open', reply: replies[id] || null }; });

    // quiz: most-missed questions (at least 3 answers)
    const qc = store.pairs(qz), qlab = store.pairs(ql), qs = {};
    quizRaw = qc;
    for (const k in qc) { const [id, rw] = k.split(':'); (qs[id] = qs[id] || { id, right: 0, wrong: 0 })[rw === 'r' ? 'right' : 'wrong'] += +qc[k] || 0; }
    quiz = Object.values(qs).map((q) => ({ ...q, total: q.right + q.wrong, label: qlab[q.id] || q.id }))
      .filter((q) => q.total >= 3).sort((a, b) => b.wrong / b.total - a.wrong / a.total || b.total - a.total).slice(0, 20);
    const answered = Object.values(qs).reduce((n, q) => n + q.right + q.wrong, 0);
    quiz = { top: quiz, answered, questions: Object.keys(qs).length };

    const cc = store.pairs(cf), clab = store.pairs(cl);
    confusing = Object.keys(cc).map((k) => ({ key: k, count: +cc[k] || 0, label: clab[k] || k })).filter((c) => c.count > 0).sort((a, b) => b.count - a.count).slice(0, 20);

    const fnl = store.pairs(fn), days = lastDays(30);
    funnel = { visitors: 0, gopro: 0, paywall: 0, start: 0, paid: 0 };
    days.forEach((d) => { funnel.visitors += +(visits[d] || 0); ['gopro', 'paywall', 'start', 'paid'].forEach((s) => { funnel[s] += +(fnl[d + ':' + s] || 0); }); });
    if (nx.payments) { const dd = new Set(days); funnel.paid += nx.payments.filter((p) => p.status === 'paid' && p.at && dd.has(istDay(Date.parse(p.at)))).length; }
    banner = parseJSON(bn, null);

    // every student who has signed in (plus anyone paid or on the free list), newest activity first
    const [uf, ul, us, un, pd, dk, uv, ps] = await store.pipeline([['HGETALL', 'userFirst'], ['HGETALL', 'userLogin'], ['HGETALL', 'userSeen'], ['HGETALL', 'userLogins'], ['HGETALL', 'paid'], ['KEYS', 'dev*:*@*'], ['HGETALL', 'userVisits'], ['HGETALL', 'progSum']]);
    const first = store.pairs(uf), login = store.pairs(ul), seen = store.pairs(us), logins = store.pairs(un), paidBy = store.pairs(pd), visitsBy = store.pairs(uv), progBy = store.pairs(ps);
    const freeBy = Object.fromEntries(free.map((f) => [f.email, f]));
    const nxBy = {}; (nx.payments || []).forEach((p) => { if (p.status === 'paid' || p.status === 'manual') nxBy[p.email] = p; });
    // students who signed in before this list existed only left a device record ("devices:<email>:<kind>")
    const early = (dk || []).map((k) => k.slice(k.indexOf(':') + 1, k.lastIndexOf(':'))).filter(isStudentEmail);
    const emails = [...new Set([...Object.keys(first), ...Object.keys(paidBy), ...Object.keys(freeBy), ...early, ...Object.keys(nxBy)])].filter(isStudentEmail).slice(0, 2000); // not the Razorpay reviewer account
    const dc = emails.length ? await store.pipeline(emails.flatMap((e) => deviceKeys(e).map((k) => ['ZCARD', k]))) : [];
    students = emails.map((e, i) => {
      const p = paidBy[e] != null ? parseJSON(paidBy[e], {}) : null;
      return {
        email: e,
        paid: p ? { amount: (p.amount || 0) / 100, at: p.at || '', id: p.id || '' } : nxBy[e] && nxBy[e].status === 'paid' ? { amount: (nxBy[e].amount || 0) / 100, at: nxBy[e].at || '', id: nxBy[e].id || '', via: 'Notix' } : null,
        free: freeBy[e] ? { modules: freeBy[e].modules || null } : nxBy[e] && nxBy[e].status === 'manual' ? { modules: null, via: 'Notix' } : null,
        first: first[e] || '', lastLogin: login[e] || '', lastSeen: seen[e] || login[e] || first[e] || '',
        logins: +logins[e] || 0, visits: +visitsBy[e] || 0, phones: dc[i * MAX_DEVICES] || 0, pcs: dc[i * MAX_DEVICES + 1] || 0,
        early: !first[e] && early.includes(e), // signed in before tracking started
        progress: progBy[e] ? progress(parseJSON(progBy[e], null)) : null, // from the synced copy (api/sync.js)
      };
    }).sort((a, b) => (b.lastSeen > a.lastSeen ? 1 : b.lastSeen < a.lastSeen ? -1 : 0));
  }
  send(res, 200, {
    storage: store.configured(),
    razorpayError,
    maxDevices: MAX_DEVICES,
    paidModules, freeModules,
    price: cfg.normalPrice / 100,
    sale: cfg.sale ? { rupees: cfg.sale.price / 100, until: new Date(cfg.sale.until).toISOString(), text: cfg.sale.text || '' } : null,
    banner, paused: cfg.paused, business: cfg.business || '', reviewOn: reviewOn(), signin: mode.signin, freeSite: mode.freeMode, freeNow: mode.free,
    payments: salesSummary(pays, nx, byDay),
    content: contentStats(views, quizRaw),
    // a deploy made from the CLI has no git commit: then a push to GitHub does not reach the live site (checked daily by Notix)
    deploy: { git: !!process.env.VERCEL_GIT_COMMIT_SHA, sha: (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) },
    visits, views, feedback, free, limits, quiz, confusing, funnel, students, resetRequests, battles,
  });
});
