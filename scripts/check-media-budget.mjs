#!/usr/bin/env node

/**
 * Media Budget Check Script
 *
 * Reads the performanceBudget from src/config/site.ts and compares
 * the total size of all media files loaded on the home page against the budget.
 *
 * Usage: bun run scripts/check-media-budget.mjs
 */

import { readFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

// Files that load on the home page
const HOME_PAGE_MEDIA = [
  // Hero video posters
  { path: "public/hero-render-1.webp", category: "images" },
  { path: "public/about-avatar.jpg", category: "images" },

  // Project banners (loaded lazily)
  { path: "public/banner-movies-event-house-bremen.webp", category: "images" },
  { path: "public/banner-multi-macbook.webp", category: "images" },
  { path: "public/banner-danila-rizo.webp", category: "images" },

  // Navigation avatar
  { path: "public/avatar-bruno-bg.jpg", category: "images" },
];

const VIDEO_FILES = [
  // Hero background (browser downloads one of these)
  { path: "public/backgroundvideo.webm", category: "video" },
  { path: "public/backgroundvideo.mp4", category: "video" },

  // About avatar (browser downloads one of these)
  { path: "public/avatar-bio3.webm", category: "video" },
  { path: "public/avatar-bio3.mp4", category: "video" },
];

// Parse budget from site.ts
function parseBudget() {
  const configPath = resolve(rootDir, "src/config/site.ts");
  const content = readFileSync(configPath, "utf-8");

  // Extract performanceBudget values via regex
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

// Get file sizes
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

  // Budget summary
  console.log("Performance Budget:");
  console.log(`  JavaScript: ${formatSize(budget.javascript)}`);
  console.log(`  Images:     ${formatSize(budget.images)}`);
  console.log(`  CSS:        ${formatSize(budget.css)}`);
  console.log(`  Total:      ${formatSize(budget.total)}`);
  console.log();

  // Measure images
  console.log("Home Page Images:");
  const imageFiles = getFileSizes(HOME_PAGE_MEDIA);
  let totalImages = 0;
  for (const file of imageFiles) {
    const status = file.exists ? "" : " [NOT FOUND]";
    console.log(`  ${file.path.padEnd(45)} ${formatSize(file.size).padStart(10)}${status}`);
    if (file.exists) totalImages += file.size;
  }
  console.log(`  ${"-".repeat(55)}`);
  console.log(`  TOTAL IMAGES: ${formatSize(totalImages).padStart(10)}`);
  console.log();

  // Check budget
  const imagesOverBudget = budget.images !== null && totalImages > budget.images;
  const imageBudgetStatus = imagesOverBudget ? "❌ OVER BUDGET" : "✅ OK";

  console.log(`Image Budget:  ${formatSize(budget.images)}`);
  console.log(`Actual:        ${formatSize(totalImages)}`);
  console.log(`Status:        ${imageBudgetStatus}`);
  console.log();

  // Measure videos (informational - videos are loaded lazily)
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

  // Total combined (for reference)
  const totalMedia = totalImages + totalVideo;
  const totalOverBudget = budget.total !== null && totalMedia > budget.total;
  const totalStatus = totalOverBudget ? "❌ OVER BUDGET" : "✅ OK";

  console.log(`Total Budget:  ${formatSize(budget.total)}`);
  console.log(`Total Media:   ${formatSize(totalMedia)}`);
  console.log(`Status:        ${totalStatus}`);
  console.log();

  // Summary
  console.log("=".repeat(60));
  let hasErrors = false;

  if (imagesOverBudget) {
    const over = totalImages - budget.images;
    console.log(`❌ IMAGES: ${formatSize(over)} over budget of ${formatSize(budget.images)}`);
    hasErrors = true;
  } else {
    const remaining = budget.images - totalImages;
    console.log(`✅ IMAGES: ${formatSize(remaining)} remaining from budget`);
  }

  if (totalOverBudget) {
    const over = totalMedia - budget.total;
    console.log(`❌ TOTAL: ${formatSize(over)} over budget of ${formatSize(budget.total)}`);
    hasErrors = true;
  } else {
    const remaining = budget.total - totalMedia;
    console.log(`✅ TOTAL: ${formatSize(remaining)} remaining from budget`);
    hasErrors = true; // videos are not counted in "total" but still push it over
  }

  console.log("=".repeat(60));

  if (hasErrors) {
    console.log("\n⚠️  Some budgets are exceeded. See docs/audit/media-performance-2026-05-05.md for recommendations.");
  } else {
    console.log("\n✅ All budgets are within limits.");
  }

  // Exit with non-zero if images budget exceeded (videos are lazy, exempt from strict check)
  process.exit(imagesOverBudget ? 1 : 0);
}

main();
