// ─── progetti.occhino.it Authentication Module ─────────────────────────────
// Client-side gate only — no backend. Deters casual visitors and crawlers,
// not a real access control (password and cookie logic are visible in
// view-source). Cookie: progetti_auth, 24h expiry.
//
// Load this script un-deferred as the first tag in <head> on every gated
// page, immediately followed by an inline call to ProgettiAuth.requireAuth().
// That blocks parsing until the auth check runs, so there is no flash of
// protected content before an unauthenticated visitor is redirected.
//
// Password algorithm — 10 characters, generated fresh each day:
//   1. Two fixed capital-letter initials: GO, DR or MM (peer codes) — always first.
//   2. The remaining 4 blocks may appear in ANY order after the initials:
//        - the current year, digits reversed (2026 -> "6202")
//        - one special character from ! # % & @ $
//        - a literal dot "."
//        - the current day, zero-padded to 2 digits
//   Example for 2026-08-03, peer GO, special "!": GO6202!.03 (or any
//   reordering of the last 8 characters, e.g. GO.03!6202).

const ProgettiAuth = (() => {
  const COOKIE_NAME = 'progetti_auth';
  const COOKIE_EXPIRY_HOURS = 24;
  const LOGIN_PATH = '/';
  const DEFAULT_DEST = '/hub.html';
  const PEER_CODES = ['GO', 'DR', 'MM'];
  const SPECIAL_CHARS = ['!', '#', '%', '&', '@', '$'];

  function validatePassword(value) {
    const prefix = value.slice(0, 2);
    if (!PEER_CODES.includes(prefix)) return 'Iniziali non valide';

    const today = new Date();
    const yearReversed = String(today.getFullYear()).split('').reverse().join('');
    const day = String(today.getDate()).padStart(2, '0');
    const expectedLength = 2 + yearReversed.length + 1 + 1 + day.length;

    if (value.length !== expectedLength) return 'Lunghezza password non valida';

    let rest = value.slice(2);
    if (!rest.includes(yearReversed)) return 'Anno non valido';
    rest = rest.replace(yearReversed, '');

    if (!rest.includes(day)) return 'Giorno non valido';
    rest = rest.replace(day, '');

    if (rest.length !== 2 || !rest.includes('.') || ![...rest].some((c) => SPECIAL_CHARS.includes(c))) {
      return 'Carattere speciale o punto mancante';
    }

    return '';
  }

  function setAuthCookie() {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + COOKIE_EXPIRY_HOURS);
    document.cookie = `${COOKIE_NAME}=1; path=/; expires=${expiryDate.toUTCString()}; SameSite=Strict`;
  }

  function getAuthCookie() {
    const match = document.cookie.match('(?:^|; )' + COOKIE_NAME + '=([^;]*)');
    return match ? decodeURIComponent(match[1]) : null;
  }

  function isAuthenticated() {
    return getAuthCookie() === '1';
  }

  // Only same-site relative paths are valid redirect targets — blocks
  // ?redirect=https://evil.example or ?redirect=//evil.example open redirects.
  function isSafeRedirect(path) {
    return typeof path === 'string' && /^\/(?!\/)/.test(path);
  }

  function currentPath() {
    return location.pathname + location.search + location.hash;
  }

  // Call at the very top of <head> on any page that must be gated.
  function requireAuth() {
    if (isAuthenticated()) return;
    const dest = encodeURIComponent(currentPath());
    location.replace(`${LOGIN_PATH}?redirect=${dest}`);
  }

  // Sends an already-authenticated visitor onward: to the page they
  // originally requested (?redirect=), or to the hub if there isn't one.
  function redirectAfterLogin() {
    const redirect = new URLSearchParams(location.search).get('redirect');
    location.href = redirect && isSafeRedirect(redirect) ? redirect : DEFAULT_DEST;
  }

  function handleLogin(formId, passwordInputId, messageElementId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const passwordInput = document.getElementById(passwordInputId);
    const messageEl = document.getElementById(messageElementId);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const error = validatePassword(passwordInput.value.trim());

      if (error) {
        if (messageEl) {
          messageEl.textContent = error;
          messageEl.className = 'msg bad';
        }
        return;
      }

      setAuthCookie();
      redirectAfterLogin();
    });
  }

  return {
    validatePassword,
    setAuthCookie,
    getAuthCookie,
    isAuthenticated,
    requireAuth,
    redirectAfterLogin,
    handleLogin,
  };
})();
