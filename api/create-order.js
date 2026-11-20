// POST /api/create-order -> Razorpay order at the current price for the signed-in student.
// The student's email goes into the order's notes (server-side), which is how the payment is tied to their account.
const { send, razorpay, settings, env, getUser, handle } = require('./_lib');
module.exports = handle(async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  if (process.env.STORE_URL) return send(res, 403, { error: 'Pro is bought on Notix: ' + process.env.STORE_URL });
  const u = getUser(req);
  if (!u) return send(res, 401, { error: 'Please sign in with your VIT student account first.' });
  const cfg = await settings(), paused = cfg.paused;
  const price = cfg.price || cfg.normalPrice; // during a ₹0 offer only the reviewer still sees Pay: charge the normal price
  if (paused) return send(res, 503, { error: 'Payments are paused for now. Please check back soon.' });
  if (!Number.isInteger(price) || price < 100) return send(res, 500, { error: 'The price must be at least ₹1.' });
  const paylink = require('./_paylink');
  if (paylink.on()) { // hosted Razorpay page (see _paylink.js); the browser goes there instead of opening checkout
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const l = await paylink.createLink(u.e, price, 'https://' + host);
    return send(res, 200, { linkUrl: l.linkUrl, linkId: l.linkId, orderId: l.linkId, amount: l.amount, currency: 'INR', email: u.e });
  }
  const order = await razorpay('POST', '/orders', {
    amount: price, currency: 'INR', receipt: 'bn_' + Date.now().toString(36),
    notes: { product: 'baphy105-notes', email: u.e },
  });
  send(res, 200, { order_id: order.id, orderId: order.id, amount: order.amount, currency: order.currency, keyId: env('RAZORPAY_KEY_ID'), email: u.e });
});
