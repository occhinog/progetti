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
// Password algorithm — 9 characters in a FIXED order, generated fresh each day:
//   1. Two capital-letter initials: GO, DR or MM (peer codes).
//   2. A literal "$".
//   3. The current year, digits reversed (2026 -> "6202").
//   4. The current day, zero-padded to 2 digits.
//   Example for 2026-08-06, peer GO: GO$620206
//
// Simplified from the previous 10-character scheme, which allowed any of
// ! # % & @ $ plus a dot in any order after the initials. Fixed order and a
// single special character make it easy to type from memory; since the whole
// algorithm is readable in view-source, the entropy was never the point.

const ProgettiAuth = (() => {
  const COOKIE_NAME = 'progetti_auth';
  const COOKIE_EXPIRY_HOURS = 24;
  const LOGIN_PATH = '/';
  const DEFAULT_DEST = '/hub.html';
  const PEER_CODES = ['GO', 'DR', 'MM'];
  const SPECIAL_CHAR = '$';

  function validatePassword(value) {
    const prefix = value.slice(0, 2);
    if (!PEER_CODES.includes(prefix)) return 'Iniziali non valide';

    const today = new Date();
    const yearReversed = String(today.getFullYear()).split('').reverse().join('');
    const day = String(today.getDate()).padStart(2, '0');
    const expectedLength = prefix.length + 1 + yearReversed.length + day.length;

    if (value.length !== expectedLength) return 'Lunghezza password non valida';
    if (value[2] !== SPECIAL_CHAR) return 'Carattere speciale non valido';
    if (value.slice(3, 3 + yearReversed.length) !== yearReversed) return 'Anno non valido';
    if (value.slice(3 + yearReversed.length) !== day) return 'Giorno non valido';

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
