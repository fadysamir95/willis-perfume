/*
 * Generate:
 *   - standalone product pages (products/<id>.html)
 *   - list pages at the site root (collection.html, featured.html)
 *   - sitemap.xml + robots.txt
 * Run from tools/:  node generate-pages.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = process.env.DATA_PATH || path.join(ROOT, "website_data_willis_perfume_FINAL_WITH_PRICES.json");
const OUT_DIR = process.env.OUT_DIR || path.join(ROOT, "products");

/* Read the single source of truth (site-config.js) so generated pages,
   sitemap.xml and robots.txt all use the configured domain / analytics IDs.
   Editable env override: SITE_URL */
let SITE_CONFIG = {};
try {
  const vm = require("vm");
  const cfgCtx = { window: {} };
  vm.createContext(cfgCtx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "site-config.js"), "utf8"), cfgCtx);
  SITE_CONFIG = cfgCtx.window.SITE_CONFIG || {};
} catch (e) {
  console.warn("⚠ site-config.js not readable — using defaults:", e.message);
}

const SITE_URL = process.env.SITE_URL || SITE_CONFIG.siteUrl || "https://willis-perfume.com";

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncate(text, max = 158) {
  const plain = String(text || "").replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  return plain.slice(0, max - 1).trimEnd() + "…";
}

function stockStatus(stock) {
  const asNum = Number(stock);
  if (stock != null && String(stock).trim() !== "" && !Number.isNaN(asNum)) {
    if (asNum <= 0) return "out";
    if (asNum <= 3) return "low";
    return "in";
  }
  if (stock === "out" || stock === "low") return stock;
  return "in";
}

function availability(stock) {
  const s = stockStatus(stock);
  if (s === "out") return "https://schema.org/OutOfStock";
  if (s === "low") return "https://schema.org/LimitedAvailability";
  return "https://schema.org/InStock";
}

const isVisible = product => product.visible !== false;

const ANALYTICS_SNIPPETS = `
  <!-- ======================================================================
       ANALYTICS — ids come from ../site-config.js (window.SITE_CONFIG) at
       runtime. Edit site-config.js and re-run: node tools/generate-pages.js
       ====================================================================== -->
  <!-- GOOGLE ANALYTICS (GA4) — not loaded while the ID is still a placeholder -->
  <script>
    (function () {
      var cfg = window.SITE_CONFIG || {};
      var id = cfg.ga4Id;
      if (!id || id.indexOf("XXXX") !== -1) return;
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", id);
    })();
  <\/script>

  <!-- META PIXEL — not initialized while the ID is still a placeholder -->
  <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    (function () {
      var cfg = window.SITE_CONFIG || {};
      var id = cfg.pixelId;
      if (!id || id.indexOf("XXXX") !== -1) return;
      fbq('init', id);
      fbq('track', 'PageView');
      var im = document.createElement("img");
      im.height = 1; im.width = 1; im.style.display = "none"; im.alt = "";
      im.src = "https://www.facebook.com/tr?id=" + encodeURIComponent(id) + "&ev=PageView&noscript=1";
      document.head.appendChild(im);
    })();
  <\/script>`;

const FONTS_LINK = "https://fonts.googleapis.com/css2?family=Marcellus&family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@400;500;600;700&family=Cairo:wght@400;500;600;700&display=swap";

