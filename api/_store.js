// Tiny key-value store for feedback and view counts: Upstash Redis over its REST API (free tier, added from
// Vercel → Storage). Works with either the Upstash or the older Vercel KV variable names. If no store is
// configured, every call is a no-op and returns null, so the site keeps working.
const crypto = require('crypto');

function creds() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

// Every key this site uses starts with "baphy105:", so it shares one database with the chemistry site (no prefix)
// and the English site ("baeng101:") without the lists ever mixing. KEYS results come back without it.
const PREFIX = process.env.STORE_PREFIX == null ? 'baphy105:' : process.env.STORE_PREFIX;
const MULTI = new Set(['DEL', 'EXISTS', 'MGET', 'UNLINK']);
const withPrefix = (cmd) => cmd.map((a, i) => (i >= 1 && (i === 1 || MULTI.has(String(cmd[0]).toUpperCase())) ? PREFIX + a : a));

async function pipeline(cmds) {
  const c = creds();
  if (!c) return null;
  const r = await fetch(c.url + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + c.token, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds.map(withPrefix)),
  });
  if (!r.ok) throw Object.assign(new Error('Store request failed (' + r.status + ')'), { status: 500 });
  const j = await r.json();
  return j.map((x, i) => {
    if (x && x.error) console.error('store error on', cmds[i][0], x.error);
    const v = x && 'result' in x ? x.result : null;
    return String(cmds[i][0]).toUpperCase() === 'KEYS' && Array.isArray(v) ? v.map((k) => (k.startsWith(PREFIX) ? k.slice(PREFIX.length) : k)) : v;
  });
}

// HGETALL returns a flat [k, v, k, v] list
function pairs(flat) {
  const out = {};
  for (let i = 0; flat && i < flat.length; i += 2) out[flat[i]] = +flat[i + 1] || flat[i + 1];
  return out;
}

const ipHash = (req) => crypto.createHash('sha256').update(String((req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket?.remoteAddress || '') + '|bn').digest('hex').slice(0, 16);
// days are counted in Indian time (IST, UTC+5:30)
const IST = 5.5 * 3600e3;
const today = () => new Date(Date.now() + IST).toISOString().slice(0, 10);

module.exports = { configured: () => !!creds(), pipeline, pairs, ipHash, today };
