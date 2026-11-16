// POST /api/track -> anonymous counters (no personal data stored)
//   { visit: true }                          +1 to today's visitors (sent once per browser per day)
//   { topic }                                +1 to that topic's open count
//   { quiz, ok, label }                      +1 right/wrong for a question (first answer per session)
//   { confusing, tab, on, label }            +1 / -1 on a topic tab's "Confusing?" count
//   { funnel: 'paywall' | 'start' | 'gopro' } +1 to today's paywall views / checkout opens / Go Pro page views
const { send, body, handle } = require('./_lib');
const store = require('./_store');

const TOPIC = /^m[0-9]+-[a-z0-9-]{2,60}$/;
const QID = /^[A-Za-z0-9_-]{1,40}$/;
const label = (s) => String(s || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 140);

module.exports = handle(async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  if (!store.configured()) return send(res, 200, { ok: true, stored: false });
  const b = await body(req);
  const cmds = [];
  if (b.visit) cmds.push(['HINCRBY', 'visits', store.today(), 1]);
  const topic = String(b.topic || '');
  if (TOPIC.test(topic)) cmds.push(['HINCRBY', 'views', topic, 1]);
  const q = String(b.quiz || '');
  if (QID.test(q)) {
    cmds.push(['HINCRBY', 'quiz', q + (b.ok ? ':r' : ':w'), 1]);
    if (b.label) cmds.push(['HSET', 'quizLabel', q, label(b.label)]);
  }
  const c = String(b.confusing || ''), tab = parseInt(b.tab, 10);
  if (TOPIC.test(c) && Number.isInteger(tab) && tab >= 0 && tab < 40) {
    const f = c + '#' + tab;
    cmds.push(['HINCRBY', 'confusing', f, b.on ? 1 : -1]);
    if (b.label) cmds.push(['HSET', 'confusingLabel', f, label(b.label)]);
  }
  if (b.funnel === 'paywall' || b.funnel === 'start' || b.funnel === 'gopro') cmds.push(['HINCRBY', 'funnel', store.today() + ':' + b.funnel, 1]);
  if (cmds.length) await store.pipeline(cmds);
  send(res, 200, { ok: true });
});
