/**
 * Build for Cloudflare Pages.
 * - Assumes `npm run build:css` already produced ./assets/css/tailwind.css
 * - Copies the site into ./dist and rewrites HTML to drop the Tailwind CDN
 *   (script tag + inline tailwind.config) and reference the compiled CSS instead.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

function rm(p) {
  fs.rmSync(p, { recursive: true, force: true });
}
function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}
function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else copyFile(s, d);
  }
}

function transformHtml(html, cssHref) {
  // 1) remove the Tailwind Play CDN script tag
  html = html.replace(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/g, "");
  // 2) remove the inline `tailwind.config = {...}` script block
  html = html.replace(/\s*<script>\s*tailwind\.config[\s\S]*?<\/script>\s*/g, "\n");
  // 3) inject compiled CSS link right before the app.css stylesheet
  if (!html.includes("tailwind.css")) {
    html = html.replace(
      /(<link rel="stylesheet" href="[^"]*app\.css[^"]*"\s*\/?>)/,
      `  <link rel="stylesheet" href="${cssHref}" />\n$1`
    );
  }
  return html;
}

console.log("→ Assembling dist/ …");

rm(DIST);
ensureDir(DIST);

// Pages (rewrite HTML)
const pagesDir = path.join(ROOT, "pages");
const distPages = path.join(DIST, "pages");
ensureDir(distPages);
for (const file of fs.readdirSync(pagesDir)) {
  if (!file.endsWith(".html")) continue;
  const src = path.join(pagesDir, file);
  let html = fs.readFileSync(src, "utf8");
  html = transformHtml(html, "../assets/css/tailwind.css");
  fs.writeFileSync(path.join(distPages, file), html);
}

// Root index.html (rewrite HTML)
let indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
indexHtml = transformHtml(indexHtml, "assets/css/tailwind.css");
fs.writeFileSync(path.join(DIST, "index.html"), indexHtml);

// Assets (compiled tailwind + app.css + app.js + any img/fonts)
copyDir(path.join(ROOT, "assets"), path.join(DIST, "assets"));

// Cloudflare Pages helpers: long-cache assets, default security headers
fs.writeFileSync(
  path.join(DIST, "_headers"),
  "/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n" +
    "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n"
);
fs.writeFileSync(path.join(DIST, "_redirects"), "/dashboard /pages/dashboard.html 302\n");

// Sanity check: warn if compiled CSS is missing
const compiled = path.join(DIST, "assets", "css", "tailwind.css");
if (!fs.existsSync(compiled)) {
  console.warn("⚠  assets/css/tailwind.css not found — run `npm run build:css` first.");
}

console.log("✓ dist/ ready for Cloudflare Pages.");
