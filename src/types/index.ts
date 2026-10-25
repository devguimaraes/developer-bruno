export * from "./blog";

export interface Skill {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  category: "development" | "design" | "performance" | "deployment";
  technologies?: readonly string[];
}

export interface SocialLink {
  id: string;
  href: string;
  label: string;
  username?: string;
}

// Site configuration interface
export interface SiteConfig {
  title: string;
  titleTemplate?: string;
  description: string;
  author: string;
  email: string;
  location: string;
  domain: string;
  github: string;
  linkedin: string;
  avatar: string;
  cv?: {
    url: string;
    filename: string;
  };
  seo: {
    image: string;
    siteName: string;
    locale?: string;
    region?: string;
  };
  performanceBudget?: {
    javascript: number;
    images: number;
    css: number;
    total: number;
  };
  brazilianMarket?: {
    country: string;
    language: string;
    currency: string;
    locale: string;
    region: string;
    timezone: string;
    serviceAreas: string[];
  };
}

export interface ContactData {
  title: string;
  description: string;
  email: string;
  socialLinks: readonly SocialLink[];
}
