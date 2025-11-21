import type { SiteConfig, HeroData, ContactData } from '@/types';

/**
 * Site configuration and metadata
 */
export const siteConfig: SiteConfig = {
  title: 'Bruno Guimarães | Desenvolvedor Front-End',
  description: 'Desenvolvedor Front-End especializado em React, TypeScript e interfaces modernas. Transformando visão estratégica em software de alta performance.',
  author: 'Bruno Guimarães',
  email: 'bc.guimaraes@outlook.com',
  location: 'Rio de Janeiro, Brasil',
  domain: 'https://devguimaraes.dev',
  github: 'https://github.com/devguimaraes',
  linkedin: 'https://www.linkedin.com/in/bcguimaraes/',
  avatar: '/avatar.jpg',
  cv: {
    url: '/cv-bruno-guimaraes.pdf',
    filename: 'Bruno-Guimaraes-CV.pdf',
  },
  seo: {
    keywords: [
      'desenvolvedor front-end',
      'react developer',
      'typescript',
      'next.js',
      'ui developer',
      'web development',
      'bruno guimarães',
      'front-end rio de janeiro',
    ],
    image: '/og-image.jpg',
    siteName: 'Bruno Guimarães Portfolio',
  },
};

/**
 * Hero section specific configuration
 */
export const heroData: HeroData = {
  title: 'BRUNO',
  subtitle: 'GUIMARÃES',
  description: 'Transformo visão estratégica em software e sites de alta performance. Crio interfaces que unem engenharia robusta e design intencional para maximizar resultados.',
  badge: 'DESENVOLVEDOR FRONT END',
  cta: {
    primary: {
      text: 'Ver Projetos',
      href: '#projects',
    },
    secondary: {
      text: 'Download CV',
      href: siteConfig.cv?.url || '#',
    },
  },
  technologies: [
    {
      name: 'React',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      alt: 'React',
    },
    {
      name: 'Next.js',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      alt: 'Next.js',
    },
    {
      name: 'TypeScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      alt: 'TypeScript',
    },
    {
      name: 'Tailwind',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
      alt: 'Tailwind CSS',
    },
  ],
};

/**
 * Contact section configuration
 */
export const contactData: ContactData = {
  title: 'Vamos Conversar',
  description: 'Estou sempre aberto a discutir novos projetos, ideias criativas ou oportunidades de fazer parte da sua visão. Entre em contato!',
  email: 'bc.guimaraes@outlook.com',
  socialLinks: [
    {
      id: 'linkedin',
      icon: 'Linkedin', // Will be imported dynamically
      href: 'https://www.linkedin.com/in/bcguimaraes/',
      label: 'LinkedIn',
      username: 'bcguimaraes',
    },
    {
      id: 'github',
      icon: 'Github', // Will be imported dynamically
      href: 'https://github.com/devguimaraes',
      label: 'GitHub',
      username: 'devguimaraes',
    },
  ],
};

/**
 * Social links configuration
 */
export const socialLinks = [
  {
    id: 'github',
    href: 'https://github.com/devguimaraes',
    label: 'GitHub',
  },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/bcguimaraes/',
    label: 'LinkedIn',
  },
  {
    id: 'email',
    href: 'mailto:bc.guimaraes@outlook.com',
    label: 'Email',
  },
] as const;

/**
 * Navigation sections configuration
 */
export const navigationSections = [
  { id: 'hero', label: 'Início', href: '#hero' },
  { id: 'about', label: 'Sobre', href: '#about' },
  { id: 'experience', label: 'Experiência', href: '#experience' },
  { id: 'projects', label: 'Projetos', href: '#projects' },
  { id: 'contact', label: 'Contato', href: '#contact' },
] as const;

/**
 * Footer configuration
 */
export const footerData = {
  copyright: `© ${new Date().getFullYear()} ${siteConfig.author}. Todos os direitos reservados.`,
  builtWith: [
    { name: 'React', url: 'https://react.dev' },
    { name: 'TypeScript', url: 'https://typescriptlang.org' },
    { name: 'Vite', url: 'https://vitejs.dev' },
    { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
  ],
};

/**
 * Theme configuration
 */
export const themeConfig = {
  defaultTheme: 'dark' as const,
  themes: ['light', 'dark'] as const,
};

/**
 * Analytics configuration (for future implementation)
 */
export const analyticsConfig = {
  // Google Analytics, Plausible, etc.
  // Leave empty for now
  googleAnalyticsId: '',
  plausibleDomain: '',
};

/**
 * Performance budget configuration
 */
export const performanceBudget = {
  // Maximum bundle sizes in bytes
  javascript: 244 * 1024, // 244KB
  css: 50 * 1024, // 50KB
  images: 512 * 1024, // 512KB
  fonts: 200 * 1024, // 200KB
};

/**
 * Export all configurations
 */
export default siteConfig;