/*
 * Local dev server for Willi's Perfume + admin API.
 * Run: node serve.js [port]
 *
 * The /api/* routes are LOCAL-ONLY admin endpoints:
 *   GET  /api/products   -> product array (JSON)
 *   POST /api/products   -> save product array
 *   GET  /api/images     -> list images/*.webp
 *   POST /api/upload     -> { name, data(dataURL) } -> webp (sharp) -> images/.. 
 *   POST /api/regenerate -> run tools/generate-pages.js, return output
 * Do NOT deploy this server as-is; it is a local management tool.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.argv[2] || 8080);
const DATA_PATH = path.join(ROOT, "website_data_willis_perfume_FINAL_WITH_PRICES.json");
const GENERATOR = path.join(__dirname, "generate-pages.js");

let sharp = null;
try { sharp = require("sharp"); } catch (e) { sharp = null; }

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function sendJSON(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

/* Content hash of the data file — lets the admin panel detect when the file
   changed elsewhere (another tab/device) before it overwrites it. */
const crypto = require("crypto");
function dataHash() {
  if (!fs.existsSync(DATA_PATH)) return "";
  return crypto.createHash("md5").update(fs.readFileSync(DATA_PATH)).digest("hex");
}

http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const method = req.method.toUpperCase();

  /* ---------- admin API ---------- */
  if (method === "GET" && urlPath === "/api/products") {
    try {
      if (!fs.existsSync(DATA_PATH)) return sendJSON(res, 404, { error: "data file missing" });
      const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
      res.setHeader("X-Data-Hash", dataHash());
      return sendJSON(res, 200, data);
    } catch (e) {
      return sendJSON(res, 500, { error: String(e && e.message || e) });
    }
  }

  if (method === "POST" && urlPath === "/api/products") {
    try {
      const raw = await readBody(req);
      const body = JSON.parse(raw.toString("utf8"));
      if (!Array.isArray(body)) return sendJSON(res, 400, { error: "expected an array" });
      for (const p of body) {
        if (!p || typeof p !== "object" || !p.id) {
          return sendJSON(res, 400, { error: "every product needs an id" });
        }
        if (p.size != null && p.sizes == null) continue;
      }
      /* Stale-write guard: if the client loaded an older copy (base hash) and
         the file changed since, refuse unless the client insists. */
      const baseHash = req.headers["x-base-hash"] || "";
      const cur = dataHash();
      if (baseHash && cur && baseHash !== cur) {
        return sendJSON(res, 409, { error: "stale data — file changed since the dashboard loaded; refresh and retry" });
      }
      fs.writeFileSync(DATA_PATH, JSON.stringify(body, null, 2) + "\n", "utf8");
      return sendJSON(res, 200, { ok: true, count: body.length, hash: dataHash() });
    } catch (e) {
      return sendJSON(res, 500, { error: String(e && e.message || e) });
    }
  }

  if (method === "GET" && urlPath === "/api/images") {
    try {
      const dir = path.join(ROOT, "images");
      const files = fs.readdirSync(dir)
        .filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f))
        .map(f => `images/${f}`);
      return sendJSON(res, 200, files);
    } catch (e) {
      return sendJSON(res, 500, { error: String(e && e.message || e) });
    }
  }

  if (method === "POST" && urlPath === "/api/upload") {
    try {
      const raw = await readBody(req);
      const body = JSON.parse(raw.toString("utf8"));
      const name = String(body.name || "").replace(/^images\//, "");
      if (!/^[a-z0-9_-]+\.(webp|png|jpg|jpeg)$/i.test(name)) {
        return sendJSON(res, 400, { error: "invalid file name" });
      }
      const dataUrl = String(body.data || "");
      const b64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
      const buf = Buffer.from(b64, "base64");
      let finalName = name;

      if (sharp && /\.(png|jpg|jpeg)$/i.test(name)) {
        try {
          const webp = await sharp(buf)
            .resize({ width: 700, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
          finalName = name.replace(/\.(png|jpg|jpeg)$/i, ".webp");
          fs.writeFileSync(path.join(ROOT, "images", finalName), webp);
        } catch (e) {
          fs.writeFileSync(path.join(ROOT, "images", name), buf);
        }
      } else {
        fs.writeFileSync(path.join(ROOT, "images", finalName), buf);
      }

      return sendJSON(res, 200, { path: `images/${finalName}` });
    } catch (e) {
      return sendJSON(res, 500, { error: String(e && e.message || e) });
    }
  }

  if (method === "POST" && urlPath === "/api/regenerate") {
    try {
      execFileSync(process.execPath, [GENERATOR], { cwd: ROOT, encoding: "utf8" });
      return sendJSON(res, 200, { ok: true });
    } catch (e) {
      return sendJSON(res, 500, { ok: false, error: String((e.stderr || e.message || e)) });
    }
  }

  /* ---------- static files ---------- */
  let route = urlPath;
  if (route === "/") route = "/index.html";
  const file = path.resolve(ROOT, "." + route);
  if (!file.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not found: " + route);
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Serving ${ROOT} at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html  (local only)`);
});