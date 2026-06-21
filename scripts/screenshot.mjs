#!/usr/bin/env node
/**
 * Usage: node scripts/screenshot.mjs [url-path] [output-path]
 *
 * Defaults:
 *   url-path    = /zh-TW/island
 *   output-path = /tmp/screenshot.png
 *
 * Requires the dev server to be running on port 3000 (or PORT env var).
 * Uses the pre-installed Chromium at /opt/pw-browsers/.
 */
import { chromium } from "playwright";
import { existsSync } from "fs";

const CHROMIUM_CANDIDATES = [
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/opt/pw-browsers/chromium/chrome-linux/chrome",
];

const executablePath = CHROMIUM_CANDIDATES.find(existsSync);
if (!executablePath) {
  console.error("Chromium not found. Run: npx playwright install chromium");
  process.exit(1);
}

const port = process.env.PORT ?? "3000";
const urlPath = process.argv[2] ?? "/zh-TW/island";
const outPath = process.argv[3] ?? "/tmp/screenshot.png";
const url = `http://localhost:${port}${urlPath}`;

const browser = await chromium.launch({
  executablePath,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${outPath}`);
