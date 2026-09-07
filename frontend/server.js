const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const Version = "1.1.0";

const PUBLIC_DIR = path.join(__dirname, "public");

// Build case-insensitive page map
function buildPageMap() {
  const map = new Map();
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.warn(`[Warning] Directory not found: ${PUBLIC_DIR}`);
    return map;
  }

  try {
    for (const file of fs.readdirSync(PUBLIC_DIR)) {
      if (file.toLowerCase().endsWith(".html")) {
        const nameNoExt = file.slice(0, -5); // strip ".html"
        map.set(nameNoExt.toLowerCase(), file);
      }
    }
  } catch (err) {
    console.error("Error building page map:", err);
  }
  return map;
}

let pageMap = buildPageMap();

// Debounce fs.watch triggers
let watchTimeout = null;
if (fs.existsSync(PUBLIC_DIR)) {
  fs.watch(PUBLIC_DIR, { persistent: false }, () => {
    clearTimeout(watchTimeout);
    watchTimeout = setTimeout(() => {
      pageMap = buildPageMap();
    }, 100);
  });
}

// 1. Canonical URLs: Strip .html extension
app.get(/\.html$/i, (req, res) => {
  const clean = req.path.replace(/\.html$/i, "");
  res.redirect(301, clean === "" ? "/" : clean);
});

// 2. Static assets (CSS, JS, Images, etc.)
app.use(express.static(PUBLIC_DIR, { extensions: false, index: false }));

// 3. Clean URL Routing
app.get(/^\/[a-zA-Z0-9\-_/]*$/, (req, res, next) => {
  const key = (req.path === "/" ? "index" : req.path.slice(1)).toLowerCase();
  const file = pageMap.get(key);

  if (!file) return next();

  // Enforce root option to prevent Directory Traversal
  res.sendFile(file, { root: PUBLIC_DIR }, (err) => {
    if (err) next(err);
  });
});

// 404 Fallback
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Solarglyph Labs site running on port ${PORT}`);
  console.log(`Version: ${Version}`);
});