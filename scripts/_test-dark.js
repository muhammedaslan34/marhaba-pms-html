const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const server = http.createServer((req, res) => {
  let p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (req.url === "/") p = path.join(ROOT, "index.html");
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); res.end("404"); return; }
    const mime = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" }[path.extname(p)] || "text/plain";
    res.writeHead(200, { "Content-Type": mime });
    res.end(data);
  });
});

const PAGES = [
  ["dashboard.html", "Dashboard"],
  ["reservations.html", "Reservations"],
  ["reports.html", "Reports"],
  ["reservation-detail.html", "Reservation Detail"],
];

async function check(page, sel, prop) {
  return page.evaluate(({ sel, prop }) => {
    const el = document.querySelector(sel);
    if (!el) return "NO ELEMENT: " + sel;
    return getComputedStyle(el)[prop];
  }, { sel, prop });
}

(async () => {
  await new Promise((r) => server.listen(8842, r));
  const browser = await chromium.launch({ channel: "chrome" });

  for (const [file, label] of PAGES) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    // Force dark theme before load
    await page.addInitScript(() => { localStorage.setItem("pms-theme", "dark"); });
    await page.goto(`http://localhost:8842/pages/${file}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    // Check a text-slate-800 element (should be light in dark mode)
    const heading = await check(page, "h2.text-slate-800, h1.text-slate-800, .text-slate-800", "color");
    // Check the main background panel
    const panelBg = await check(page, ".panel", "backgroundColor");

    console.log(`[${label}] dark=${isDark} body=${bodyBg}`);
    console.log(`   .text-slate-800 color=${heading}`);
    console.log(`   .panel bg=${panelBg}`);
    await page.close();
  }

  await browser.close();
  server.close();
})();
