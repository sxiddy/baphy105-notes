// Shared helpers for the sign-in, payment and content functions (files starting with _ are not deployed as endpoints).
const crypto = require('crypto');

const PRICE = parseInt(process.env.PRICE_PAISE || '2000', 10); // ₹20 default (store list price); the owner can change it on /admin
const DOMAIN = (process.env.STUDENT_DOMAIN || 'vitstudent.ac.in').toLowerCase(); // only these Google accounts get in
const USER_COOKIE = 'bn_user';   // signed-in student: { e: email, d: device id }
const OWNER_COOKIE = 'bn_access'; // owner unlock from /admin: { p: 'owner' }
const MAX_AGE = 400 * 24 * 3600; // browsers cap cookies at 400 days
// Razorpay's website reviewer signs in on /review.html with this username and the REVIEW_CODE the owner sets in
// Vercel (unset = reviewer sign-in is off). The reviewer sees the free modules, the paywall and the Pay button, never paid content.
const REVIEW_EMAIL = 'review@baphy105';
const reviewOn = () => !!process.env.REVIEW_CODE;

function env(name) {
  const v = process.env[name];
  if (!v) throw Object.assign(new Error(`Server is missing ${name}. Set it in Vercel → Settings → Environment Variables.`), { status: 500 });
  return v;
}

function send(res, status, obj, headers) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (headers) for (const k in headers) res.setHeader(k, headers[k]);
  res.end(JSON.stringify(obj));
}

async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch (e) { return {}; }
}

const b64u = (buf) => Buffer.from(buf).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
const unb64u = (s) => Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64');
const hmac = (key, msg) => crypto.createHmac('sha256', key).update(msg).digest();

function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

