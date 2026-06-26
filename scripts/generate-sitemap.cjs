const fs = require("node:fs");
const path = require("node:path");

/**
 * Generate XML sitemap for Brazilian market
 * Reads configuration from src/config/site.ts to ensure consistency
 */
function generateSitemap() {
  const currentDate = new Date().toISOString().split("T")[0];

  // Import site configuration dynamically
  let siteConfig;
  try {
    // Read and parse the TypeScript config file (simple approach)
    const configPath = path.join(__dirname, "../src/config/site.ts");
    const configContent = fs.readFileSync(configPath, "utf8");

    // Extract domain from config using regex (simplified approach)
    const domainMatch = configContent.match(/domain:\s*['"]([^'"]+)['"]/);
    if (domainMatch) {
      siteConfig = { domain: domainMatch[1] };
    } else {
      // Fallback to correct domain
      siteConfig = { domain: "https://devguimaraes.com.br" };
    }
  } catch (_error) {
    console.warn("Warning: Could not read config file, using default domain");
    siteConfig = { domain: "https://devguimaraes.com.br" };
  }

  // Only canonical, crawlable URLs — no fragments (#about, #projects)
  const entries = [
    {
      path: "/",
      changefreq: "daily",
      priority: 1.0,
      lastmod: currentDate,
    },
    {
      path: "/blog",
      changefreq: "weekly",
      priority: 0.8,
      lastmod: currentDate,
    },
    {
      path: "/projetos/agencia-multi-br",
      changefreq: "monthly",
      priority: 0.7,
      lastmod: currentDate,
    },
    {
      path: "/projetos/movies-bremen",
      changefreq: "monthly",
      priority: 0.7,
      lastmod: currentDate,
    },
    {
      path: "/projetos/danila-rizo-palmieri",
      changefreq: "monthly",
      priority: 0.7,
      lastmod: currentDate,
    },
    {
      path: "/robots.txt",
      changefreq: "monthly",
      priority: 0.5,
      lastmod: currentDate,
    },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Brazilian Market SEO Sitemap -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries
  .map(
    entry => `  <url>
    <loc>${entry.path === "/" ? siteConfig.domain : `${siteConfig.domain}${entry.path}`}</loc>
    <lastmod>${entry.lastmod || currentDate}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
    ${
      entry.path === "/"
        ? `
    <xhtml:link rel="alternate" hreflang="pt-br" href="${siteConfig.domain}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteConfig.domain}/en/" />`
        : ""
    }
  </url>`
  )
  .join("\n")}
</urlset>`;

  return sitemap;
}

// Gerar o sitemap
const sitemap = generateSitemap();
const distPath = path.join(__dirname, "../dist", "sitemap.xml");

// Ensure dist directory exists
const distDir = path.dirname(distPath);
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(distPath, sitemap);
console.log("✅ Sitemap gerado com sucesso:", distPath);
console.log("🌐 URLs base:", sitemap.match(/<loc>https:\/\/[^<]+<\/loc>/g)?.[0]);