/* ---------- <head> for product pages (in products/) ---------- */
function headHTML(product) {
  const url = `${SITE_URL}/products/${product.id}.html`;
  const title = `${product.brand_name} — Inspired by ${product.inspired_by} | Willi's Perfume`;
  const desc = truncate(product.description);
  const image = `${SITE_URL}/images/${product.id}.webp`;
  const prices = Object.values(product.sizes || {});
  const minPrice = prices.length ? Math.min(...prices.map(Number)) : 0;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.brand_name,
    "image": [image],
    "description": product.description,
    "brand": { "@type": "Brand", "name": "Willi's Perfume" },
    "sku": product.id,
    "url": url,
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "EGP",
      "price": minPrice,
      "availability": availability(product.stock),
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": "Collection", "item": `${SITE_URL}/collection.html` },
      { "@type": "ListItem", "position": 3, "name": product.brand_name, "item": url }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#f7f3ec" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />

  <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon-32x32.png" />
  <link rel="apple-touch-icon" href="../images/apple-touch-icon.png" />

  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="Willi's Perfume" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:locale:alternate" content="ar_EG" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image" content="${image}" />

  <script src="../site-config.js"><\/script>
  <script>window.BASE_PATH = "../"; window.SITE_URL = (window.SITE_CONFIG && window.SITE_CONFIG.siteUrl) || "https://willis-perfume.com";<\/script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONTS_LINK}" rel="stylesheet">
  <link rel="stylesheet" href="../style.css" />
  <link rel="stylesheet" href="../style-mobile-fix.css" />

  <script type="application/ld+json">
  ${JSON.stringify(productSchema, null, 2)}
  <\/script>
  <script type="application/ld+json">
  ${JSON.stringify(breadcrumbSchema, null, 2)}
  <\/script>
${ANALYTICS_SNIPPETS}
</head>`;
}

/* ---------- <head> for the root list pages (collection.html / featured.html) ---------- */
function listHeadHTML(mode) {
  const featuredList = mode === "featured";
  const url = `${SITE_URL}/${featuredList ? "featured" : "collection"}.html`;
  const title = featuredList
    ? "Most Requested Fragrances | Willi's Perfume"
    : "Our Collection — Inspired Perfumes | Willi's Perfume";
  const desc = featuredList
    ? "The most requested fragrances from Willi's Perfume — shop the customer favorites online with cash on delivery nationwide."
    : "Browse the full Willi's Perfume collection of inspired fragrances at the best prices. Cash on delivery nationwide.";
  const image = `${SITE_URL}/images/logo.webp`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": featuredList ? "Most Requested" : "Collection", "item": url }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#f7f3ec" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />

  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png" />
  <link rel="apple-touch-icon" href="images/apple-touch-icon.png" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Willi's Perfume" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:locale:alternate" content="ar_EG" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta name="twitter:image" content="${image}" />

  <script src="site-config.js"><\/script>
  <script>window.BASE_PATH = ""; window.SITE_URL = (window.SITE_CONFIG && window.SITE_CONFIG.siteUrl) || "https://willis-perfume.com";<\/script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONTS_LINK}" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="style-mobile-fix.css" />

  <script type="application/ld+json">
  ${JSON.stringify(breadcrumbSchema, null, 2)}
  <\/script>
${ANALYTICS_SNIPPETS}
</head>`;
}

