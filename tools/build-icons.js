/* build-icons.js
   Regenerate PWA/app icons from the project logo (images/logo.webp).
   Art: logo trimmed to its artwork, centered on the brand cream background
   (#f7f3ec) at ~60% of the canvas so it is maskable-safe (inner 80% safe
   zone for circle/rounded launchers). Outputs fully opaque PNGs so Android /
   iOS never apply a default background.

   Usage: node tools/build-icons.js
   Requires: npm i --save-dev sharp
*/
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");
const LOGO = path.join(ROOT, "images", "logo.webp");
const OUT_DIR = path.join(ROOT, "images");
const BG = { r: 247, g: 243, b: 236 }; // #f7f3ec — matches manifest background/theme
const LOGO_FRACTION = 0.6; // logo artwork occupies 60% of the canvas (maskable-safe)
const FAVICON_FRACTION = 0.85; // smaller canvases need a bigger logo to stay legible

const SIZES = [
  { file: "icon-512.png", size: 512, fraction: LOGO_FRACTION },
  { file: "icon-192.png", size: 192, fraction: LOGO_FRACTION },
  { file: "apple-touch-icon.png", size: 180, fraction: LOGO_FRACTION },
  { file: "favicon-32x32.png", size: 32, fraction: FAVICON_FRACTION }
];

async function build(logoBuffer, outFile, size, fraction) {
  const logoSize = Math.round(size * fraction);
  const logo = await sharp(logoBuffer)
    .trim() // cut away transparent padding so the artwork is measured, not the canvas
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const bg = await sharp({
    create: { width: size, height: size, channels: 4, background: { r: BG.r, g: BG.g, b: BG.b, alpha: 1 } }
  })
    .composite([{ input: logo, gravity: "center" }])
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(OUT_DIR, outFile), bg);

  const meta = await sharp(bg).metadata();
  const hasAlpha = meta.hasAlpha;
  console.log(`  ${outFile}  ${meta.width}x${meta.height}  ${bg.length} bytes  opaque=${!hasAlpha}`);
}

(async () => {
  if (!fs.existsSync(LOGO)) {
    console.error("logo not found:", LOGO);
    process.exit(1);
  }
  const logoBuffer = fs.readFileSync(LOGO);
  console.log(`Building icons from ${path.relative(ROOT, LOGO)} (${(logoBuffer.length / 1024).toFixed(1)} KB)`);
  for (const s of SIZES) await build(logoBuffer, s.file, s.size, s.fraction);
  console.log("done.");
})();