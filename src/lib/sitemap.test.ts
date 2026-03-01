import { describe, it, expect } from 'vitest';
import { 
  generateSitemapEntries, 
  generateSitemap, 
  generateRobotsTxt, 
  validateSitemapEntry 
} from './sitemap';
import { siteConfig } from '../config/site';

describe('Sitemap Utils', () => {
  describe('generateSitemapEntries', () => {
    it('should return an array of sitemap entries', () => {
      const entries = generateSitemapEntries();
      expect(Array.isArray(entries)).toBe(true);
      expect(entries.length).toBeGreaterThan(5);
    });

    it('should include the home page entry', () => {
      const entries = generateSitemapEntries();
      const home = entries.find(e => e.path === '/');
      expect(home).toBeDefined();
      expect(home?.priority).toBe(1.0);
    });
  });

  describe('generateSitemap', () => {
    it('should return a valid XML string', () => {
      const sitemap = generateSitemap();
      expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(sitemap).toContain('<urlset');
      expect(sitemap).toContain(siteConfig.domain);
    });

    it('should include hreflang links for the home page', () => {
      const sitemap = generateSitemap();
      expect(sitemap).toContain('hreflang="pt-br"');
      expect(sitemap).toContain('hreflang="en"');
    });
  });

  describe('generateRobotsTxt', () => {
    it('should include sitemap location', () => {
      const robots = generateRobotsTxt();
      expect(robots).toContain(`Sitemap: ${siteConfig.domain}/sitemap.xml`);
    });

    it('should allow crawling the root', () => {
      const robots = generateRobotsTxt();
      expect(robots).toContain('User-agent: *');
      expect(robots).toContain('Allow: /');
    });
  });

  describe('validateSitemapEntry', () => {
    it('should return true for valid entry', () => {
      const validEntry = {
        path: '/test',
        changefreq: 'daily' as const,
        priority: 0.8,
        lastmod: '2023-12-01'
      };
      expect(validateSitemapEntry(validEntry)).toBe(true);
    });

    it('should return false for invalid priority', () => {
      const invalidEntry = {
        path: '/test',
        changefreq: 'daily' as const,
        priority: 1.5,
        lastmod: '2023-12-01'
      };
      expect(validateSitemapEntry(invalidEntry)).toBe(false);
    });

    it('should return false for invalid date format', () => {
      const invalidEntry = {
        path: '/test',
        changefreq: 'daily' as const,
        priority: 0.5,
        lastmod: '2023/12/01'
      };
      expect(validateSitemapEntry(invalidEntry)).toBe(false);
    });
  });
});