/* ---------- Shared page chrome (header / menu / footer / cart drawer / mobile nav) ---------- */
function chromePage({ back, bodyAttrs, navCollection, navFeatured, breadcrumbsHtml, mainHtml }) {
  return `
<body ${bodyAttrs}>
  <div class="page-shell">
    <div class="announcement-bar" data-i18n="announce.text" role="note">Free shipping on orders above 1000 EGP · Cash on delivery nationwide</div>
    <header class="site-header">
      <a class="brand" href="${back}index.html" aria-label="Willi's Perfume home">
        <img src="${back}images/logo.webp" alt="Willi's Perfume logo" width="43" height="43">
        <span class="brand-copy">
          <strong>Willi's Perfume</strong>
          <small>WEAR YOUR WILL</small>
        </span>
      </a>

      <nav class="desktop-nav" aria-label="Main navigation">
        <a href="${back}index.html#home" data-i18n="nav.home">Home</a>
        <a href="${navCollection}" data-i18n="nav.collection">Collection</a>
        <a href="${navFeatured}" data-i18n="nav.featured">Most Requested</a>
        <a href="${back}index.html#story" data-i18n="nav.about">About Us</a>
        <a href="${back}index.html#footer" data-i18n="nav.contact">Contact</a>
      </nav>

      <div class="desktop-actions">
        <a class="social-icon" href="https://www.instagram.com/willis_perfume/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.4" cy="6.7" r="1" fill="currentColor"/></svg>
        </a>
        <a class="social-icon facebook-icon" href="https://www.facebook.com/profile.php?id=61590332657028" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M13.7 7.2h2V4.4c-.35-.05-1.55-.15-2.9-.15-2.87 0-4.84 1.75-4.84 4.98v2.78H4.8v3.1h3.16v7.7h3.86v-7.7h3.07l.49-3.1h-3.56V9.55c0-.9.24-2.35 1.88-2.35Z" fill="#fff"/></svg>
        </a>
        <button class="lang-toggle" type="button" aria-label="Switch to Arabic">العربية</button>
        <button class="cart-icon-btn" id="desktopCartBtn" aria-label="Open cart" aria-expanded="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7.5h12l-1.1 12a1.8 1.8 0 0 1-1.8 1.6H8.9a1.8 1.8 0 0 1-1.8-1.6L6 7.5Z"/><path d="M9 10V5.8A3 3 0 0 1 12 3a3 3 0 0 1 3 2.8V10"/></svg>
          <span class="cart-badge" id="desktopCartBadge">0</span>
        </button>
        <button class="desktop-whatsapp" id="desktopWhatsApp">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.2A8.5 8.5 0 1 1 20.5 11.8Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.3 8.6c.2-.4.5-.5.9-.5h.6c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c.7 1.2 1.6 2.1 2.9 2.8l.7-.7c.2-.2.4-.2.7-.1l1.8.8c.3.1.4.3.4.5v.6c0 .4-.2.7-.5.9-.5.3-1.2.4-1.8.2-3.4-1-5.8-3.4-6.8-6.8-.2-.6-.1-1.3.2-1.8Z" fill="currentColor"/></svg>
          <span data-i18n="header.orderWa">Order on WhatsApp</span>
        </button>
      </div>

      <button class="icon-btn menu-btn" id="menuBtn" aria-label="Open menu" data-i18n-aria="menu.open" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </header>

    <div class="menu-overlay" id="menuOverlay"></div>
    <aside class="side-menu" id="sideMenu" aria-hidden="true">
      <div class="menu-top">
        <span data-i18n="menu.label">Menu</span>
        <button class="icon-btn close-menu" id="closeMenu" aria-label="Close menu" data-i18n-aria="menu.close">×</button>
      </div>
      <nav>
        <a href="${back}index.html#home" data-i18n="nav.home">Home</a>
        <a href="${navCollection}" data-i18n="nav.collection">Collection</a>
        <a href="${navFeatured}" data-i18n="nav.featured">Most Requested</a>
        <button data-gender="Men" data-i18n="gender.men">Men</button>
        <button data-gender="Women" data-i18n="gender.women">Women</button>
        <button data-gender="Unisex" data-i18n="gender.unisex">Unisex</button>
      </nav>
      <div class="menu-divider"></div>
      <p class="menu-caption" data-i18n="menu.caption">Find a scent that feels like you.</p>
      <button class="lang-toggle menu-lang-toggle" type="button" aria-label="Switch to Arabic">العربية</button>
      <div class="menu-socials">
        <a href="https://www.instagram.com/willis_perfume/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-i18n="menu.instagram">Instagram</a>
        <a href="https://www.facebook.com/profile.php?id=61590332657028" target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-i18n="menu.facebook">Facebook</a>
        <a href="#" id="menuWhatsApp" aria-label="WhatsApp" data-i18n="menu.whatsapp">WhatsApp</a>
      </div>
    </aside>

    <main>
      ${breadcrumbsHtml}
      ${mainHtml}
    </main>

    <footer class="site-footer" id="footer">
      <img src="${back}images/logo.webp" alt="" class="footer-logo" width="58" height="58">
      <h3>Willi's Perfume</h3>
      <p data-i18n="footer.about">Wear Your Will</p>
      <small data-i18n="footer.rights">© 2026 Willi's Perfume. All rights reserved.</small>
    </footer>
  </div>

  <nav class="mobile-nav" aria-label="Mobile navigation">
    <a href="${back}index.html#home" class="mobile-nav-item">
      <span>⌂</span><small data-i18n="mnav.home">Home</small>
    </a>
    <a href="${navCollection}" class="mobile-nav-item">
      <span>▦</span><small data-i18n="mnav.collection">Collection</small>
    </a>
    <button class="mobile-nav-item" id="cartNav" aria-label="Open cart" data-i18n-aria="cart.open">
      <span class="mobile-cart-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7.5h12l-1.1 12a1.8 1.8 0 0 1-1.8 1.6H8.9a1.8 1.8 0 0 1-1.8-1.6L6 7.5Z"/><path d="M9 10V5.8A3 3 0 0 1 12 3a3 3 0 0 1 3 2.8V10"/></svg>
        <span class="cart-badge" id="mobileCartBadge">0</span>
      </span>
      <small data-i18n="mnav.cart">Cart</small>
    </button>
    <button class="mobile-nav-item" id="whatsappNav">
      <span class="nav-whatsapp-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.2A8.5 8.5 0 1 1 20.5 11.8Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.3 8.6c.2-.4.5-.5.9-.5h.6c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c.7 1.2 1.6 2.1 2.9 2.8l.7-.7c.2-.2.4-.2.7-.1l1.8.8c.3.1.4.3.4.5v.6c0 .4-.2.7-.5.9-.5.3-1.2.4-1.8.2-3.4-1-5.8-3.4-6.8-6.8-.2-.6-.1-1.3.2-1.8Z" fill="currentColor"/></svg></span><small data-i18n="mnav.whatsapp">WhatsApp</small>
    </button>
  </nav>

  <div class="cart-overlay" id="cartOverlay"></div>
  <aside class="cart-drawer" id="cartDrawer" aria-hidden="true">
    <div class="cart-head">
      <span class="cart-title" data-i18n="cart.title">Your Cart</span>
      <button class="icon-btn close-cart" id="closeCart" aria-label="Close cart" data-i18n-aria="cart.close">×</button>
    </div>
    <div class="cart-items-wrap">
      <div class="cart-items" id="cartItems"></div>
      <div class="cart-empty" id="cartEmpty">
        <span class="cart-empty-icon">▢</span>
        <h3 data-i18n="cart.emptyTitle">Your cart is empty</h3>
        <p data-i18n="cart.emptyText">Add a fragrance you love and it will appear here.</p>
        <button class="secondary-btn" id="continueShopping" data-i18n="cart.continue">Continue shopping</button>
      </div>
    </div>
    <div class="cart-footer" id="cartFooter">
      <div class="cart-total-line">
        <span data-i18n="cart.total">Total</span>
        <strong id="cartTotal">0 EGP</strong>
      </div>
      <button class="checkout-btn" id="checkoutBtn" data-i18n="cart.checkout">Checkout via WhatsApp</button>
      <button class="clear-cart-btn" id="clearCartBtn" data-i18n="cart.clear">Clear cart</button>
    </div>
  </aside>

  <div class="toast" id="toast" role="status" aria-live="polite"></div>

  <script src="${back}i18n.js"><\/script>
  <script src="${back}app.js"><\/script>
</body>
</html>`;
}

