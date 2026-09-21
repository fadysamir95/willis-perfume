/* Willi's Perfume — online product data (Vercel Blob storage).
   Mirrors the local tools/serve.js /api/products contract so the admin
   dashboard works identically on the live site:
     GET  -> products array + X-Data-Hash (md5 of the JSON)
     POST -> { ok, count, hash }; honors X-Base-Hash stale-write guard.
   Setup:
     - Connect a Blob store (vercel.com/stores) — BLOB_READ_WRITE_TOKEN is
       injected automatically.
     - Optional security: set env ADMIN_PIN — then every request must send
       header x-admin-pin with that value. Without it the endpoint is open. */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { put, list } = require("@vercel/blob");

const DATA_PATH = "data/products.json";
/* Fallback seed: the JSON shipped with the deploy is used until the first
   save writes to Blob, so a fresh deployment and the first online save work. */
const SEED_PATH = path.join(process.cwd(), "website_data_willis_perfume_FINAL_WITH_PRICES.json");

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res, status, obj, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  for (const [k, v] of Object.entries(extraHeaders)) res.setHeader(k, v);
  res.end(JSON.stringify(obj));
}

function pinOk(req) {
  const pin = process.env.ADMIN_PIN;
  return !pin || String(req.headers["x-admin-pin"] || "") === pin;
}

async function currentContent() {
  const { blobs } = await list({
    prefix: DATA_PATH,
    limit: 1,
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  const blob = blobs && blobs[0];
  if (!blob) return null;
  const res = await fetch(blob.url);
  if (!res.ok) throw new Error("blob read failed: " + res.status);
  return res.text();
}

function md5(text) {
  return crypto.createHash("md5").update(text).digest("hex");
}

module.exports = async function handler(req, res) {
  const method = (req.method || "GET").toUpperCase();

  if (!pinOk(req)) return sendJson(res, 401, { error: "unauthorized" });

  try {
    if (method === "GET") {
      const txt = await currentContent();
      if (txt == null) {
        /* no data in Blob yet — serve the shipped JSON as the initial data */
        if (fs.existsSync(SEED_PATH)) {
          const seed = fs.readFileSync(SEED_PATH, "utf8");
          return sendJson(res, 200, JSON.parse(seed), {
            "X-Data-Hash": md5(seed),
            "X-Data-Source": "repo-seed"
          });
        }
        return sendJson(res, 404, {
          error: "no products stored in Blob yet — save once from the dashboard (or POST an array) to seed it"
        });
      }
      return sendJson(res, 200, JSON.parse(txt), { "X-Data-Hash": md5(txt) });
    }

    if (method === "POST") {
      const body = JSON.parse(await readBody(req));
      if (!Array.isArray(body)) return sendJson(res, 400, { error: "expected an array" });

      /* stale-write guard (same as the local server) */
      const baseHash = String(req.headers["x-base-hash"] || "");
      const cur = await currentContent();
      if (baseHash && cur != null) {
        if (baseHash !== md5(cur)) {
          return sendJson(res, 409, {
            error: "stale data — file changed since the dashboard loaded; refresh and retry"
          });
        }
      }

      const json = JSON.stringify(body, null, 2) + "\n";
      const blob = await put(DATA_PATH, json, {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      return sendJson(res, 200, {
        ok: true,
        count: body.length,
        hash: md5(json),
        url: blob.url
      });
    }

    return sendJson(res, 405, { error: "method not allowed" });
  } catch (e) {
    const B = require("@vercel/blob");
    const raw = String(e && e.message || e);
    let friendly;
    if (/Cannot use public access on a private store|private access/i.test(raw)) {
      friendly = "الـ Blob store متعيّنة في وضع Private ❗ — الموقع والصور محتاجين store بوضع Public. من Vercel: Storage ← Create جديدة وهيستخدمها، واختار <b>Public</b> عند الإنشاء (كلاسيكي: اسم willis-blob-public) واربطها بنفس المشروع — بيضيف المتغير تلقائيًا. بعدها تقدر تحذف الستور القديمة.";
    } else if (e instanceof B.BlobStoreNotFoundError) {
      friendly = "Blob store مش موجود — افتح تبويب Storage في Vercel، اعمل Create لـ Blob store واربطها بالمشروع ده، ثم أعِد الـ deploy";
    } else if (e instanceof B.BlobStoreSuspendedError) {
      friendly = "Blob store موقوف (suspended) من Vercel — تحتاج تتواصل مع الدعم أو تعمل store جديد";
    } else if (e instanceof B.BlobAccessError || /token|BLOB_READ_WRITE_TOKEN|Unauthorized|does not exist/i.test(raw) && !/^Vercel Blob: This store does not exist/i.test(raw)) {
      friendly = "متغير BLOB_READ_WRITE_TOKEN مش شغال — اعمل Create لـ Blob store من تبويب Storage في Vercel (بيضيف المتغير تلقائيًا) ثم اعمل Redeploy";
    } else if (e instanceof B.BlobServiceNotAvailable || e instanceof B.BlobServiceRateLimited) {
      friendly = "خدمة Blob غير متاحة مؤقتًا من Vercel — جرب بعد شوية";
    } else {
      friendly = raw;
    }
    return sendJson(res, 500, {
      error: friendly,
      detail: raw,
      env: {
        hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        hasStoreId: !!process.env.BLOB_STORE_ID
      }
    });
  }
};