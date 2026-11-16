/* Small Notix additions: the "free Pro tool" label and the "Report a mistake" form. */
(function () {
  'use strict';
  // One place to change when the store domain moves.
  var NOTIX_STORE = 'https://notix-notes.vercel.app';
  var SUBJECT_CODE = 'BAPHY105';
  var FREE_TOOL = 'opamp-gain'; // the one Pro tool open to everyone
  var STORE_PAGE = NOTIX_STORE + '/' + SUBJECT_CODE.toLowerCase();

  var css = document.createElement('style');
  css.textContent =
    '.nx-free{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;margin:8px 0 18px;padding:6px 14px;min-height:44px;border:1px solid var(--line-2,#3a3a41);border-radius:var(--r,12px);background:var(--surface,#202024);color:var(--text-dim,#80808a);font-size:13px;line-height:1.4}' +
    '.nx-free a{color:var(--text-2,#cfcfd6);text-decoration:underline;display:inline-flex;align-items:center;min-height:44px}' +
    '.nx-rep-wrap{margin:28px 0 8px}' +
    '.nx-rep-btn{min-height:44px;min-width:44px;padding:0 14px;border:1px solid var(--line-2,#3a3a41);border-radius:var(--r,12px);background:transparent;color:var(--text-dim,#80808a);font:inherit;font-size:13px;cursor:pointer}' +
    '.nx-rep-btn:hover{color:var(--text-2,#cfcfd6)}' +
    '.nx-rep-btn:focus-visible,.nx-rep input:focus-visible,.nx-rep textarea:focus-visible,.nx-rep button:focus-visible{outline:2px solid var(--text-2,#cfcfd6);outline-offset:2px}' +
    '.nx-rep-back{position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.6)}' +
    '.nx-rep{box-sizing:border-box;width:100%;max-width:420px;max-height:100%;overflow:auto;padding:18px;border:1px solid var(--line-2,#3a3a41);border-radius:var(--r,12px);background:var(--bg-2,#1b1b1e);color:var(--text,#b3b3bb);font-size:14px}' +
    '.nx-rep h2{margin:0 0 4px;font-size:17px;color:var(--text-2,#cfcfd6)}' +
    '.nx-rep p{margin:0 0 12px;color:var(--text-dim,#80808a);font-size:13px}' +
    '.nx-rep label{display:block;margin:10px 0 4px;font-size:13px;color:var(--text-2,#cfcfd6)}' +
    '.nx-rep textarea,.nx-rep input{box-sizing:border-box;width:100%;padding:10px 12px;border:1px solid var(--line-2,#3a3a41);border-radius:8px;background:var(--surface,#202024);color:var(--text-2,#cfcfd6);font:inherit;font-size:16px}' +
    '.nx-rep textarea{min-height:110px;resize:vertical}' +
    '.nx-rep-row{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}' +
    '.nx-rep-row button{min-height:44px;min-width:44px;padding:0 16px;border-radius:8px;border:1px solid var(--line-2,#3a3a41);background:var(--surface-2,#27272c);color:var(--text-2,#cfcfd6);font:inherit;font-size:14px;cursor:pointer}' +
    '.nx-rep-row button:disabled{opacity:.55;cursor:default}' +
    '.nx-rep-msg{min-height:20px;margin-top:10px;font-size:13px}' +
    '.nx-rep-msg.err{color:#ff8a8a}';
  document.head.appendChild(css);

  function where() {
    var h1 = document.querySelector('article.topic h1, .view h1');
    var tab = document.querySelector('article.topic .tab[aria-selected="true"]');
    var bits = [location.pathname + location.hash];
    if (h1) bits.push(h1.textContent.trim());
    if (tab) bits.push(tab.textContent.trim());
    return bits.join(' | ').slice(0, 300);
  }

  function openForm(opener) {
    var back = document.createElement('div');
    back.className = 'nx-rep-back';
    back.innerHTML =
      '<form class="nx-rep" role="dialog" aria-modal="true" aria-labelledby="nx-rep-t" novalidate>' +
      '<h2 id="nx-rep-t">Report a mistake</h2><p>Spotted something wrong on this page? Tell us.</p>' +
      '<label for="nx-rep-text">What is wrong?</label>' +
      '<textarea id="nx-rep-text" maxlength="1000" required></textarea>' +
      '<label for="nx-rep-mail">Email (optional)</label>' +
      '<input id="nx-rep-mail" type="email" autocomplete="email" maxlength="200">' +
      '<div class="nx-rep-msg" role="status" aria-live="polite"></div>' +
      '<div class="nx-rep-row"><button type="button" data-close>Close</button><button type="submit">Send</button></div></form>';
    document.body.appendChild(back);
    var form = back.firstChild, ta = form.querySelector('textarea'), mail = form.querySelector('input'),
      send = form.querySelector('[type=submit]'), msg = form.querySelector('.nx-rep-msg');
    function close() { document.removeEventListener('keydown', onKey, true); back.remove(); if (opener) opener.focus(); }
    function onKey(e) {
      if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
      if (e.key === 'Tab') {
        var f = Array.prototype.filter.call(form.querySelectorAll('textarea,input,button'), function (x) { return !x.disabled; });
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey, true);
    back.addEventListener('mousedown', function (e) { if (e.target === back) close(); });
    form.querySelector('[data-close]').addEventListener('click', close);
    ta.focus();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = ta.value.trim();
      msg.className = 'nx-rep-msg';
      if (!text) { msg.className += ' err'; msg.textContent = 'Please say what is wrong.'; ta.focus(); return; }
      send.disabled = true; msg.textContent = 'Sending...';
      fetch(NOTIX_STORE + '/api/community', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'report', code: SUBJECT_CODE, where: where(), text: text.slice(0, 1000), email: mail.value.trim() })
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (o) {
          if (o.ok && !o.j.error) { msg.textContent = 'Thanks, sent'; ta.value = ''; setTimeout(close, 1400); }
          else { msg.className += ' err'; msg.textContent = o.j.error || 'Could not send. Try again.'; send.disabled = false; }
        }).catch(function () { msg.className += ' err'; msg.textContent = 'Could not send. Check your connection.'; send.disabled = false; });
    });
  }

  function decorate() {
    var art = document.querySelector('article.topic');
    if (art && !art.querySelector('.nx-rep-btn')) {
      var w = document.createElement('div'); w.className = 'nx-rep-wrap';
      var b = document.createElement('button'); b.type = 'button'; b.className = 'nx-rep-btn'; b.textContent = 'Report a mistake';
      b.addEventListener('click', function () { openForm(b); });
      w.appendChild(b); art.appendChild(w);
    }
    if (!window.PRO && FREE_TOOL) {
      var tools = document.querySelectorAll('[data-viz="' + FREE_TOOL + '"]');
      Array.prototype.forEach.call(tools, function (el) {
        if (el.nextElementSibling && el.nextElementSibling.classList.contains('nx-free')) return;
        var n = document.createElement('div'); n.className = 'nx-free';
        n.innerHTML = '<span>Free Pro tool · the rest are in Pro (₹10)</span> <a href="' + STORE_PAGE + '">See Pro on Notix</a>';
        el.parentNode.insertBefore(n, el.nextSibling);
      });
    }
  }
  var t = 0;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(decorate, 60); }).observe(document.body, { childList: true, subtree: true });
  decorate();
})();