/* Standalone product page body (products/<id>.html) */
function productShellBody(product, prevId, nextId) {
  const back = "../";
  return chromePage({
    back,
    bodyAttrs: `data-product-id="${esc(product.id)}"`,
    navCollection: `${back}collection.html`,
    navFeatured: `${back}featured.html`,
    breadcrumbsHtml: `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="${back}index.html" data-i18n="nav.home">Home</a>
        <span>/</span>
        <a href="${back}collection.html" data-i18n="nav.collection">Collection</a>
        <span>/</span>
        <span class="current">${esc(product.brand_name)}</span>
      </nav>`,
    mainHtml: `
      <div id="productPage" class="product-page"></div>

      <nav class="product-pager" aria-label="Pagination">
        <a href="./${prevId}.html"><span aria-hidden="true">‹</span> <span data-i18n="pager.prev">Previous fragrance</span></a>
        <a href="${back}collection.html" data-i18n="nav.collection">Collection</a>
        <a href="./${nextId}.html"><span data-i18n="pager.next">Next fragrance</span> <span aria-hidden="true">›</span></a>
      </nav>`
  });
}

/* Root list page bodies: collection.html (all products, with search/filters) and
   featured.html (every featured product). */
function listShellBody(mode) {
  const featuredList = mode === "featured";
  const eyebrowText = featuredList ? "CUSTOMER FAVORITES" : "THE COLLECTION";
  const titleText = featuredList ? "Most Requested" : "Our Collection";
  const eyebrowKey = featuredList ? "featured.eyebrow" : "coll.eyebrow";
  const titleKey = featuredList ? "featured.title" : "coll.title";
  const pageMode = featuredList ? "featured" : "collection";

  const shopTools = featuredList ? "" : `
        <div class="search-wrap">
          <span class="search-icon">⌕</span>
          <input id="searchInput" type="search" placeholder="Search your fragrance..." data-i18n-placeholder="coll.search" autocomplete="off">
          <button id="clearSearch" class="clear-search" aria-label="Clear search" data-i18n-aria="coll.clear">×</button>
        </div>

        <div class="filter-row" id="genderFilters" aria-label="Filter by gender">
          <button class="filter-chip active" data-gender="All" data-i18n="filter.all">All</button>
          <button class="filter-chip" data-gender="Men" data-i18n="filter.men">Men</button>
          <button class="filter-chip" data-gender="Women" data-i18n="filter.women">Women</button>
          <button class="filter-chip" data-gender="Unisex" data-i18n="filter.unisex">Unisex</button>
        </div>

        <div class="category-row" id="categoryFilters" aria-label="Filter by category">
          <button class="category-chip active" data-category="All" data-i18n="cat.all">All styles</button>
          <button class="category-chip" data-category="Elegant" data-i18n="cat.Elegant">Elegant</button>
          <button class="category-chip" data-category="Summer" data-i18n="cat.Summer">Summer</button>
          <button class="category-chip" data-category="Formal" data-i18n="cat.Formal">Formal</button>
          <button class="category-chip" data-category="Night" data-i18n="cat.Night">Night</button>
          <button class="category-chip" data-category="Attractive" data-i18n="cat.Attractive">Attractive</button>
          <button class="category-chip" data-category="Luxury" data-i18n="cat.Luxury">Luxury</button>
        </div>`;

  return chromePage({
    back: "",
    bodyAttrs: `data-page-mode="${pageMode}"`,
    navCollection: "collection.html",
    navFeatured: "featured.html",
    breadcrumbsHtml: `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="index.html" data-i18n="nav.home">Home</a>
        <span>/</span>
        <span class="current" data-i18n="${titleKey}">${titleText}</span>
      </nav>`,
    mainHtml: `
      <section class="list-page">
        <div class="list-page-head">
          <span class="eyebrow" data-i18n="${eyebrowKey}">${eyebrowText}</span>
          <h1 data-i18n="${titleKey}">${titleText}</h1>
          <span class="count-badge" id="resultCount"></span>
        </div>
        ${shopTools}
        <div id="products-container" class="products-grid"></div>

        <div id="emptyState" class="empty-state hidden">
          <div>⌕</div>
          <h3 data-i18n="coll.empty.title">No fragrance found</h3>
          <p data-i18n="coll.empty.text">Try another name, inspired fragrance, or filter.</p>
          <button class="secondary-btn" id="resetFilters" data-i18n="coll.empty.reset">Show all fragrances</button>
        </div>
      </section>`
  });
}

