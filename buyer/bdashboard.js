// Buyer dashboard. Uses common.js (data, storage and rendering) and ../filter.js.
let properties = [];
let savedIds = [];

const propertiesList = document.getElementById('propertiesList');

// ---------- Filter (the code is in filter.js) ----------
const applyFilters = setupFilter(
  function () {
    return properties;
  },
  function (filtered) {
    let message = 'No properties match your filter.';
    if (properties.length === 0) {
      message = 'No properties available at the moment.';
    }
    renderGrid(filtered, savedIds, message);
  }
);

// ---------- Save button ----------
// One listener for all save buttons (event delegation)
propertiesList.addEventListener('click', function handleClick(event) {
  // The CSS rule .heart-btn svg { pointer-events: none; } makes the button the target
  const btn = event.target;
  if (!btn.classList.contains('heart-btn')) return;

  try {
    const id = Number(btn.dataset.id);
    savedIds = toggleSave(id); // keep our list up to date, so a new filter keeps the saved state
    const isSaved = savedIds.includes(id);

    btn.classList.toggle('saved', isSaved);
    btn.setAttribute('aria-pressed', isSaved);
    if (isSaved) {
      btn.setAttribute('aria-label', 'Remove from saved');
    } else {
      btn.setAttribute('aria-label', 'Save property');
    }
  } catch (error) {
    console.error(error);
    alert('Could not save this property. Please try again.');
  }
});

// ---------- Start ----------
try {
  savedIds = getSavedIds();
  properties = getProperties();

  // Give each card a gradient once, so it does not change when the filter changes
  properties.forEach(function (p) {
    p.gradient = randomGradient();
  });

  applyFilters();
} catch (error) {
  console.error(error);
  propertiesList.innerHTML = '<p class="empty">Properties could not be loaded. Please refresh the page.</p>';
}