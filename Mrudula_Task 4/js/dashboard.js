/* =============================================
   dashboard.js — handles secured dashboard page
   ============================================= */

(function () {

  // Guard: redirect to login if no active session
  Auth.requireAuth('../index.html');

  const session = Auth.getSession();

  // Populate user info
  document.getElementById('user-avatar').textContent    = Auth.getInitials(session.name);
  document.getElementById('user-name').textContent      = session.name;
  document.getElementById('user-email').textContent     = session.email;
  document.getElementById('login-time').textContent     = Auth.formatTime(session.loginAt);

})();

/* ---- Logout (called from HTML onclick) ---- */
function logout() {
  Auth.clearSession();
  window.location.href = '../index.html';
}
