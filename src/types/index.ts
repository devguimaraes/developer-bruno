export * from "./blog";

export interface Project {
  id: string;
  title: string;
  description: string;
  /** Display category (e.g. "Event Platform", "Agency Website") */
  category: string;
  tech: readonly string[];
  github: string;
  live: string;
  color: string;
  featured?: boolean;
  tags?: readonly string[];
  /** Main project thumbnail/screenshot */
  image: string;
  /** Banner image for project card display (falls back to image if not set) */
  bannerImage?: string;
  previewAnimation?: "pixel-blast" | "grid-scan" | "letter-glitch" | "faulty-terminal";
  /** DEV-76: Role played in the project */
  role?: string;
  /** DEV-75: Problem/context of the project */
  context?: string;
  /** DEV-75: Measurable impact/result */
  impact?: string;
  /** DEV-84: Slug for case study routing */
  slug?: string;
  /** DEV-82: Related blog post slugs for cross-linking */
  relatedPosts?: readonly string[];
}

// Work experience interface
export interface Experience {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
  achievements: readonly string[];
  tech: readonly string[];
  location?: string;
  type?: "full-time" | "part-time" | "freelance" | "contract";
}

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
    keywords: readonly string[];
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

// Portfolio navigation sections
export type Section = "hero" | "about" | "experience" | "projects" | "contact";

// Content validation helpers
export interface ContentValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Analytics Event Interface
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

// Error Boundary State
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}
