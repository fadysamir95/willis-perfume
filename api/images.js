/* Willi's Perfume — list available product images for the dashboard.
   Same contract as the local tools/serve.js /api/images:
   returns an array of names/paths like "images/foo.webp".
   Combines the images shipped with the deploy (read-only filesystem)
   with images uploaded to Vercel Blob. */
const fs = require("fs");
const path = require("path");
const { list } = require("@vercel/blob");

const IMAGE_PREFIX = "images/";
const IMG_RE = /\.(webp|png|jpg|jpeg)$/i;

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function pinOk(req) {
  const pin = process.env.ADMIN_PIN;
  return !pin || String(req.headers["x-admin-pin"] || "") === pin;
}

module.exports = async function handler(req, res) {
  if ((req.method || "GET").toUpperCase() !== "GET") {
    return sendJson(res, 405, { error: "method not allowed" });
  }
  if (!pinOk(req)) return sendJson(res, 401, { error: "unauthorized" });

  try {
    const out = new Set();

    /* images shipped with the deploy */
    const imgDir = path.join(process.cwd(), "images");
    if (fs.existsSync(imgDir)) {
      for (const f of fs.readdirSync(imgDir)) {
        if (IMG_RE.test(f)) out.add("images/" + f);
      }
    }

    /* images uploaded to Blob (optional — if listing fails we skip it) */
    try {
      const { blobs } = await list({
        prefix: IMAGE_PREFIX,
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
      for (const b of blobs || []) out.add(b.pathname);
    } catch (e) {
      /* keep going with static images only */
    }

    return sendJson(res, 200, [...out]);
  } catch (e) {
    return sendJson(res, 500, { error: String(e && e.message || e) });
  }
};