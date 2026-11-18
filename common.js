// common.js
// the code that the buyer pages and the seller pages share (bdashboard, bsaved, sdashboard, sadd)
// those pages load this file before their own js file

// one property. data is an object with the fields below
// it comes from SAMPLE or from what the seller typed in the add property form
class Property {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.propertyType = data.propertyType;         // Apartment, Villa, Studio...
    this.transactionType = data.transactionType;   // "Sale" or "Rent" (the form saves "For Sale" / "For Rent")
    this.price = data.price;
    this.location = data.location;
    this.size = data.size;                         // in m²
    this.bedrooms = data.bedrooms;
    this.bathrooms = data.bathrooms;
    this.floor = data.floor;
    this.yearBuilt = data.yearBuilt;
    this.photoPath = data.photoPath;
    this.otherDetails = data.otherDetails;
    this.seller = data.seller;                     // fullName and email of the seller
  }

  // true if the property is for sale, false if it is for rent
  // the samples have "Sale" and the form has "For Sale" so we just check if it has the word sale
  // because of "get" we use it like a normal field: property.isSale (without the brackets)
  get isSale() {
    const type = this.transactionType.toLowerCase();
    return type.includes('sale');
  }

  // the price with the $ in front, like "$185000"
  get priceText() {
    return '$' + this.price;
  }
}

// localStorage keeps things in the browser even after the page is closed
// we use it instead of a database for now
// it can only keep text, so we use JSON to change our lists and objects to text and back
// we always use try/catch so the page doesn't break if the storage has a problem

// reads what is saved under key
// if nothing is saved there (or it is broken) it returns the fallback
function readStorage(key, fallback) {
  try {
    const savedText = localStorage.getItem(key);

    // nothing saved yet
    if (savedText === null) {
      return fallback;
    }

    return JSON.parse(savedText);
  } catch (error) {
    console.error('Storage read failed:', error);
    return fallback;
  }
}

// saves value under key
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Storage write failed:', error);
  }
}

// for now the sample properties are in this file and the changes
// (added, deleted, saved) are in localStorage
// when we have a backend these functions will ask the server

// all the samples have the same photo
const HOUSE_PHOTO = 'https://usvintagewood.com/wp-content/uploads/2021/05/image1-1024x683.jpg';

// the properties that are always on the site
const SAMPLE = [
  {
    id: 1, title: 'Modern Apartment 2+1', propertyType: 'Apartment', transactionType: 'Sale',
    price: 185000, location: 'Tirana, Blloku', size: 92, bedrooms: 2, bathrooms: 1,
    photoPath: HOUSE_PHOTO,
    seller: { fullName: 'Arben Hoxha', email: 'arben@example.com' }
  },
  {
    id: 2, title: 'Cozy Studio Downtown', propertyType: 'Studio', transactionType: 'Rent',
    price: 550, location: 'Tirana, Center', size: 38, bedrooms: 1, bathrooms: 1,
    photoPath: HOUSE_PHOTO,
    seller: { fullName: 'Elira Dervishi', email: 'elira@example.com' }
  },
  {
    id: 3, title: 'Family Villa with Garden', propertyType: 'Villa', transactionType: 'Sale',
    price: 320000, location: 'Tirana, Farka', size: 240, bedrooms: 4, bathrooms: 3,
    photoPath: HOUSE_PHOTO,
    seller: { fullName: 'Arben Hoxha', email: 'arben@example.com' }
  },
  {
    id: 4, title: 'Sea View Apartment', propertyType: 'Apartment', transactionType: 'Sale',
    price: 98000, location: 'Durres, Beach', size: 70, bedrooms: 2, bathrooms: 1,
    photoPath: HOUSE_PHOTO,
    seller: { fullName: 'Besnik Leka', email: 'besnik@example.com' }
  },
  {
    id: 5, title: 'Furnished 1+1 near Center', propertyType: 'Apartment', transactionType: 'Rent',
    price: 700, location: 'Tirana, Komuna e Parisit', size: 58, bedrooms: 1, bathrooms: 1,
    photoPath: HOUSE_PHOTO,
    seller: { fullName: 'Elira Dervishi', email: 'elira@example.com' }
  },
  {
    id: 6, title: 'Luxury Villa by the Sea', propertyType: 'Villa', transactionType: 'Sale',
    price: 410000, location: 'Vlore, Uji i Ftohte', size: 210, bedrooms: 4, bathrooms: 3,
    photoPath: HOUSE_PHOTO,
    seller: { fullName: 'Besnik Leka', email: 'besnik@example.com' }
  }
];

// the ids of the properties that a seller deleted
// we can't really delete a sample, so we save its id and hide it
function getDeletedIds() {
  return readStorage('deletedPropertyIds', []);
}

// returns all the properties that should be on the site
// the samples + the ones the sellers added, without the deleted ones
function getProperties() {
  const deletedIds = getDeletedIds();
  const added = readStorage('addedProperties', []);

  // one list, the samples first and then the added ones
  const all = SAMPLE.concat(added);

  const properties = [];
  for (const data of all) {
    const isDeleted = deletedIds.includes(data.id);

    if (!isDeleted) {
      // make it a Property so it also has isSale and priceText
      properties.push(new Property(data));
    }
  }

  return properties;
}

// the user that is logged in (fullName, email, role), or null if nobody is logged in
// login.js saves it as 'currentUser'
// with a backend this will come from the login session
function getCurrentUser() {
  return readStorage('currentUser', null);
}

// only the properties of the seller that is logged in
// with a backend: fetch('/api/seller/properties')
function getMyProperties() {
  const user = getCurrentUser();

  // nobody is logged in so there is nothing to show
  if (user === null) {
    return [];
  }

  // a property is mine if the email of its seller is my email
  return getProperties().filter(function isMine(property) {
    return property.seller.email === user.email;
  });
}

