/**
 * Gera WebP a partir de PNG/JPEG em public/ (qualidade visual ~82).
 * Uso: node scripts/optimize-media.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");

const files = [
  "banner-movies-event-house-bremen.png",
  "banner-danila-rizo.png",
  "banner-multi-macbook.png",
  "hero-render-1.png",
  "project-render-1.png",
  "project-render-2.png",
  "movies-event-house.png",
  "agencia-multi-br-banner.png",
  "kqrh-banner.jpg",
];

async function main() {
  for (const name of files) {
    const input = path.join(publicDir, name);
    if (!fs.existsSync(input)) {
      console.warn(`skip (missing): ${name}`);
      continue;
    }
    const base = name.replace(/\.(png|jpe?g)$/i, "");
    const output = path.join(publicDir, `${base}.webp`);
    await sharp(input)
      .webp({ quality: 82, effort: 6, smartSubsample: true })
      .toFile(output);
    const inStat = fs.statSync(input);
    const outStat = fs.statSync(output);
    console.log(
      `${name} → ${base}.webp (${(inStat.size / 1024).toFixed(0)} KB → ${(outStat.size / 1024).toFixed(0)} KB)`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
