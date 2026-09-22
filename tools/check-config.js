/*
 * Launch configuration checker.
 * Reads site-config.js (single source of truth) and scans the built site
 * for leftover placeholder values.
 * Usage:  node tools/check-config.js
 * Exit 0 = everything configured; exit 1 = something still pending.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

function loadConfig() {
  const file = path.join(ROOT, "site-config.js");
  const src = fs.readFileSync(file, "utf8");
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  return ctx.window.SITE_CONFIG || {};
}

const isPending = {
  /* live on willis-perfume.vercel.app (custom domain on launch) — only flag
     genuinely unset/broken values (empty, placeholder-ish, whitespace) */
  domain: v => !v || /X{4,}/.test(v) || /\s/.test(v),
  ga4: v => !v || /X{4,}/.test(v),
  pixel: v => !v || /X{4,}/.test(v) || /^1234567890123456$/.test(v),
  whatsapp: v => !v || /X/.test(v)
};

const FILES = [
  "index.html",
  "sitemap.xml",
  "robots.txt",
  "app.js",
  "tools/serve.js",
  "tools/generate-pages.js"
];
const PRODUCT_GLOB = path.join(ROOT, "products", "*.html");

function scan() {
  const cfg = loadConfig();
  const results = [];
  const push = (ok, name, detail) => results.push({ ok, name, detail });

  push(!isPending.domain(cfg.siteUrl), "siteUrl (domain)", cfg.siteUrl || "(missing)");
  push(!isPending.ga4(cfg.ga4Id), "ga4Id (Google Analytics)", cfg.ga4Id || "(missing)");
  push(!isPending.pixel(cfg.pixelId), "pixelId (Meta Pixel)", cfg.pixelId || "(missing)");
  push(!isPending.whatsapp(cfg.whatsapp), "whatsapp number", cfg.whatsapp || "(missing)");

  /* Hardcoded placeholder IDs left anywhere outside site-config.js? */
  const tokenFiles = [path.join(ROOT, "index.html"), path.join(ROOT, "robots.txt"),
    path.join(ROOT, "sitemap.xml"), path.join(ROOT, "app.js"),
    path.join(ROOT, "tools", "serve.js"), path.join(ROOT, "tools", "generate-pages.js")];
  if (fs.existsSync(path.dirname(PRODUCT_GLOB))) {
    fs.readdirSync(path.dirname(PRODUCT_GLOB))
      .filter(f => f.endsWith(".html"))
      .forEach(f => tokenFiles.push(path.join(path.dirname(PRODUCT_GLOB), f)));
  }

  let leaked = [];
  for (const f of tokenFiles) {
    if (!fs.existsSync(f)) continue;
    const txt = fs.readFileSync(f, "utf8");
    if (/G-?X{5,}/.test(txt)) leaked.push(f.replace(ROOT, ".") + " (GA4)");
    if (/1234567890123456/.test(txt)) leaked.push(f.replace(ROOT, ".") + " (Pixel)");
  }
  leaked = [...new Set(leaked)];
  push(leaked.length === 0, "no hardcoded placeholder IDs in built files",
    leaked.length ? leaked.join(", ") : "clean");

  return { results, cfg };
}

const { results } = scan();
let pending = 0;
console.log("Launch configuration — site-config.js + site scan\n");
let max = Math.max(...results.map(r => (r.ok ? "ok " : "pending").length)) + 1;
for (const r of results) {
  const tag = r.ok ? "ok " : "pending";
  console.log(`  [${tag}]`.padEnd(max + 2) + r.name.padEnd(38) + " → " + r.detail);
  if (!r.ok) pending++;
}
console.log("\n" + (pending === 0
  ? "✔ ALL CONFIGURED — ready for launch."
  : `⏳ ${pending} item(s) pending — edit site-config.js and re-run: node tools/generate-pages.js`));
process.exit(pending === 0 ? 0 : 1);