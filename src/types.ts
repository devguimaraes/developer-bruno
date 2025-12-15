/**
 * Type definitions for the site configuration and sitemap
 */

export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  email: string;
  location: string;
  domain: string;
  github: string;
  linkedin: string;
  avatar: string;
  cv: {
    url: string;
    filename: string;
  };
  seo: {
    keywords: string[];
    image: string;
    siteName: string;
    locale: string;
    region: string;
  };
  performanceBudget: {
    javascript: number;
    images: number;
    css: number;
    total: number;
  };
  brazilianMarket: {
    country: string;
    language: string;
    currency: string;
    locale: string;
    region: string;
    timezone: string;
    phoneNumber: string;
    serviceAreas: string[];
  };
}

export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  cta: {
    primary: {
      text: string;
      href: string;
    };
    secondary: {
      text: string;
      href: string;
    };
  };
  technologies: Array<{
    name: string;
    icon: string;
    alt: string;
  }>;
}

export interface ContactData {
  title: string;
  description: string;
  email: string;
  socialLinks: Array<{
    id: string;
    icon: string;
    href: string;
    label: string;
    username: string;
  }>;
}

export interface SitemapEntry {
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod?: string;
}

export interface PerformanceMetrics {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

export interface WebVitalsThresholds {
  LCP: number;
  FID: number;
  CLS: number;
  FCP: number;
  TTFB: number;
  INP: number;
}

export const BRAZILIAN_WEB_VITALS_THRESHOLDS: WebVitalsThresholds = {
  LCP: 2800, // Largest Contentful Paint (2.8s for Brazilian mobile networks)
  FID: 100,  // First Input Delay (100ms)
  CLS: 0.25, // Cumulative Layout Shift
  FCP: 1800, // First Contentful Paint (1.8s)
  TTFB: 800, // Time to First Byte (800ms for Brazilian servers)
  INP: 200,  // Interaction to Next Paint (200ms)
};

export interface Skill {
  id: string;
  icon: React.ComponentType;
  title: string;
  description: string;
  color: string;
  category: 'development' | 'design' | 'performance' | 'deployment';
  technologies: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: readonly string[];
  github: string;
  live: string;
  color: string;
  featured: boolean;
  tags: readonly string[];
  image: string;
}