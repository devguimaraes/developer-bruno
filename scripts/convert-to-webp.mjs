import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";

const ASSETS_DIR = "./src/assets";
const PUBLIC_DIR = "./public";
const QUALITY = 85;

async function convertToWebP(inputPath, outputPath) {
  const stats = await stat(inputPath);
  const originalSize = stats.size;

  await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);

  const newStats = await stat(outputPath);
  const newSize = newStats.size;
  const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

  console.log(`✅ ${parse(inputPath).base} -> ${parse(outputPath).base}`);
  console.log(
    `   ${(originalSize / 1024).toFixed(0)}KB -> ${(newSize / 1024).toFixed(
      0
    )}KB (${savings}% smaller)`
  );

  return { original: originalSize, converted: newSize };
}

async function processDirectory(dir) {
  const files = await readdir(dir);
  let totalOriginal = 0;
  let totalConverted = 0;

  for (const file of files) {
    const ext = parse(file).ext.toLowerCase();
    if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
      const inputPath = join(dir, file);
      const outputPath = join(dir, `${parse(file).name}.webp`);

      try {
        const { original, converted } = await convertToWebP(
          inputPath,
          outputPath
        );
        totalOriginal += original;
        totalConverted += converted;
      } catch (err) {
        console.error(`❌ Failed to convert ${file}:`, err.message);
      }
    }
  }

  return { totalOriginal, totalConverted };
}

async function main() {
  console.log("🖼️  Converting images to WebP...\n");

  console.log("📁 Processing src/assets...");
  const assets = await processDirectory(ASSETS_DIR);

  console.log("\n📁 Processing public...");
  const pub = await processDirectory(PUBLIC_DIR);

  const totalOriginal = assets.totalOriginal + pub.totalOriginal;
  const totalConverted = assets.totalConverted + pub.totalConverted;
  const totalSavings = (
    ((totalOriginal - totalConverted) / totalOriginal) *
    100
  ).toFixed(1);

  console.log("\n========================================");
  console.log(
    `📊 Total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB -> ${(
      totalConverted /
      1024 /
      1024
    ).toFixed(2)}MB`
  );
  console.log(
    `💾 Savings: ${((totalOriginal - totalConverted) / 1024 / 1024).toFixed(
      2
    )}MB (${totalSavings}%)`
  );
  console.log("========================================");
}

main().catch(console.error);
