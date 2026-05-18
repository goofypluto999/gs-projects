// Screenshot each live product at 1440x900 desktop, save as JPG to public/previews/.
// Run: node scripts/screenshot.mjs
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";

const targets = [
  { id: "foresay-labs", url: "https://foresaylabs.com/" },
  { id: "aimvantage", url: "https://aimvantage.uk/" },
  { id: "waddaplay", url: "https://waddaplay.vercel.app/" },
  { id: "cv-mirror", url: "https://cv-mirror-web.vercel.app/" },
  { id: "adsforge", url: "https://www.adsforge.store/" },
];

const outDir = path.resolve("public/previews");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

for (const t of targets) {
  console.log(`[shoot] ${t.id} ← ${t.url}`);
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  );

  try {
    await page.goto(t.url, {
      waitUntil: "networkidle2",
      timeout: 45_000,
    });
  } catch (e) {
    console.warn(`[warn] ${t.id} navigation timed out, screenshotting anyway`);
  }

  // Wait extra 2s for animations / late-loaded assets
  await new Promise((r) => setTimeout(r, 2500));

  // Try to dismiss common cookie / consent popups before shooting
  await page.evaluate(() => {
    const selectors = [
      'button[aria-label*="accept" i]',
      'button[aria-label*="dismiss" i]',
      'button[aria-label*="close" i]',
      '#onetrust-accept-btn-handler',
      '.ot-pc-refuse-all-handler',
      '[data-testid="uc-accept-all-button"]',
      'button:has-text("Accept")',
    ];
    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        if (el) (el).click();
      } catch {}
    }
  });

  await new Promise((r) => setTimeout(r, 1200));

  const outPath = path.join(outDir, `${t.id}.jpg`);
  await page.screenshot({
    path: outPath,
    type: "jpeg",
    quality: 88,
    clip: { x: 0, y: 0, width: 1440, height: 900 },
  });
  console.log(`[ok]    ${outPath}`);
  await page.close();
}

await browser.close();
console.log("[done] all 5 screenshots saved.");
