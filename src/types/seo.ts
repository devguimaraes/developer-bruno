/**
 * SEO types and interfaces for Brazilian market optimization
 */

export interface SEOProps {
  /** Page title - defaults to site title */
  title?: string;

  /** Page description - defaults to site description */
  description?: string;

  /** Additional keywords beyond site defaults */
  keywords?: string[];

  /** Social media image URL */
  image?: string;

  /** Canonical URL */
  url?: string;

  /** Page type for search engines */
  type?: 'website' | 'article' | 'profile' | 'portfolio';

  /** Language and region (default: pt_BR) */
  locale?: string;

  /** Author of the content */
  author?: string;

  /** Publication date */
  publishedDate?: string;

  /** Last modified date */
  modifiedDate?: string;

  /** Whether to noindex this page */
  noindex?: boolean;

  /** Whether to nofollow links on this page */
  nofollow?: boolean;
}

export interface OpenGraphProps {
  /** OpenGraph title */
  title?: string;

  /** OpenGraph description */
  description?: string;

  /** OpenGraph type */
  type?: string;

  /** OpenGraph URL */
  url?: string;

  /** OpenGraph image */
  image?: string;

  /** OpenGraph site name */
  siteName?: string;

  /** OpenGraph locale */
  locale?: string;
}

export interface TwitterCardProps {
  /** Twitter card type */
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';

  /** Twitter title */
  title?: string;

  /** Twitter description */
  description?: string;

  /** Twitter image */
  image?: string;

  /** Twitter site handle */
  site?: string;

  /** Twitter creator handle */
  creator?: string;
}

export interface StructuredDataProps {
  /** Structured data type */
  type: 'Person' | 'WebSite' | 'Project' | 'WorkExperience' | 'ContactPoint' | 'ProfessionalService';

  /** Structured data content */
  data: Record<string, any>;
}

export interface PerformanceMetrics {
  /** Largest Contentful Paint */
  lcp?: number;

  /** First Input Delay */
  fid?: number;

  /** Cumulative Layout Shift */
  cls?: number;

  /** Interaction to Next Paint */
  inp?: number;

  /** Time to First Byte */
  ttfb?: number;

  /** First Contentful Paint */
  fcp?: number;
}

export interface AnalyticsEvent {
  /** Event name */
  name: string;

  /** Event properties */
  props?: Record<string, string | number | boolean>;

  /** Event URL */
  url?: string;
}

export interface ErrorBoundaryState {
  /** Whether an error occurred */
  hasError: boolean;

  /** The error that occurred */
  error?: Error;

  /** Error info from React */
  errorInfo?: React.ErrorInfo;
}

export interface SitemapEntry {
  /** URL path */
  path: string;

  /** Change frequency */
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

  /** Priority 0.0-1.0 */
  priority: number;

  /** Last modification date */
  lastmod?: string;
}

/**
 * Brazilian SEO specific interfaces
 */

export interface BrazilianSEOOptimization {
  /** Keywords specific to Brazilian market */
  brazilianKeywords: string[];

  /** Local business information */
  localBusiness?: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    email?: string;
  };

  /** Service areas in Brazil */
  serviceAreas?: string[];

  /** Brazilian market specifics */
  market: {
    locale: 'pt_BR';
    region: 'BR';
    currency: 'BRL';
    language: 'Português';
  };
}

export interface RichSnippetProps {
  /** Rich snippet type */
  type: 'software' | 'service' | 'article' | 'product' | 'event';

  /** Rich snippet data */
  data: {
    name?: string;
    description?: string;
    image?: string;
    url?: string;
    price?: string;
    rating?: number;
    reviewCount?: number;
    provider?: string;
    offers?: {
      price?: string;
      priceCurrency?: string;
      availability?: string;
    };
  };
}

export interface WebVitalsThresholds {
  /** LCP threshold in milliseconds (Good: <2500) */
  lcp: number;

  /** FID threshold in milliseconds (Good: <100) */
  fid: number;

  /** CLS threshold (Good: <0.1) */
  cls: number;

  /** INP threshold in milliseconds (Good: <200) */
  inp: number;

  /** TTFB threshold in milliseconds (Good: <800) */
  ttfb: number;
}

/**
 * Default Brazilian market thresholds
 */
export const BRAZILIAN_WEB_VITALS_THRESHOLDS: WebVitalsThresholds = {
  lcp: 2500, // Conservative for 3G networks
  fid: 100,
  cls: 0.1,
  inp: 200,
  ttfb: 800, // Consider Brazilian network conditions
};

/**
 * Default Brazilian SEO configuration
 */
export const DEFAULT_BRAZILIAN_SEO: BrazilianSEOOptimization = {
  brazilianKeywords: [
    'desenvolvedor front-end Brasil',
    'programador React Rio de Janeiro',
    'desenvolvedor TypeScript Brasil',
    'portfolio desenvolvedor web',
    'Bruno Guimarães front-end',
    'desenvolvedor web São Paulo',
    'programador JavaScript Brasil',
    'front-end developer Brasil',
    'desenvolvedor React Brasil',
    'portfolio desenvolvimento web'
  ],
  market: {
    locale: 'pt_BR',
    region: 'BR',
    currency: 'BRL',
    language: 'Português'
  }
};