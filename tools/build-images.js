/*
 * Optimize all images for Willi's Perfume.
 * - logo.png  (2048x2048, ~3.9 MB)  -> logo.webp   (~260px, ~20 KB)
 * - bottle.png (1024x1536, ~948 KB) -> bottle.webp (~520px, ~60 KB)
 * - product webps capped at 700px wide, webp q80
 * - favicon + apple-touch-icon + og-image generated from the logo
 * Run from tools/:  node build-images.js
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IMAGES = path.join(ROOT, "images");

async function optimize(input, output, ops) {
  await sharp(path.join(IMAGES, input))
    .resize(ops.width, ops.height, { fit: ops.fit || "inside", withoutEnlargement: true })
    .webp({ quality: ops.quality || 80, effort: 6 })
    .rotate()
    .toFile(path.join(IMAGES, output));
  const info = await sharp(path.join(IMAGES, output)).metadata();
  const kb = fs.statSync(path.join(IMAGES, output)).size / 1024;
  console.log(`✔ ${input} -> ${output} (${info.width}x${info.height}, ${kb.toFixed(1)} KB)`);
}

async function main() {
  // 1) Logo — displayed at 43px / 58px
  await optimize("logo.png", "logo.webp", { width: 280, height: 280, quality: 88 });

  // 2) Hero bottle — displayed around 285-355px wide
  await optimize("bottle.png", "bottle.webp", { width: 540, quality: 82 });

  // 3) Product images — cap width at 700px (covers 2x retina of the largest card)
  const products = fs.readdirSync(IMAGES).filter(f => /\.webp$/.test(f) && f !== "bottle.webp" && f !== "logo.webp");
  let saved = 0;
  for (const file of products) {
    const srcPath = path.join(IMAGES, file);
    const srcBuf = fs.readFileSync(srcPath);
    const meta = await sharp(srcBuf).metadata();
    if ((meta.width || 0) <= 700 && (meta.height || 0) <= 900) continue; // already small enough
    const before = srcBuf.length;
    const buf = await sharp(srcBuf)
      .resize(700, 900, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toBuffer();
    fs.writeFileSync(srcPath, buf);
    const after = buf.length;
    saved += before - after;
    console.log(`✔ resized ${file}: ${(before / 1024).toFixed(0)} -> ${(after / 1024).toFixed(0)} KB`);
  }
  if (saved > 0) console.log(`   (saved ${(saved / 1024).toFixed(0)} KB across product images)`);

  // 4) Favicons
  await sharp(path.join(IMAGES, "logo.png"))
    .resize(32, 32)
    .png({ compressionLevel: 9 })
    .toFile(path.join(IMAGES, "favicon-32x32.png"));
  await sharp(path.join(IMAGES, "logo.png"))
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(path.join(IMAGES, "apple-touch-icon.png"));
  console.log("✔ favicon-32x32.png + apple-touch-icon.png");

  // 5) Open Graph image (1200x630) — ivory background, bottle + logo + text
  const bottleBuf = await sharp(path.join(IMAGES, "bottle.png"))
    .resize(430, 580, { fit: "inside" })
    .webp({ quality: 82 })
    .toBuffer();
  const logoBuf = await sharp(path.join(IMAGES, "logo.png"))
    .resize(120, 120)
    .png()
    .toBuffer();
  const svg = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stop-color="#fffaf0"/>
          <stop offset="55%" stop-color="#f6efe2"/>
          <stop offset="100%" stop-color="#dfc7a3"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#glow)"/>
      <circle cx="1050" cy="80" r="190" fill="none" stroke="#a77a32" stroke-opacity=".25" stroke-width="2"/>
      <rect x="86" y="472" width="1028" height="3" fill="#a77a32" fill-opacity=".35"/>
      <text x="88" y="452" font-family="Georgia, 'Times New Roman', serif" font-size="58" font-weight="700" fill="#171614">Willi&apos;s Perfume</text>
      <text x="90" y="505" font-family="Arial, Helvetica, sans-serif" font-size="24" letter-spacing="10" fill="#8c6428">WEAR YOUR WILL</text>
    </svg>`);
  const svgBuf = await sharp(svg).png().toBuffer();

  await sharp(svgBuf)
    .composite([
      { input: logoBuf, left: 88, top: 88 },
      { input: bottleBuf, left: 700, top: 90 }
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(IMAGES, "og-image.png"));
  const ogKb = fs.statSync(path.join(IMAGES, "og-image.png")).size / 1024;
  console.log(`✔ og-image.png (${ogKb.toFixed(0)} KB)`);

  // 6) Remove the heavy originals now that webp versions exist
  for (const old of ["logo.png", "bottle.png"]) {
    const p = path.join(IMAGES, old);
    if (fs.existsSync(p)) { fs.unlinkSync(p); console.log(`✖ removed ${old}`); }
  }
}

main().catch(err => { console.error(err); process.exit(1); });