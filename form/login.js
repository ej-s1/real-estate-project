const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');
const passwordInput = document.getElementById('password');
const passwordError = document.getElementById('passwordError');
const formError = document.getElementById('formError');
const loginBtn = document.getElementById('loginBtn');
const loginContainer = document.getElementById('loginContainer');

// ---------- Storage helpers (always try/catch) ----------
function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Storage read failed:', error);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Storage write failed:', error);
  }
}

// ---------- Login (demo, without a backend) ----------
// The accounts are the ones saved by register.js under the key 'users'.
// Passwords are kept as plain text here only because this is a demo.
function loginUser(credentials) {
  const users = readStorage('users', []);

  const user = users.find(function (u) {
    return u.email.toLowerCase() === credentials.email.toLowerCase() &&
      u.password === credentials.password;
  });

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  // Remember who is logged in (without the password)
  writeStorage('currentUser', {
    fullName: user.fullName,
    email: user.email,
    role: user.role
  });

  return user;
}

// ---------- Validation ----------
// Each check function throws an Error when the value is not ok
function checkEmail(value) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value)) {
    throw new Error('Please enter a valid email.');
  }
}

function checkPassword(value) {
  if (value.length === 0) {
    throw new Error('Please enter your password.');
  }
}

function validateEmail() {
  try {
    checkEmail(emailInput.value.trim());
    emailError.textContent = '';
    emailInput.classList.remove('invalid');
    return true;
  } catch (error) {
    emailError.textContent = error.message;
    emailInput.classList.add('invalid');
    return false;
  }
}

function validatePassword() {
  try {
    checkPassword(passwordInput.value);
    passwordError.textContent = '';
    passwordInput.classList.remove('invalid');
    return true;
  } catch (error) {
    passwordError.textContent = error.message;
    passwordInput.classList.add('invalid');
    return false;
  }
}

// Once a field shows an error, re-check it on every keystroke
emailInput.addEventListener('input', function recheckEmail() {
  if (emailInput.classList.contains('invalid')) {
    validateEmail();
  }
});

passwordInput.addEventListener('input', function recheckPassword() {
  if (passwordInput.classList.contains('invalid')) {
    validatePassword();
  }
});

// ---------- Submit ----------
loginForm.addEventListener('submit', function handleSubmit(event) {
  event.preventDefault();
  formError.textContent = '';

  const emailOk = validateEmail();
  const passwordOk = validatePassword();
  if (!emailOk || !passwordOk) {
    return;
  }

  loginBtn.disabled = true;

  try {
    const user = loginUser({
      email: emailInput.value.trim(),
      password: passwordInput.value
    });

    // Sellers and buyers have different pages
    if (user.role === 'Seller') {
      window.location.href = '../seller/sdashboard.html';
    } else {
      window.location.href = '../buyer/bdashboard.html';
    }
  } catch (error) {
    formError.textContent = error.message;
  } finally {
    loginBtn.disabled = false;
  }
});

// ---------- Slide-down animation ----------
window.addEventListener('DOMContentLoaded', function showLogin() {
  loginContainer.classList.add('show');
});