/* ---------- main ---------- */

/* ---------- validation & report ---------- */
const warnings = [];
const seen = new Set();
for (const product of data) {
  if (!product.id) { warnings.push("product without id"); continue; }
  if (seen.has(product.id)) { console.error(`✖ duplicate id: ${product.id}`); process.exitCode = 1; }
  seen.add(product.id);

  if (!product.brand_name) warnings.push(`${product.id}: missing brand_name`);
  if (!product.inspired_by) warnings.push(`${product.id}: missing inspired_by`);
  const sizes = product.sizes || {};
  if (["35ml", "55ml", "110ml"].some(s => sizes[s] == null || Number.isNaN(Number(sizes[s])))) {
    warnings.push(`${product.id}: sizes must be numbers for 35ml / 55ml / 110ml`);
  }
  const imgRefs = [product.image, ...(product.image_gallery || [])].filter(Boolean);
  const missing = imgRefs.filter(p => !fs.existsSync(path.join(ROOT, p)));
  if (missing.length) warnings.push(`${product.id}: image not found — ${missing.join(", ")}`);
}

if (process.exitCode) {
  console.error("\n✖ Aborting: fix the validation errors above, then rerun.");
  process.exit(1);
}

const visible = data
  .filter(isVisible)
  .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
const hiddenIds = data.filter(p => !isVisible(p)).map(p => p.id);

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

