// Progress sync: a student's progress follows their account across their phone and laptop.
//   GET  /api/sync               -> { data } the saved copy (null = nothing saved yet)
//   POST /api/sync { data, mods } -> saves it (key prog:<email>, max ~300 KB) and a small summary for the owner's
//                                  student list (hash progSum: email -> { total, today, streak, topics, mods, at })
// The browser merges the saved copy with its own before sending, so this just stores what it is given.
// (This is the 12th function: the Vercel Hobby limit. Fold new endpoints into an existing one.)
const { send, body, getUser, deviceActive, handle } = require('./_lib');
const store = require('./_store');

const MAX_BYTES = 300 * 1024;
const DAYMS = 864e5, IST = 5.5 * 3600e3;
const dayKey = (ms) => new Date(ms + IST).toISOString().slice(0, 10);

// the same numbers the app shows: seconds studied, days in a row with at least a minute, topics marked done
function summary(d, mods) {
  const study = d.study && typeof d.study === 'object' ? d.study : {};
  const total = Object.values(study).reduce((a, v) => a + (+v || 0), 0);
  const today = +study[dayKey(Date.now())] || 0;
  let streak = 0, t = Date.now();
  if ((+study[dayKey(t)] || 0) < 60) t -= DAYMS;
  while ((+study[dayKey(t)] || 0) >= 60 && streak < 1000) { streak++; t -= DAYMS; }
  const topics = Object.values(d.done && typeof d.done === 'object' ? d.done : {}).filter(Boolean).length;
  const m = parseInt(mods, 10);
  return { total: Math.round(total), today: Math.round(today), streak, topics, mods: Number.isInteger(m) && m >= 0 && m <= 50 ? m : 0, day: dayKey(Date.now()), at: new Date().toISOString() };
}

module.exports = handle(async (req, res) => {
  const u = getUser(req);
  if (!u) return send(res, 401, { error: 'Sign in to sync your progress.' });
  if (!store.configured()) return send(res, 200, { data: null, stored: false });
  if (!(await deviceActive(u, req))) return send(res, 401, { error: 'Signed out on this device.' });
  const key = 'prog:' + u.e;
  if (req.method === 'GET') {
    const [raw] = await store.pipeline([['GET', key]]);
    let data = null; try { data = JSON.parse(raw || 'null'); } catch (e) {}
    return send(res, 200, { data: data && typeof data === 'object' ? data : null });
  }
  if (req.method !== 'POST') return send(res, 405, { error: 'GET or POST only' });
  const b = await body(req);
  if (!b.data || typeof b.data !== 'object' || Array.isArray(b.data) || !b.data.visited) return send(res, 400, { error: 'No progress to save.' });
  const json = JSON.stringify(b.data);
  if (Buffer.byteLength(json) > MAX_BYTES) return send(res, 413, { error: 'Your saved progress is too big to sync (over 300 KB). Remove some notes or highlights.' });
  const rl = `rl:sync:${u.e}:${new Date().toISOString().slice(0, 13)}`;
  const [count] = await store.pipeline([['INCR', rl], ['EXPIRE', rl, 3600]]);
  if (count > 400) return send(res, 429, { error: 'Too many saves this hour.' });
  await store.pipeline([['SET', key, json], ['HSET', 'progSum', u.e, JSON.stringify(summary(b.data, b.mods))]]);
  send(res, 200, { ok: true });
});
