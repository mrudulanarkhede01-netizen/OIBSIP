/* =============================================
   login.js — handles login form logic
   ============================================= */

(function () {

  // If already logged in, go straight to dashboard
  if (Auth.getSession()) {
    window.location.href = 'pages/dashboard.html';
  }

  const form      = document.getElementById('login-form');
  const emailInp  = document.getElementById('email');
  const passInp   = document.getElementById('password');
  const loginBtn  = document.getElementById('login-btn');

  /* ---- Clear inline errors on input ---- */
  emailInp.addEventListener('input', () => {
    clearFieldErrors('email-error');
    hideAlert('login-error');
  });

  passInp.addEventListener('input', () => {
    clearFieldErrors('pass-error');
    hideAlert('login-error');
  });

  /* ---- Form submission ---- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    submit();
  });

  function validate() {
    let valid = true;
    clearFieldErrors('email-error', 'pass-error');

    const email = emailInp.value.trim();
    const pass  = passInp.value;

    if (!email) {
      setFieldError('email-error', 'Email address is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('email-error', 'Please enter a valid email address.');
      valid = false;
    }

    if (!pass) {
      setFieldError('pass-error', 'Password is required.');
      valid = false;
    }

    return valid;
  }

  function submit() {
    setLoading(true);

    // Simulate a brief async delay (mimics a server round-trip)
    setTimeout(() => {
      const result = Auth.loginUser(emailInp.value.trim(), passInp.value);

      if (!result.ok) {
        showAlert('login-error', result.message);
        setLoading(false);
        return;
      }

      Auth.setSession(result.user);
      window.location.href = 'pages/dashboard.html';
    }, 500);
  }

  function setLoading(loading) {
    loginBtn.disabled = loading;
    loginBtn.querySelector('.btn-label').style.display  = loading ? 'none'   : 'inline';
    loginBtn.querySelector('.btn-loader').style.display = loading ? 'inline' : 'none';
  }

})();
