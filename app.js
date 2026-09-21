const DATA_URL = "website_data_willis_perfume_FINAL_WITH_PRICES.json";

/*
  IMPORTANT:
  Replace this with Willi's real WhatsApp number in international format.
  Egypt example format: 2010XXXXXXXX
*/
const WHATSAPP_NUMBER = "201272566695";

const CART_STORAGE_KEY = "willis_cart_v1";

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

const productsContainer = document.getElementById("products-container");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const resetFilters = document.getElementById("resetFilters");

const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");

const productModal = document.getElementById("productModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartCloseBtn = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");

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

  if (product.image && !candidates.includes(product.image)) {
    candidates.push(product.image);
  }

  candidates.push("images/bottle.png");
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
    image.src = "images/bottle.png";
  }
}

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
  showToast(`${product.brand_name} (${size.replace("ml", " ML")}) added to cart`);
}

function changeCartQty(productId, size, delta) {
  const item = findCartItem(productId, size);
  if (!item) return;

  item.qty = Math.min(99, Math.max(1, (Number(item.qty) || 1) + delta));
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

function renderCart() {
  const validItems = state.cart.filter(item => productInData(item.id));

  if (!validItems.length) {
    cartItemsEl.innerHTML = "";
    document.getElementById("cartEmpty").classList.remove("hidden");
    document.getElementById("cartFooter").classList.add("hidden");
    document.getElementById("cartTotal").textContent = "0 EGP";
    return;
  }

  document.getElementById("cartEmpty").classList.add("hidden");
  document.getElementById("cartFooter").classList.remove("hidden");

  cartItemsEl.innerHTML = validItems.map(item => {
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
          <span class="cart-item-meta">${escapeHTML(item.size.replace("ml", " ML"))} · ${Number(price).toLocaleString()} EGP each</span>
          <div class="cart-item-controls">
            <button type="button" class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>
            <span class="cart-qty">${escapeHTML(String(item.qty))}</span>
            <button type="button" class="qty-btn" data-action="inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-item-right">
          <button type="button" class="cart-item-remove" aria-label="Remove item">×</button>
          <strong class="cart-item-total">${Number(price * item.qty).toLocaleString()} EGP</strong>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("cartTotal").textContent = `${Number(getCartTotal()).toLocaleString()} EGP`;
}

function openCart() {
  renderCart();
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("cart-open");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cart-open");
}

function checkoutCart() {
  const validItems = state.cart.filter(item => productInData(item.id));
  if (!validItems.length) return;

  const lines = validItems.map((item, index) => {
    const product = state.products.find(product => product.id === item.id);
    const price = Number(product.sizes?.[item.size] || 0);
    return `${index + 1}. ${product.brand_name} — ${item.size.replace("ml", " ML")} × ${item.qty} = ${Number(price * item.qty).toLocaleString()} EGP`;
  });

  const count = getCartCount();
  const total = Number(getCartTotal()).toLocaleString();

  const message =
`Hi, I would like to order:

🛍 My Cart (${count} item${count === 1 ? "" : "s"}):
${lines.join("\n")}

Total: ${total} EGP

Name:
Phone:
Address (optional):`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
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

      bottle.style.translate = `${px * 8}px ${py * 5}px`;
      bottle.style.rotate = `${px * 0.8}deg`;
    });
  };

  hero.addEventListener("pointermove", event => move(event.clientX, event.clientY), { passive: true });

  hero.addEventListener("pointerleave", () => {
    bottle.style.translate = "";
    bottle.style.rotate = "";
  }, { passive: true });
}

function getFilteredProducts() {
  const q = state.search.trim().toLowerCase();

  return state.products.filter(product => {
    const matchesGender = state.gender === "All" || product.gender === state.gender;
    const matchesCategory =
      state.category === "All" ||
      (Array.isArray(product.categories) && product.categories.includes(state.category));

    const searchable = [
      product.brand_name,
      product.inspired_by,
      product.gender,
      product.fragrance_family,
      product.short_profile?.join(" "),
      product.categories?.join(" ")
    ].join(" ").toLowerCase();

    return matchesGender && matchesCategory && (!q || searchable.includes(q));
  });
}

