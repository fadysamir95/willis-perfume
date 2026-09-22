const BASE_PATH = window.BASE_PATH || "";
/* Product data source:
   - over http(s): the same-origin /api/products endpoint (Vercel function on
     the live site, tools/serve.js locally) so edits made from the online
     admin appear instantly; falls back to the local JSON if missing.
   - opened as file://: the local JSON directly. */
const LOCAL_DATA_URL = BASE_PATH + "website_data_willis_perfume_FINAL_WITH_PRICES.json";
const DATA_URL = (typeof location !== "undefined" && location.protocol === "file:")
  ? LOCAL_DATA_URL
  : BASE_PATH + "api/products";

/*
  WhatsApp number source of truth is site-config.js (window.SITE_CONFIG.whatsapp).
  If the config is ever missing, WhatsApp actions are disabled instead of
  opening broken wa.me links.
*/
const WHATSAPP_NUMBER = (window.SITE_CONFIG && window.SITE_CONFIG.whatsapp) || "";

const CART_STORAGE_KEY = "willis_cart_v1";

const PAGE_PRODUCT_ID = document.body?.dataset?.productId || "";
const PAGE_MODE = document.body?.dataset?.pageMode || ""; // "", "featured", "collection"

/* Homepage "Our Collection" preview: show this many, then link to collection.html */
const HOMEPAGE_PREVIEW_CAP = 8;

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const IMAGE_EXTENSIONS = ["webp", "png", "jpg", "jpeg"];

function getProductImageCandidates(product) {
  const id = String(product.id || "").trim().toLowerCase();
  const candidates = IMAGE_EXTENSIONS.map(ext => `images/${id}.${ext}`);

  if (product.image) {
    if (/^https?:/i.test(product.image)) {
      /* absolute URL (e.g. an image uploaded to Blob from the online admin)
         wins over the static candidates */
      candidates.unshift(product.image);
    } else if (!candidates.includes(product.image)) {
      candidates.push(product.image);
    }
  }

  candidates.push("images/bottle.webp");
  return [...new Set(candidates)];
}

function productImageTag(product, extraClass = "product-image") {
  const candidates = getProductImageCandidates(product);
  const first = candidates[0];

  return `
    <img
      class="${extraClass}"
      loading="lazy"
      src="${escapeHTML(first)}"
      data-image-candidates="${escapeHTML(JSON.stringify(candidates))}"
      data-image-index="0"
      alt="${escapeHTML(product.brand_name)} perfume"
      onerror="tryNextProductImage(this)"
    >
  `;
}

function tryNextProductImage(image) {
  try {
    const candidates = JSON.parse(image.dataset.imageCandidates || "[]");
    let index = Number(image.dataset.imageIndex || 0) + 1;

    if (index >= candidates.length) {
      image.onerror = null;
      return;
    }

    image.dataset.imageIndex = String(index);
    image.src = candidates[index];
  } catch (error) {
    image.onerror = null;
    image.src = "images/bottle.webp";
  }
}

/* ---------- Cart state ---------- */

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items)
      ? items.filter(item => item && item.id && item.size)
      : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

const state = {
  products: [],
  gender: "All",
  category: "All",
  search: "",
  selectedProduct: null,
  selectedSize: "35ml",
  selectedQty: 1,
  cart: loadCart()
};

/* ================================
   Shopping Cart
   ================================ */

function getDefaultSize(product) {
  const sizes = Object.keys(product.sizes || {});
  return sizes.includes("35ml") ? "35ml" : (sizes[0] || "35ml");
}

function productInData(productId) {
  return state.products.some(product => product.id === productId);
}

function getCartCount() {
  return state.cart.reduce((sum, item) => {
    if (!productInData(item.id)) return sum;
    return sum + (Number(item.qty) || 0);
  }, 0);
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => {
    const product = state.products.find(product => product.id === item.id);
    if (!product) return sum;
    const price = Number(product.sizes?.[item.size] || 0);
    return sum + price * (Number(item.qty) || 0);
  }, 0);
}

function findCartItem(productId, size) {
  return state.cart.find(item => item.id === productId && item.size === size);
}

function addToCart(product, size, qty = 1) {
  const existing = findCartItem(product.id, size);

  if (existing) {
    existing.qty = Math.min(99, existing.qty + qty);
  } else {
    state.cart.push({ id: product.id, size, qty });
  }

  saveCart();
  updateCartUI();
  renderCart();
  showToast(t("toast.added", {
    name: product.brand_name,
    size: size.replace("ml", " ML")
  }));

  const price = Number(product.sizes?.[size] || 0);
  analyticsEvent("AddToCart", "add_to_cart", {
    value: Number((price * qty).toFixed(2)),
    currency: "EGP",
    content_ids: [product.id],
    content_type: "product",
    items: [{
      item_id: product.id,
      item_name: product.brand_name,
      price,
      quantity: qty
    }]
  });

  openCartIfNeeded();
}

function changeCartQty(productId, size, delta) {
  const item = findCartItem(productId, size);
  if (!item) return;

  const next = (Number(item.qty) || 1) + delta;
  if (next < 1) {
    removeCartItem(productId, size);
    return;
  }

  item.qty = Math.min(99, next);
  saveCart();
  updateCartUI();
  renderCart();
}

function removeCartItem(productId, size) {
  state.cart = state.cart.filter(item => !(item.id === productId && item.size === size));
  saveCart();
  updateCartUI();
  renderCart();
}

