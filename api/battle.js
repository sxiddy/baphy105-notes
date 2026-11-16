// 1v1 quiz battles. One student picks topics and gets a link; one other student opens it and joins (never more
// than two). Ten questions, 10 seconds each, built from the flashcards (api/_battle.json, written by tools/build.js).
// The server is the clock and the marker: a question is sent only once it starts, answers are accepted only inside
// its window, and the right answer is revealed only after the window closes. A tab switch during a question makes
// that question count as wrong.
//   GET  /api/battle                     -> { access: 'full' | 'preview' | 'used', modules }
//   GET  /api/battle?id=X                -> the battle as this player sees it (poll it)
//   POST /api/battle { action: 'create', topics: [topicId, ...] } -> { id }
//   POST /api/battle { action: 'join', id }
//   POST /api/battle { action: 'ready', id }         this player read the rules; the battle starts once both are ready
//   POST /api/battle { action: 'answer', id, i, k }   k = option 0-3
//   POST /api/battle { action: 'switch', id, i }      the player left the tab during question i
// Paid (or free-access) students can battle on any topic their access covers. Everyone else gets one preview
// battle, on one topic from a free module (key "bfree:<email>").
const crypto = require('crypto');
const { send, body, getUser, hasAccess, siteMode, handle } = require('./_lib');
const store = require('./_store');
const B = require('./_battle.json');
const { freeModules = [] } = require('./_access.json');

const QT = 10000, GAP = 4000, LEAD = 5000, GRACE = 1500, N = 10, TTL = 3 * 3600;
const SLOT = QT + GAP;
const firstName = (email) => { const w = String(email).split('@')[0].split('.')[0].replace(/[^a-z]/gi, '') || 'Student'; return w[0].toUpperCase() + w.slice(1).toLowerCase(); };
const parse = (s, d) => { try { return JSON.parse(s) ?? d; } catch (e) { return d; } };
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const points = (a, sw, c) => (a && !sw && a.k === c ? 100 + Math.round(50 * Math.max(0, 1 - a.ms / QT)) : 0);
const err = (status, message) => Object.assign(new Error(message), { status });

// Can this student play on these topics? A preview uses up the one free battle, so it is only checked when joining or creating.
async function allow(req, u, topics, id) {
  const mods = [...new Set(topics.map((t) => B.topics[t][0]))];
  const t = await hasAccess(req);
  if (t && (!t.modules || mods.every((m) => t.modules.includes(m) || freeModules.includes(m)))) return false;
  if (topics.length === 1 && mods.every((m) => freeModules.includes(m))) {
    const [ok] = await store.pipeline([['SET', 'bfree:' + u.e, id, 'NX']]);
    if (ok == null) throw err(402, 'You have used your free preview battle. Unlock full access to battle on any topic.');
    return true;
  }
  throw err(402, t ? 'Your access does not cover every topic in this battle.' : 'Battles on these topics are for full-access students. Free accounts get one preview battle on a single Module 2 topic.');
}

function makeQuestions(topics) {
  const pool = shuffle(topics.flatMap((t) => (B.cards[t] || []).map((_, i) => [t, i])));
  if (pool.length < 4) throw err(400, 'Pick a topic with more flashcards.');
  return pool.slice(0, N).map(([t, i]) => {
    const back = B.cards[t][i][1];
    // wrong options: other cards of the same topic first, then the other chosen topics
    const same = shuffle((B.cards[t] || []).map((_, j) => [t, j]).filter(([, j]) => j !== i));
    const other = shuffle(pool.filter(([tt]) => tt !== t));
    const seen = new Set([back]), wrong = [];
    for (const o of [...same, ...other]) { const b = B.cards[o[0]][o[1]][1]; if (!seen.has(b)) { seen.add(b); wrong.push(o); } if (wrong.length === 3) break; }
    const opts = shuffle([[t, i], ...wrong]);
    return { t, i, o: opts, c: opts.findIndex(([ot, oi]) => ot === t && oi === i) };
  });
}

