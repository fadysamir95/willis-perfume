/*
 * One-off data update: inject a `stock` field ("in" | "low" | "out") into every product.
 * Run from tools/:  node update-data.js
 */
const fs = require("fs");
const path = require("path");

const JSON_PATH = path.resolve(__dirname, "..", "website_data_willis_perfume_FINAL_WITH_PRICES.json");
const data = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));

// Manual stock levels. Everything not listed defaults to "in".
const STOCK = {
  "fortune-rush": "low",
  "milky-amber": "low",
  "silk-veil": "low",
  "saffron-flame": "low",
  "golden-bloom": "out"
};

let changed = 0;
for (const product of data) {
  product.stock = STOCK[product.id] || "in";
  changed++;
}

fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`✔ stock added to ${changed} products`);
console.log("  " + data.map(p => `${p.id}: ${p.stock}`).join(" | "));