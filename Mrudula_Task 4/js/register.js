/* =============================================
   register.js — handles registration form logic
   ============================================= */

(function () {

  // If already logged in, redirect to dashboard
  if (Auth.getSession()) {
    window.location.href = 'dashboard.html';
  }

  const form        = document.getElementById('register-form');
  const nameInp     = document.getElementById('fullname');
  const emailInp    = document.getElementById('email');
  const passInp     = document.getElementById('password');
  const confirmInp  = document.getElementById('confirm-password');
  const regBtn      = document.getElementById('register-btn');

  /* ---- Live password strength ---- */
  passInp.addEventListener('input', () => {
    updateStrength(passInp.value);
    clearFieldErrors('pass-error');
    hideAlert('reg-error');
  });

  /* ---- Clear errors on input ---- */
  nameInp.addEventListener('input',    () => clearFieldErrors('name-error'));
  emailInp.addEventListener('input',   () => { clearFieldErrors('email-error'); hideAlert('reg-error'); });
  confirmInp.addEventListener('input', () => clearFieldErrors('confirm-error'));

  /* ---- Form submission ---- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    submit();
  });

  function validate() {
    let valid = true;
    clearFieldErrors('name-error', 'email-error', 'pass-error', 'confirm-error');
    hideAlert('reg-error');

    const name    = nameInp.value.trim();
    const email   = emailInp.value.trim();
    const pass    = passInp.value;
    const confirm = confirmInp.value;

    if (!name || name.length < 2) {
      setFieldError('name-error', 'Please enter your full name (at least 2 characters).');
      valid = false;
    }

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
    } else if (pass.length < 8) {
      setFieldError('pass-error', 'Password must be at least 8 characters.');
      valid = false;
    }

    if (!confirm) {
      setFieldError('confirm-error', 'Please confirm your password.');
      valid = false;
    } else if (pass && pass !== confirm) {
      setFieldError('confirm-error', 'Passwords do not match.');
      valid = false;
    }

    return valid;
  }

  function submit() {
    setLoading(true);

    setTimeout(() => {
      const result = Auth.registerUser(
        nameInp.value.trim(),
        emailInp.value.trim(),
        passInp.value
      );

      if (!result.ok) {
        showAlert('reg-error', result.message);
        setLoading(false);
        return;
      }

      // Show success message then redirect to login
      showAlert('reg-success', '✓ Account created! Redirecting you to sign in…');
      form.reset();
      updateStrength('');

      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1800);
    }, 500);
  }

  function setLoading(loading) {
    regBtn.disabled = loading;
    regBtn.querySelector('.btn-label').style.display  = loading ? 'none'   : 'inline';
    regBtn.querySelector('.btn-loader').style.display = loading ? 'inline' : 'none';
  }

})();