function clearCart() {
  state.cart = [];
  saveCart();
  updateCartUI();
  renderCart();
}

function updateCartUI() {
  const count = getCartCount();

  ["desktopCartBadge", "mobileCartBadge"].forEach(id => {
    const badge = document.getElementById(id);
    if (!badge) return;
    badge.textContent = count;
    badge.style.display = count ? "grid" : "none";
  });
}

const CART_EMPTY_EL = document.getElementById("cartEmpty");
const CART_FOOTER_EL = document.getElementById("cartFooter");

function cartTotalEl() {
  return document.getElementById("cartTotal");
}

function renderCart() {
  const itemsEl = document.getElementById("cartItems");
  if (!itemsEl) return;
  const validItems = state.cart.filter(item => productInData(item.id));

  if (!validItems.length) {
    itemsEl.innerHTML = "";
    CART_EMPTY_EL?.classList.remove("hidden");
    CART_FOOTER_EL?.classList.add("hidden");
    if (cartTotalEl()) cartTotalEl().textContent = `0 ${isArabic() ? "ج.م" : "EGP"}`;
    return;
  }

  CART_EMPTY_EL?.classList.add("hidden");
  CART_FOOTER_EL?.classList.remove("hidden");

  itemsEl.innerHTML = validItems.map(item => {
    const product = state.products.find(product => product.id === item.id);
    const price = Number(product.sizes?.[item.size] || 0);
    const candidates = getProductImageCandidates(product);

    return `
      <div class="cart-item" data-product-id="${escapeHTML(item.id)}" data-size="${escapeHTML(item.size)}">
        <img class="cart-item-img" loading="lazy"
             src="${escapeHTML(candidates[0])}"
             data-image-candidates="${escapeHTML(JSON.stringify(candidates))}"
             data-image-index="0"
             alt="" onerror="tryNextProductImage(this)">
        <div class="cart-item-info">
          <strong class="cart-item-name">${escapeHTML(product.brand_name)}</strong>
          <span class="cart-item-meta">${escapeHTML(item.size.replace("ml", " ML"))} · ${t("cart.each", { price: Number(price).toLocaleString() })}</span>
          <div class="cart-item-controls">
            <button type="button" class="qty-btn" data-action="dec" aria-label="${t("cart.qtyDown")}">−</button>
            <span class="cart-qty">${escapeHTML(String(item.qty))}</span>
            <button type="button" class="qty-btn" data-action="inc" aria-label="${t("cart.qtyUp")}">+</button>
          </div>
        </div>
        <div class="cart-item-right">
          <button type="button" class="cart-item-remove" aria-label="${t("cart.remove")}">×</button>
          <strong class="cart-item-total">${Number(price * item.qty).toLocaleString()} ${isArabic() ? "ج.م" : "EGP"}</strong>
        </div>
      </div>
    `;
  }).join("");

  if (cartTotalEl()) cartTotalEl().textContent = `${Number(getCartTotal()).toLocaleString()} ${isArabic() ? "ج.م" : "EGP"}`;
}

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartCloseBtn = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");

function openCart() {
  renderCart();
  cartDrawer?.classList?.add("open");
  cartOverlay?.classList?.add("open");
  cartDrawer?.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
  trapFocus(cartDrawer);
}

function closeCart() {
  cartDrawer?.classList?.remove("open");
  cartOverlay?.classList?.remove("open");
  cartDrawer?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
  untrapFocus(cartDrawer);
}

/* Auto-open the cart after adding a product — but never fight an
   already-open drawer (just keep it open). */
function openCartIfNeeded() {
  if (!cartDrawer) return;
  if (!document.body.classList.contains("cart-open")) openCart();
}

/* ================================
   Focus management (accessibility)
   Overlays (product modal / cart drawer / side menu) trap the Tab key so
   keyboard users stay inside the dialog, and focus returns to the element
   that opened it when it closes. A small stack keeps nested overlays
   (e.g. modal -> auto-opened cart) working correctly.
   ================================ */

const trapStack = [];
let trapLastFocus = null;

function getFocusable(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter(el => el.getClientRects().length > 0);
}

function focusFirst(container) {
  const focusables = getFocusable(container);
  if (focusables.length) focusables[0].focus();
}

function handleTrapKeydown(event) {
  if (event.key !== "Tab" || !trapStack.length) return;
  const container = trapStack[trapStack.length - 1];
  const focusables = getFocusable(container);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (event.shiftKey) {
    if (active === first || !container.contains(active)) {
      event.preventDefault();
      last.focus();
    }
  } else if (active === last || !container.contains(active)) {
    event.preventDefault();
    first.focus();
  }
}

function trapFocus(container) {
  if (!container) return;
  if (!trapStack.length) {
    trapLastFocus = document.activeElement;
    document.addEventListener("keydown", handleTrapKeydown, true);
  }
  trapStack.push(container);
  focusFirst(container);
}

function untrapFocus(container) {
  const idx = trapStack.lastIndexOf(container);
  if (idx !== -1) trapStack.splice(idx, 1);
  if (!trapStack.length) {
    document.removeEventListener("keydown", handleTrapKeydown, true);
    if (trapLastFocus && typeof trapLastFocus.focus === "function") trapLastFocus.focus();
    trapLastFocus = null;
  } else {
    focusFirst(trapStack[trapStack.length - 1]);
  }
}

let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ================================
   WhatsApp order messages
   ================================ */

