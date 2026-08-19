/* One-off: SJ.png -> favicon.ico + app icons + manifest icons.
 * Run: node scripts/generate-icons.mjs */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const SOURCE = "C:/Users/Admin/Personal Portfolio Website/SJ.png";
const ROOT = path.resolve(import.meta.dirname, "..");

const PNG_TARGETS = [
  { dest: "src/app/icon.png", size: 512 },
  { dest: "src/app/apple-icon.png", size: 180 },
  { dest: "public/icons/icon-192.png", size: 192 },
  { dest: "public/icons/icon-512.png", size: 512 },
];
const ICO_SIZES = [16, 32, 48];

for (const { dest, size } of PNG_TARGETS) {
  const out = path.join(ROOT, dest);
  await mkdir(path.dirname(out), { recursive: true });
  await sharp(SOURCE).resize(size, size).png().toFile(out);
  console.log(`icon ${dest} ${size}x${size}`);
}

const icoPngs = await Promise.all(
  ICO_SIZES.map((size) => sharp(SOURCE).resize(size, size).png().toBuffer()),
);
await writeFile(path.join(ROOT, "src/app/favicon.ico"), await pngToIco(icoPngs));
console.log(`favicon.ico ${ICO_SIZES.join("/")}`);
