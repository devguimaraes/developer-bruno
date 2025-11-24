import type { Project } from '@/types';
import agenciaMultiBrImg from '@/assets/agencia-multi-br.png';
import engerodImg from '@/assets/engerod.png';
import semogrjImg from '@/assets/semogrj.png';
import luisFelipeImg from '@/assets/luis-felipe-pereira.png';

/**
 * Projects data with external links and proper categorization
 */
export const projects: readonly Project[] = [
  {
    id: 'agencia-multi-br',
    title: 'Agência Multi BR',
    description:
      'Agência de marketing digital 360º especializada em tráfego pago, conteúdo, redes sociais, web design e identidade visual. Estratégia personalizada com atendimento local.',
    tech: ['WordPress', 'Elementor', 'UI/UX', 'SEO'] as const,
    github: '#',
    live: 'https://www.agenciamultibr.com/',
    color: 'bg-accent',
    featured: true,
    tags: ['marketing', 'web-design', 'seo', 'branding'] as const,
    image: agenciaMultiBrImg,
  },
  {
    id: 'engerod',
    title: 'Engerod Engenharia',
    description:
      'Empresa especializada em pontes, viadutos e projetos especiais. Referência nacional em obras de infraestrutura com tradição desde 1972.',
    tech: ['Wordpress', 'PHP', 'CSS', 'SEO'] as const,
    github: '#',
    live: 'https://engerod.com.br/',
    color: 'bg-secondary',
    featured: true,
    tags: ['engenharia', 'institucional', 'infraestrutura', 'corporativo'] as const,
    image: engerodImg,
  },
  {
    id: 'semogrj',
    title: 'SEMOGRJ',
    description:
      'Abastecimento Marítimo e Logística Internacional. Empresa com presença global, frota própria e excelência operacional no setor marítimo.',
    tech: ['Wordpress', 'PHP', 'Logística', 'B2B'] as const,
    github: '#',
    live: 'https://semogrj.com.br/',
    color: 'bg-primary',
    featured: true,
    tags: ['logistica', 'maritimo', 'internacional', 'b2b'] as const,
    image: semogrjImg,
  },
  {
    id: 'luis-felipe-pereira',
    title: 'Luis Felipe Pereira',
    description:
      'Arquitetura e Interiores de alto padrão. Portfólio visual e design sofisticado para projetos residenciais e comerciais no Rio de Janeiro.',
    tech: ['React', 'Framer Motion', 'Gallery', 'UI/UX'] as const,
    github: '#',
    live: 'https://luisfelipepereira.com.br/',
    color: 'bg-muted',
    featured: true,
    tags: ['arquitetura', 'design', 'portfolio', 'premium'] as const,
    image: luisFelipeImg,
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