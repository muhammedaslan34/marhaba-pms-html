const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8801;
const mime = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };

const server = http.createServer((req, res) => {
  let p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (req.url === "/") p = path.join(ROOT, "index.html");
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); res.end("404"); return; }
    res.writeHead(200, { "Content-Type": mime[path.extname(p)] || "text/plain" });
    res.end(data);
  });
});

async function openAndCount(page, rootSel, searchVal) {
  return page.evaluate(async ({ rootSel, searchVal }) => {
    const root = document.querySelector(rootSel);
    if (!root) return "ROOT NOT FOUND: " + rootSel;
    const trigger = root.querySelector("[data-ss-trigger]");
    if (!trigger) return "NO TRIGGER";
    trigger.click();
    await new Promise((r) => setTimeout(r, 250));
    const dd = document.querySelector(".phone-dropdown.is-open");
    if (!dd) return "DROPDOWN DID NOT OPEN";
    const items = dd.querySelectorAll(".phone-dropdown-item").length;
    const txt = root.querySelector("[data-ss-text]").textContent;
    let searchCount = null;
    if (searchVal) {
      const sb = dd.querySelector("[data-ss-search]");
      sb.value = searchVal;
      sb.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise((r) => setTimeout(r, 150));
      searchCount = dd.querySelectorAll(".phone-dropdown-item").length;
    }
    return { triggerText: txt, open: true, items, searchCount };
  }, { rootSel, searchVal });
}

async function closeAll(page) {
  await page.evaluate(async () => {
    document.body.click();
    await new Promise((r) => setTimeout(r, 150));
  });
}

async function testPage(browser, url, label) {
  const page = await browser.newPage({ viewport: { width: 900, height: 1000 } });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  await page.goto(url, { waitUntil: "networkidle" });

  await page.evaluate(() => {
    const mb = document.querySelector('[data-action="open-modal"][data-target="guest-modal"]');
    if (mb) mb.click();
    const tg = document.getElementById("new-guest-toggle");
    if (tg) tg.click();
  });
  await page.waitForTimeout(300);

  const phone = await openAndCount(page, "[data-phone-field]", "إمارات");
  await closeAll(page);
  const nat = await openAndCount(page, "[data-nationality-field]", "سعودي");
  await closeAll(page);

  console.log(`\n[${label}]`);
  console.log("  phone:", JSON.stringify(phone));
  console.log("  nationality:", JSON.stringify(nat));
  console.log("  console errors:", errors.length ? errors.slice(0, 3) : "none");
  await page.close();
}

(async () => {
  await new Promise((r) => server.listen(PORT, r));
  const browser = await chromium.launch({ channel: "chrome" });
  await testPage(browser, `http://localhost:${PORT}/pages/guests.html`, "guests.html");
  await testPage(browser, `http://localhost:${PORT}/pages/reservation-new.html`, "reservation-new.html");
  await browser.close();
  server.close();
})();