async function load(id) {
  if (!/^[a-f0-9]{10}$/.test(id)) throw err(404, 'This battle link is not valid.');
  const [flat, ans] = await store.pipeline([['HGETALL', 'bt:' + id], ['HGETALL', 'bt:' + id + ':a']]);
  const bt = {}; for (let i = 0; flat && i < flat.length; i += 2) bt[flat[i]] = flat[i + 1];
  if (!bt.host) throw err(404, 'This battle has expired or never existed. Start a new one.');
  const a = {}; for (let i = 0; ans && i < ans.length; i += 2) a[ans[i]] = ans[i + 1];
  return { bt, a, qs: parse(bt.qs, []), topics: parse(bt.topics, []) };
}
const roleOf = (bt, u) => (bt.host === u.e ? 'host' : bt.guest === u.e ? 'guest' : null);

function view(id, { bt, a, qs, topics }, role, now) {
  const start = +bt.start || 0, n = qs.length;
  const out = {
    id, n, qt: QT, gap: GAP, now, start: start || null, role,
    topics: topics.map((t) => B.topics[t] ? B.topics[t][1] : t), topicIds: topics, preview: bt.preview === '1',
    host: { name: firstName(bt.host) }, guest: bt.guest ? { name: firstName(bt.guest) } : null,
    results: [], current: null, scores: { host: 0, guest: 0 }, done: false, ready: { host: bt.readyHost === '1', guest: bt.readyGuest === '1' },
  };
  if (!start || !role) return out; // someone else with the link only sees who is playing, never the questions
  const ans = (r, i) => parse(a[r + ':' + i], null), sw = (r, i) => a[r + ':' + i + ':sw'] === '1';
  for (let i = 0; i < n; i++) {
    const qs0 = start + i * SLOT;
    if (now < qs0 + QT + GRACE) {
      if (now >= qs0 && !out.current) {
        const q = qs[i];
        out.current = { i, startsAt: qs0, front: B.cards[q.t][q.i][0], topic: B.topics[q.t][1], options: q.o.map(([t, j]) => B.cards[t][j][1]), answered: role ? ans(role, i) != null : false, switched: role ? sw(role, i) : false };
      }
      break;
    }
    const q = qs[i], side = (r) => { const x = ans(r, i), s = sw(r, i); const p = points(x, s, q.c); out.scores[r] += p; return { k: x ? x.k : null, ms: x ? x.ms : null, ok: p > 0, pts: p, switched: s }; };
    out.results.push({ i, c: q.c, front: B.cards[q.t][q.i][0], answer: B.cards[q.t][q.i][1], options: q.o.map(([t, j]) => B.cards[t][j][1]), host: side('host'), guest: side('guest') });
  }
  out.done = out.results.length === n;
  return out;
}

