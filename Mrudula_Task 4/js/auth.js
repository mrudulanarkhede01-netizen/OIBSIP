/* =============================================
   auth.js — shared authentication utilities
   Handles: user storage, session, and helpers
   ============================================= */

const Auth = (() => {

  const USERS_KEY   = 'secureauth_users';
  const SESSION_KEY = 'secureauth_session';

  /* ---------- User Storage ---------- */

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function userExists(email) {
    return !!getUsers()[email.toLowerCase()];
  }

  function registerUser(name, email, password) {
    const users = getUsers();
    const key   = email.toLowerCase();
    if (users[key]) return { ok: false, message: 'An account with this email already exists.' };
    users[key] = { name, password: hashSimple(password), createdAt: Date.now() };
    saveUsers(users);
    return { ok: true };
  }

  function loginUser(email, password) {
    const users = getUsers();
    const key   = email.toLowerCase();
    if (!users[key]) return { ok: false, message: 'No account found with this email address.' };
    if (users[key].password !== hashSimple(password)) return { ok: false, message: 'Incorrect password. Please try again.' };
    return { ok: true, user: { name: users[key].name, email: key } };
  }

  /* ---------- Session ---------- */

  function setSession(user) {
    const session = { ...user, loginAt: new Date().toISOString() };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function requireAuth(redirectTo = '../index.html') {
    if (!getSession()) {
      window.location.href = redirectTo;
    }
  }

  /* ---------- Helpers ---------- */

  // Simple obfuscation (NOT cryptographic — for demo only)
  // In a real app, use bcrypt on the server side
  function hashSimple(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
  }

  function getInitials(name) {
    return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  function formatTime(isoString) {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Expose API
  return {
    registerUser,
    loginUser,
    setSession,
    getSession,
    clearSession,
    requireAuth,
    getInitials,
    formatTime,
    userExists
  };

})();

/* ---------- Shared UI Helpers ---------- */

function showAlert(id, message, visible = true) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.style.display = visible ? 'block' : 'none';
}

function hideAlert(id) {
  showAlert(id, '', false);
}

function setFieldError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
  // Mark the related input invalid
  const inputId = id.replace('-error', '');
  const input = document.getElementById(inputId) || document.getElementById(inputId.replace('name', 'fullname'));
  if (input) {
    if (message) input.classList.add('invalid');
    else input.classList.remove('invalid');
  }
}

function clearFieldErrors(...ids) {
  ids.forEach(id => setFieldError(id, ''));
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.setAttribute('aria-label', isText ? 'Show password' : 'Hide password');
  // Swap icon opacity as visual cue
  btn.style.opacity = isText ? '0.5' : '1';
}

function updateStrength(password) {
  let score = 0;
  if (password.length >= 8)         score++;
  if (/[A-Z]/.test(password))       score++;
  if (/[0-9]/.test(password))       score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const colors  = ['#E24B4A', '#EF9F27', '#1D9E75', '#0F6E56'];
  const labels  = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  for (let i = 1; i <= 4; i++) {
    const seg = document.getElementById('s' + i);
    if (seg) seg.style.background = i <= score ? colors[score - 1] : 'var(--color-border)';
  }

  const lbl = document.getElementById('strength-label');
  if (lbl) lbl.textContent = password.length ? labels[score] : '';
}
