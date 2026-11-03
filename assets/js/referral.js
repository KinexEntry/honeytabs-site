// /r/?code=<code> (and /r/<code> via 404.html): show the friend's code, remember it for sign-up,
// and hand off to the app. No cookies, no third-party requests.
(function () {
  var d = document;
  var ALPHA = /^[2-9A-HJKMNP-Z]{6,10}$/;
  // Same key the HoneyTabs app uses for a pending code (AsyncStorage maps to localStorage on web),
  // so a web sign-up on this domain picks it up.
  var KEY = 'referral:pending_code';
  // Set to the web sign-up URL once the HoneyTabs web app is hosted (the code is appended as ?ref=).
  var WEB_SIGNUP_URL = '';

  function clean(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  function fromUrl() {
    var q = new URLSearchParams(location.search);
    var c = q.get('code') || q.get('ref');
    if (!c) { var m = location.pathname.match(/\/r\/([A-Za-z0-9-]{4,20})\/?$/); c = m && m[1]; }
    c = clean(c);
    return ALPHA.test(c) ? c : null;
  }
  var code = fromUrl();
  try { if (code) localStorage.setItem(KEY, code); else code = clean(localStorage.getItem(KEY)) || null; } catch (e) {}
  if (code && !ALPHA.test(code)) code = null;

  var box = d.querySelector('[data-ref-box]'), missing = d.querySelector('[data-ref-missing]');
  if (code) {
    box.hidden = false;
    d.querySelector('[data-ref-code]').textContent = code;
    if (history.replaceState && !/[?&]code=/.test(location.search)) history.replaceState(null, '', '/r/?code=' + code);
  } else if (missing) missing.hidden = false;

  var deep = 'eventdesk://r/' + (code || '');
  var ua = navigator.userAgent || '';
  var isAndroid = /Android/i.test(ua), isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var open = d.querySelector('[data-ref-open]');
  // Android: an intent URL opens the app if installed, otherwise Google Play. iOS: tap to open (Safari shows
  // an error for an uninstalled scheme, so we don't auto-jump there).
  var androidIntent = 'intent://r/' + (code || '') + '#Intent;scheme=eventdesk;package=com.kinexentry.eventdesk;end';
  open.href = isAndroid ? androidIntent : deep;
  if (!isAndroid && !isIOS) open.hidden = true; // desktop: no app to open

  // Put the matching store first on phones.
  var stores = d.querySelector('.ref-stores');
  if (isAndroid && stores) stores.insertBefore(d.querySelector('[data-ref-store=android]'), stores.firstChild);

  var web = d.querySelector('[data-ref-web]');
  if (WEB_SIGNUP_URL && web) {
    web.href = WEB_SIGNUP_URL + (code ? (WEB_SIGNUP_URL.indexOf('?') < 0 ? '?' : '&') + 'ref=' + code : '');
    web.firstChild.nodeValue = 'Or sign up on the web ';
  }

  var copy = d.querySelector('[data-ref-copy]');
  if (copy) copy.addEventListener('click', function () {
    var label = copy.querySelector('span');
    var done = function () { label.textContent = 'Copied'; setTimeout(function () { label.textContent = 'Copy code'; }, 1800); };
    if (navigator.clipboard && code) navigator.clipboard.writeText(code).then(done, done); else done();
  });

  // Try the app once, automatically, on Android only.
  if (code && isAndroid && !sessionStorage.getItem('ref-tried')) {
    try { sessionStorage.setItem('ref-tried', '1'); } catch (e) {}
    setTimeout(function () { location.href = androidIntent; }, 600);
  }
})();
