/* Sign-in and payment gate. Only VIT student Google accounts get in; paid modules load only after the server
   confirms payment (or free access) for that account. UPI-only Razorpay checkout. */
(function () {
  'use strict';
  const root = document.getElementById('app');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let price = 5000, S = {};
  function deviceId() {
    let d = null;
    try { d = localStorage.getItem('bn_device'); } catch (e) { /* storage blocked */ }
    if (!/^[a-f0-9]{32}$/.test(d || '')) {
      const a = new Uint8Array(16); crypto.getRandomValues(a); d = Array.from(a, (x) => x.toString(16).padStart(2, '0')).join('');
      try { localStorage.setItem('bn_device', d); } catch (e) { /* ignore */ }
    }
    return d;
  }
  const CFG = window.MODULES_CONFIG || [];
  const list = (arr) => (arr.length > 1 ? arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1] : arr[0] || '');
  const freeCount = () => CFG.filter((m) => m.free).length;
  const freeNames = () => list(CFG.filter((m) => m.free).map((m) => 'Module ' + (+m.num)));
  const paidNames = () => list(CFG.filter((m) => !m.free).map((m) => `<b>Module ${+m.num} (${esc(m.title)})</b>`));

  function loadScript(src) {
    return new Promise((ok, bad) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => bad(new Error('Could not load ' + src)); document.body.appendChild(s); });
  }
  async function api(path, data) {
    const r = await fetch(path, data ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), credentials: 'same-origin' } : { credentials: 'same-origin' });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'Request failed (' + r.status + ')');
    return j;
  }
  // e.g. 28-09-2026 11:30 PM, in Indian time
  const offerEnds = (ms) => { const d = new Date(ms + 5.5 * 3600e3), h = d.getUTCHours(); return String(d.getUTCDate()).padStart(2, '0') + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + d.getUTCFullYear() + ' ' + String(h % 12 || 12).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0') + (h < 12 ? ' AM' : ' PM'); };
  const legal = '<a href="terms.html" style="color:inherit">Terms</a> · <a href="refund.html" style="color:inherit">Refunds</a> · <a href="contact.html" style="color:inherit">Contact</a> · <a href="privacy.html" style="color:inherit">Privacy</a>';
  const reload = () => { history.replaceState(null, '', location.pathname); location.reload(); };
  async function signOut() { try { await api('/api/login', { logout: true }); } catch (e) { /* ignore */ } reload(); }
  window.__signOut = signOut;

  // anonymous funnel counts for the owner: saw the paywall, opened checkout (once per browser session each)
  function funnel(step) {
    try { const k = 'bn_f_' + step; if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, '1'); } catch (e) { return; }
    try { const b = new Blob([JSON.stringify({ funnel: step })], { type: 'application/json' }); if (!(navigator.sendBeacon && navigator.sendBeacon('/api/track', b))) fetch('/api/track', { method: 'POST', body: b, keepalive: true }).catch(() => {}); } catch (e) { /* ignore */ }
  }

  // ---------------------------------------------------------------- sign in
  function signIn(msg) {
    const domain = S.domain || 'vitstudent.ac.in';
    const keep = () => { try { if (location.hash && location.hash !== '#home') localStorage.setItem('bn_after', JSON.stringify({ h: location.hash, t: Date.now() })); } catch (e) { /* ignore */ } };
    keep(); window.addEventListener('hashchange', keep); // a new link pasted into this same tab
    root.innerHTML = `
      <div class="gate">
        <div class="gate-card">
          <div class="gate-eyebrow">BAPHY105 · Engineering Physics</div>
          <h1 class="gate-title">Engineering Physics</h1>
          <p class="gate-lead">Study notes for VIT students. Sign in with your <b>VIT student Google account</b> (…@${esc(domain)}) to continue.</p>
          <div id="gsi" class="gate-gsi"></div>
          ${S.devLogin ? `<form id="dev-login" class="gate-dev"><label>Local test only: sign in as<input id="dev-email" value="test@${esc(domain)}"></label><button class="btn" type="submit">Sign in (dev)</button></form>` : ''}
          <p class="gate-msg" id="gate-msg" role="alert">${msg ? esc(msg) : ''}</p>
          <p class="gate-muted gate-small">Only …@${esc(domain)} accounts are accepted. Staff and personal Gmail accounts can't sign in. Your account works on 1 phone + 1 laptop/PC.</p>
          <p class="gate-muted gate-small gate-legal">${legal}</p>
        </div>
      </div>`;
    const out = document.getElementById('gate-msg');
    const say = (t) => { out.textContent = t; };
    const login = async (data) => {
      say('Signing you in…');
      try { await api('/api/login', Object.assign({ deviceId: deviceId() }, data)); reload(); }
      catch (e) { say(e.message); }
    };
    if (S.devLogin) document.getElementById('dev-login').addEventListener('submit', (e) => { e.preventDefault(); login({ devEmail: document.getElementById('dev-email').value }); });
    if (!S.googleClientId) { if (!S.devLogin) say('Sign-in is not set up yet. Please check back soon.'); return; }
    // Google refuses to sign in inside apps' built-in browsers (WhatsApp, Instagram, …), so say so up front.
    if (/FBAN|FBAV|FB_IAB|Instagram|WhatsApp|Snapchat|Line\/|LinkedInApp|Telegram|; wv\)/i.test(navigator.userAgent)) {
      document.getElementById('gsi').innerHTML = `<div class="gate-inapp"><p><b>Open this page in Chrome or Safari.</b> Google doesn't allow signing in inside ${/WhatsApp/i.test(navigator.userAgent) ? 'WhatsApp' : "this app"}'s built-in browser. Tap ⋮ or ⋯ and choose <b>Open in browser</b>, or copy the link:</p><button class="btn" id="gate-copy">Copy link</button></div>`;
      document.getElementById('gate-copy').addEventListener('click', () => { try { navigator.clipboard.writeText(location.origin + '/').then(() => say('Link copied. Paste it in Chrome or Safari.')); } catch (e) { say(location.origin + '/'); } });
      return;
    }
    // Full-page sign-in (no pop-up, so pop-up blockers can't stop it): Google sends the student back to /api/login,
    // which reads the device id from this cookie (SameSite=None so it survives Google's cross-site POST).
    try { document.cookie = 'bn_dev=' + deviceId() + '; Path=/; Max-Age=86400; SameSite=None' + (location.protocol === 'https:' ? '; Secure' : ''); } catch (e) { /* ignore */ }
    loadScript('https://accounts.google.com/gsi/client').then(() => {
      const g = window.google && window.google.accounts && window.google.accounts.id;
      if (!g) { say('Google sign-in could not load. Check your connection and reload.'); return; }
      // Full-page sign-in (no pop-up to block). Google sends the student back to /api/login.
      g.initialize({ client_id: S.googleClientId, hd: domain, ux_mode: 'redirect', login_uri: location.origin + '/api/login', auto_select: false });
      g.renderButton(document.getElementById('gsi'), { theme: 'filled_black', size: 'large', shape: 'pill', text: 'signin_with', logo_alignment: 'left', width: 300 });
    }).catch(() => say('Google sign-in could not load. Check your connection (or an ad blocker) and reload.'));
  }

  // ---------------------------------------------------------------- load notes
  // Paid users get everything; a single-module grant loads just those modules; everyone else gets the free
  // modules and sees the rest as locked.
  async function start(paid, modules) {
    root.innerHTML = '<div class="gate"><div class="gate-card"><p class="gate-muted">Loading your notes…</p></div></div>';
    try {
      const FM = window.FILE_MODULE || {};
      const paidFiles = !paid ? [] : (window.PRO_FILES || []).filter((f) => !modules || modules.includes(FM[f]));
      const files = (window.FREE_FILES || []).concat(paidFiles);
      // all at once: every file only registers data (the app sorts chunks, questions and papers itself)
      await Promise.all(files.map((f) => loadScript('data/' + f)));
      // the notes are free; Pro (every module, or the modules of a single-module grant) unlocks the Pro features
      window.PRO = !!paid; window.PRO_MODULES = paid && modules ? modules : null;
      window.APP_LOCKED = false;
      window.__showPaywall = paywall;
      try {
        const a = JSON.parse(localStorage.getItem('bn_after') || 'null'); localStorage.removeItem('bn_after');
        if (a && Date.now() - a.t < 15 * 60e3 && /^#[a-z0-9.-]+$/.test(a.h) && (!location.hash || location.hash === '#home')) history.replaceState(null, '', location.pathname + a.h);
      } catch (e) { /* ignore */ }
      root.innerHTML = '';
      window.__startApp();
    } catch (e) {
      root.innerHTML = `<div class="gate"><div class="gate-card"><h1 class="gate-title">Could not load the notes</h1><p class="gate-muted">${esc(e.message)}. Check your connection and reload.</p></div></div>`;
    }
  }

  // Pro is bought on the Notix store: send the student there (signed in, with this subject highlighted)
  function storeGate() {
    const go = S.storeUrl + '/?subject=' + encodeURIComponent(S.storeCode);
    root.innerHTML = `
      <div class="gate">
        <div class="gate-card">
          <div class="gate-eyebrow">${esc(S.storeCode)} · ${esc(S.storeName)}</div>
          <h1 class="gate-title">${esc(S.storeCode)} Pro</h1>
          <p class="gate-lead">The notes stay free. Pro adds the study tools: interactive models, the question bank, quizzes, flashcards, formula sheets and more. Pro is bought on <b>Notix</b>, one payment per subject with UPI, and it opens here as soon as you are back.</p>
          <p><a class="btn primary gate-pay" id="gate-store" href="${esc(go)}">Get Pro on Notix</a></p>
          <p class="gate-muted gate-small">Sign in there with the same student account (<b>${esc(S.user || '')}</b>). After paying, come back to this page and reload it.</p>
          <p><button class="btn" type="button" id="gate-reload">I have paid, reload</button></p>
          <p class="gate-signed">Signed in as ${esc(S.user || '')} · <button type="button" class="linkish" id="gate-out">Sign out</button></p>
          <p style="margin-top:14px"><a class="btn ghost" href="./" id="gate-back">← Back to the notes</a></p>
          <p class="gate-muted gate-small gate-legal">${legal}</p>
        </div>
      </div>`;
    funnel('paywall');
    document.getElementById('gate-out').addEventListener('click', signOut);
    document.getElementById('gate-reload').addEventListener('click', () => reload());
  }

  // ---------------------------------------------------------------- pay
  function paywall(msg) {
    if (S.storeUrl && S.user) return storeGate();
    if (!S.user && !S.owner) return guestLocked();
    const rs = (price / 100).toFixed(0);
    root.innerHTML = `
      <div class="gate">
        <div class="gate-card">
          <div class="gate-eyebrow">BAPHY105 · Engineering Physics</div>
          <h1 class="gate-title">BAPHY105 Pro</h1>
          <p class="gate-lead">The notes stay free. Pro adds every flashcard, the formula sheet, model answers, model papers, the quiz, the timed mock CAT, the revision pack, interactive models and progress sync. One payment, no subscription.</p>
          ${S.sale && S.sale.text && S.normalPrice > price ? `<div class="gate-offer-note" role="note">${esc(S.sale.text)}</div>` : ''}
          <div class="gate-price"><span class="gate-rs">₹${rs}</span>${S.sale && S.normalPrice > price ? `<s class="gate-was">₹${(S.normalPrice / 100).toFixed(0)}</s><span class="gate-offer">Offer ends ${offerEnds(S.sale.until)}</span>` : ''}<span class="gate-muted">one-time · pay with any UPI app</span></div>
          <div class="gate-devices" role="note">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/></svg>
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.6"/><path d="M1.5 20h21"/></svg>
            <p><b>Works on 1 phone + 1 laptop/PC only.</b> Your payment is tied to <b>${esc(S.user || '')}</b>. Sign in with it on one phone and one computer. A second phone or a second PC won't open.</p>
          </div>
          ${S.reviewer ? '<div class="gate-offer-note" role="note"><b>Reviewer account.</b> You can see the payment page and open the UPI checkout. Pro stays locked for this account, even after a test payment.</div>' : ''}
          ${S.paused ? `<div class="gate-offer-note" role="note"><b>Payments are paused for now.</b> ${esc(S.paused.text || 'Please check back soon. The free notes still work.')}</div>` : `<button class="btn primary gate-pay" id="gate-pay">Pay ₹${rs} with UPI</button>`}
          <p class="gate-msg" id="gate-msg" role="alert">${msg ? esc(msg) : ''}</p>
          <p class="gate-muted gate-small">Google Pay, PhonePe, Paytm, BHIM or any UPI ID. After paying, just sign in with the same student account on your other device.</p>
          <details class="gate-restore">
            <summary>Already paid? Restore access</summary>
            <form id="gate-form">
              <label>Your student email<input id="gate-email" value="${esc(S.user || '')}" readonly aria-readonly="true"></label>
              <label>Payment ID <span class="gate-muted">(only for payments made before sign-in was added)</span><input id="gate-pid" placeholder="pay_XXXXXXXXXXXXXX" autocomplete="off"></label>
              <button class="btn" type="submit">Restore access</button>
            </form>
          </details>
          <details class="gate-restore">
            <summary>Signed out on your devices? Request a device reset</summary>
            <form id="gate-reset">
              <label>Why do you need a reset? <span class="gate-muted">(optional)</span><input id="gate-why" maxlength="300" placeholder="e.g. I got a new phone"></label>
              <button class="btn" type="submit">Request a device reset</button>
              <p class="gate-muted gate-small" style="margin:0">You can only request a device reset once every week, and it's done only when the owner approves it.</p>
            </form>
          </details>
          <p class="gate-signed">Signed in as ${esc(S.user || '')} · <button type="button" class="linkish" id="gate-out">Sign out</button></p>
          <p style="margin-top:14px"><a class="btn ghost" href="./" id="gate-back">← Back to the notes</a></p>
          <p class="gate-muted gate-small gate-legal">One-time UPI payment for Pro features for study notes. ${legal}</p>
        </div>
      </div>`;
    const payBtn = document.getElementById('gate-pay'), out = document.getElementById('gate-msg');
    const say = (t) => { out.textContent = t; };
    funnel('paywall');
    document.getElementById('gate-out').addEventListener('click', signOut);
    // UPI apps (BHIM especially) often send the student back with the checkout saying "cancelled", or reload this page,
    // although the money went through. So the order is remembered and the server asks Razorpay about it directly.
    const PENDING = 'bn_pending_order';
    const remember = (id) => { try { localStorage.setItem(PENDING, JSON.stringify({ id, t: Date.now() })); } catch (e) { /* ignore */ } };
    const forget = () => { try { localStorage.removeItem(PENDING); } catch (e) { /* ignore */ } };
    let checking = false;
    async function checkOrder(orderId, first) {
      if (checking || !orderId) return;
      checking = true;
      say(first || 'Checking with Razorpay whether your payment went through… If you cancelled it yourself, just tap Pay again.');
      const until = Date.now() + 3 * 60e3;
      while (Date.now() < until) {
        try {
          const r = await api('/api/verify', { action: 'check', orderId });
          if (r.ok) { forget(); say('Payment confirmed. Unlocked! Loading everything…'); reload(); return; }
        } catch (e) { checking = false; say(e.message + ' If money was taken, use "Restore access" below.'); return; }
        await new Promise((ok) => setTimeout(ok, 5000));
      }
      checking = false;
      say('No completed payment found yet. If money was taken from your account, reload this page in a few minutes (it unlocks by itself) or use "Restore access" below.');
    }
    if (!payBtn) return wireForms(); // payments paused
    try { const pend = JSON.parse(localStorage.getItem(PENDING) || 'null'); if (pend && Date.now() - pend.t < 60 * 60e3) checkOrder(pend.id, 'Checking your last payment…'); else forget(); } catch (e) { /* ignore */ }
    payBtn.addEventListener('click', async () => {
      payBtn.disabled = true; say('Opening UPI checkout…');
      funnel('start');
      try {
        await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        const o = await api('/api/create-order', {});
        if (o.amount !== price) {
          // the price changed while this page was open (usually an offer ended): show the new price before charging it
          const was = price;
          try { S = await api('/api/session?d=' + deviceId()); } catch (e) { /* keep what we have */ }
          price = o.amount; window.PRICE_RS = Math.round(price / 100);
          paywall(price > was ? `The offer has ended. The price is now ₹${window.PRICE_RS}. Tap Pay to continue.` : `The price is now ₹${window.PRICE_RS}. Tap Pay to continue.`);
          return;
        }
        const rzp = new window.Razorpay({
          key: o.keyId, order_id: o.orderId, amount: o.amount, currency: o.currency,
          name: 'BAPHY105 Notes', description: 'Full access to the notes',
          prefill: { email: o.email },
          notes: { product: 'baphy105-notes', email: o.email },
          theme: { color: '#151517' },
          config: { display: {
            blocks: { upi: { name: 'Pay using UPI', instruments: [{ method: 'upi' }] } },
            sequence: ['block.upi'],
            preferences: { show_default_blocks: false },
          } },
          handler: async (resp) => {
            say('Payment received. Confirming…');
            try { await api('/api/verify', resp); forget(); say('Unlocked. Loading everything…'); reload(); }
            catch (e) { payBtn.disabled = false; checkOrder(o.orderId, 'Confirming your payment with Razorpay… (payment ID: ' + resp.razorpay_payment_id + ')'); }
          },
          // "cancelled" or "failed" is not always true with UPI apps: check the order before telling the student
          modal: { ondismiss: () => { payBtn.disabled = false; checkOrder(o.orderId); } },
        });
        rzp.on('payment.failed', () => { payBtn.disabled = false; checkOrder(o.orderId, 'The UPI app reported a problem. Checking with Razorpay whether the money was taken anyway… You can also tap Pay to try again.'); });
        remember(o.orderId);
        rzp.open();
      } catch (e) { say(e.message); payBtn.disabled = false; }
    });
    wireForms();
    function wireForms() {
    document.getElementById('gate-reset').addEventListener('submit', async (e) => {
      e.preventDefault();
      say('Sending your request…');
      try { await api('/api/restore', { action: 'reset-devices', reason: document.getElementById('gate-why').value }); say('Request sent. The owner will approve it soon.'); }
      catch (err) { say(err.message); }
    });
    document.getElementById('gate-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      say('Checking your payment…');
      try { await api('/api/restore', { paymentId: document.getElementById('gate-pid').value.trim() }); say('Access restored.'); reload(); }
      catch (err) { say(err.message); }
    });
    }
  }

  // a guest (sign-in switched off) tapped a paid module: paying needs an account, so there is no Pay button
  function guestLocked() {
    root.innerHTML = `
      <div class="gate">
        <div class="gate-card">
          <div class="gate-eyebrow">BAPHY105 · Engineering Physics</div>
          <h1 class="gate-title">Pro is not on sale right now</h1>
          <p class="gate-lead">The notes are free to use. Paying for Pro needs a signed-in account, and sign-in is switched off right now, so Pro can't be bought at the moment. Please check back soon.</p>
          <p style="margin-top:14px"><a class="btn ghost" href="./">← Back to the notes</a></p>
          <p class="gate-muted gate-small gate-legal">${legal}</p>
        </div>
      </div>`;
  }

  (async () => {
    try {
      S = await api('/api/session?d=' + deviceId());
      price = S.price || S.normalPrice || price; // a ₹0 offer: the app shows "FREE" instead of a price
      window.PRICE_RS = Math.round(price / 100);
      window.FREE_OFFER = S.freeOffer && S.freeSite ? { was: Math.round((S.normalPrice || price) / 100), ends: offerEnds(S.freeOffer), until: S.freeOffer, text: (S.sale && S.sale.text) || '' } : null;
      window.SITE_BANNER = S.banner || null;
      window.FREE_SITE = !!S.freeSite; // Pro open for everyone (open mode or a free offer)
      window.PRICE_WAS = S.normalPrice && S.normalPrice > price ? Math.round(S.normalPrice / 100) : null; // an offer price is running
      window.SALE_TEXT = (S.sale && S.sale.text) || '';
      window.SIGNED_IN_AS = S.user || null;
      // the owner can switch sign-in off on /admin: then everyone opens the notes as a guest
      if (!S.user && !S.owner && S.signin !== false) {
        const err = new URLSearchParams(location.search).get('login_error');
        if (err) history.replaceState(null, '', location.pathname + location.hash);
        return signIn(err || S.deviceError || '');
      }
      start(!!S.paid, Array.isArray(S.modules) ? S.modules : null);
    } catch (e) {
      root.innerHTML = `<div class="gate"><div class="gate-card"><h1 class="gate-title">Could not reach the site</h1><p class="gate-muted">${esc(e.message)}. Check your connection and reload.</p></div></div>`;
    }
  })();
})();
