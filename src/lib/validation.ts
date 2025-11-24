import { z } from 'zod';

/**
 * Zod schemas for content validation
 */

// URL validation regex
const urlRegex = /^https?:\/\/.+/;

// Project schema
export const ProjectSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tech: z.array(z.string()).min(1, 'At least one technology is required'),
  github: z.string().url('Invalid GitHub URL').regex(urlRegex, 'GitHub URL must start with http/https'),
  live: z.string().url('Invalid live URL').regex(urlRegex, 'Live URL must start with http/https'),
  color: z.string().min(1, 'Color class is required'),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

// Experience schema
export const ExperienceSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  year: z.string().min(1, 'Year/Period is required'),
  role: z.string().min(1, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  achievements: z.array(z.string()).min(1, 'At least one achievement is required'),
  location: z.string().optional(),
  type: z.enum(['full-time', 'part-time', 'freelance', 'contract']).optional(),
});

// Skill schema
export const SkillSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  icon: z.instanceof(Function), // Lucide icon component
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  color: z.string().min(1, 'Color class is required'),
  category: z.enum(['development', 'design', 'performance', 'deployment']),
  technologies: z.array(z.string()).optional(),
});

// Social link schema
export const SocialLinkSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  icon: z.instanceof(Function), // Lucide icon component
  href: z.string().url('Invalid URL').regex(urlRegex, 'URL must start with http/https'),
  label: z.string().min(1, 'Label is required'),
  username: z.string().optional(),
});

// Site configuration schema
export const SiteConfigSchema = z.object({
  title: z.string().min(1, 'Site title is required'),
  description: z.string().min(10, 'Site description must be at least 10 characters'),
  author: z.string().min(1, 'Author name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  domain: z.string().url('Invalid domain URL').regex(urlRegex, 'Domain must start with http/https'),
  github: z.string().url('Invalid GitHub URL').regex(urlRegex, 'GitHub URL must start with http/https'),
  linkedin: z.string().url('Invalid LinkedIn URL').regex(urlRegex, 'LinkedIn URL must start with http/https'),
  avatar: z.string().min(1, 'Avatar path is required'),
  cv: z.object({
    url: z.string().min(1, 'CV URL is required'),
    filename: z.string().min(1, 'CV filename is required'),
  }).optional(),
  seo: z.object({
    keywords: z.array(z.string()).min(1, 'At least one SEO keyword is required'),
    image: z.string().min(1, 'SEO image path is required'),
    siteName: z.string().min(1, 'SEO site name is required'),
  }),
});

// Hero data schema
export const HeroDataSchema = z.object({
  title: z.string().min(1, 'Hero title is required'),
  subtitle: z.string().min(1, 'Hero subtitle is required'),
  description: z.string().min(20, 'Hero description must be at least 20 characters'),
  badge: z.string().min(1, 'Hero badge text is required'),
  cta: z.object({
    primary: z.object({
      text: z.string().min(1, 'Primary CTA text is required'),
      href: z.string().min(1, 'Primary CTA href is required'),
    }),
    secondary: z.object({
      text: z.string().min(1, 'Secondary CTA text is required'),
      href: z.string().min(1, 'Secondary CTA href is required'),
    }),
  }),
  technologies: z.array(z.object({
    name: z.string().min(1, 'Technology name is required'),
    icon: z.string().url('Invalid technology icon URL'),
    alt: z.string().min(1, 'Technology alt text is required'),
  })).min(1, 'At least one technology is required'),
});

// Contact data schema
export const ContactDataSchema = z.object({
  title: z.string().min(1, 'Contact title is required'),
  description: z.string().min(10, 'Contact description must be at least 10 characters'),
  email: z.string().email('Invalid contact email format'),
  socialLinks: z.array(SocialLinkSchema).min(1, 'At least one social link is required'),
});

// Validation functions
export const validateProject = (data: unknown) => {
  return ProjectSchema.safeParse(data);
};

export const validateExperience = (data: unknown) => {
  return ExperienceSchema.safeParse(data);
};

export const validateSkill = (data: unknown) => {
  return SkillSchema.safeParse(data);
};

export const validateSiteConfig = (data: unknown) => {
  return SiteConfigSchema.safeParse(data);
};

export const validateHeroData = (data: unknown) => {
  return HeroDataSchema.safeParse(data);
};

export const validateContactData = (data: unknown) => {
  return ContactDataSchema.safeParse(data);
};

// Type guards
export const isValidProject = (data: unknown): data is z.infer<typeof ProjectSchema> => {
  return validateProject(data).success;
};

export const isValidExperience = (data: unknown): data is z.infer<typeof ExperienceSchema> => {
  return validateExperience(data).success;
};

export const isValidSkill = (data: unknown): data is z.infer<typeof SkillSchema> => {
  return validateSkill(data).success;
};

export const isValidSiteConfig = (data: unknown): data is z.infer<typeof SiteConfigSchema> => {
  return validateSiteConfig(data).success;
};

export const isValidHeroData = (data: unknown): data is z.infer<typeof HeroDataSchema> => {
  return validateHeroData(data).success;
};

export const isValidContactData = (data: unknown): data is z.infer<typeof ContactDataSchema> => {
  return validateContactData(data).success;
};

// Validation error formatter
export const formatValidationErrors = (result: z.ZodError): string[] => {
  return result.errors.map(error => {
    const path = error.path.join('.');
    return `${path}: ${error.message}`;
  });
};

// Content validation helper
export const validateContent = <T>(
  data: unknown,
  validator: (data: unknown) => { success: boolean; error?: z.ZodError }
): { isValid: boolean; data?: T; errors: string[] } => {
  const result = validator(data);

  if (result.success) {
    return {
      isValid: true,
      data: result.data as T,
      errors: [],
    };
  }

  return {
    isValid: false,
    errors: result.error ? formatValidationErrors(result.error) : ['Unknown validation error'],
  };
};

export {
  ProjectSchema,
  ExperienceSchema,
  SkillSchema,
  SocialLinkSchema,
  SiteConfigSchema,
  HeroDataSchema,
  ContactDataSchema,
};