function currency() { return isArabic() ? "ج.م" : "EGP"; }

function waOrderFooter() {
  return `\n${t("wa.payment")}\n${t("wa.shipping")}\n\n${t("wa.name")}\n${t("wa.phone")}\n${t("wa.address")}`;
}

function quickOrderUrl(product) {
  if (!WHATSAPP_NUMBER) return "#";
  const size = getDefaultSize(product);
  const price = Number(product.sizes?.[size] || 0).toLocaleString();

  const message =
`${t("wa.header")}

${t("wa.odItem", { name: product.brand_name })}
${t("wa.odInspired", { name: product.inspired_by })}
${t("wa.odSize", { size: size.replace("ml", " ML") })}
${t("wa.odPrice", { price })}${waOrderFooter()}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function modalOrderMessage(product, size) {
  const price = Number(product.sizes?.[size] || 0).toLocaleString();

  return (
`${t("wa.header")}

${t("wa.odItem", { name: product.brand_name })}
${t("wa.odInspired", { name: product.inspired_by })}
${t("wa.odSize", { size: size.replace("ml", " ML") })}
${t("wa.odPrice", { price })}${waOrderFooter()}`
  );
}

function checkoutMessage() {
  const validItems = state.cart.filter(item => productInData(item.id));
  if (!validItems.length) return "";

  const lines = validItems.map((item, index) => {
    const product = state.products.find(product => product.id === item.id);
    const price = Number(product.sizes?.[item.size] || 0).toLocaleString();
    return t("wa.bullet", {
      name: product.brand_name,
      size: item.size.replace("ml", " ML"),
      qty: item.qty,
      price: Number(Number(product.sizes?.[item.size] || 0) * item.qty).toLocaleString()
    });
  });

  const count = getCartCount();
  const total = Number(getCartTotal()).toLocaleString();

  return (
`${t("wa.header")}

${t("wa.cart", { n: count, s: count === 1 ? "" : "s" })}
${lines.join("\n")}

${t("wa.total", { total })}${waOrderFooter()}`
  );
}

/* Same as openWhatsApp but WITHOUT a phone number — WhatsApp opens its
   recipient/contact picker so the user chooses whom to share the link with. */
function shareToWhatsApp(message) {
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function openWhatsApp(message) {
  if (!WHATSAPP_NUMBER) return; /* config missing — nothing to open */
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* ---------- Analytics (GA4 + Meta Pixel) ---------- */
function analyticsEvent(pixelEvent, ga4Event, params) {
  try { if (typeof fbq === "function") fbq("track", pixelEvent, params); } catch (e) { /* noop */ }
  try { if (typeof gtag === "function") gtag("event", ga4Event, params); } catch (e) { /* noop */ }
}

/* ---------- Product page URL + share / notify helpers ---------- */
function productPageUrl(product) {
  /* Runtime share/copy links must use the domain the site is actually open on
     (the Vercel preview now, the custom domain later). A hardcoded SITE_URL
     hands the recipient a link that doesn't resolve until the custom domain
     goes live. */
  const origin = (typeof location !== "undefined" && location.protocol !== "file:")
    ? location.origin
    : (window.SITE_URL || "");
  return origin + "/products/" + product.id + ".html";
}

function notifyMessage(product, size) {
  return `${t("wa.notifyMsg", {
    name: product.brand_name,
    size: (size || getDefaultSize(product)).replace("ml", " ML")
  })}\n\n${t("wa.name")}\n${t("wa.phone")}`;
}

function shareMessage(product) {
  const size = getDefaultSize(product);
  return `${t("wa.shareMsg", {
    name: product.brand_name,
    price: Number(product.sizes?.[size] || 0).toLocaleString(),
    currency: currency()
  })}${productPageUrl(product)}`;
}

function copyShareLink(product) {
  const url = productPageUrl(product);
  const done = () => showToast(t("toast.copied"));
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard.writeText(url).then(done, done);
      return;
    }
  } catch (e) { /* fall through to prompt */ }
  try {
    if (window.prompt) window.prompt(product.brand_name, url);
  } catch (e) { /* noop */ }
  done();
}

/* ---------- Related products ---------- */
function relatedProducts(product, limit = 4) {
  const others = state.products.filter(p => p.id !== product.id && isVisible(p));

  const score = p => {
    let s = 0;
    if (p.fragrance_family && p.fragrance_family === product.fragrance_family) s += 3;
    const sharedCat = (p.categories || []).filter(c => (product.categories || []).includes(c)).length;
    s += sharedCat * 2;
    if (p.inspired_by && p.inspired_by === product.inspired_by) s += 1;
    return s;
  };

  const sameGender = others
    .filter(p => p.gender === product.gender)
    .map(p => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s)
    .map(x => x.p);

  if (sameGender.length >= limit) return sameGender.slice(0, limit);

  const picked = new Set(sameGender.map(p => p.id));
  const rest = others
    .filter(p => !picked.has(p.id))
    .map(p => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s)
    .map(x => x.p);

  return [...sameGender, ...rest].slice(0, limit);
}

function relatedSectionHTML(product) {
  const related = relatedProducts(product);
  if (!related.length) return "";

  const cards = related.map(p => {
    const size = getDefaultSize(p);
    return `
      <button type="button" class="related-card" data-related-id="${escapeHTML(p.id)}" aria-label="${escapeHTML(p.brand_name)}">
        <img src="${escapeHTML(getProductImageCandidates(p)[0])}" alt="" loading="lazy">
        <strong>${escapeHTML(p.brand_name)}</strong>
        <span>${Number(p.sizes?.[size] || 0).toLocaleString()} ${currency()}</span>
      </button>
    `;
  }).join("");

  return `
    <div class="related-section">
      <h3 class="notes-title">${t("detail.related")}</h3>
      <div class="related-grid">${cards}</div>
    </div>
  `;
}

/* ================================
   Stock & gallery helpers
   ================================ */

function productStock(product) {
  const raw = product?.stock;
  const asNum = Number(raw);
  if (raw != null && String(raw).trim() !== "" && !Number.isNaN(asNum)) {
    if (asNum <= 0) return "out";
    if (asNum <= 3) return "low";
    return "in";
  }
  if (raw === "out" || raw === "low") return raw;
  return "in";
}

function isVisible(product) {
  return !!product && product.visible !== false;
}

function isAvailable(product) {
  return productStock(product) !== "out";
}

function stockChip(product) {
  const s = productStock(product);
  if (s === "in") return "";
  return `<span class="stock-chip ${s}">${t(`stock.${s}`)}</span>`;
}

function galleryImages(product) {
  const list = Array.isArray(product.image_gallery) && product.image_gallery.length
    ? product.image_gallery.slice()
    : [];
  return [...new Set([getProductImageCandidates(product)[0], ...list])];
}

/* ================================
   Product detail (shared by modal + product page)
   ================================ */

function buildProductDetail(product) {
  const notes = pt(product, "notes") || {};
  const profiles = (pt(product, "profile") || [])
    .map(item => `<span class="profile-chip">${escapeHTML(item)}</span>`)
    .join("");

  const sizeKeys = Object.keys(product.sizes || {});
  const sizeButtons = sizeKeys.map(size => `
    <button class="size-btn ${state.selectedSize === size ? "active" : ""}" data-size="${escapeHTML(size)}">
      <span>${escapeHTML(size.replace("ml", " ML"))}</span>
      <strong>${Number(product.sizes?.[size] || 0).toLocaleString()} ${currency()}</strong>
    </button>
  `).join("");

  const galleries = galleryImages(product);
  const galleryBtn = galleries.length > 1
    ? `<button type="button" class="gallery-btn" data-gallery-index="0">${t("modal.morePhotos")} (${galleries.length})</button>`
    : "";

  const available = isAvailable(product);
  const actions = available ? `
    <div class="qty-row">
      <span>${t("modal.quantity")}</span>
      <div class="qty-stepper">
        <button type="button" class="qty-btn" data-qty-delta="-1" aria-label="${t("cart.qtyDown")}">−</button>
        <span class="qty-value">${state.selectedQty}</span>
        <button type="button" class="qty-btn" data-qty-delta="1" aria-label="${t("cart.qtyUp")}">+</button>
      </div>
    </div>

    <button class="add-cart-btn" id="addToCartBtn">
      <span>+</span> ${t("modal.addToCart", { price: Number(product.sizes?.[state.selectedSize] || 0).toLocaleString() })}
    </button>

    <button class="whatsapp-btn" id="orderWhatsApp">
      <span>◔</span> ${t("modal.orderWa")}
    </button>
  ` : `
    <p class="out-note">${t("stock.out")}</p>
    <button class="notify-btn" id="notifyBtn"
            data-product-id="${escapeHTML(product.id)}"
            data-size="${escapeHTML(state.selectedSize)}">
      ${t("detail.notify")}
    </button>
  `;

  return `
    <div class="detail-image">
      ${productImageTag(product, "detail-product-image")}
      ${stockChip(product)}
      ${galleryBtn}
    </div>

    <span class="detail-gender">${gt(product.gender)}</span>
    <h2 class="detail-title">${escapeHTML(product.brand_name)}</h2>
    <p class="detail-inspired">${t("modal.inspired")} <strong>${escapeHTML(product.inspired_by)}</strong></p>
    <div class="detail-profile">${profiles}</div>
    <p class="detail-description">${escapeHTML(pt(product, "description"))}</p>

    <div class="family-box">
      <span>${t("modal.family")}</span>
      <strong>${escapeHTML(pt(product, "family"))}</strong>
    </div>

    <h3 class="notes-title">${t("modal.notes")}</h3>
    <div class="notes-grid">
      ${renderNoteCard(t("modal.notesTop"), notes.top)}
      ${renderNoteCard(t("modal.notesHeart"), notes.heart)}
      ${renderNoteCard(t("modal.notesBase"), notes.base)}
    </div>

    ${available ? `<h3 class="size-title">${t("modal.chooseSize")}</h3>
    <div class="size-grid">${sizeButtons}</div>` : ""}

    ${actions}

    <div class="share-row">
      <span>${t("detail.share")}</span>
      <button type="button" class="share-btn" id="shareWhatsApp" data-product-id="${escapeHTML(product.id)}" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.72.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.71.97.99-3.62-.24-.37a9.77 9.77 0 1 1 8.34 4.6zM12 2a10 10 0 0 0-8.55 15.22L2 22l4.92-1.29A10 10 0 1 0 12 2z"/>
        </svg>
      </button>
      <button type="button" class="share-btn" id="copyLink" data-product-id="${escapeHTML(product.id)}" aria-label="${t("detail.share")}">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </button>
    </div>

    ${relatedSectionHTML(product)}
  `;
}

function renderNoteCard(title, values) {
  const safeValues = Array.isArray(values) ? values : [];
  return `
    <div class="note-card">
      <span>${title}</span>
      <p>${safeValues.length ? safeValues.map(escapeHTML).join("<br>") : t("modal.notListed")}</p>
    </div>
  `;
}

function attachProductDetail(rootEl, product) {
  rootEl.querySelectorAll(".size-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.selectedSize = btn.dataset.size;
      state.selectedProduct = product;
      renderActiveDetail();
    });
  });

  rootEl.querySelectorAll("[data-qty-delta]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.selectedProduct = product;
      state.selectedQty = Math.min(99, Math.max(1, state.selectedQty + Number(btn.dataset.qtyDelta)));
      renderActiveDetail();
    });
  });

  rootEl.querySelectorAll(".gallery-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const images = galleryImages(product);
      const img = rootEl.querySelector(".detail-product-image");
      if (!img) return;
      const next = (Number(btn.dataset.galleryIndex || 0) + 1) % images.length;
      btn.dataset.galleryIndex = String(next);
      img.src = images[next];
      img.dataset.imageIndex = "0";
    });
  });

  rootEl.querySelectorAll(".related-card").forEach(btn => {
    btn.addEventListener("click", () => {
      const related = state.products.find(p => p.id === btn.dataset.relatedId);
      if (!related) return;
      if (PAGE_PRODUCT_ID) {
        window.location.href = BASE_PATH + "products/" + related.id + ".html";
      } else {
        openProductModal(related);
      }
    });
  });
}

const detailRoot = () =>
  PAGE_PRODUCT_ID
    ? document.getElementById("productPage")
    : document.getElementById("modalContent");

function renderActiveDetail() {
  if (!state.selectedProduct) return;
  const root = detailRoot();
  if (!root) return;
  root.innerHTML = buildProductDetail(state.selectedProduct);
  attachProductDetail(root, state.selectedProduct);
}

/* ================================
   Shop: product cards & filtering
   ================================ */

function filteredProducts() {
  const query = state.search.trim().toLowerCase();

  return state.products
    .filter(product => {
      if (!isVisible(product)) return false;

      const matchesGender = state.gender === "All" || product.gender === state.gender;
      const matchesCategory =
        state.category === "All" || (product.categories || []).includes(state.category);

      const haystack = [
        product.brand_name,
        product.inspired_by,
        product.gender,
        ...(product.categories || []),
        ...(product.short_profile || []),
        ...Object.values(product.notes || {}).flat()
      ].join(" ").toLowerCase();

      return matchesGender && matchesCategory && (!query || haystack.includes(query));
    })
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

function productCardHTML(product) {
  const size = getDefaultSize(product);
  const price = Number(product.sizes?.[size] || 0).toLocaleString();
  const available = isAvailable(product);

  return `
        <article class="product-card" data-product-id="${escapeHTML(product.id)}" role="group" aria-label="${escapeHTML(product.brand_name)}">
          <div class="product-image-wrap">
            <span class="product-gender">${gt(product.gender)}</span>
            ${stockChip(product)}
            ${productImageTag(product)}
            ${available ? `
              <a class="quick-order-btn" href="${escapeHTML(quickOrderUrl(product))}"
                 target="_blank" rel="noopener" aria-label="${t("modal.orderWa")}"
                 title="${t("modal.orderWa")}">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
                  <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.72.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.71.97.99-3.62-.24-.37a9.77 9.77 0 1 1 8.34 4.6zM12 2a10 10 0 0 0-8.55 15.22L2 22l4.92-1.29A10 10 0 1 0 12 2z"/>
                </svg>
              </a>` : ""}
          </div>

          <div class="product-body">
            <h3 class="product-name">${escapeHTML(product.brand_name)}</h3>
            <p class="inspired">${t("modal.inspired")} <strong>${escapeHTML(product.inspired_by)}</strong></p>

            <div class="card-actions">
              <button class="view-details" type="button">${t("card.details")}</button>
              ${available
                ? `<button class="add-to-cart" type="button" data-size="${size}">
                     <span>+</span> ${t("card.addToCart")} — ${price} ${currency()}
                   </button>`
                : `<button class="add-to-cart" type="button" disabled>${t("stock.out")}</button>`}
            </div>
          </div>
        </article>
      `;
}

function renderProducts() {
  const productsContainer = document.getElementById("products-container");
  if (!productsContainer) return;

  const allProducts = filteredProducts();

  const countEl = document.getElementById("resultCount");
  if (countEl) countEl.textContent = t("coll.count", { n: allProducts.length });

  /* Homepage preview: show a curated grid, then a "view all" link to collection.html.
     Filtering (search / gender / category) shows every matching product instead. */
  const filtering = state.search.trim() || state.gender !== "All" || state.category !== "All";
  const viewAllWrap = document.getElementById("viewAllWrap");

  let products = allProducts;
  if (viewAllWrap && !filtering && allProducts.length > HOMEPAGE_PREVIEW_CAP) {
    products = allProducts.slice(0, HOMEPAGE_PREVIEW_CAP);
    viewAllWrap.classList.remove("hidden");
  } else if (viewAllWrap) {
    viewAllWrap.classList.add("hidden");
  }

  const emptyState = document.getElementById("emptyState");

  if (!products.length) {
    productsContainer.innerHTML = "";
    emptyState?.classList.remove("hidden");
  } else {
    emptyState?.classList.add("hidden");
    productsContainer.innerHTML = products.map(productCardHTML).join("");
  }
}

/* "Most requested" — visible + featured products only, sorted by manual order. */
function featuredProducts(limit = HOMEPAGE_PREVIEW_CAP) {
  return state.products
    .filter(p => p.visible !== false && p.featured === true)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .slice(0, limit);
}

function renderFeatured() {
  const section = document.getElementById("featured");
  const grid = document.getElementById("featuredGrid");
  if (!section || !grid) return;
  const items = featuredProducts();
  if (!items.length) {
    section.classList.add("hidden");
    return;
  }
  section.classList.remove("hidden");
  grid.innerHTML = items.map(productCardHTML).join("");
}

/* featured.html — a full page listing every featured product. */
function renderFeaturedPage() {
  const container = document.getElementById("products-container");
  if (!container) return;
  const items = featuredProducts(Infinity);

  const countEl = document.getElementById("resultCount");
  if (countEl) countEl.textContent = t("coll.count", { n: items.length });

  const emptyState = document.getElementById("emptyState");
  if (!items.length) {
    container.innerHTML = "";
    emptyState?.classList.remove("hidden");
  } else {
    emptyState?.classList.add("hidden");
    container.innerHTML = items.map(productCardHTML).join("");
  }
}

function resetFilters() {
  state.gender = "All";
  state.category = "All";
  state.search = "";

  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";

  document.querySelectorAll("#genderFilters .filter-chip").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.gender === "All");
  });

  document.querySelectorAll("#categoryFilters .category-chip").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === "All");
  });

  renderProducts();
}

/* ================================
   Product modal
   ================================ */

const productModal = document.getElementById("productModal");
const modalContentEl = document.getElementById("modalContent");
const modalCloseBtn = document.getElementById("modalClose");
const modalBackdrop = document.getElementById("modalBackdrop");

function openProductModal(product) {
  if (!productModal || !modalContentEl) return;
  state.selectedProduct = product;
  state.selectedSize = getDefaultSize(product);
  state.selectedQty = 1;
  modalContentEl.innerHTML = buildProductDetail(product);
  attachProductDetail(modalContentEl, product);
  productModal.classList.add("open");
  modalBackdrop?.classList.add("open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  trapFocus(productModal);
}

function closeProductModal() {
  if (!productModal) return;
  productModal.classList.remove("open");
  modalBackdrop?.classList.remove("open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  state.selectedProduct = null;
  untrapFocus(productModal);
}

/* ================================
   Product page (standalone pages)
   ================================ */

function renderPageProduct() {
  const pageEl = document.getElementById("productPage");
  if (!pageEl || !PAGE_PRODUCT_ID) return;

  const product = state.products.find(p => p.id === PAGE_PRODUCT_ID);
  if (!product) {
    pageEl.innerHTML = `
      <div class="not-found">
        <h2>404</h2>
        <p>${t("coll.empty.title")}</p>
        <a class="card-btn" href="index.html">${t("coll.empty.reset")}</a>
      </div>
    `;
    return;
  }

  state.selectedProduct = product;
  state.selectedSize = getDefaultSize(product);
  state.selectedQty = 1;

  pageEl.dataset.rendered = "1";
  pageEl.innerHTML = buildProductDetail(product);
  attachProductDetail(pageEl, product);
}

/* ================================
   Wiring & init
   ================================ */

function initHeroMotion() {
  const hero = document.querySelector(".hero");
  const bottle = document.querySelector(".hero-bottle");
  if (!hero || !bottle || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let frame = null;

  const move = (x, y) => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const px = (x - rect.left) / rect.width - 0.5;
      const py = (y - rect.top) / rect.height - 0.5;
      bottle.style.setProperty("--parallax-x", `${px * 7}px`);
      bottle.style.setProperty("--parallax-y", `${py * 4}px`);
    });
  };

  hero.addEventListener("pointermove", event => {
    if (event.pointerType === "touch") return;
    move(event.clientX, event.clientY);
  }, { passive: true });

  hero.addEventListener("pointerleave", () => {
    bottle.style.setProperty("--parallax-x", "0px");
    bottle.style.setProperty("--parallax-y", "0px");
  }, { passive: true });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;

    link.addEventListener("click", event => {
      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", window.location.pathname + window.location.search);

      if (link.closest(".side-menu")) closeSideMenu();
    });
  });
}

/* Cross-page hash links (e.g. contact -> index.html#story) can land in the
   wrong spot: the Most Requested section starts hidden and is injected after
   the products fetch, which pushes every section below it down. Once the page
   is fully rendered, snap to the real target. */
function realignToHash() {
  if (typeof window === "undefined" || !window.location || !window.location.hash) return;
  const target = document.getElementById(window.location.hash.slice(1));
  if (!target || typeof target.scrollIntoView !== "function") return;
  target.scrollIntoView({ block: "start", behavior: "instant" });
}

/* Highlight the nav item that matches where you are:
   - generated pages -> fixed active item per page mode / product page
   - homepage -> scroll-spy over the section anchors (#home, #featured, #collection, #story) */
function initNavSpy() {
  const links = [...document.querySelectorAll(".desktop-nav a, .side-menu nav a")];
  const mark = key => links.forEach(a => a.classList.toggle("active", a.dataset.i18n === key));

  const bodyDataset = document.body ? document.body.dataset : {};
  if (bodyDataset.pageMode) {
    if (bodyDataset.pageMode === "featured") return mark("nav.featured");
    if (bodyDataset.pageMode === "collection") return mark("nav.collection");
    if (bodyDataset.pageMode === "contact") return mark("nav.contact");
    return;
  }
  if (bodyDataset.productId) return mark("nav.collection");

  const sections = ["home", "featured", "collection", "story"]
    .map(id => document.getElementById(id))
    .filter(sec => sec && typeof sec.getBoundingClientRect === "function");
  if (!sections.length) return;

  const keys = { home: "nav.home", featured: "nav.featured", collection: "nav.collection", story: "nav.about" };
  const spy = () => {
    const probe = (window.scrollY || 0) + (window.innerHeight || 0) * 0.35;
    let current = sections[0];
    for (const sec of sections) {
      const top = sec.getBoundingClientRect().top + (window.scrollY || 0);
      if (top <= probe) current = sec;
    }
    mark(keys[current.id]);
  };
  if (typeof window.addEventListener === "function") {
    window.addEventListener("scroll", spy, { passive: true });
  }
  spy();
}

function initFilters() {
  document.querySelectorAll("#genderFilters .filter-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      state.gender = btn.dataset.gender;
      document.querySelectorAll("#genderFilters .filter-chip").forEach(b => {
        b.classList.toggle("active", b === btn);
      });
      renderProducts();
    });
  });

  document.querySelectorAll("#categoryFilters .category-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.category;
      document.querySelectorAll("#categoryFilters .category-chip").forEach(b => {
        b.classList.toggle("active", b === btn);
      });
      renderProducts();
    });
  });

  const searchInput = document.getElementById("searchInput");
  const clearSearch = document.getElementById("clearSearch");

  if (searchInput && clearSearch) {
    searchInput.addEventListener("input", event => {
      state.search = event.target.value;
      clearSearch.style.display = state.search ? "block" : "none";
      renderProducts();
    });

    clearSearch.addEventListener("click", () => {
      searchInput.value = "";
      state.search = "";
      clearSearch.style.display = "none";
      searchInput.focus();
      renderProducts();
    });

    if (!state.search) clearSearch.style.display = "none";
  }

  document.getElementById("resetFilters")?.addEventListener("click", resetFilters);
}

function handleCardClick(event) {
  const details = event.target.closest(".view-details");
  if (details) {
    const card = details.closest(".product-card");
    const product = card && state.products.find(p => p.id === card.dataset.productId);
    if (product) openProductModal(product);
    return;
  }

  const addButton = event.target.closest(".add-to-cart");
  if (addButton && !addButton.disabled) {
    const card = addButton.closest(".product-card");
    const product = card && state.products.find(p => p.id === card.dataset.productId);
    if (product) {
      addToCart(product, addButton.dataset.size || getDefaultSize(product));
    }
    return;
  }

  const quickBtn = event.target.closest(".quick-order-btn");
  if (quickBtn) {
    const card = quickBtn.closest(".product-card");
    const product = card && state.products.find(p => p.id === card.dataset.productId);
    if (product) {
      const price = Number(product.sizes?.[getDefaultSize(product)] || 0);
      analyticsEvent("InitiateCheckout", "begin_checkout", {
        value: price,
        currency: "EGP",
        content_ids: [product.id],
        content_type: "product",
        items: [{
          item_id: product.id,
          item_name: product.brand_name,
          price,
          quantity: 1
        }]
      });
    }
    return;
  }
}

function initCards() {
  const container = document.getElementById("products-container");
  if (container) container.addEventListener("click", handleCardClick);

  const featuredGrid = document.getElementById("featuredGrid");
  if (featuredGrid) featuredGrid.addEventListener("click", handleCardClick);
}

function initMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const closeMenu = document.getElementById("closeMenu");
  const sideMenu = document.getElementById("sideMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  if (!menuBtn || !sideMenu) return;

  menuBtn.addEventListener("click", () => {
    sideMenu.classList.add("open");
    menuOverlay?.classList.add("open");
    sideMenu.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    trapFocus(sideMenu);
  });

  const close = () => {
    sideMenu.classList.remove("open");
    menuOverlay?.classList.remove("open");
    sideMenu.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    untrapFocus(sideMenu);
  };

  closeMenu?.addEventListener("click", close);
  menuOverlay?.addEventListener("click", close);

  sideMenu.querySelectorAll("[data-gender]").forEach(button => {
    button.addEventListener("click", () => {
      state.gender = button.dataset.gender;
      document.querySelectorAll("#genderFilters .filter-chip").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.gender === state.gender);
      });
      renderProducts();
      close();
      const collection = document.getElementById("collection");
      if (collection) collection.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    });
  });
}

function initCartEvents() {
  document.getElementById("desktopCartBtn")?.addEventListener("click", openCart);
  document.getElementById("cartNav")?.addEventListener("click", openCart);
  cartCloseBtn?.addEventListener("click", closeCart);
  cartOverlay?.addEventListener("click", closeCart);
  document.getElementById("continueShopping")?.addEventListener("click", closeCart);

  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    const message = checkoutMessage();
    if (message) {
      const items = state.cart
        .filter(item => productInData(item.id))
        .map(item => {
          const product = state.products.find(x => x.id === item.id);
          return {
            item_id: item.id,
            item_name: product ? product.brand_name : item.id,
            price: Number(product?.sizes?.[item.size] || 0),
            quantity: item.qty
          };
        });

      analyticsEvent("Purchase", "purchase", {
        value: getCartTotal(),
        currency: "EGP",
        content_type: "product",
        items
      });

      openWhatsApp(message);
    }
  });

  document.getElementById("clearCartBtn")?.addEventListener("click", () => {
    clearCart();
    showToast(t("toast.cleared"));
  });

  cartItemsEl?.addEventListener("click", event => {
    const row = event.target.closest(".cart-item");
    if (!row) return;

    const productId = row.dataset.productId;
    const size = row.dataset.size;

    if (event.target.closest('[data-action="inc"]')) {
      changeCartQty(productId, size, 1);
    } else if (event.target.closest('[data-action="dec"]')) {
      changeCartQty(productId, size, -1);
    } else if (event.target.closest(".cart-item-remove")) {
      removeCartItem(productId, size);
    }
  });
}

function generalWhatsAppUrl() {
  if (!WHATSAPP_NUMBER) return "#";
  const message = `${t("wa.header")}\n\n${t("wa.name")}\n${t("wa.phone")}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function initWhatsAppButtons() {
  const openGeneral = () => {
    const url = generalWhatsAppUrl();
    if (url && url !== "#") window.open(url, "_blank", "noopener,noreferrer");
  };

  document.getElementById("whatsappNav")?.addEventListener("click", openGeneral);
  document.getElementById("desktopWhatsApp")?.addEventListener("click", openGeneral);
  document.getElementById("menuWhatsApp")?.addEventListener("click", event => {
    event.preventDefault();
    openGeneral();
  });
}

/* Modal add-to-cart / order buttons (rendered dynamically inside buildProductDetail) */
document.addEventListener("click", event => {
  const addBtn = event.target.closest("#addToCartBtn");
  if (addBtn && state.selectedProduct) {
    addToCart(state.selectedProduct, state.selectedSize, state.selectedQty);
    if (productModal && productModal.classList.contains("open")) closeProductModal();
    return;
  }

  const waBtn = event.target.closest("#orderWhatsApp");
  if (waBtn && state.selectedProduct) {
    openWhatsApp(modalOrderMessage(state.selectedProduct, state.selectedSize));
    return;
  }

  const notifyBtn = event.target.closest("#notifyBtn");
  if (notifyBtn) {
    const product = state.products.find(p => p.id === notifyBtn.dataset.productId);
    if (product) {
      openWhatsApp(notifyMessage(product, notifyBtn.dataset.size || getDefaultSize(product)));
    }
    return;
  }

  const shareWa = event.target.closest("#shareWhatsApp");
  if (shareWa) {
    const product = state.products.find(p => p.id === shareWa.dataset.productId);
    if (product) shareToWhatsApp(shareMessage(product));
    return;
  }

  const copyBtn = event.target.closest("#copyLink");
  if (copyBtn) {
    const product = state.products.find(p => p.id === copyBtn.dataset.productId);
    if (product) copyShareLink(product);
  }
});

modalCloseBtn?.addEventListener("click", closeProductModal);
modalBackdrop?.addEventListener("click", closeProductModal);

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;

  closeProductModal();
  closeCart();

  const sideMenu = document.getElementById("sideMenu");
  if (sideMenu?.classList.contains("open")) {
    sideMenu.classList.remove("open");
    document.getElementById("menuOverlay")?.classList.remove("open");
    sideMenu.setAttribute("aria-hidden", "true");
    document.getElementById("menuBtn")?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    untrapFocus(sideMenu);
  }
});

