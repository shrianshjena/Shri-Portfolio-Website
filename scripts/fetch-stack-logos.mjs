/* One-off: vendor every stack logo into public/images/stack. The site CSP
 * is img-src 'self', so nothing may hot-link at runtime.
 * Run: node scripts/fetch-stack-logos.mjs */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const DEST_DIR = path.join(ROOT, "public/images/stack");
const OLD_REPO =
  "https://raw.githubusercontent.com/shrianshjena/shrianshjena/main/src/assets/icons";
const SIMPLE_ICONS = "https://cdn.simpleicons.org";

/* svg marks carried over from the old portfolio repo. Several old-repo
 * svgs (veo, gamma, antigravity, notion, figma, runway) are generic
 * placeholder glyphs, not brand marks; those tools come from the raster
 * or Simple Icons lists below instead. */
const REPO_SVGS = [
  "sql",
  "excel",
  "powerbi",
  "tableau",
  "powerpoint",
  "vscode",
  "replit",
  "lovable",
  "cursor",
  "midjourney",
  "kling",
  "groq",
  "canva",
];

/* raster marks from the old repo, normalized to 128px-tall webp. */
const REPO_RASTERS = [
  { slug: "chatgpt", file: "chatgpt.webp" },
  { slug: "elevenlabs", file: "elevenlabs.png" },
  { slug: "flow", file: "flow.png" },
  { slug: "gamma", file: "gamma.png" },
  { slug: "veo", file: "veo.png" },
  { slug: "antigravity", file: "antigravity-new.png" },
  { slug: "runway", file: "runway.png" },
];

/* marks the old repo hot-linked from a CDN; vendored from Simple Icons
 * (CC0 icon set; the marks themselves remain their owners' trademarks,
 * used nominatively). */
const SIMPLE = [
  { slug: "python", icon: "python" },
  { slug: "github", icon: "github" },
  { slug: "huggingface", icon: "huggingface" },
  { slug: "langchain", icon: "langchain" },
  { slug: "claude", icon: "claude" },
  { slug: "gemini", icon: "googlegemini" },
  { slug: "perplexity", icon: "perplexity" },
  { slug: "notion", icon: "notion" },
  { slug: "figma", icon: "figma" },
];

async function fetchBytes(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

await mkdir(DEST_DIR, { recursive: true });

for (const slug of REPO_SVGS) {
  const bytes = await fetchBytes(`${OLD_REPO}/${slug}.svg`);
  await writeFile(path.join(DEST_DIR, `${slug}.svg`), bytes);
  console.log(`svg    ${slug}.svg ${bytes.length}B`);
}

for (const { slug, file } of REPO_RASTERS) {
  const bytes = await fetchBytes(`${OLD_REPO}/${file}`);
  const out = path.join(DEST_DIR, `${slug}.webp`);
  await sharp(bytes).resize({ height: 128 }).webp({ quality: 82 }).toFile(out);
  console.log(`raster ${slug}.webp`);
}

for (const { slug, icon } of SIMPLE) {
  const bytes = await fetchBytes(`${SIMPLE_ICONS}/${icon}/F0F0F8`);
  await writeFile(path.join(DEST_DIR, `${slug}.svg`), bytes);
  console.log(`svg    ${slug}.svg ${bytes.length}B (simpleicons)`);
}

console.log("done");
