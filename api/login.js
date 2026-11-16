// Signs a student in with their Google account. Only @<STUDENT_DOMAIN> (default vitstudent.ac.in) accounts are
// accepted, so staff and personal accounts are refused. The device limit (1 phone + 1 laptop/PC unless the owner
// changed it) is applied here.
//   Full-page flow (default): Google POSTs a form { credential, g_csrf_token } here; we answer with a redirect to
//   the site (or back to the sign-in screen with ?login_error=...). The device id comes from the bn_dev cookie.
//   JSON flow: POST { credential | devEmail, deviceId } -> { ok, email } (devEmail only with DEV_LOGIN=1, never on Vercel).
//   Reviewer: POST { reviewUser, reviewCode } from /review.html -> the Razorpay website reviewer's account (see _lib.js);
//   only when REVIEW_CODE is set in Vercel, and at most 10 tries an hour per address (30 an hour in total).
//   While the owner has switched sign-in off (/admin), new Google and dev sign-ins are refused (the reviewer's still works).
//   Sign out: POST { logout: true } (also /api/logout) -> clears this browser's sign-in (their device slot stays theirs).
const { send, handle, verifyGoogle, safeEqual: same, REVIEW_EMAIL, reviewerCookie, siteMode, isStudentEmail, normEmail, deviceIdFrom, claimDevice, userCookie, clearUserCookie, safeEqual, DOMAIN } = require('./_lib');

const cookies = (req) => Object.fromEntries((req.headers.cookie || '').split(/;\s*/).filter(Boolean).map((c) => { const i = c.indexOf('='); return [c.slice(0, i), decodeURIComponent(c.slice(i + 1))]; }));

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = typeof req.body === 'string' ? req.body : '';
  if (!raw) { const chunks = []; for await (const c of req) chunks.push(c); raw = Buffer.concat(chunks).toString('utf8'); }
  if (/application\/x-www-form-urlencoded/.test(req.headers['content-type'] || '')) return Object.fromEntries(new URLSearchParams(raw));
  try { return JSON.parse(raw || '{}'); } catch (e) { return {}; }
}

async function signIn(req, b, deviceId) {
  if (!(await siteMode(true)).signin) throw Object.assign(new Error('Sign-in is switched off right now. You can open the notes without signing in.'), { status: 403 });
  let email;
  if (process.env.DEV_LOGIN === '1' && !process.env.VERCEL && b.devEmail) email = normEmail(b.devEmail);
  else {
    const g = await verifyGoogle(b.credential);
    if (g.hd && g.hd !== DOMAIN) throw Object.assign(new Error(`Please use your VIT student account (…@${DOMAIN}).`), { status: 403 });
    email = g.email;
  }
  if (!isStudentEmail(email)) throw Object.assign(new Error(`Only VIT student accounts (…@${DOMAIN}) can use this site. You signed in as ${email}.`), { status: 403 });
  // Only a real device id counts toward the device limit. If the browser didn't pass one (it can drop the cookie on
  // Google's redirect), the slot is claimed on the first page load instead (api/session.js), so one browser = one device.
  const dev = /^[a-f0-9]{32}$/.test(String(deviceId || '')) ? deviceId : null;
  if (dev) { const claim = await claimDevice(email, dev, req); if (!claim.ok) throw Object.assign(new Error(claim.why), { status: 403 }); }
  // the owner's student list on /admin: first and latest sign-in, and how many sign-ins
  const store = require('./_store'), now = new Date().toISOString();
  if (store.configured()) await store.pipeline([['HSETNX', 'userFirst', email, now], ['HSET', 'userLogin', email, now], ['HSET', 'userSeen', email, now], ['HINCRBY', 'userLogins', email, 1]]).catch(() => {});
  return { email, cookie: userCookie(email, dev) };
}

async function reviewSignIn(req, b) {
  const code = process.env.REVIEW_CODE;
  if (!code) return { status: 403, error: 'Reviewer sign-in is switched off.' };
  const store = require('./_store');
  if (store.configured()) {
    const ip = String(req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || '').split(',')[0].trim().slice(0, 64);
    const [mine, , all] = await store.pipeline([['INCR', 'revtry:' + ip], ['EXPIRE', 'revtry:' + ip, 3600], ['INCR', 'revtry'], ['EXPIRE', 'revtry', 3600]]);
    if (mine > 10 || all > 30) return { status: 429, error: 'Too many tries. Please wait an hour and try again.' };
  }
  const user = String(b.reviewUser || '').trim().toLowerCase();
  if (user !== REVIEW_EMAIL || !same(String(b.reviewCode || ''), code)) return { status: 401, error: 'Wrong username or access code.' };
  return { status: 200, cookie: reviewerCookie() };
}

module.exports = handle(async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
  const b = await readBody(req);
  const c = cookies(req);
  if (b.logout || /[?&]out=1/.test(req.url || '')) return send(res, 200, { ok: true }, { 'Set-Cookie': clearUserCookie() });

  if (b.reviewCode !== undefined) {
    const r = await reviewSignIn(req, b);
    return r.cookie ? send(res, 200, { ok: true, email: REVIEW_EMAIL }, { 'Set-Cookie': r.cookie }) : send(res, r.status, { error: r.error });
  }

  if (b.g_csrf_token !== undefined) { // Google's full-page redirect
    const back = (err, cookie) => {
      res.statusCode = 303;
      res.setHeader('Location', err ? '/?login_error=' + encodeURIComponent(err) : '/');
      res.setHeader('Cache-Control', 'no-store');
      if (cookie) res.setHeader('Set-Cookie', cookie);
      res.end();
    };
    // Google's double-submit check. Some browsers don't send the cookie on Google's cross-site POST, so only a
    // mismatch is refused; the ID token itself is still verified against Google's keys and our client ID.
    if (c.g_csrf_token && !safeEqual(c.g_csrf_token, b.g_csrf_token)) return back('Sign-in could not be checked. Please try again.');
    try { const r = await signIn(req, b, c.bn_dev); return back(null, r.cookie); }
    catch (e) { return back(e.message || 'Sign-in failed. Please try again.'); }
  }

  try { const r = await signIn(req, b, b.deviceId); send(res, 200, { ok: true, email: r.email }, { 'Set-Cookie': r.cookie }); }
  catch (e) { send(res, e.status || 500, { error: e.message }); }
});