function renderProducts() {
  const products = getFilteredProducts();
  resultCount.textContent = `${products.length} fragrance${products.length === 1 ? "" : "s"}`;

  if (!products.length) {
    productsContainer.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  productsContainer.innerHTML = products.map(product => {
    const profiles = (product.short_profile || []).slice(0, 3)
      .map(item => `<span class="profile-chip">${escapeHTML(item)}</span>`)
      .join("");

    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <span class="product-gender">${escapeHTML(product.gender)}</span>
          ${productImageTag(product)}
        </div>

        <div class="product-body">
          <h3 class="product-name">${escapeHTML(product.brand_name)}</h3>
          <p class="inspired">Inspired by <strong>${escapeHTML(product.inspired_by)}</strong></p>
          <div class="profile-row">${profiles}</div>

          <div class="price-line">
            <span>From</span>
            <strong>${Number(product.sizes?.["35ml"] || 0).toLocaleString()} EGP</strong>
          </div>

          <div class="card-actions">
            <button class="view-details" data-product-id="${escapeHTML(product.id)}">
              Details
            </button>
            <button class="add-to-cart" data-product-id="${escapeHTML(product.id)}">
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function setGender(gender) {
  state.gender = gender;
  document.querySelectorAll("#genderFilters .filter-chip").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.gender === gender);
  });
  renderProducts();
}

function setCategory(category) {
  state.category = category;
  document.querySelectorAll("#categoryFilters .category-chip").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });
  renderProducts();
}

function openProduct(productId) {
  const product = state.products.find(item => item.id === productId);
  if (!product) return;

  state.selectedProduct = product;
  state.selectedSize = "35ml";
  state.selectedQty = 1;
  renderProductModal();

  productModal.classList.add("open");
  modalBackdrop.classList.add("open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProduct() {
  productModal.classList.remove("open");
  modalBackdrop.classList.remove("open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function renderProductModal() {
  const product = state.selectedProduct;
  if (!product) return;

  const notes = product.notes || {};
  const profiles = (product.short_profile || [])
    .map(item => `<span class="profile-chip">${escapeHTML(item)}</span>`)
    .join("");

  const sizeButtons = ["35ml", "55ml", "110ml"].map(size => `
    <button class="size-btn ${state.selectedSize === size ? "active" : ""}" data-size="${size}">
      <span>${size.replace("ml", " ML")}</span>
      <strong>${Number(product.sizes?.[size] || 0).toLocaleString()} EGP</strong>
    </button>
  `).join("");

  modalContent.innerHTML = `
    <div class="detail-image">
      ${productImageTag(product, "detail-product-image")}
    </div>

    <span class="detail-gender">${escapeHTML(product.gender)}</span>
    <h2 class="detail-title">${escapeHTML(product.brand_name)}</h2>
    <p class="detail-inspired">Inspired by ${escapeHTML(product.inspired_by)}</p>
    <div class="detail-profile">${profiles}</div>
    <p class="detail-description">${escapeHTML(product.description)}</p>

    <div class="family-box">
      <span>Fragrance Family</span>
      <strong>${escapeHTML(product.fragrance_family)}</strong>
    </div>

    <h3 class="notes-title">Fragrance Notes</h3>
    <div class="notes-grid">
      ${renderNoteCard("Top Notes", notes.top)}
      ${renderNoteCard("Heart Notes", notes.heart)}
      ${renderNoteCard("Base Notes", notes.base)}
    </div>

    <h3 class="size-title">Choose Size</h3>
    <div class="size-grid">${sizeButtons}</div>

    <div class="qty-row">
      <span>Quantity</span>
      <div class="qty-stepper">
        <button type="button" class="qty-btn" data-qty-delta="-1" aria-label="Decrease quantity">−</button>
        <span class="qty-value">${state.selectedQty}</span>
        <button type="button" class="qty-btn" data-qty-delta="1" aria-label="Increase quantity">+</button>
      </div>
    </div>

    <button class="add-cart-btn" id="addToCartBtn">
      <span>+</span> Add to Cart — ${Number(product.sizes?.[state.selectedSize] || 0).toLocaleString()} EGP
    </button>

    <button class="whatsapp-btn" id="orderWhatsApp">
      <span>◔</span> Order on WhatsApp
    </button>
  `;

  modalContent.querySelectorAll(".size-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.selectedSize = btn.dataset.size;
      renderProductModal();
    });
  });

  modalContent.querySelectorAll("[data-qty-delta]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.selectedQty = Math.min(99, Math.max(1, state.selectedQty + Number(btn.dataset.qtyDelta)));
      renderProductModal();
    });
  });

  document.getElementById("addToCartBtn")?.addEventListener("click", () => {
    addToCart(state.selectedProduct, state.selectedSize, state.selectedQty);
  });

  document.getElementById("orderWhatsApp")?.addEventListener("click", orderOnWhatsApp);
}

function renderNoteCard(title, values) {
  const safeValues = Array.isArray(values) ? values : [];
  return `
    <div class="note-card">
      <span>${title}</span>
      <p>${safeValues.length ? safeValues.map(escapeHTML).join("<br>") : "Not listed"}</p>
    </div>
  `;
}

