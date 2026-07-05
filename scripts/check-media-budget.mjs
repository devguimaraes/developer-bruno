#!/usr/bin/env node

/**
 * Media Budget Check Script
 *
 * Verifica o tamanho total dos assets da home page contra o orçamento
 * de performance definido em src/config/site.ts.
 *
 * Usage: node scripts/check-media-budget.mjs
 */

import { readFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

// Imagens carregadas no viewport inicial da home (contam para o budget)
const STRICT_HOME_IMAGES = [
  { path: "public/hero-render-1.webp", category: "images" },
  { path: "public/brunoGuimaraes.webp", category: "images" },
  { path: "public/avatar.webp", category: "images" },
];

const LAZY_HOME_IMAGES = [
  { path: "public/banner-movies-event-house-bremen.webp", category: "images" },
  { path: "public/banner-multi-macbook.webp", category: "images" },
  { path: "public/banner-danila-rizo.webp", category: "images" },
];

const VIDEO_FILES = [
  { path: "public/backgroundvideo.webm", category: "video" },
  { path: "public/backgroundvideo.mp4", category: "video" },
];

// Parse budget from site.ts
function parseBudget() {
  const configPath = resolve(rootDir, "src/config/site.ts");
  const content = readFileSync(configPath, "utf-8");

  const jsMatch = content.match(/javascript:\s*(\d+)/);
  const imgMatch = content.match(/images:\s*(\d+)/);
  const cssMatch = content.match(/css:\s*(\d+)/);
  const totalMatch = content.match(/total:\s*(\d+)/);

  return {
    javascript: jsMatch ? Number.parseInt(jsMatch[1], 10) : null,
    images: imgMatch ? Number.parseInt(imgMatch[1], 10) : null,
    css: cssMatch ? Number.parseInt(cssMatch[1], 10) : null,
    total: totalMatch ? Number.parseInt(totalMatch[1], 10) : null,
  };
}

function getFileSizes(files) {
  return files.map(({ path, category }) => {
    const fullPath = resolve(rootDir, path);
    try {
      const stats = statSync(fullPath);
      return { path, category, size: stats.size, exists: true };
    } catch {
      return { path, category, size: 0, exists: false };
    }
  });
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function main() {
  const budget = parseBudget();

  console.log("=".repeat(60));
  console.log("  Media Budget Check");
  console.log("=".repeat(60));
  console.log();

  console.log("Performance Budget:");
  console.log(`  JavaScript: ${formatSize(budget.javascript)}`);
  console.log(`  Images:     ${formatSize(budget.images)}`);
  console.log(`  CSS:        ${formatSize(budget.css)}`);
  console.log(`  Total:      ${formatSize(budget.total)}`);
  console.log();

  console.log("Initial Home Page Images:");
  const strictImageFiles = getFileSizes(STRICT_HOME_IMAGES);
  let totalStrictImages = 0;
  for (const file of strictImageFiles) {
    const status = file.exists ? "" : " [NOT FOUND]";
    console.log(`  ${file.path.padEnd(45)} ${formatSize(file.size).padStart(10)}${status}`);
    if (file.exists) totalStrictImages += file.size;
  }
  console.log(`  ${"-".repeat(55)}`);
  console.log(`  TOTAL STRICT IMAGES: ${formatSize(totalStrictImages).padStart(10)}`);
  console.log();

  console.log("Lazy Home Page Images (informational only):");
  const lazyImageFiles = getFileSizes(LAZY_HOME_IMAGES);
  let totalLazyImages = 0;
  for (const file of lazyImageFiles) {
    const status = file.exists ? "" : " [NOT FOUND]";
    console.log(`  ${file.path.padEnd(45)} ${formatSize(file.size).padStart(10)}${status}`);
    if (file.exists) totalLazyImages += file.size;
  }
  console.log(`  ${"-".repeat(55)}`);
  console.log(`  TOTAL LAZY IMAGES: ${formatSize(totalLazyImages).padStart(10)}`);
  console.log();

  const imagesOverBudget = budget.images !== null && totalStrictImages > budget.images;
  const imageBudgetStatus = imagesOverBudget ? "❌ OVER BUDGET" : "✅ OK";

  console.log(`Image Budget:  ${formatSize(budget.images)}`);
  console.log(`Strict Actual: ${formatSize(totalStrictImages)}`);
  console.log(`Status:        ${imageBudgetStatus}`);
  console.log();

  console.log("Home Page Videos (lazy loaded, informational only):");
  const videoFiles = getFileSizes(VIDEO_FILES);
  let totalVideo = 0;
  for (const file of videoFiles) {
    const status = file.exists ? "" : " [NOT FOUND]";
    console.log(`  ${file.path.padEnd(45)} ${formatSize(file.size).padStart(10)}${status}`);
    if (file.exists) totalVideo += file.size;
  }
  console.log(`  ${"-".repeat(55)}`);
  console.log(`  TOTAL VIDEO: ${formatSize(totalVideo).padStart(10)}`);
  console.log();

  const totalStrictMedia = totalStrictImages;
  const totalInformationalMedia = totalStrictImages + totalLazyImages + totalVideo;
  const totalOverBudget = budget.total !== null && totalStrictMedia > budget.total;
  const totalStatus = totalOverBudget ? "❌ OVER BUDGET" : "✅ OK";

  console.log(`Total Budget:  ${formatSize(budget.total)}`);
  console.log(`Strict Media:  ${formatSize(totalStrictMedia)}`);
  console.log(`All Media:     ${formatSize(totalInformationalMedia)} (informational)`);
  console.log(`Status:        ${totalStatus}`);
  console.log();

  console.log("=".repeat(60));
  let hasErrors = false;

  if (imagesOverBudget) {
    const over = totalStrictImages - budget.images;
    console.log(`❌ IMAGES: ${formatSize(over)} over budget of ${formatSize(budget.images)}`);
    hasErrors = true;
  } else {
    const remaining = budget.images - totalStrictImages;
    console.log(`✅ IMAGES: ${formatSize(remaining)} remaining from budget`);
  }

  if (totalOverBudget) {
    const over = totalStrictMedia - budget.total;
    console.log(`❌ TOTAL: ${formatSize(over)} over budget of ${formatSize(budget.total)}`);
    hasErrors = true;
  } else {
    const remaining = budget.total - totalStrictMedia;
    console.log(`✅ TOTAL: ${formatSize(remaining)} remaining from budget`);
  }

  console.log("=".repeat(60));

  if (hasErrors) {
    console.log("\n⚠️  Some budgets are exceeded. Run optimize:media to convert remaining images.");
  } else {
    console.log("\n✅ All budgets are within limits.");
  }

  process.exit(imagesOverBudget ? 1 : 0);
}

main();
