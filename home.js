// ---------- Property class (same fields as Real_Estate.Models.Property) ----------
class Property {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.price = data.price;
    this.photoPath = data.photoPath;
    this.transactionType = data.transactionType;
  }

  get isSale() {
    return this.transactionType.toLowerCase().includes('sale');
  }

  get priceText() {
    return `$${this.price}`;
  }
}

// ---------- Data layer ----------
// For now the data lives here and in localStorage. When the backend is ready, replace the body of
// getProperties with a fetch('/api/properties') call.
// JSON field names should be: title, price, photoPath, transactionType.
const HOUSE_PHOTO = 'https://usvintagewood.com/wp-content/uploads/2021/05/image1-1024x683.jpg';

const SAMPLE = [
  { id: 1, title: 'Modern Apartment 2+1', price: 185000, photoPath: HOUSE_PHOTO, transactionType: 'Sale' },
  { id: 2, title: 'Cozy Studio Downtown', price: 550, photoPath: HOUSE_PHOTO, transactionType: 'Rent' },
  { id: 3, title: 'Family Villa with Garden', price: 320000, photoPath: HOUSE_PHOTO, transactionType: 'Sale' },
  { id: 4, title: 'Sea View Apartment', price: 98000, photoPath: HOUSE_PHOTO, transactionType: 'Sale' },
  { id: 5, title: 'Furnished 1+1 near Center', price: 700, photoPath: HOUSE_PHOTO, transactionType: 'Rent' },
  { id: 6, title: 'Luxury Villa by the Sea', price: 410000, photoPath: HOUSE_PHOTO, transactionType: 'Sale' }
];

// Same data as common.js: the sample properties plus the ones sellers added in this browser,
// without the ones sellers deleted.
function getProperties() {
  let added = [];
  let deleted = [];

  try {
    added = JSON.parse(localStorage.getItem('addedProperties')) || [];
    deleted = JSON.parse(localStorage.getItem('deletedPropertyIds')) || [];
  } catch (error) {
    console.error('Storage read failed:', error);
  }

  const all = [...SAMPLE, ...added];

  return all
    .filter(function (data) {
      return !deleted.includes(data.id);
    })
    .map(function (data) {
      return new Property(data);
    });
}

// ---------- Helpers ----------
const gradients = [
  'linear-gradient(135deg, #1f2937, #0d9488)',
  'linear-gradient(135deg, #1f2937, #2563eb)',
  'linear-gradient(135deg, #1f2937, #374151)',
  'linear-gradient(135deg, #1f2937, #4b5563)',
  'linear-gradient(135deg, #1f2937, #1e40af)',
  'linear-gradient(135deg, #1f2937, #064e3b)'
];

function randomGradient() {
  return gradients[Math.floor(Math.random() * gradients.length)];
}

// Escape text so data from a backend can never inject HTML
function esc(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ---------- Rendering ----------
function cardHtml(property) {
  let ribbonClass = 'rent';
  if (property.isSale) {
    ribbonClass = 'sale';
  }

  return `
    <div class="property-card" style="background:${randomGradient()};">
      <div class="image-wrapper">
        <img src="${esc(property.photoPath)}" alt="Property">
        <div class="ribbon ${ribbonClass}">${esc(property.transactionType)}</div>
      </div>
      <div class="property-card-content">
        <h3>${esc(property.title)}</h3>
        <p><strong>Price:</strong> ${property.priceText}</p>
        <p class="more-info">More Information</p>
      </div>
    </div>`;
}

function renderProperties(list) {
  const container = document.getElementById('propertiesList');

  if (list.length === 0) {
    container.innerHTML = '<p class="empty">No properties available at the moment.</p>';
    return;
  }

  const cards = list.map(cardHtml);
  container.innerHTML = `<div class="properties-grid">${cards.join('')}</div>`;
}

// ---------- Events ----------
// One listener for all "More Information" clicks (event delegation)
document.getElementById('propertiesList').addEventListener('click', function handleClick(event) {
  if (event.target.classList.contains('more-info')) {
    alert('You need to login/register to view more details.');
  }
});

// Slide-in animation for the hero
window.addEventListener('DOMContentLoaded', function showHero() {
  document.getElementById('homeContainer').classList.add('show');
});

// ---------- Filter (the code is in filter.js) ----------
let allProperties = [];

const applyFilters = setupFilter(
  function () {
    return allProperties;
  },
  function (filtered) {
    if (filtered.length === 0 && allProperties.length > 0) {
      document.getElementById('propertiesList').innerHTML =
        '<p class="empty">No properties match your filter.</p>';
      return;
    }
    renderProperties(filtered);
  }
);

// ---------- Start ----------
try {
  allProperties = getProperties();
  applyFilters();
} catch (error) {
  console.error(error);
  document.getElementById('propertiesList').innerHTML =
    '<p class="empty">Properties could not be loaded. Please refresh the page.</p>';
}
// ---------- Money rain (runs when the page opens) ----------
const NOTE_COLORS = [
  ['#2e7d32', '#81c784'],
  ['#388e3c', '#a5d6a7']
];

function startMoneyRain() {
  const COUNT = 45;
  const rain = document.createElement('div');
  rain.className = 'money-rain';
  rain.setAttribute('aria-hidden', 'true');

  let longest = 0;
  for (let i = 0; i < COUNT; i++) {
    const isCoin = Math.random() < 0.35;
    const duration = 4 + Math.random() * 4;
    const delay = Math.random() * 3;
    const piece = document.createElement('div');

    if (isCoin) {
      piece.className = 'money coin';
      piece.textContent = '⌂';
    } else {
      const colors = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
      piece.className = 'money note';
      piece.style.setProperty('--n1', colors[0]);
      piece.style.setProperty('--n2', colors[1]);
      piece.innerHTML = '<span class="c tl">100</span><span class="c br">100</span><span class="oval">⌂</span>';
    }

    piece.style.setProperty('--x', `${Math.random() * 100}%`);
    piece.style.setProperty('--sway', `${Math.round(Math.random() * 160 - 80)}px`);
    piece.style.setProperty('--r0', `${Math.round(Math.random() * 360)}deg`);
    piece.style.setProperty('--r1', `${Math.round(Math.random() * 720 - 360)}deg`);
    piece.style.setProperty('--dur', `${duration}s`);
    piece.style.setProperty('--delay', `${delay}s`);

    longest = Math.max(longest, duration + delay);
    rain.appendChild(piece);
  }

  document.body.appendChild(rain);
  // Remove it when the last piece has fallen
  setTimeout(function removeRain() {
    rain.remove();
  }, (longest + 0.5) * 1000);
}

window.addEventListener('DOMContentLoaded', startMoneyRain);