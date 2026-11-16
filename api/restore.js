// POST /api/restore { paymentId? } (or { action: 'reset-devices' }: a device reset request, below) -> "Already paid? Restore access" for the signed-in student.
//   Without a payment ID: looks through recent Razorpay payments for a completed one made from this student account.
//   With a payment ID: also unlocks a payment made before sign-in existed (its order has no email). Each such
//   payment can be claimed by one account only (hash "claimed": payment id -> email).
const { send, body, razorpay, checkPayment, isOurs, recordPaid, normEmail, getUser, hasAccess, handle } = require('./_lib');
const store = require('./_store');
const PAGES = 20; // up to 2,000 recent payments scanned (100 per page)

async function findByEmail(email) {
  const from = Math.floor(Date.now() / 1000) - 400 * 24 * 3600;
  for (let page = 0; page < PAGES; page++) {
    const list = await razorpay('GET', `/payments?from=${from}&count=100&skip=${page * 100}`);
    const items = list.items || [];
    // an authorized (not yet captured) UPI payment counts too: checkPayment captures it; left alone, Razorpay refunds it
    const hit = items.find((p) => (isOurs(p) || isOurs({ ...p, status: 'captured' }) && p.status === 'authorized') && normEmail((p.notes || {}).email) === email);
    if (hit) return hit.id;
    if (items.length < 100) break;
  }
  return null;
}

// { action: 'reset-devices', reason? }: the student asks the owner to clear their devices. The request waits in hash
// "devreq" (email -> {at, reason, kind}) until the owner approves or declines it on /admin. One request a week
// (key "devreset:<email>").
const WEEK = 7 * 24 * 3600;
async function requestReset(req, res, u, b) {
  if (!store.configured()) return send(res, 400, { error: 'Device reset requests are not available right now.' });
  const key = 'devreset:' + u.e;
  const [ok, ttl] = await store.pipeline([['SET', key, new Date().toISOString(), 'EX', WEEK, 'NX'], ['TTL', key]]);
  if (ok == null) {
    const next = Number.isInteger(ttl) && ttl > 0 ? new Date(Date.now() + ttl * 1000).toISOString() : null;
    return send(res, 429, { error: 'You can only request a device reset once every week. Anything more needs the owner\'s permission (use Help?).', next });
  }
  const reason = String(b.reason || '').split('').filter((ch) => ch.charCodeAt(0) >= 32).join('').trim().slice(0, 300);
  const kind = /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(req.headers['user-agent'] || '') ? 'phone' : 'pc';
  await store.pipeline([['HSET', 'devreq', u.e, JSON.stringify({ at: new Date().toISOString(), reason, kind })]]);
  send(res, 200, { ok: true });
}

module.exports = handle(async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const u = getUser(req);
  if (!u) return send(res, 401, { error: 'Please sign in with your VIT student account first.' });
  const b = await body(req);
  if (b.action === 'reset-devices') return requestReset(req, res, u, b);
  if (await hasAccess(req)) return send(res, 200, { ok: true, already: true });
  const given = String(b.paymentId || '').trim();

  const pid = given || await findByEmail(u.e);
  if (!pid) return send(res, 404, { error: `No completed payment found for ${u.e}. If you paid before sign-in was added, enter your payment ID (it starts with pay_).` });
  let chk;
  try { chk = await checkPayment(pid); } // confirms UPI, our order, captured; newer orders carry the email
  catch (e) { if (given && e.status !== 401) return send(res, 404, { error: 'No payment found with that ID. Check it in your UPI app or Razorpay receipt (it starts with pay_).' }); throw e; }
  if (!chk.ok) return send(res, 402, { error: chk.why });

  if (chk.email) {
    if (chk.email !== u.e) return send(res, 403, { error: 'That payment belongs to a different student account.' });
  } else {
    // an older payment (made with a phone number): the first student account to claim it keeps it
    const [, owner] = await store.pipeline([['HSETNX', 'claimed', pid, u.e], ['HGET', 'claimed', pid]]);
    if (owner !== u.e) return send(res, 403, { error: 'That payment ID has already been used by another student account.' });
  }
  await recordPaid(u.e, chk.payment);
  send(res, 200, { ok: true });
});
