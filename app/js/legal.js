/* Legal pages (terms, refund, contact): fill in the business name the owner saved on /admin (Settings). */
(function () {
  'use strict';
  fetch('/api/session', { credentials: 'same-origin' }).then((r) => r.json()).then((s) => {
    const name = s && typeof s.business === 'string' ? s.business.trim() : '';
    if (name) document.querySelectorAll('[data-business]').forEach((el) => { el.textContent = name; });
  }).catch(() => { /* keep the site name */ });
})();
