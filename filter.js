// filter.js
// the filter bar above the properties (sale or rent, up to or above, and the price)
// the home page and the buyer dashboard both use it, so we wrote it only once here
//
// how to use it:
//   const applyFilters = setupFilter(getAll, show);
// getAll is a function that returns all the properties
// show is a function that draws the list we give it
// it returns applyFilters, the page calls it when the properties are loaded to show them the first time
function setupFilter(getAll, show) {
  // the parts of the filter bar from the html
  const filterForm = document.getElementById('filterForm');
  const typeFilter = document.getElementById('typeFilter');     // "" (both), "sale" or "rent"
  const modeFilter = document.getElementById('modeFilter');     // "below" (up to) or "above"
  const priceFilter = document.getElementById('priceFilter');
  const filterCount = document.getElementById('filterCount');   // the "4 of 6 properties" text
  const clearButton = document.getElementById('clearFilter');

  // looks at the filter bar and shows only the properties that match
  function applyFilters() {
    const all = getAll();

    // what the user chose
    const type = typeFilter.value;
    const mode = modeFilter.value;
    const typedPrice = priceFilter.value;   // '' if the box is empty
    const price = Number(typedPrice);       // the same price but as a number so we can compare it

    // check the properties one by one and keep the ones that pass the two rules
    const filtered = [];
    for (const property of all) {
      // rule 1: the type
      let typeFits = true;
      if (type === 'sale' && !property.isSale) {
        typeFits = false;   // we want sale but this one is for rent
      }
      if (type === 'rent' && property.isSale) {
        typeFits = false;   // we want rent but this one is for sale
      }

      // rule 2: the price, if no price is typed then every price is ok
      let priceFits = true;
      if (typedPrice !== '') {
        if (mode === 'below') {
          priceFits = property.price <= price;   // up to: the cheaper ones
        } else {
          priceFits = property.price >= price;   // above: the more expensive ones
        }
      }

      if (typeFits && priceFits) {
        filtered.push(property);
      }
    }

    // for example "4 of 6 properties"
    filterCount.textContent = `${filtered.length} of ${all.length} properties`;

    show(filtered);
  }

  // filter again every time the user types a price or changes a select
  filterForm.addEventListener('input', applyFilters);

  // if you press enter in the price box the page reloads, this stops it
  filterForm.addEventListener('submit', function stopReload(event) {
    event.preventDefault();
  });

  // the clear button empties the filter bar and shows all the properties again
  clearButton.addEventListener('click', function clearFilters() {
    filterForm.reset();
    applyFilters();
  });

  return applyFilters;
}
