// Saved properties page. Uses common.js (data, storage and rendering).
const EMPTY_MESSAGE = 'You have not saved any properties yet.';

const propertiesList = document.getElementById('propertiesList');

function showSaved() {
  const all = getProperties();
  const savedIds = getSavedIds();
  const saved = all.filter(function (p) {
    return savedIds.includes(p.id);
  });

  renderGrid(saved, savedIds, EMPTY_MESSAGE);
}

// Clicking a filled bookmark removes the property from this page
propertiesList.addEventListener('click', function handleClick(event) {
  // The CSS rule .heart-btn svg { pointer-events: none; } makes the button the target
  const btn = event.target;
  if (!btn.classList.contains('heart-btn')) return;

  try {
    toggleSave(Number(btn.dataset.id));
    showSaved();
  } catch (error) {
    console.error(error);
    alert('Could not update your saved properties. Please try again.');
  }
});

// ---------- Start ----------
try {
  showSaved();
} catch (error) {
  console.error(error);
  propertiesList.innerHTML = '<p class="empty">Saved properties could not be loaded. Please refresh the page.</p>';
}