// deletes a property, it adds its id to the deleted ids
// with a backend: fetch('/api/seller/properties/' + id, { method: 'DELETE' })
function deleteProperty(id) {
  const deletedIds = getDeletedIds();
  deletedIds.push(id);
  writeStorage('deletedPropertyIds', deletedIds);
}

// the ids of the properties that the buyer saved with the bookmark button
function getSavedIds() {
  return readStorage('savedPropertyIds', []);
}

// runs when the bookmark button is clicked
// if the property was saved it is not saved anymore, and if it wasn't now it is
// it returns the new list of saved ids
function toggleSave(id) {
  let savedIds = getSavedIds();

  if (savedIds.includes(id)) {
    // it was saved, so we keep all the ids except this one
    savedIds = savedIds.filter(function isOtherId(savedId) {
      return savedId !== id;
    });
  } else {
    // it wasn't saved, so we add it at the end
    savedIds.push(id);
  }

  writeStorage('savedPropertyIds', savedIds);
  return savedIds;
}

// makes a text safe to put inside html
// for example "<b>hi</b>" is shown as normal text and not as a real tag
// we use it for everything that a person typed (titles, locations, names...)
function esc(text) {
  const div = document.createElement('div');
  div.textContent = text;   // we put it in as normal text
  return div.innerHTML;     // and take it back with the special characters fixed
}

// the background colors for the property cards
const gradients = [
  'linear-gradient(135deg, #1f2937, #0d9488)',
  'linear-gradient(135deg, #1f2937, #2563eb)',
  'linear-gradient(135deg, #1f2937, #374151)',
  'linear-gradient(135deg, #1f2937, #4b5563)',
  'linear-gradient(135deg, #1f2937, #1e40af)',
  'linear-gradient(135deg, #1f2937, #064e3b)'
];

// picks a random color from the list above
function randomGradient() {
  // Math.random() is a number between 0 and 1
  // times the number of colors and rounded down it is a position in the list (0 to 5)
  const position = Math.floor(Math.random() * gradients.length);
  return gradients[position];
}

// makes the html of one property card (for the buyer pages)
// isSaved is true if the buyer saved it, then the bookmark is filled
function cardHtml(property, isSaved) {
  // on the buyer dashboard every property has a gradient (a background color)
  // on the saved page it doesn't, so the card uses the background from the css
  let style = '';
  if (property.gradient) {
    style = `style="background:${property.gradient};"`;
  }

  // the ribbon in the corner has a different color for sale and for rent
  let ribbonClass = 'rent';
  if (property.isSale) {
    ribbonClass = 'sale';
  }

  // the bookmark button is different when the property is saved
  let savedClass = '';
  let buttonLabel = 'Save property';
  if (isSaved) {
    savedClass = 'saved';
    buttonLabel = 'Remove from saved';
  }

  // data-id on the button is how the click code knows which property was clicked
  return `
    <div class="buyer-card" ${style}>
      <img src="${esc(property.photoPath)}" class="property-img" alt="${esc(property.title)}">
      <div class="buyer-ribbon ${ribbonClass}">${esc(property.transactionType)}</div>
      <div class="property-info">
        <div class="property-header">
          <h3>${esc(property.title)}</h3>
          <button type="button" class="heart-btn ${savedClass}" data-id="${property.id}"
                  aria-pressed="${isSaved}" aria-label="${buttonLabel}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14a1 1 0 0 1 1 1v17l-8-5-8 5V4a1 1 0 0 1 1-1z"/></svg>
          </button>
        </div>
        <p>${esc(property.propertyType)}</p>
        <p><strong>Price:</strong> ${property.priceText}</p>
        <p><strong>Location:</strong> ${esc(property.location)}</p>
        <p>
          <strong>Size:</strong> ${esc(property.size)} m² |
          <strong>Bedrooms:</strong> ${esc(property.bedrooms)} |
          <strong>Bathrooms:</strong> ${esc(property.bathrooms)}
        </p>
        <p><strong>Seller:</strong> ${esc(property.seller.fullName)} (${esc(property.seller.email)})</p>
      </div>
    </div>`;
}

// draws a list of properties inside <div id="propertiesList">
// savedIds are the ids the buyer saved, so those cards have the bookmark filled
// emptyMessage is the text we show when the list is empty
function renderGrid(list, savedIds, emptyMessage) {
  const listBox = document.getElementById('propertiesList');

  // nothing to show, so we write the message
  if (list.length === 0) {
    listBox.innerHTML = `<p class="empty">${emptyMessage}</p>`;
    return;
  }

  // make the html of every card and put them together
  let cardsHtml = '';
  for (const property of list) {
    const isSaved = savedIds.includes(property.id);
    cardsHtml += cardHtml(property, isSaved);
  }

  listBox.innerHTML = `<div class="properties-grid">${cardsHtml}</div>`;
}

// saves a new property, data has the same fields as the add property form
// for now the new property is kept in the browser
// with a backend: fetch('/api/seller/properties', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
function addProperty(data) {
  const user = getCurrentUser();

  // only a seller that is logged in can add a property
  if (user === null) {
    throw new Error('You must be logged in to add a property.');
  }

  // the form doesn't have these two so we add them here
  data.id = Date.now();   // the time now as a number, so every id is different
  data.seller = { fullName: user.fullName, email: user.email };

  // add it to the list of added properties and save the list
  const added = readStorage('addedProperties', []);
  added.push(data);
  writeStorage('addedProperties', added);

  return data;
}
