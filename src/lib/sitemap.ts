import { siteConfig } from '../config/site';
import type { SitemapEntry } from '../types';

/**
 * Brazilian market sitemap configuration
 */
const SITEMAP_CONFIG = {
  changefreq: {
    HOME: 'daily',
    ABOUT: 'monthly',
    PROJECTS: 'weekly',
    BLOG: 'weekly',
    CONTACT: 'monthly',
    STATIC: 'monthly'
  },
  priority: {
    HOME: 1.0,
    PROJECTS: 0.9,
    BLOG: 0.8,
    ABOUT: 0.7,
    CONTACT: 0.6,
    STATIC: 0.5
  }
};

/**
 * Generate sitemap entries for Brazilian search engines
 */
export const generateSitemapEntries = (): SitemapEntry[] => {
  const baseUrl = siteConfig.domain;
  const currentDate = new Date().toISOString().split('T')[0];

  const entries: SitemapEntry[] = [
    // Main page
    {
      path: '/',
      changefreq: SITEMAP_CONFIG.changefreq.HOME,
      priority: SITEMAP_CONFIG.priority.HOME,
      lastmod: currentDate
    },

    // About section
    {
      path: '/#about',
      changefreq: SITEMAP_CONFIG.changefreq.ABOUT,
      priority: SITEMAP_CONFIG.priority.ABOUT,
      lastmod: currentDate
    },

    // Projects section
    {
      path: '/#projects',
      changefreq: SITEMAP_CONFIG.changefreq.PROJECTS,
      priority: SITEMAP_CONFIG.priority.PROJECTS,
      lastmod: currentDate
    },

    // Blog section
    {
      path: '/#blog',
      changefreq: SITEMAP_CONFIG.changefreq.BLOG,
      priority: SITEMAP_CONFIG.priority.BLOG,
      lastmod: currentDate
    },

    // Services section
    {
      path: '/#services',
      changefreq: SITEMAP_CONFIG.changefreq.STATIC,
      priority: SITEMAP_CONFIG.priority.STATIC,
      lastmod: currentDate
    },

    // Experience section
    {
      path: '/#experience',
      changefreq: SITEMAP_CONFIG.changefreq.STATIC,
      priority: SITEMAP_CONFIG.priority.STATIC,
      lastmod: currentDate
    },

    // Skills section
    {
      path: '/#skills',
      changefreq: SITEMAP_CONFIG.changefreq.STATIC,
      priority: SITEMAP_CONFIG.priority.STATIC,
      lastmod: currentDate
    },

    // Contact section
    {
      path: '/#contact',
      changefreq: SITEMAP_CONFIG.changefreq.CONTACT,
      priority: SITEMAP_CONFIG.priority.CONTACT,
      lastmod: currentDate
    },

    // Static pages
    {
      path: '/robots.txt',
      changefreq: SITEMAP_CONFIG.changefreq.STATIC,
      priority: SITEMAP_CONFIG.priority.STATIC,
      lastmod: currentDate
    },
    {
      path: '/sitemap.xml',
      changefreq: SITEMAP_CONFIG.changefreq.STATIC,
      priority: SITEMAP_CONFIG.priority.STATIC,
      lastmod: currentDate
    }
  ];

  return entries;
};

/**
 * Generate XML sitemap for Brazilian market
 */
export const generateSitemap = (): string => {
  const entries = generateSitemapEntries();
  const currentDate = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(entry => `  <url>
    <loc>${entry.path === '/' ? siteConfig.domain : `${siteConfig.domain}${entry.path}`}</loc>
    <lastmod>${entry.lastmod || currentDate}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
    ${entry.path === '/' ? `
    <xhtml:link rel="alternate" hreflang="pt-br" href="${siteConfig.domain}/" />` : ''}
    ${entry.path === '/' ? `
    <xhtml:link rel="alternate" hreflang="en" href="${siteConfig.domain}/en/" />` : ''}
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

/**
 * Generate sitemap index for multiple sitemaps
 */
export const generateSitemapIndex = (): string => {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteConfig.domain}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

  return sitemapIndex;
};

/**
 * Brazilian search engine specific configurations
 */
export const BRAZILIAN_SEARCH_ENGINES = {
  google: {
    name: 'Google Brazil',
    submitUrl: 'https://search.google.com/search-console/',
    priority: 1
  },
  bing: {
    name: 'Bing Brazil',
    submitUrl: 'https://www.bing.com/webmasters/',
    priority: 2
  },
  duckduckgo: {
    name: 'DuckDuckGo',
    submitUrl: 'https://duckduckgo.com/',
    priority: 3
  },
  yahoo: {
    name: 'Yahoo Brazil',
    submitUrl: 'https://search.yahoo.com/',
    priority: 4
  },
  eco: {
    name: 'Ecosia Brazil',
    submitUrl: 'https://www.ecosia.org/',
    priority: 5
  }
};

/**
 * Generate robots.txt for Brazilian market
 */
export const generateRobotsTxt = (): string => {
  const robotsTxt = `# Brazilian Market SEO - Robots.txt
# Website: ${siteConfig.domain}

User-agent: *
Allow: /

# Priority for Brazilian search engines
User-agent: Googlebot
Crawl-delay: 1

User-agent: msnbot
Crawl-delay: 1

User-agent: duckduckbot
Crawl-delay: 1

# Block common crawlers that don't add value
User-agent: AhrefsBot
Disallow: /admin/
Disallow: /private/
Disallow: /*.json$

User-agent: MJ12bot
Disallow: /

User-agent: SemrushBot
Disallow: /admin/
Disallow: /private/

# Allow all content for Brazilian users
Allow: /
Allow: /#*
Allow: /*.css
Allow: /*.js
Allow: /*.png
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.webp
Allow: /*.svg

# Sitemap location
Sitemap: ${siteConfig.domain}/sitemap.xml

# Brazilian market specific
# Geotarget Brazil
# Language: pt-BR
# Region: BR
# Currency: BRL

# Optimization for Brazilian mobile networks
# Consider 3G/4G performance
# Fast loading is priority
`;

  return robotsTxt;
};

/**
 * Generate hreflang tags for Brazilian and English
 */
export const generateHrefLangTags = (): Array<{rel: string; hrefLang: string; href: string}> => {
  const baseUrl = siteConfig.domain;

  return [
    {
      rel: 'alternate',
      hrefLang: 'pt-br',
      href: baseUrl
    },
    {
      rel: 'alternate',
      hrefLang: 'pt',
      href: baseUrl
    },
    {
      rel: 'alternate',
      hrefLang: 'en',
      href: `${baseUrl}/en`
    },
    {
      rel: 'alternate',
      hrefLang: 'x-default',
      href: baseUrl
    }
  ];
};

/**
 * Validate sitemap entries for Brazilian compliance
 */
export const validateSitemapEntry = (entry: SitemapEntry): boolean => {
  // Check if path is valid
  if (!entry.path || typeof entry.path !== 'string') {
    return false;
  }

  // Check if changefreq is valid
  const validChangefreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
  if (!validChangefreqs.includes(entry.changefreq)) {
    return false;
  }

  // Check if priority is valid (0.0 to 1.0)
  if (entry.priority < 0 || entry.priority > 1) {
    return false;
  }

  // Check if lastmod is valid date format
  if (entry.lastmod) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(entry.lastmod)) {
      return false;
    }
  }

  return true;
};

export default generateSitemap;