// ---------------------------------------------------------------- signed cookies
function sign(obj) {
  const payload = b64u(JSON.stringify({ ...obj, t: Math.floor(Date.now() / 1000) }));
  return payload + '.' + b64u(hmac(env('SESSION_SECRET'), payload));
}
function readSigned(req, name) {
  const raw = (req.headers.cookie || '').split(/;\s*/).find((c) => c.startsWith(name + '='));
  if (!raw) return null;
  const [payload, sig] = raw.slice(name.length + 1).split('.');
  if (!payload || !sig) return null;
  let secret;
  try { secret = env('SESSION_SECRET'); } catch (e) { return null; }
  if (!safeEqual(sig, b64u(hmac(secret, payload)))) return null;
  try { return JSON.parse(unb64u(payload).toString('utf8')); } catch (e) { return null; }
}
function cookie(name, value, maxAge) {
  const secure = process.env.VERCEL ? '; Secure' : '';
  return `${name}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
}
const userCookie = (email, deviceId) => cookie(USER_COOKIE, sign({ e: email, d: deviceId }), MAX_AGE);
const ownerCookie = () => cookie(OWNER_COOKIE, sign({ p: 'owner' }), MAX_AGE);
const clearUserCookie = () => cookie(USER_COOKIE, '', 0);
const reviewerCookie = () => cookie(USER_COOKIE, sign({ e: REVIEW_EMAIL, r: 1 }), 7 * 24 * 3600);
const isReviewer = (u) => !!(u && u.r === 1 && u.e === REVIEW_EMAIL);

const normEmail = (s) => String(s || '').trim().toLowerCase();
const isStudentEmail = (e) => new RegExp('^[a-z0-9._%+-]+@' + DOMAIN.replace(/\./g, '\\.') + '$').test(normEmail(e));

// The signed-in student (or the owner, or everyone in local dev).
function getUser(req) {
  if (process.env.DEV_BYPASS === '1') return { e: 'dev@' + DOMAIN };
  const u = readSigned(req, USER_COOKIE);
  if (isReviewer(u)) return reviewOn() ? u : null; // clearing REVIEW_CODE signs the reviewer out everywhere
  return u && isStudentEmail(u.e) ? u : null;
}
function isOwner(req) {
  if (process.env.DEV_BYPASS === '1') return true;
  const t = readSigned(req, OWNER_COOKIE);
  return !!(t && t.p === 'owner');
}

// Two site-wide switches the owner flips on /admin (hash "config"):
//   signin = "off": nobody new can sign in, and anyone can open the site without signing in (a guest). Students who
//                   are already signed in stay signed in and keep what they paid for.
//   mode = "free":  every module is open to everyone who can open the site (no paywall); "paid" (default) = as usual.
//   A temporary offer at ₹0 (config "sale", price 0) does the same as "free" until the offer ends, then the site is paid again.
//   .free = free right now for either reason; .freeMode = the switch; .freeOffer = the ₹0 offer's end time (ms) or null.
// Cached for a few seconds per server instance, so a switch reaches every page within about 5 s.
// Until the owner flips a switch, api/_mode.json decides: "open": true = sign-in off and everything free.
const MODE_FILE = (() => { try { return require('./_mode.json'); } catch (e) { return {}; } })();
let MODE = null, MODE_AT = 0;
async function siteMode(fresh) {
  if (!fresh && MODE && Date.now() - MODE_AT < 5000) return MODE;
  const store = require('./_store');
  const open = MODE_FILE.open === true || process.env.OPEN_ACCESS === '1';
  const out = { signin: !open, free: false, freeMode: open, freeOffer: null };
  if (store.configured()) {
    // a store error must not take the whole site down: keep the defaults and log why
    const r = await store.pipeline([['HMGET', 'config', 'signin', 'mode', 'sale']]).catch((e) => { console.error('siteMode store error:', e.message); return null; });
    const [s, m, sl] = (r && Array.isArray(r[0])) ? r[0] : [];
    if (!r || !Array.isArray(r[0])) console.error('siteMode: config read failed', JSON.stringify(r));
    if (s === 'off' || s === 'on') out.signin = s === 'on';
    if (m === 'free' || m === 'paid') out.freeMode = m === 'free';
    try { const x = JSON.parse(sl || 'null'); if (x && x.price === 0 && x.until > Date.now()) out.freeOffer = x.until; } catch (e) {}
  }
  out.free = out.freeMode || !!out.freeOffer;
  MODE = out; MODE_AT = Date.now();
  return out;
}
// May this browser open the site at all? A signed-in student or the owner, or anyone while sign-in is switched off.
async function canOpen(req) {
  return !!(getUser(req) || isOwner(req) || !(await siteMode()).signin);
}

// Pro bought on the Notix store (STORE_URL): asked server-to-server with STORE_SECRET. A yes is remembered for a
// minute, a no for 5 seconds, so a student who just paid is unlocked almost at once and the store is not hit on every request.
const STORE_CODE = 'BAPHY105';
const STORE_CACHE = new Map();
async function storePaid(email) {
  const url = process.env.STORE_URL, secret = process.env.STORE_SECRET;
  if (!url || !secret || !email) return false;
  const hit = STORE_CACHE.get(email);
  if (hit && hit.until > Date.now()) return hit.paid;
  let paid = false;
  try {
    const r = await fetch(url.replace(/\/$/, '') + '/api/entitlement?product=' + STORE_CODE + '&email=' + encodeURIComponent(email), { headers: { Authorization: 'Bearer ' + secret }, signal: AbortSignal.timeout(3000) });
    if (r.ok) paid = !!(await r.json()).paid; else return false;
  } catch (e) { return false; } // store unreachable: do not lock or unlock anyone because of it
  STORE_CACHE.set(email, { paid, until: Date.now() + (paid ? 60e3 : 5e3) });
  return paid;
}

// Who can see the paid modules: the owner, a student whose email paid (hash "paid"), or one on the owner's free
// list (hash "free"; removing them locks them out straight away, and a temporary grant has an "until" time). A free grant can be limited to some modules;
// then .modules lists them (null = everything). While the whole site is free, everyone who can open it.
async function hasAccess(req) {
  if (isOwner(req)) return { owner: true, modules: null };
  const u = getUser(req);
  if (isReviewer(u)) return null; // the reviewer never gets paid content, even after a test payment
  const store = require('./_store');
  const mode = await siteMode();
  if (mode.free && (!mode.signin || (u && (await deviceActive(u, req))))) return { email: u ? u.e : null, freeSite: true, modules: null };
  if (!u || !store.configured()) return null;
  if (!(await deviceActive(u, req))) return null;
  const [paid, free] = await store.pipeline([['HGET', 'paid', u.e], ['HGET', 'free', u.e]]);
  if (paid != null) return { email: u.e, paid: true, modules: null };
  if (await storePaid(u.e)) return { email: u.e, paid: true, modules: null, store: true };
  if (free == null) return null;
  let x = {}; try { x = JSON.parse(free) || {}; } catch (e) {}
  if (x.until && x.until <= Date.now()) { await store.pipeline([['HDEL', 'free', u.e]]); return null; } // temporary grant ended
  return { email: u.e, free: true, modules: Array.isArray(x.modules) && x.modules.length ? x.modules : null };
}

// ---------------------------------------------------------------- Google sign-in
// Verifies a "Sign in with Google" ID token (RS256 JWT) against Google's published keys.
let JWKS = null, JWKS_AT = 0;
async function googleKeys() {
  if (JWKS && Date.now() - JWKS_AT < 3600e3) return JWKS;
  const r = await fetch('https://www.googleapis.com/oauth2/v3/certs');
  if (!r.ok) throw Object.assign(new Error('Could not reach Google to check the sign-in. Try again.'), { status: 502 });
  JWKS = (await r.json()).keys || []; JWKS_AT = Date.now();
  return JWKS;
}
async function verifyGoogle(token) {
  const bad = (m) => Object.assign(new Error(m || 'Google sign-in could not be verified. Try again.'), { status: 401 });
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw bad();
  let hdr, c;
  try { hdr = JSON.parse(unb64u(parts[0])); c = JSON.parse(unb64u(parts[1])); } catch (e) { throw bad(); }
  if (hdr.alg !== 'RS256') throw bad();
  let jwk = (await googleKeys()).find((k) => k.kid === hdr.kid);
  if (!jwk) { JWKS = null; jwk = (await googleKeys()).find((k) => k.kid === hdr.kid); } // keys rotate
  if (!jwk) throw bad();
  const ok = crypto.verify('RSA-SHA256', Buffer.from(parts[0] + '.' + parts[1]), crypto.createPublicKey({ key: jwk, format: 'jwk' }), unb64u(parts[2]));
  if (!ok) throw bad();
  if (!['accounts.google.com', 'https://accounts.google.com'].includes(c.iss)) throw bad();
  if (c.aud !== env('GOOGLE_CLIENT_ID')) throw bad();
  if (!(c.exp * 1000 > Date.now())) throw bad('That sign-in expired. Please sign in again.');
  if (!c.email_verified) throw bad('Your Google email is not verified.');
  return { email: normEmail(c.email), hd: c.hd ? String(c.hd).toLowerCase() : null, name: c.name || '' };
}

// ---------------------------------------------------------------- Razorpay
async function razorpay(method, path, data) {
  const auth = Buffer.from(env('RAZORPAY_KEY_ID') + ':' + env('RAZORPAY_KEY_SECRET')).toString('base64');
  const r = await fetch('https://api.razorpay.com/v1' + path, {
    method,
    headers: { Authorization: 'Basic ' + auth, 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error((j.error && j.error.description) || 'Razorpay request failed'), { status: r.status === 401 ? 401 : 500 });
  return j;
}

// Confirms a payment is real, UPI, on one of our orders, and captured. Captures it if only authorized.
// Returns the order too, whose notes carry the student's email (set server-side in create-order).
async function checkPayment(paymentId, orderId) {
  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId || '')) return { ok: false, why: 'That does not look like a Razorpay payment ID (it starts with pay_).' };
  let p = await razorpay('GET', '/payments/' + paymentId);
  if (orderId && p.order_id !== orderId) return { ok: false, why: 'Payment does not belong to this order.' };
  if (p.method !== 'upi') return { ok: false, why: 'Only UPI payments unlock the notes.' };
  // orders are only ever created server-side at the current price, so any INR amount on one of our orders is valid
  // (older payments at an earlier price keep working after the owner changes it)
  if (p.currency !== 'INR' || !(p.amount >= 100)) return { ok: false, why: 'Payment amount does not match.' };
  const order = p.order_id ? await razorpay('GET', '/orders/' + p.order_id) : null;
  if (!order || (order.notes || {}).product !== 'baphy105-notes') return { ok: false, why: 'Payment was not for these notes.' };
  if (p.status === 'authorized') p = await razorpay('POST', `/payments/${paymentId}/capture`, { amount: p.amount, currency: 'INR' });
  if (p.status !== 'captured') return { ok: false, why: `Payment is ${p.status}, not completed.` };
  return { ok: true, payment: p, order, email: normEmail((order.notes || {}).email) };
}

// A completed payment for these notes, as seen in Razorpay's payment list (any price the owner has used).
const isOurs = (p) => p.status === 'captured' && p.method === 'upi' && p.currency === 'INR'
  // untagged payments (from before orders carried a product) still match on price; a payment tagged for another
  // product (e.g. the BAENG101 site on the same Razorpay account) never counts here
  && (p.notes || {}).product === 'baphy105-notes';

// Records a verified payment against the student's email, so every device they sign in on has access.
async function recordPaid(email, p) {
  const store = require('./_store');
  if (!store.configured()) throw Object.assign(new Error('Storage is not set up, so access cannot be saved.'), { status: 500 });
  await store.pipeline([['HSET', 'paid', email, JSON.stringify({ id: p.id, at: new Date(p.created_at * 1000).toISOString(), amount: p.amount })]]);
}

// Owner settings kept in the store (hash "config"): price in paise, a temporary sale price, the announcement banner,
// "paused" (payments switched off: the paywall shows a notice instead of Pay) and "business" (the name on the legal pages).
// While a sale is running (until its end time) it replaces the normal price everywhere, then the normal price returns by itself.
// A ₹0 sale makes every module free until it ends (see siteMode).
// Pro is sold on the Notix store, so the price shown here comes from the store (what the student pays now, and the MRP
// struck through while a store sale runs). Cached for 5 minutes; if the store can't be reached the site's own price stays.
let STORE_PRICE = null;
async function withStorePrice(out) {
  const url = process.env.STORE_URL;
  if (!url) return out;
  try {
    if (!STORE_PRICE || STORE_PRICE.until < Date.now()) {
      const r = await fetch(url.replace(/\/$/, '') + '/api/session', { signal: AbortSignal.timeout(3000) });
      const j = r.ok ? await r.json() : null;
      const p = j && (j.products || []).find((x) => x.code === STORE_CODE);
      STORE_PRICE = { p: p && Number.isInteger(p.price) ? p : null, until: Date.now() + (p ? 300e3 : 30e3) };
    }
    const p = STORE_PRICE.p;
    if (p) { out.price = p.price; out.normalPrice = Number.isInteger(p.list) && p.list > p.price ? p.list : p.price; }
  } catch (e) {} // store unreachable: keep the site's own price
  return out;
}
async function settings() { return withStorePrice(await siteSettings()); }
async function siteSettings() {
  const store = require('./_store');
  const out = { price: PRICE, normalPrice: PRICE, sale: null, banner: null, paused: null, business: '' };
  if (!store.configured()) return out;
  const cfgRow = await store.pipeline([['HMGET', 'config', 'price', 'banner', 'sale', 'paused', 'business']]).catch((e) => { console.error('settings store error:', e.message); return null; });
  if (!cfgRow || !Array.isArray(cfgRow[0])) console.error('settings: config read failed', JSON.stringify(cfgRow));
  const [p, b, sl, pz, bz] = cfgRow && Array.isArray(cfgRow[0]) ? cfgRow[0] : [];
  try { const x = JSON.parse(pz || 'null'); if (x && x.on) out.paused = { text: typeof x.text === 'string' ? x.text.slice(0, 240) : '' }; } catch (e) {}
  if (typeof bz === 'string') out.business = bz.slice(0, 120);
  const n = parseInt(p, 10); if (Number.isInteger(n) && n >= 100) out.price = out.normalPrice = n;
  try { const x = JSON.parse(b || 'null'); if (x && x.on && x.text) out.banner = { id: x.id, text: x.text }; } catch (e) {}
  try {
    const x = JSON.parse(sl || 'null');
    if (x && Number.isInteger(x.price) && (x.price === 0 || x.price >= 100) && x.until > Date.now()) { out.sale = { price: x.price, until: x.until, text: typeof x.text === 'string' ? x.text.slice(0, 140) : '' }; out.price = x.price; }
  } catch (e) {}
  return out;
}

// ---------------------------------------------------------------- devices
// Each student account signs in on one phone (or tablet) and one laptop/PC, unless the owner set a custom limit for
// that email on /admin (hash "limits": email -> {"phone":n,"pc":n}). The kind comes from the browser's user agent;
// the browser keeps a random device id in localStorage, so signing in again on the same device reuses its slot.
const DEVICE_KINDS = ['phone', 'pc'];
const MAX_DEVICES = DEVICE_KINDS.length;
const KIND_NAME = { phone: 'phone', pc: 'laptop/PC' };
function deviceIdFrom(b) {
  const d = String((b && b.deviceId) || '');
  return /^[a-f0-9]{32}$/.test(d) ? d : crypto.randomBytes(16).toString('hex');
}
const deviceKind = (req) => (/Mobi|Android|iPhone|iPad|iPod|Tablet/i.test((req && req.headers['user-agent']) || '') ? 'phone' : 'pc');
const deviceKeys = (email) => DEVICE_KINDS.map((k) => `devz:${email}:${k}`); // sorted sets: device id -> last use
const DEFAULT_LIMITS = { phone: 1, pc: 1 };
// A limit can be temporary: {"phone":n,"pc":n,"until":ms}. Once "until" has passed it counts as the default 1 + 1
// (.expired tells the caller to HDEL it); without "until" it is permanent.
function parseLimits(raw) {
  let x = {}; try { x = JSON.parse(raw || '{}') || {}; } catch (e) {}
  const until = Number.isFinite(x.until) ? x.until : null;
  if (until && until <= Date.now()) return { phone: DEFAULT_LIMITS.phone, pc: DEFAULT_LIMITS.pc, until: null, expired: true };
  const n = (v, d) => (Number.isInteger(v) && v >= 0 && v <= 20 ? v : d);
  return { phone: n(x.phone, DEFAULT_LIMITS.phone), pc: n(x.pc, DEFAULT_LIMITS.pc), until };
}
// "until" from the admin page: null = permanent; otherwise a time between a minute and two years from now
function limitUntil(v) {
  if (v == null || v === '' || v === 0) return { until: null };
  const t = Number(v);
  if (!(t > Date.now() + 60e3 && t < Date.now() + 2 * 365 * 864e5)) return { error: 'Pick an end date and time in the future (within two years).' };
  return { until: Math.round(t) };
}
const plural = (n, k) => `${n} ${n === 1 ? KIND_NAME[k] : k === 'pc' ? 'laptops/PCs' : 'phones'}`;
async function claimDevice(email, deviceId, req) {
  const store = require('./_store');
  if (!store.configured()) return { ok: true, enforced: false };
  const kind = deviceKind(req), key = `devz:${email}:${kind}`;
  // "Newest sign-in wins": signing in on another phone/PC (or another browser) never fails; once the limit is
  // passed, the least recently used device of that kind is signed out. Scores are last-use times.
  const [raw] = await store.pipeline([['HGET', 'limits', email]]);
  const lim = parseLimits(raw);
  if (lim.expired) await store.pipeline([['HDEL', 'limits', email]]);
  if (lim[kind] === 0) return { ok: false, why: `This account can't be used on a ${KIND_NAME[kind]}. It works on ${plural(lim.phone, 'phone')} and ${plural(lim.pc, 'pc')}.` };
  const [, count] = await store.pipeline([['ZADD', key, Date.now(), deviceId], ['ZCARD', key]]);
  if (count > lim[kind]) await store.pipeline([['ZREMRANGEBYRANK', key, 0, count - lim[kind] - 1]]);
  return { ok: true, enforced: true, kind, replaced: count > lim[kind] };
}
// Is this signed-in browser still one of the account's active devices? (false = signed out by a newer sign-in)
async function deviceActive(u, req) {
  if (!u || !u.d) return true; // sign-ins from before device tracking, or not yet claimed
  const store = require('./_store');
  if (!store.configured()) return true;
  const key = `devz:${u.e}:${deviceKind(req)}`;
  const [score] = await store.pipeline([['ZSCORE', key, u.d]]);
  return score != null;
}

function handle(fn) {
  return async (req, res) => {
    try { await fn(req, res); }
    catch (e) { send(res, e.status || 500, { error: e.message || 'Something went wrong' }); }
  };
}

module.exports = {
  PRICE, DOMAIN, MAX_DEVICES, env, send, body, hmac, safeEqual,
  getUser, isOwner, hasAccess, siteMode, canOpen, REVIEW_EMAIL, reviewOn, reviewerCookie, isReviewer, normEmail, isStudentEmail, userCookie, ownerCookie, clearUserCookie, verifyGoogle,
  razorpay, checkPayment, isOurs, recordPaid, settings, deviceIdFrom, deviceKeys, claimDevice, deviceActive, parseLimits, limitUntil, handle, STORE_CODE,
};
