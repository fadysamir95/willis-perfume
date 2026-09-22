/* ============================================================
   WILLI'S PERFUME — SITE CONFIG (single source of truth)
   ------------------------------------------------------------
   Edit ONLY this file to set your real launch values.
   Every page reads these values at runtime (window.SITE_CONFIG),
   and the page generator (tools/generate-pages.js) reads them at
   build time — so after editing, run the generator again:
       node tools/generate-pages.js

   siteUrl  : your real domain, no trailing slash
              e.g. "https://www.yourdomain.com"
   ga4Id    : Google Analytics 4 Measurement ID
              e.g. "G-ABCDE12345"   (keep "G-XXXXXXXXXX" until you have it)
   pixelId  : Meta (Facebook) Pixel ID
              e.g. "1234567890123456"  (keep placeholder until you have it)
   whatsapp : WhatsApp number, international format, NO "+", NO spaces
              e.g. "201012345678"
   ============================================================ */
window.SITE_CONFIG = {
  siteUrl: "https://willis-perfume.vercel.app",
  ga4Id: "G-DGXZZQQ8DP",
  pixelId: "1234567890123456",
  whatsapp: "201272566695"
};

/* Guard helper — every page skips loading trackers while the IDs are still
   placeholders, so no bogus analytics/pixel requests fire before launch:
   - GA4: keep "G-XXXXXXXXXX" (or anything containing XXXX) until ready.
   - Pixel: "1234567890123456" is the built-in placeholder — treat it as
     NOT configured. A real Meta Pixel ID is 15-16 digits and won't match. */
window.SITE_CONFIG.isAnalyticsReady = function (kind) {
  var id = this[kind];
  if (!id || typeof id !== "string") return false;
  if (kind === "ga4Id") return /^G-[A-Z0-9]{4,}$/i.test(id) && id.indexOf("XXXX") === -1;
  if (kind === "pixelId") return /^[0-9]{15,16}$/.test(id) && id !== "1234567890123456";
  return false;
};