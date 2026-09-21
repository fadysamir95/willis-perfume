/*
 * One-off data migration for Willi's Perfume:
 *   1. Move Arabic product content (description/family/profile/notes)
 *      from i18n.js PRODUCT_AR into the JSON as `product.ar`.
 *   2. Convert `stock` from string ("in"/"low"/"out") to a number (units).
 *   3. Assign a default `order` (display order) to every product.
 *   4. Mark every product `visible: true`.
 *
 * Run from tools/:  node migrate-data.js
 * After running, regenerate pages:  node generate-pages.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "website_data_willis_perfume_FINAL_WITH_PRICES.json");
const I18N_PATH = path.join(ROOT, "i18n.js");

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
if (!Array.isArray(data)) {
  console.error("✖ Data file is not a JSON array");
  process.exit(1);
}

/* Extract PRODUCT_AR from i18n.js without executing DOM code */
const i18nSrc = fs.readFileSync(I18N_PATH, "utf8");
const ctx = {
  console,
  localStorage: { getItem: () => null, setItem: () => {} },
  document: {
    documentElement: { lang: "en", dir: "ltr" },
    readyState: "complete",
    body: { dataset: {} },
    querySelectorAll: () => [],
    addEventListener: () => {},
    dispatchEvent: () => {}
  },
  CustomEvent: class { constructor(type, init) { this.type = type; this.init = init; } },
  setTimeout,
  clearTimeout
};
vm.createContext(ctx);
vm.runInContext(i18nSrc + "\n;globalThis.__PRODUCT_AR__ = PRODUCT_AR;", ctx);
const PRODUCT_AR = ctx.__PRODUCT_AR__ || {};

let arCount = 0;
let stockChanged = 0;

const migrated = data.map((product, index) => {
  const out = { ...product };

  /* 1. Arabic content from i18n.js */
  const ar = PRODUCT_AR[product.id];
  if (ar && Object.keys(ar).length) {
    out.ar = {
      description: ar.description || "",
      family: ar.family || "",
      profile: Array.isArray(ar.profile) ? ar.profile : [],
      notes: ar.notes && typeof ar.notes === "object" ? ar.notes : {}
    };
    arCount++;
  } else if (out.ar) {
    arCount++; // already migrated
  }

  /* 2. Numeric stock with legacy mapping */
  const raw = out.stock;
  const asNum = Number(raw);
  if (raw != null && !Number.isNaN(asNum) && String(raw).trim() !== "") {
    out.stock = Math.max(0, Math.floor(asNum));
  } else if (raw === "out") {
    out.stock = 0;
    stockChanged++;
  } else if (raw === "low") {
    out.stock = 2;
    stockChanged++;
  } else {
    out.stock = raw == null ? 20 : 20;
    stockChanged++;
  }

  /* 3. Display order (keeps current file order) */
  if (out.order == null) out.order = index + 1;

  /* 4. Visibility */
  if (out.visible == null) out.visible = true;

  return out;
});

fs.writeFileSync(DATA_PATH, JSON.stringify(migrated, null, 2), "utf8");
console.log(`✔ migrated ${migrated.length} products`);
console.log(`✔ arabic content embedded for ${arCount} products`);
console.log(`✔ stock converted for ${stockChanged} products (in→20, low→2, out→0)`);
console.log(`✔ order 1..${migrated.length} assigned, visible=true on all`);
console.log("→ now run: node generate-pages.js");