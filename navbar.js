// navbar.js
// this file makes the navbar (the logo and the links at the top) for all the pages
// if a link has to change we change it only here and it changes on every page
//
// to use it on a page:
//   <script src="../navbar.js" data-navbar="buyer" data-root="../"></script>
// data-navbar is which navbar we want: "public", "buyer" or "seller"
// data-root is how to go back to the main folder, "../" if the page is inside a folder
// (home.html is already in the main folder so it doesn't need it)

// all the navbars, one for each type of user
// logo is where the logo takes you, links are the links in the bar
// text is what you see on the page and page is the file that opens
// the paths start from the main folder
const NAVBARS = {
  // not logged in
  public: {
    logo: 'home.html',
    links: [
      { text: 'Home', page: 'home.html' },
      { text: 'Properties', page: 'home.html#properties-section' },
      { text: 'Login', page: 'form/login.html' }
    ]
  },

  // buyers
  buyer: {
    logo: 'buyer/bdashboard.html',
    links: [
      { text: 'Properties', page: 'buyer/bdashboard.html' },
      { text: 'Saved', page: 'buyer/bsaved.html' },
      { text: 'Logout', page: 'home.html' }
    ]
  },

  // sellers
  seller: {
    logo: 'seller/sdashboard.html',
    links: [
      { text: 'Dashboard', page: 'seller/sdashboard.html' },
      { text: 'Add Property', page: 'seller/sadd.html' },
      { text: 'Logout', page: 'home.html' }
    ]
  }
};

// the script tag that loaded this file, we need it to read data-navbar and data-root
// we have to save it here at the top because later the browser doesn't know it anymore
const navbarScript = document.currentScript;

// makes the navbar and puts it at the top of the page
function drawNavbar() {
  // if we can't find the script tag we don't know which navbar to make
  if (!navbarScript) {
    console.error('navbar.js: it must be loaded with a normal <script src="..."> tag.');
    return;
  }

  // "../" or empty
  const root = navbarScript.dataset.root || '';

  // the navbar that this page asked for
  const navbar = NAVBARS[navbarScript.dataset.navbar];

  // the name in data-navbar is wrong or missing
  if (!navbar) {
    console.error('navbar.js: data-navbar must be "public", "buyer" or "seller". Got:', navbarScript.dataset.navbar);
    return;
  }

  // the page we are on now, like "/buyer/bsaved.html"
  const currentAddress = location.pathname;

  // make an <a> for every link and put them together
  let linksHtml = '';
  for (const link of navbar.links) {
    // the link of the page we are on gets class="active" so the css can highlight it
    // we know we are on that page if the address ends with the file of the link
    let activeClass = '';
    if (currentAddress.endsWith('/' + link.page)) {
      activeClass = ' class="active"';
    }

    linksHtml += `<a href="${root}${link.page}"${activeClass}>${link.text}</a>`;
  }

  // the whole navbar, logo on the left and links on the right
  const navbarHtml =
    `<header class="navbar">
       <a href="${root}${navbar.logo}" class="logo">MyRealEstate</a>
       <nav>${linksHtml}</nav>
     </header>`;

  // add it as the first thing inside body
  document.body.insertAdjacentHTML('afterbegin', navbarHtml);
}

// the navbar goes inside body, so we wait for the page to load and then we draw it
document.addEventListener('DOMContentLoaded', drawNavbar);
