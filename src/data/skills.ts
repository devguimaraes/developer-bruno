import type { IconName } from "@/components/brand";
import type { Skill } from "@/types";

// Ícones sem equivalente no BLOCO Line — mantidos como string para referência futura
const Palette = "palette" as const;
const Zap = "zap" as const;
const Smartphone = "smartphone" as const;
const Shield = "shield" as const;

/**
 * Skills and technical competencies data
 */
export const skills: readonly Skill[] = [
  {
    id: "development",
    icon: "codigo" as IconName,
    title: "Desenvolvimento",
    description:
      "React, Next.js, TypeScript, Astro. Código limpo, performático e escalável seguindo as melhores práticas.",
    color: "bg-primary",
    category: "development",
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Astro",
      "Node.js",
    ],
  },
  {
    id: "design-ui",
    icon: Palette,
    title: "Design & UI",
    description:
      "Tailwind CSS, Radix UI, Framer Motion. Interfaces modernas, acessíveis e responsivas com design systems.",
    color: "bg-secondary",
    category: "design",
    technologies: [
      "Tailwind CSS",
      "Radix UI",
      "Framer Motion",
      "shadcn/ui",
      "CSS Modules",
      "Sass",
      "Figma",
      "Stitch UI do Google",
    ],
  },
  {
    id: "performance",
    icon: Zap,
    title: "Performance",
    description:
      "Otimização de bundle, lazy loading, code splitting. Web Vitals excelentes e experiência do usuário otimizada.",
    color: "bg-accent",
    category: "performance",
    technologies: [
      "Web Vitals",
      "Lighthouse",
      "Bundle Analysis",
      "Code Splitting",
      "Lazy Loading",
      "Caching",
      "CDN",
      "Image Optimization",
    ],
  },
  {
    id: "deployment-cicd",
    icon: "deploy" as IconName,
    title: "Deploy & CI/CD",
    description:
      "Vercel, GitHub Actions, Docker. Pipelines automatizados, deployments seguros e monitoramento contínuo.",
    color: "bg-muted",
    category: "deployment",
    technologies: [
      "Vercel",
      "GitHub Actions",
      "Docker",
      "Git",
      "CI/CD",
      "Testing",
      "Monitoring",
      "Environment Management",
    ],
  },
  {
    id: "backend-database",
    icon: "api" as IconName,
    title: "Backend & Database",
    description:
      "Node.js, Express, PostgreSQL, MongoDB. APIs RESTful, GraphQL e gerenciamento de dados eficiente.",
    color: "bg-primary",
    category: "development",
    technologies: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "MongoDB",
      "Prisma",
      "REST API",
      "GraphQL",
      "Supabase",
    ],
  },
  {
    id: "web-seo",
    icon: "comunidade" as IconName,
    title: "Web & SEO",
    description:
      "SEO técnico, acessibilidade (WCAG), HTML semântico. Sites otimizados para buscadores e usuários.",
    color: "bg-secondary",
    category: "design",
    technologies: [
      "SEO",
      "WCAG",
      "Semantic HTML",
      "Open Graph",
      "Structured Data",
      "Sitemap",
      "Robots.txt",
      "Analytics",
    ],
  },
  {
    id: "mobile-pwa",
    icon: Smartphone,
    title: "Mobile & PWA",
    description:
      "Mobile-first, Progressive Web Apps. Experiência nativa em dispositivos móveis com service workers.",
    color: "bg-accent",
    category: "development",
    technologies: [
      "PWA",
      "Service Workers",
      "Mobile First",
      "Responsive Design",
      "Touch Events",
      "Viewport Meta",
      "Manifest",
      "App Shell",
    ],
  },
  {
    id: "security-best",
    icon: Shield,
    title: "Security & Best Practices",
    description:
      "Segurança web, autenticação, OWASP. Código seguro seguindo as melhores práticas do mercado.",
    color: "bg-muted",
    category: "deployment",
    technologies: [
      "HTTPS",
      "Authentication",
      "OAuth",
      "JWT",
      "Input Validation",
      "XSS Prevention",
      "CORS",
      "Security Headers",
    ],
  },
] as const;

/**
 * Get skills by category
 */
export const getSkillsByCategory = (category: Skill["category"]): readonly Skill[] => {
  return skills.filter(skill => skill.category === category);
};

/**
 * Get skill by ID
 */
export const getSkillById = (id: string): Skill | undefined => {
  return skills.find(skill => skill.id === id);
};

/**
 * Get all unique technologies across skills
 */
export const getAllTechnologies = (): readonly string[] => {
  const allTech = skills.flatMap(skill => skill.technologies || []);
  return [...new Set(allTech)].sort();
};

/**
 * Get skills statistics
 */
export const getSkillsStats = () => ({
  total: skills.length,
  byCategory: {
    development: getSkillsByCategory("development").length,
    design: getSkillsByCategory("design").length,
    performance: getSkillsByCategory("performance").length,
    deployment: getSkillsByCategory("deployment").length,
  },
  technologies: getAllTechnologies().length,
});

/**
 * Get featured skills (first 4 for display)
 */
export const featuredSkills = skills.slice(0, 4) as readonly Skill[];

/**
 * Search skills by technology name
 */
export const searchSkillsByTech = (tech: string): readonly Skill[] => {
  const searchTerm = tech.toLowerCase();
  return skills.filter(
    skill =>
      skill.technologies?.some(technology => technology.toLowerCase().includes(searchTerm)) ||
      skill.title.toLowerCase().includes(searchTerm)
  );
};

// Export default skills array for convenience
export default skills;