module.exports = handle(async (req, res) => {
  const u = getUser(req);
  if (!u) return send(res, 401, { error: (await siteMode()).signin ? 'Sign in with your VIT student account to battle.' : 'Battles need a signed-in account, and sign-in is switched off right now.' });
  if (!store.configured()) return send(res, 400, { error: 'Battles are not available right now.' });
  const now = Date.now();

  if (req.method === 'GET') {
    const id = new URL(req.url, 'http://x').searchParams.get('id') || '';
    if (!id) {
      const t = await hasAccess(req);
      if (t) return send(res, 200, { access: 'full', modules: t.modules || null });
      const [used] = await store.pipeline([['GET', 'bfree:' + u.e]]);
      return send(res, 200, { access: used ? 'used' : 'preview', modules: freeModules });
    }
    const b = await load(id);
    return send(res, 200, view(id, b, roleOf(b.bt, u), now), { 'Cache-Control': 'no-store' });
  }
  if (req.method !== 'POST') return send(res, 405, { error: 'GET or POST only' });
  const b = await body(req);

  if (b.action === 'create') {
    const topics = [...new Set((Array.isArray(b.topics) ? b.topics : []).map(String))].filter((t) => B.topics[t]).slice(0, 40);
    if (!topics.length) return send(res, 400, { error: 'Pick at least one topic.' });
    const rl = `rl:bt:${u.e}:${new Date().toISOString().slice(0, 13)}`;
    const [count] = await store.pipeline([['INCR', rl], ['EXPIRE', rl, 3600]]);
    if (count > 20) return send(res, 429, { error: 'That is a lot of battles for one hour. Try again later.' });
    const id = crypto.randomBytes(5).toString('hex');
    const preview = await allow(req, u, topics, id);
    const qs = makeQuestions(topics);
    await store.pipeline([['HSET', 'bt:' + id, 'host', u.e, 'topics', JSON.stringify(topics), 'qs', JSON.stringify(qs), 'created', String(now), 'preview', preview ? '1' : '0'], ['EXPIRE', 'bt:' + id, TTL], ['HINCRBY', 'battles', store.today(), 1]]);
    return send(res, 200, { ok: true, id });
  }

  const id = String(b.id || '');
  const bat = await load(id);
  const { bt, qs, topics } = bat;

  if (b.action === 'join') {
    if (bt.host === u.e) return send(res, 400, { error: 'This is your own battle. Send the link to a friend.' });
    if (bt.guest && bt.guest !== u.e) return send(res, 409, { error: 'This battle already has two players. Battles are 1v1.' });
    if (bt.guest === u.e) return send(res, 200, { ok: true });
    await allow(req, u, topics, id);
    const [set] = await store.pipeline([['HSETNX', 'bt:' + id, 'guest', u.e]]);
    if (!set) return send(res, 409, { error: 'Someone else joined first. Battles are 1v1.' });
    return send(res, 200, { ok: true });
  }

  const role = roleOf(bt, u);
  if (!role) return send(res, 403, { error: 'You are not a player in this battle.' });

  if (b.action === 'ready') {
    if (!bt.guest) return send(res, 409, { error: 'Wait for your opponent to join.' });
    const [, flags] = await store.pipeline([['HSET', 'bt:' + id, role === 'host' ? 'readyHost' : 'readyGuest', '1'], ['HMGET', 'bt:' + id, 'readyHost', 'readyGuest']]);
    // both have read the rules: fix the start time once (whoever gets here second sets it)
    if (flags && flags[0] === '1' && flags[1] === '1') await store.pipeline([['HSETNX', 'bt:' + id, 'start', String(now + LEAD)], ['EXPIRE', 'bt:' + id + ':a', TTL]]);
    return send(res, 200, { ok: true });
  }
  const start = +bt.start || 0, i = parseInt(b.i, 10);
  const qs0 = start + i * SLOT;
  const open = start && Number.isInteger(i) && i >= 0 && i < qs.length && now >= qs0 - 500 && now <= qs0 + QT + GRACE;

  if (b.action === 'answer') {
    const k = parseInt(b.k, 10);
    if (!open) return send(res, 409, { error: 'Time is up for that question.' });
    if (!(k >= 0 && k <= 3)) return send(res, 400, { error: 'Pick an option.' });
    const [set] = await store.pipeline([['HSETNX', 'bt:' + id + ':a', role + ':' + i, JSON.stringify({ k, ms: Math.max(0, Math.min(QT, now - qs0)) })], ['EXPIRE', 'bt:' + id + ':a', TTL]]);
    return send(res, 200, { ok: true, already: !set });
  }
  if (b.action === 'switch') {
    if (open) await store.pipeline([['HSET', 'bt:' + id + ':a', role + ':' + i + ':sw', '1'], ['EXPIRE', 'bt:' + id + ':a', TTL]]);
    return send(res, 200, { ok: true });
  }
  send(res, 400, { error: 'Unknown action.' });
});
