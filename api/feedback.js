// POST /api/feedback { kind, topic?, tab?, text, contact?, website? } -> stores a "Help?" request or an "Any ideas?" idea
//   kind: 'mistake' (wrong in the notes) | 'suggestion' | 'bug' (something isn't working) | 'other' | 'idea'
// Both show up on the owner's page (/admin) with the student's email, so the owner can reply.
// GET  /api/feedback                  -> { messages, unread } the signed-in student's inbox: the owner's replies
//                                        (list inbox:<email>, written by /api/stats "reply"), newest first
// POST /api/feedback { action: 'read' } -> marks them all read (inboxRead:<email> = the time)
const { send, body, getUser, handle } = require('./_lib');
const store = require('./_store');
const crypto = require('crypto');

const KINDS = ['mistake', 'suggestion', 'bug', 'other', 'idea'];
const clean = (s, n) => String(s || '').split('').filter((ch) => ch.charCodeAt(0) >= 32 || ch === '\n').join('').trim().slice(0, n);

module.exports = handle(async (req, res) => {
  if (req.method === 'GET') {
    const u = getUser(req);
    if (!u) return send(res, 401, { error: 'Sign in to see your messages.' });
    if (!store.configured()) return send(res, 200, { messages: [], unread: 0 });
    const [list, last] = await store.pipeline([['LRANGE', 'inbox:' + u.e, 0, 49], ['GET', 'inboxRead:' + u.e]]);
    const messages = (list || []).map((x) => { try { return JSON.parse(x); } catch (e) { return null; } }).filter((x) => x && x.reply);
    return send(res, 200, { messages, unread: messages.filter((m) => !last || m.at > last).length });
  }
  if (req.method !== 'POST') return send(res, 405, { error: 'GET or POST only' });
  const b = await body(req);
  if (b.action === 'read') {
    const u = getUser(req);
    if (!u) return send(res, 401, { error: 'Sign in first.' });
    if (store.configured()) await store.pipeline([['SET', 'inboxRead:' + u.e, new Date().toISOString()]]);
    return send(res, 200, { ok: true });
  }
  if (b.website) return send(res, 200, { ok: true }); // honeypot: bots fill hidden fields
  const text = clean(b.text, 1500);
  if (text.length < 5) return send(res, 400, { error: 'Please write a few words first.' });
  const u = getUser(req);
  const item = {
    id: crypto.randomBytes(6).toString('hex'),
    at: new Date().toISOString(),
    kind: KINDS.includes(b.kind) ? b.kind : 'mistake',
    topic: clean(b.topic, 60),
    tab: clean(b.tab, 120),
    text,
    email: u ? u.e : '',
    contact: clean(b.contact, 120),
  };
  console.log('[feedback]', JSON.stringify(item)); // always visible in Vercel → Logs
  if (store.configured()) {
    const key = `rl:fb:${u ? u.e : store.ipHash(req)}:${new Date().toISOString().slice(0, 13)}`;
    const [count] = await store.pipeline([['INCR', key], ['EXPIRE', key, 3600]]);
    if (count > 10) return send(res, 429, { error: 'Thanks! That is a lot of messages in one hour, please try again later.' });
    await store.pipeline([['LPUSH', 'feedback', JSON.stringify(item)], ['LTRIM', 'feedback', 0, 999]]);
  }
  send(res, 200, { ok: true, stored: store.configured() });
});
