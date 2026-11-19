const registerForm = document.getElementById('registerForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const roleInput = document.getElementById('role');
const formError = document.getElementById('formError');
const registerBtn = document.getElementById('registerBtn');
const registerContainer = document.getElementById('registerContainer');

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

// ---------- Register (demo, without a backend) ----------
// The accounts are saved under the key 'users' and read by login.js.
// Passwords are kept as plain text here only because this is a demo.
function registerUser(user) {
  const users = readStorage('users', []);

  const exists = users.find(function (u) {
    return u.email.toLowerCase() === user.email.toLowerCase();
  });
  if (exists) {
    throw new Error('An account with this email already exists.');
  }

  users.push(user);
  writeStorage('users', users);
  return user;
}

// ---------- Validation ----------
// Each rule gets the value of its field and throws an Error when the value is not ok.
// The key is the id of the input; its error box has the id + 'Error'.
const rules = {
  fullName: function checkFullName(value) {
    if (value.length < 2) {
      throw new Error('Please enter your full name.');
    }
  },

  email: function checkEmail(value) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value)) {
      throw new Error('Please enter a valid email.');
    }
  },

  password: function checkPassword(value) {
    if (value.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }
  }
};

// Runs the rule of one field. Returns true when it is ok, false when not.
// The password is not trimmed, because spaces can be part of it.
function validateField(id) {
  const input = document.getElementById(id);
  const errorBox = document.getElementById(id + 'Error');
  let value = input.value.trim();
  if (id === 'password') {
    value = input.value;
  }

  try {
    rules[id](value);
    errorBox.textContent = '';
    input.classList.remove('invalid');
    return true;
  } catch (error) {
    errorBox.textContent = error.message;
    input.classList.add('invalid');
    return false;
  }
}

// Once a field shows an error, re-check it on every keystroke
Object.keys(rules).forEach(function (id) {
  function recheck() {
    if (document.getElementById(id).classList.contains('invalid')) {
      validateField(id);
    }
  }

  document.getElementById(id).addEventListener('input', recheck);
});

// ---------- Submit ----------
registerForm.addEventListener('submit', function handleSubmit(event) {
  event.preventDefault();
  formError.textContent = '';

  // Check every field so all errors show at once
  const results = Object.keys(rules).map(validateField);
  if (results.includes(false)) {
    return;
  }

  registerBtn.disabled = true;

  try {
    registerUser({
      fullName: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      role: roleInput.value
    });
    window.location.href = 'login.html';
  } catch (error) {
    formError.textContent = error.message;
  } finally {
    registerBtn.disabled = false;
  }
});

// ---------- Slide-down effect ----------
window.addEventListener('DOMContentLoaded', function showRegister() {
  registerContainer.classList.add('show');
});
