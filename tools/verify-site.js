/* Static verification: i18n key coverage + local asset paths.
   Run: node verify-site.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

/* ---- load i18n dicts via vm (they use document/localStorage guards) ---- */
const i18nSrc = fs.readFileSync(path.join(ROOT, "i18n.js"), "utf8");
const ctxD = { document: {}, localStorage: { getItem: () => null } };
vm.createContext(ctxD);
try { vm.runInContext(i18nSrc, ctxD); } catch (e) { console.log("i18n load warn:", e.message); }
const EN = vm.runInContext("I18N.en", ctxD);
const AR = vm.runInContext("I18N.ar", ctxD);

let failures = 0;
function check(name, cond, detail = "") {
  if (cond) console.log(`  ok ${name}`);
  else { failures++; console.log(`  FAIL ${name} ${detail}`); }
}

/* ---- 1. data-i18n coverage in index.html + products ---- */
const htmlFiles = [path.join(ROOT, "index.html"), ...fs.readdirSync(path.join(ROOT, "products")).filter(f => f.endsWith(".html")).map(f => path.join(ROOT, "products", f))];
const usedKeys = new Set();
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const m of html.matchAll(/data-i18n(?:-placeholder|-aria)?="([^"]+)"/g)) usedKeys.add(m[1]);
}
const missingEn = [...usedKeys].filter(k => !(k in EN));
const missingAr = [...usedKeys].filter(k => !(k in AR));
check(`${usedKeys.size} data-i18n keys all present in EN`, missingEn.length === 0, missingEn.join(","));
check(`${usedKeys.size} data-i18n keys all present in AR`, missingAr.length === 0, missingAr.join(","));

/* ---- 2. t()/pt() keys used in app.js ---- */
const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const appKeys = new Set();
for (const m of appSrc.matchAll(/(?<![A-Za-z0-9_$])(?:t|pt)\("([^"]+)"/g)) appKeys.add(m[1]);
const missingApp = [...appKeys].filter(k => !(k in EN) && k !== "__keep__");
check(`${appKeys.size} t()/pt() keys used in app.js all present`, missingApp.length === 0, missingApp.join(","));

/* ---- 3. local asset references resolve ---- */
function localRefs(html, dir) {
  const refs = [];
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    let r = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/i.test(r)) continue;
    if (r.startsWith("javascript:")) continue;
    if (r.includes("fbq('init'")) continue;
    r = r.split("?")[0].split("#")[0];
    if (!r) continue;
    refs.push({ raw: m[1], resolved: path.resolve(dir, r) });
  }
  return refs;
}
let totalRefs = 0, badRefs = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const dir = path.dirname(file);
  for (const { raw, resolved } of localRefs(html, dir)) {
    totalRefs++;
    if (!fs.existsSync(resolved)) {
      badRefs++;
      console.log(`  MISSING ${path.relative(ROOT, file)} -> ${raw}`);
    }
  }
}
check(`all ${totalRefs} local asset refs resolve (${htmlFiles.length} pages)`, badRefs === 0, `${badRefs} broken`);

console.log(failures === 0 ? "\nVERIFY OK" : `\n${failures} PROBLEM(S)`);
process.exit(failures === 0 ? 0 : 1);