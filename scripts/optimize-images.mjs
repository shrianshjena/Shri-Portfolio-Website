/* One-off: source photography -> sized webp under public/images. Exits
 * non-zero if any output exceeds its byte budget.
 * Run: node scripts/optimize-images.mjs */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const BUDGET_BYTES = 250 * 1024;

const SOURCES = [
  {
    src: "C:/Users/Admin/Shriansh Pictures/Shri_Vessel Pluto 2.png",
    dest: "public/images/record/solas-portrait.webp",
    width: 800,
    height: 1067,
    quality: 78,
  },
  {
    src: "C:/Users/Admin/SOLAS MODU/SOLAS MODU_CARLTSOLAS_Website Images/Jack-Up Rig.png",
    dest: "public/images/field-record.webp",
    width: 1600,
    quality: 78,
  },
  {
    src: "C:/Users/Admin/Personal Portfolio Website/alsandjos.com.png",
    dest: "public/images/record/als-and-jos.webp",
    width: 1000,
    quality: 78,
  },
  {
    src: "C:/Users/Admin/Personal Portfolio Website/Financial-Performance.png",
    dest: "public/images/record/deepsea-finvest.webp",
    width: 1000,
    quality: 78,
  },
  {
    src: "C:/Users/Admin/Shriansh Pictures/SJ Profile Pic 2.jpg",
    dest: "public/images/position-portrait.webp",
    width: 800,
    height: 1067,
    quality: 78,
  },
  {
    src: "C:/Users/Admin/Carltsolas Website/CARLTSOLAS vessel.png",
    dest: "public/images/projects/project-carltsolas.webp",
    width: 1200,
    quality: 72,
  },
];

let failed = false;
for (const item of SOURCES) {
  const out = path.join(ROOT, item.dest);
  await mkdir(path.dirname(out), { recursive: true });
  let pipeline = sharp(item.src).rotate();
  pipeline = item.height
    ? pipeline.resize(item.width, item.height, { fit: "cover", position: "centre" })
    : pipeline.resize({ width: item.width });
  await pipeline.webp({ quality: item.quality }).toFile(out);
  const { size } = await stat(out);
  const over = size > BUDGET_BYTES;
  if (over) failed = true;
  console.log(`${over ? "OVER " : "ok   "} ${item.dest} ${Math.round(size / 1024)}KB`);
}

if (failed) {
  console.error("One or more outputs exceed the 250KB budget; lower quality and re-run.");
  process.exit(1);
}
