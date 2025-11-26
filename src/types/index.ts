/**
 * Type definitions for all portfolio data structures
 */

// Base project interface
export interface Project {
  id: string;
  title: string;
  description: string;
  tech: readonly string[];
  github: string;
  live: string;
  color: string;
  featured?: boolean;
  tags?: readonly string[];
  image?: string;
}

// Work experience interface
export interface Experience {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
  achievements: readonly string[];
  location?: string;
  type?: 'full-time' | 'part-time' | 'freelance' | 'contract';
}

// Skill/technology interface
export interface Skill {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>; // Lucide icon component
  title: string;
  description: string;
  color: string;
  category: 'development' | 'design' | 'performance' | 'deployment';
  technologies?: readonly string[];
}

// Social link interface
export interface SocialLink {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>; // Lucide icon component
  href: string;
  label: string;
  username?: string;
}

// Site configuration interface
export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  email: string;
  phone?: string;
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
    keywords: readonly string[];
    image: string;
    siteName: string;
  };
}

// Hero section specific data
export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
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
  badge: string;
  technologies: readonly {
    name: string;
    icon: string;
    alt: string;
  }[];
}

// Contact section data
export interface ContactData {
  title: string;
  description: string;
  email: string;
  socialLinks: readonly SocialLink[];
}

// Portfolio navigation sections
export type Section = 'hero' | 'about' | 'experience' | 'projects' | 'contact';

// Content validation helpers
export interface ContentValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Re-export SEO and performance types
export * from './seo';

