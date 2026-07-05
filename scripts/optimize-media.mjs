/**
 * Converte PNG/JPEG em public/ para WebP (qualidade visual ~82).
 * Processa todos os arquivos automaticamente — sem lista hardcoded.
 * Uso: node scripts/optimize-media.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");

const QUALITY = 82;

async function convertToWebP(inputPath, outputPath) {
  const inStat = fs.statSync(inputPath);
  await sharp(inputPath)
    .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
    .toFile(outputPath);
  const outStat = fs.statSync(outputPath);
  console.log(
    `${path.basename(inputPath)} → ${path.basename(outputPath)} (${(inStat.size / 1024).toFixed(0)} KB → ${(outStat.size / 1024).toFixed(0)} KB)`
  );
}

async function main() {
  const entries = fs.readdirSync(publicDir, { recursive: true });
  let converted = 0;

  for (const entry of entries) {
    const fullPath = path.join(publicDir, entry);
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) continue;

    const ext = path.extname(entry).toLowerCase();
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") continue;

    const webpPath = fullPath.replace(/\.(png|jpe?g)$/i, ".webp");
    if (fs.existsSync(webpPath)) {
      console.log(`skip (webp exists): ${entry}`);
      continue;
    }

    await convertToWebP(fullPath, webpPath);
    converted++;
  }

  if (converted === 0) {
    console.log("Nenhum PNG/JPEG pendente para conversão.");
  } else {
    console.log(`${converted} arquivo(s) convertido(s).`);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
