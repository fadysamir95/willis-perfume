/* Willi's Perfume — upload a product image to Vercel Blob.
   Same contract as the local tools/serve.js /api/upload:
     POST { name: "images/myproduct.webp", data: "<data-url or base64>" }
   -> returns { path: "<public blob URL>" }
   The dashboard stores that URL as product.image, and the site renders it
   (getProductImageCandidates in app.js prefers an absolute http(s) image). */
const { put } = require("@vercel/blob");

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function pinOk(req) {
  const pin = process.env.ADMIN_PIN;
  return !pin || String(req.headers["x-admin-pin"] || "") === pin;
}

const MIME_BY_EXT = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg"
};

module.exports = async function handler(req, res) {
  if ((req.method || "POST").toUpperCase() !== "POST") {
    return sendJson(res, 405, { error: "method not allowed" });
  }
  if (!pinOk(req)) return sendJson(res, 401, { error: "unauthorized" });

  try {
    const body = JSON.parse(await readBody(req));

    const name = String(body.name || "").replace(/^images[/\\]+/, "");
    if (!/^[a-z0-9_-]+\.(webp|png|jpg|jpeg)$/i.test(name)) {
      return sendJson(res, 400, { error: "invalid file name (use letters/digits/-/_)" });
    }

    const dataUrl = String(body.data || "");
    const b64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
    const buf = Buffer.from(b64, "base64");
    if (!buf.length) return sendJson(res, 400, { error: "empty image data" });

    const ext = name.toLowerCase().split(".").pop();
    const pathname = "images/" + name;

    const blob = await put(pathname, buf, {
      access: "public",
      contentType: MIME_BY_EXT[ext] || "application/octet-stream",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return sendJson(res, 200, { path: blob.url });
  } catch (e) {
    return sendJson(res, 500, { error: String(e && e.message || e) });
  }
};