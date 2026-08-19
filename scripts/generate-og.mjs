/* One-off: screenshot og-template.html at 1200x630 into the app-dir OG and
 * twitter images (plus alt text files). Uses the local Chrome for Testing
 * build; --disable-gpu is required on this machine (see CLAUDE.md).
 * Run: node scripts/generate-og.mjs */
import { copyFile, mkdtemp, readdir, stat, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const BROWSERS = path.join(os.homedir(), ".agent-browser/browsers");
const OG_BUDGET_BYTES = 300 * 1024;

async function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const entries = (await readdir(BROWSERS))
    .filter((name) => name.startsWith("chrome-"))
    .sort();
  if (!entries.length) throw new Error(`no Chrome for Testing under ${BROWSERS}`);
  return path.join(BROWSERS, entries[entries.length - 1], "chrome.exe");
}

const chrome = await findChrome();
const tmp = await mkdtemp(path.join(os.tmpdir(), "og-"));
const shot = path.join(tmp, "og.png");
const template = path.join(ROOT, "scripts/og-template.html");

execFileSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1200,630",
    `--screenshot=${shot}`,
    `file:///${template.replace(/\\/g, "/")}`,
  ],
  { stdio: "inherit", timeout: 60_000 },
);

const png = await sharp(shot).png({ palette: true, colors: 128 }).toBuffer();
const ogPath = path.join(ROOT, "src/app/opengraph-image.png");
await writeFile(ogPath, png);
await copyFile(ogPath, path.join(ROOT, "src/app/twitter-image.png"));

const ALT =
  "Shriansh Jena, derivatives trader and systems builder, Mumbai. Edge is engineered. Backtest CAGR 27.24 percent, alert latency 10 seconds, 200 plus ISINs.";
await writeFile(path.join(ROOT, "src/app/opengraph-image.alt.txt"), ALT);
await writeFile(path.join(ROOT, "src/app/twitter-image.alt.txt"), ALT);

const { size } = await stat(ogPath);
console.log(`opengraph-image.png ${Math.round(size / 1024)}KB`);
if (size > OG_BUDGET_BYTES) {
  console.error("OG image exceeds 300KB (WhatsApp drops large previews); reduce colors.");
  process.exit(1);
}