/* Re-render everything when the user switches language */
document.addEventListener("langchange", () => {
  if (document.getElementById("products-container")) renderProducts();
  renderFeatured();

  renderCart();
  updateCartUI();

  if (productModal?.classList.contains("open") && state.selectedProduct) {
    openProductModal(state.selectedProduct);
  }

  const pageEl = document.getElementById("productPage");
  if (pageEl && pageEl.dataset.rendered) renderPageProduct();
});

async function loadProducts() {
  const container = document.getElementById("products-container");
  const countEl = document.getElementById("resultCount");

  try {
    let response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok && DATA_URL !== LOCAL_DATA_URL) {
      /* online API missing (e.g. plain static hosting) -> use the local JSON */
      response = await fetch(LOCAL_DATA_URL, { cache: "no-store" });
    }

    if (!response.ok) {
      throw new Error(`Could not load product data (${response.status})`);
    }

    state.products = await response.json();
    state.products.forEach((p, i) => { if (p.order == null) p.order = i + 1; });
    console.log(`Willi's Perfume: ${state.products.length} products loaded.`);

    if (PAGE_PRODUCT_ID) {
      renderPageProduct();
    } else {
      if (PAGE_MODE === "featured") renderFeaturedPage();
      else renderProducts();
      renderFeatured();
    }

    renderCart();
    updateCartUI();
    realignToHash();
  } catch (error) {
    console.error(error);
    if (countEl) countEl.textContent = "Data error";
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <div>!</div>
          <h3>${t("coll.empty.title")}</h3>
          <p>${t("coll.empty.text")}</p>
        </div>
      `;
    }
  }
}

initFilters();
initCards();
initMenu();
initCartEvents();
initWhatsAppButtons();
initHeroMotion();
initSmoothAnchors();
initNavSpy();

updateCartUI();
renderCart();

loadProducts();