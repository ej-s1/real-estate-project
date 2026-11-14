// Add property page. Uses common.js (addProperty).

const thisYear = new Date().getFullYear();

// A whole number is a number with nothing after the decimal point
function isWholeNumber(value) {
  return value !== '' && Number(value) % 1 === 0;
}

// Each rule gets the value of its field and throws an Error when the value is not ok.
// The key is the id of the input; its error box has the id + 'Error'.
const rules = {
  title: function checkTitle(value) {
    if (value.length < 3) {
      throw new Error('Please enter a title (at least 3 characters).');
    }
  },

  propertyType: function checkPropertyType(value) {
    if (value === '') {
      throw new Error('Please select a property type.');
    }
  },

  transactionType: function checkTransactionType(value) {
    if (value === '') {
      throw new Error('Please select a transaction type.');
    }
  },

  price: function checkPrice(value) {
    if (value === '' || Number(value) <= 0) {
      throw new Error('Please enter a price greater than 0.');
    }
  },

  location: function checkLocation(value) {
    if (value.length < 2) {
      throw new Error('Please enter a location.');
    }
  },

  size: function checkSize(value) {
    if (value === '' || Number(value) <= 0) {
      throw new Error('Please enter a size greater than 0.');
    }
  },

  bedrooms: function checkBedrooms(value) {
    if (!isWholeNumber(value) || Number(value) < 0) {
      throw new Error('Please enter a whole number (0 or more).');
    }
  },

  bathrooms: function checkBathrooms(value) {
    if (!isWholeNumber(value) || Number(value) < 0) {
      throw new Error('Please enter a whole number (0 or more).');
    }
  },

  // Floor is optional: empty is fine
  floor: function checkFloor(value) {
    if (value === '') {
      return;
    }
    if (!isWholeNumber(value)) {
      throw new Error('Floor must be a whole number.');
    }
  },

  // Year is optional: empty is fine
  yearBuilt: function checkYearBuilt(value) {
    if (value === '') {
      return;
    }
    if (!isWholeNumber(value) || Number(value) < 1800 || Number(value) > thisYear + 5) {
      throw new Error(`Enter a year between 1800 and ${thisYear + 5}.`);
    }
  },

  photoPath: function checkPhotoPath(value) {
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      throw new Error('Please enter a valid link starting with http:// or https://');
    }
  }
};

// Runs the rule of one field. Returns true when it is ok, false when not.
function validateField(id) {
  const input = document.getElementById(id);
  const errorBox = document.getElementById(id + 'Error');

  try {
    rules[id](input.value.trim());
    errorBox.textContent = '';
    input.classList.remove('invalid');
    return true;
  } catch (error) {
    errorBox.textContent = error.message;
    input.classList.add('invalid');
    return false;
  }
}

// Check a field when the user leaves it, then on every change once it shows an error
Object.keys(rules).forEach(function (id) {
  function checkOnBlur() {
    validateField(id);
  }

  document.getElementById(id).addEventListener('blur', checkOnBlur);

  function recheck() {
    if (document.getElementById(id).classList.contains('invalid')) {
      validateField(id);
    }
  }

  document.getElementById(id).addEventListener('input', recheck);
  document.getElementById(id).addEventListener('change', recheck);
});

// Optional numbers: send null when empty
function optionalNumber(id) {
  if (document.getElementById(id).value === '') {
    return null;
  }
  return Number(document.getElementById(id).value);
}

// ---------- Submit ----------
document.getElementById('propertyForm').addEventListener('submit', function handleSubmit(event) {
  event.preventDefault();
  document.getElementById('formError').textContent = '';

  // Check every field so all errors show at once
  const results = Object.keys(rules).map(validateField);
  if (results.includes(false)) {
    const firstInvalid = document.querySelector('.form-card .invalid');
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return;
  }

  document.getElementById('saveBtn').disabled = true;

  try {
    addProperty({
      title: document.getElementById('title').value.trim(),
      propertyType: document.getElementById('propertyType').value,
      transactionType: document.getElementById('transactionType').value,
      price: Number(document.getElementById('price').value),
      location: document.getElementById('location').value.trim(),
      size: Number(document.getElementById('size').value),
      bedrooms: Number(document.getElementById('bedrooms').value),
      bathrooms: Number(document.getElementById('bathrooms').value),
      floor: optionalNumber('floor'),
      yearBuilt: optionalNumber('yearBuilt'),
      photoPath: document.getElementById('photoPath').value.trim(),
      otherDetails: document.getElementById('otherDetails').value.trim()
    });
    window.location.href = 'sdashboard.html';
  } catch (error) {
    console.error(error);
    document.getElementById('formError').textContent = 'The property could not be saved. Please try again.';
    document.getElementById('saveBtn').disabled = false;
  } finally {
    console.log('Check finished');
  }
});