function orderOnWhatsApp() {
  const product = state.selectedProduct;
  if (!product) return;

  const size = state.selectedSize;
  const price = Number(product.sizes?.[size] || 0).toLocaleString();

  const message =
`Hi, I would like to order:

• ${product.brand_name}
• Inspired by: ${product.inspired_by}
• Size: ${size.replace("ml", " ML")}
• Price: ${price} EGP

Name:
Phone:
Address (optional):`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function openMenu() {
  sideMenu.classList.add("open");
  menuOverlay.classList.add("open");
  sideMenu.setAttribute("aria-hidden", "false");
  menuBtn.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function closeSideMenu() {
  sideMenu.classList.remove("open");
  menuOverlay.classList.remove("open");
  sideMenu.setAttribute("aria-hidden", "true");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function resetAllFilters() {
  state.gender = "All";
  state.category = "All";
  state.search = "";
  searchInput.value = "";

  document.querySelectorAll("#genderFilters .filter-chip").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.gender === "All");
  });

  document.querySelectorAll("#categoryFilters .category-chip").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === "All");
  });

  clearSearch.style.display = "none";
  renderProducts();
}

async function loadProducts() {
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Could not load product data (${response.status})`);
    }

    state.products = await response.json();
    console.log(`Willi's Perfume: ${state.products.length} products loaded.`);
    renderProducts();
    renderCart();
    updateCartUI();
  } catch (error) {
    console.error(error);
    resultCount.textContent = "Data error";
    productsContainer.innerHTML = `
      <div class="empty-state">
        <div>!</div>
        <h3>Could not load the collection</h3>
        <p>Please refresh the page and try again.</p>
      </div>
    `;
  }
}

/* Keep internal section links functional without putting #home, #collection, etc. in the URL. */
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

/* Events */
document.querySelectorAll("#genderFilters .filter-chip").forEach(btn => {
  btn.addEventListener("click", () => setGender(btn.dataset.gender));
});

document.querySelectorAll("#categoryFilters .category-chip").forEach(btn => {
  btn.addEventListener("click", () => setCategory(btn.dataset.category));
});

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

resetFilters.addEventListener("click", resetAllFilters);

productsContainer.addEventListener("click", event => {
  const details = event.target.closest(".view-details");
  if (details) {
    openProduct(details.dataset.productId);
    return;
  }

  const addButton = event.target.closest(".add-to-cart");
  if (addButton) {
    const product = state.products.find(item => item.id === addButton.dataset.productId);
    if (product) addToCart(product, getDefaultSize(product));
  }
});

modalClose.addEventListener("click", closeProduct);
modalBackdrop.addEventListener("click", closeProduct);

menuBtn.addEventListener("click", openMenu);
closeMenu.addEventListener("click", closeSideMenu);
menuOverlay.addEventListener("click", closeSideMenu);

sideMenu.querySelectorAll("[data-gender]").forEach(button => {
  button.addEventListener("click", () => {
    setGender(button.dataset.gender);
    closeSideMenu();
    document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  });
});

document.getElementById("whatsappNav").addEventListener("click", () => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

document.getElementById("menuWhatsApp")?.addEventListener("click", event => {
  event.preventDefault();
  const url = `https://wa.me/${WHATSAPP_NUMBER}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeProduct();
    closeSideMenu();
    closeCart();
  }
});

/* Cart events */
document.getElementById("desktopCartBtn").addEventListener("click", openCart);
document.getElementById("cartNav").addEventListener("click", openCart);
cartCloseBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.getElementById("continueShopping").addEventListener("click", closeCart);
document.getElementById("checkoutBtn").addEventListener("click", checkoutCart);

document.getElementById("clearCartBtn").addEventListener("click", () => {
  clearCart();
  showToast("Cart cleared");
});

cartItemsEl.addEventListener("click", event => {
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

updateCartUI();
renderCart();

loadProducts();
initHeroMotion();

document.getElementById("desktopWhatsApp")?.addEventListener("click", () => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

function initFinalHeroParallax() {
  const hero = document.querySelector(".hero");
  const bottle = document.querySelector(".hero-bottle");
  if (!hero || !bottle || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let frame = 0;
  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const r = hero.getBoundingClientRect();
      const x = ((event.clientX - r.left) / r.width - .5);
      const y = ((event.clientY - r.top) / r.height - .5);
      bottle.style.setProperty("--parallax-x", `${x * 7}px`);
      bottle.style.setProperty("--parallax-y", `${y * 4}px`);
    });
  }, {passive:true});

  hero.addEventListener("pointerleave", () => {
    bottle.style.setProperty("--parallax-x", "0px");
    bottle.style.setProperty("--parallax-y", "0px");
  }, {passive:true});
}
initFinalHeroParallax();
