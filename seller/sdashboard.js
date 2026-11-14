// Seller dashboard. Uses common.js (data, storage and helpers).

const TRASH_ICON = `
  <svg viewBox="0 0 448 512" aria-hidden="true">
    <path d="M135.2 17.7 128 32H32C14.3 32 0 46.3 0 64s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-96l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h245.8c25.3 0 46.3-19.7 47.9-45L416 128z"/>
  </svg>`;

const propertiesList = document.getElementById('propertiesList');

// Named sellerCardHtml, so it is not confused with cardHtml in common.js
function sellerCardHtml(p) {
  return `
    <div class="property-card" style="background:${p.gradient};">
      <img src="${esc(p.photoPath)}" alt="${esc(p.title)}">
      <div class="property-card-content">
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.propertyType)} (${esc(p.transactionType)})</p>
        <p><strong>Price:</strong> ${p.priceText}</p>
        <p><strong>Location:</strong> ${esc(p.location)}</p>
        <p>
          <strong>Size:</strong> ${esc(p.size)} m² |
          <strong>Bedrooms:</strong> ${esc(p.bedrooms)} |
          <strong>Bathrooms:</strong> ${esc(p.bathrooms)}
        </p>
        <button type="button" class="delete-btn" data-id="${p.id}" aria-label="Delete ${esc(p.title)}">${TRASH_ICON}</button>
      </div>
    </div>`;
}

let myProperties = [];

function render() {
  if (myProperties.length === 0) {
    propertiesList.innerHTML = `<p>You have no properties yet.<br><br>
         <a href="sadd.html">Add your first property</a>.</p>`;
    return;
  }

  const cards = myProperties.map(sellerCardHtml);
  propertiesList.innerHTML = `<div class="properties-grid">${cards.join('')}</div>`;
}

// One listener for all delete buttons (event delegation)
propertiesList.addEventListener('click', function handleClick(event) {
  // The CSS rule .delete-btn svg { pointer-events: none; } makes the button the target
  const btn = event.target;
  if (!btn.classList.contains('delete-btn')) return;

  const id = Number(btn.dataset.id);
  const property = myProperties.find(function (p) {
    return p.id === id;
  });
  if (!property) return;

  if (!confirm(`Delete "${property.title}"? This cannot be undone.`)) return;

  try {
    deleteProperty(id);
    myProperties = myProperties.filter(function (p) {
      return p.id !== id;
    });
    render();
  } catch (error) {
    console.error(error);
    alert('Could not delete this property. Please try again.');
  }
});

// ---------- Start ----------
try {
  myProperties = getMyProperties();

  // Give each card a gradient once, so it does not change when one is deleted
  myProperties.forEach(function (p) {
    p.gradient = randomGradient();
  });

  render();
} catch (error) {
  console.error(error);
  propertiesList.innerHTML = '<p>Properties could not be loaded. Please refresh the page.</p>';
}