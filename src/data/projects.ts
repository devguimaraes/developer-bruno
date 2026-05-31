import type { Project } from "@/types";
import agenciaMultiBr from "@/assets/agencia-multi-br.png";
import engerod from "@/assets/engerod.png";
import semogrj from "@/assets/semogrj.png";
import luisFelipePereira from "@/assets/luis-felipe-pereira.png";
import moviesBremen from "@/assets/movies-bremen.png";

/**
 * Projects data with external links and proper categorization
 * This is the SINGLE source of truth for all project data.
 */
const rawProjects = [
  {
    id: "agencia-multi-br",
    title: "Agência Multi BR",
    category: "Corporate / Agency",
    description:
      "Engenharia de performance para uma agência digital 360º. Desenvolvemos um ecossistema focado em conversão, onde a estética vanguarda encontra uma arquitetura Next.js otimizada para Core Web Vitals e SEO agressivo.",
    tech: ["React", "NextJS", "Tailwind", "UI/UX"] as const,
    github: "#",
    live: "https://www.agenciamultibr.com/",
    color: "bg-accent",
    featured: true,
    tags: ["marketing", "web-design", "seo", "branding"] as const,
    relatedPosts: ["engenharia-interface-2026", "react-server-components"] as const,
    previewAnimation: "grid-scan",
    image: agenciaMultiBr,
    bannerImage: "/banner-multi-macbook.webp",
    slug: "agencia-multi-br",
    role: "Front-End Lead & UI/UX Developer",
    context:
      "A Agência Multi BR precisava de um site institucional que refletisse sua posição como agência de marketing digital 360º. O desafio era criar uma presença online que transmitisse profissionalismo, criatividade e resultados — tudo em um formato que funcionasse tanto para captar clientes quanto para demonstrar a própria capacidade técnica da agência.",
    impact:
      "Site institucional moderno e responsivo que comunica claramente os serviços da agência. A presença digital fortalecida contribuiu para o aumento de leads orgânicos e consolidou a marca como referência em marketing digital no mercado local.",
  },
  {
    id: "engerod",
    title: "Engerod Engenharia",
    category: "Institutional / Engineering",
    description:
      "Empresa especializada em pontes, viadutos e projetos especiais. Referência nacional em obras de infraestrutura com tradição desde 1972.",
    tech: ["Wordpress", "PHP", "CSS", "SEO"] as const,
    github: "#",
    live: "https://engerod.com.br/",
    color: "bg-secondary",
    featured: true,
    tags: ["engenharia", "institucional", "infraestrutura", "corporativo"] as const,
    previewAnimation: "faulty-terminal",
    image: engerod,
    role: "Implementação front-end + integração com CMS WordPress",
    context:
      "Empresa de engenharia com 50+ anos de tradição precisava modernizar sua presença digital mantendo a seriedade e credibilidade do setor.",
    impact:
      "Redesign completo com foco em acessibilidade e performance, reduzindo bounce rate em 30% e aumentando solicitações de orçamento via formulário.",
  },
  {
    id: "semogrj",
    title: "SEMOGRJ",
    category: "Logistics / B2B",
    description:
      "Abastecimento Marítimo e Logística Internacional. Empresa com presença global, frota própria e excelência operacional no setor marítimo.",
    tech: ["Wordpress", "PHP", "Logística", "B2B"] as const,
    github: "#",
    live: "https://semogrj.com.br/",
    color: "bg-primary",
    featured: true,
    tags: ["logistica", "maritimo", "internacional", "b2b"] as const,
    previewAnimation: "pixel-blast",
    image: semogrj,
    role: "WordPress/PHP + estruturação de UX e SEO on-page",
    context:
      "Empresa de logística marítima com presença global precisava de um site que comunicasse escala e profissionalismo para clientes B2B internacionais.",
    impact:
      "Site multilíngue com navegação intuitiva, resultando em aumento de 40% nos contatos de novos clientes internacionais.",
  },
  {
    id: "luis-felipe-pereira",
    title: "Luis Felipe Pereira",
    category: "Portfolio / Architecture",
    description:
      "Arquitetura e Interiores de alto padrão. Portfólio visual e design sofisticado para projetos residenciais e comerciais no Rio de Janeiro.",
    tech: ["WordPress", "Elementor", "Gallery", "UI/UX"] as const,
    github: "#",
    live: "https://luisfelipepereira.com.br/",
    color: "bg-muted",
    featured: true,
    tags: ["arquitetura", "design", "portfolio", "premium"] as const,
    previewAnimation: "letter-glitch",
    image: luisFelipePereira,
    role: "Front-end lead — WordPress, design de galeria e experiência visual",
    context:
      "Arquiteto de alto padrão precisava de um portfólio visual que valorizasse seus projetos com a mesma sofisticação de suas obras.",
    impact:
      "Galeria otimizada com lazy loading e WebP, carregamento 3x mais rápido que o site anterior, com tempo médio de sessão aumentado em 60%.",
  },
  {
    id: "movies-bremen",
    title: "Movies Bremen",
    category: "Event House / Cinema",
    description:
      "Engenharia de interface para uma plataforma de entretenimento premium na Alemanha. Um desafio de UI que equilibra a sofisticação visual com regras de negócio complexas e acessibilidade internacional.",
    tech: ["Next.js", "React", "Tailwind CSS", "UI/UX"] as const,
    github: "#",
    live: "https://www.moviesbremen.com/",
    color: "bg-accent",
    featured: true,
    tags: ["entretenimento", "premium", "internacional", "adult"] as const,
    relatedPosts: ["react-19-server-components", "typescript-performance"] as const,
    previewAnimation: "pixel-blast",
    image: moviesBremen,
    bannerImage: "/banner-movies-event-house-bremen.webp",
    slug: "movies-bremen",
    role: "Full-Stack Developer & UI/UX Designer",
    context:
      "A Movies Event House em Bremen, Alemanha, precisava de uma plataforma digital moderna para seu cinema adulto premium. O desafio era criar um site que combinasse discrição com apelo visual sofisticado, apresentando os serviços (cinema, sex shop, cabines privativas) de forma elegante e funcional, com navegação intuitiva em alemão e inglês.",
    impact:
      "Plataforma multilíngue lançada com sucesso, atendendo ao público europeu com uma experiência digital premium. O design responsivo e a arquitetura de informação cuidadosa resultaram em baixa taxa de rejeição e aumento no tráfego orgânico local.",
  },
  {
    id: "danila-rizo-palmieri",
    title: "Danila Rizo Palmieri",
    category: "Corporate / HR & International Business",
    description:
      "Liderança técnica e posicionamento digital para Danila Rizo Palmieri, autoridade em RH e Internacionalização. O projeto projeta a sofisticação executiva necessária para o mercado global de expansão de negócios (Brasil > USA).",
    tech: ["Wordpress", "PHP", "SEO", "UI/UX"] as const,
    github: "#",
    live: "https://www.danilapalmieri.com/",
    color: "bg-muted",
    featured: true,
    tags: ["rh", "internacionalização", "business", "premium"] as const,
    relatedPosts: ["engenharia-interface-2026"] as const,
    previewAnimation: "letter-glitch",
    image: "/banner-danila-rizo.webp",
    bannerImage: "/banner-danila-rizo.webp",
    slug: "danila-rizo-palmieri",
    role: "Web Developer & Designer",
    context:
      "Danila Rizo Palmieri, CEO da Connect Solutions, precisava de um posicionamento digital que refletisse sua autoridade em RH e internacionalização de empresas (Brasil > USA). O desafio era criar uma vitrine que comunicasse sofisticação e confiança para o mercado executivo, facilitando a prospecção de clientes que buscam expandir suas operações para o território americano.",
    impact:
      "Portfólio online visualmente impactante que se tornou a principal ferramenta de autoridade e prospecção. A nova estrutura de informação focada em consultoria e expertise técnica elevou o padrão de percepção da marca, gerando leads mais qualificados para o mercado global.",
  },
] as const;

/**
 * Normalize projects to ensure image property is a string URL
 */
export const projects = (
  rawProjects as unknown as (Omit<Project, "image"> & { image: string | { src: string } })[]
).map(project => ({
  ...project,
  image: typeof project.image === "string" ? project.image : project.image?.src,
})) as readonly Project[];

const selectedProjectIds = ["movies-bremen", "agencia-multi-br", "danila-rizo-palmieri"];

export const selectedWorks = projects.filter(project => selectedProjectIds.includes(project.id));

export default projects;
