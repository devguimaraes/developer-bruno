import type { Project } from '@/types';

/**
 * Projects data with external links and proper categorization
 */
export const projects: readonly Project[] = [
  {
    id: 'ecommerce-platform',
    title: 'E-commerce Platform',
    description:
      'Plataforma de e-commerce construída com Next.js 14, Stripe e Tailwind CSS. Performance otimizada com ISR e edge functions para produtos dinâmicos.',
    tech: ['Next.js', 'TypeScript', 'Tailwind', 'Stripe', 'Prisma'] as const,
    github: 'https://github.com/devguimaraes/ecommerce-platform',
    live: 'https://ecommerce-demo.devguimaraes.dev',
    color: 'bg-accent',
    featured: true,
    tags: ['e-commerce', 'next.js', 'stripe', 'full-stack'] as const,
  },
  {
    id: 'design-system',
    title: 'Design System',
    description:
      'Sistema de design completo com componentes React reutilizáveis, documentação Storybook e testes automatizados. Base para múltiplos projetos.',
    tech: ['React', 'Storybook', 'Radix UI', 'CSS Modules', 'Jest'] as const,
    github: 'https://github.com/devguimaraes/design-system',
    live: 'https://design-system.devguimaraes.dev',
    color: 'bg-secondary',
    featured: true,
    tags: ['design-system', 'react', 'storybook', 'ui-components'] as const,
  },
  {
    id: 'portfolio-generator',
    title: 'Portfolio Generator',
    description:
      'Ferramenta para criação de portfólios com Astro, Markdown e animações Framer Motion. SSG para máxima performance e SEO otimizado.',
    tech: ['Astro', 'React', 'Framer Motion', 'MDX', 'TypeScript'] as const,
    github: 'https://github.com/devguimaraes/portfolio-generator',
    live: 'https://portfolio-generator.devguimaraes.dev',
    color: 'bg-primary',
    featured: false,
    tags: ['astro', 'static-site', 'portfolio', 'ssg'] as const,
  },
  {
    id: 'dashboard-analytics',
    title: 'Dashboard Analytics',
    description:
      'Dashboard de analytics em tempo real com React Query, Recharts e WebSockets. Visualização de dados interativa com atualização automática.',
    tech: ['React', 'TanStack Query', 'WebSocket', 'Recharts', 'Node.js'] as const,
    github: 'https://github.com/devguimaraes/analytics-dashboard',
    live: 'https://analytics.devguimaraes.dev',
    color: 'bg-muted',
    featured: false,
    tags: ['dashboard', 'analytics', 'real-time', 'data-visualization'] as const,
  },
  {
    id: 'task-management-app',
    title: 'Task Management App',
    description:
      'Aplicação de gestão de tarefas com drag-and-drop, colaboração em tempo real e notificações push. Interface intuitiva com feedback visual.',
    tech: ['React', 'TypeScript', 'Supabase', 'Dnd Kit', 'PWA'] as const,
    github: 'https://github.com/devguimaraes/task-app',
    live: 'https://tasks.devguimaraes.dev',
    color: 'bg-accent',
    featured: false,
    tags: ['task-management', 'pwa', 'collaboration', 'supabase'] as const,
  },
  {
    id: 'weather-widget',
    title: 'Weather Widget',
    description:
      'Widget de clima minimalista com geolocalização automática, previsão de 7 dias e alerts de condições extremas. Performance otimizada.',
    tech: ['React', 'TypeScript', 'OpenWeather API', 'Geolocation', 'CSS'] as const,
    github: 'https://github.com/devguimaraes/weather-widget',
    live: 'https://weather.devguimaraes.dev',
    color: 'bg-secondary',
    featured: false,
    tags: ['weather', 'api', 'geolocation', 'widget'] as const,
  },
] as const;

/**
 * Get featured projects
 */
export const featuredProjects = projects.filter(project => project.featured);

/**
 * Get projects by technology
 */
export const getProjectsByTech = (tech: string): readonly Project[] => {
  return projects.filter(project => project.tech.includes(tech));
};

/**
 * Get projects by tag
 */
export const getProjectsByTag = (tag: string): readonly Project[] => {
  return projects.filter(project => project.tags?.includes(tag));
};

/**
 * Get project by ID
 */
export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

/**
 * Get all unique technologies used across projects
 */
export const getAllTechnologies = (): readonly string[] => {
  const allTech = projects.flatMap(project => project.tech);
  return [...new Set(allTech)];
};

/**
 * Get all unique tags across projects
 */
export const getAllTags = (): readonly string[] => {
  const allTags = projects.flatMap(project => project.tags || []);
  return [...new Set(allTags)];
};

/**
 * Get project statistics
 */
export const getProjectStats = () => ({
  total: projects.length,
  featured: featuredProjects.length,
  technologies: getAllTechnologies().length,
  tags: getAllTags().length,
});

// Export default projects array for convenience
export default projects;