/* Remove pages whose product no longer exists or was hidden. */
const keepSet = new Set(visible.map(p => `${p.id}.html`));
const removedPages = fs.readdirSync(OUT_DIR)
  .filter(f => f.endsWith(".html") && !keepSet.has(f));
for (const f of removedPages) fs.unlinkSync(path.join(OUT_DIR, f));

const urls = [
  `${SITE_URL}/`,
  `${SITE_URL}/collection.html`,
  `${SITE_URL}/featured.html`
];

visible.forEach((product, index) => {
  const prev = visible[(index - 1 + visible.length) % visible.length];
  const next = visible[(index + 1) % visible.length];

  const page = headHTML(product) + productShellBody(product, prev.id, next.id);
  const file = path.join(OUT_DIR, `${product.id}.html`);
  fs.writeFileSync(file, page, "utf8");

  urls.push(`${SITE_URL}/products/${product.id}.html`);
  console.log(`✔ products/${product.id}.html`);
});

/* ---------- root list pages ---------- */
const listPages = [
  { mode: "collection", name: "collection.html" },
  { mode: "featured", name: "featured.html" }
];
for (const spec of listPages) {
  const page = listHeadHTML(spec.mode) + listShellBody(spec.mode);
  const file = path.join(ROOT, spec.name);
  fs.writeFileSync(file, page, "utf8");
  console.log(`✔ ${spec.name}`);
}

/* ---------- sitemap.xml ---------- */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>\n    <loc>${u}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${u === `${SITE_URL}/` ? "1.0" : "0.8"}</priority>\n  </url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap, "utf8");
console.log(`✔ sitemap.xml (${urls.length} URLs)`);

/* ---------- robots.txt (domain comes from SITE_CONFIG) ---------- */
const robots = `User-agent: *
Allow: /

# Let Google / Bing read the sitemap
Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(ROOT, "robots.txt"), robots, "utf8");
console.log(`✔ robots.txt (Sitemap: ${SITE_URL}/sitemap.xml)`);

/* ---------- summary ---------- */
console.log(`\nℹ ${visible.length} visible / ${data.length} total`);
if (hiddenIds.length) console.log(`⊘ hidden (page not generated): ${hiddenIds.join(", ")}`);
if (removedPages.length) console.log(`🗑 removed stale pages: ${removedPages.join(", ")}`);
if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} warning(s):`);
  warnings.forEach(w => console.log(`   - ${w}`));
} else {
  console.log("✔ no data warnings");
}