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

  /** Article-specific metadata for blog posts */
  articleMeta?: {
    /** Article tags/categories */
    tags?: string[];
    /** Article section */
    section?: string;
    /** Reading time in minutes */
    readingTime?: number;
    /** Article word count */
    wordCount?: number;
  };
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
  data: Record<string, unknown>;
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