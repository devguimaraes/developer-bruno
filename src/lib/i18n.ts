export type Locale = "pt" | "en";

export const defaultLocale: Locale = "pt";

export const locales: Locale[] = ["pt", "en"];

// Simple dictionary for UI strings
export const dictionary = {
  pt: {
    // Hero
    "hero.line1": "BRUNO",
    "hero.line2": "GUIMARÃES",
    "hero.badge":
      "Desenvolvedor Front-End — Especialista em TypeScript, Next.js, React e Interfaces para sistemas e aplicações web.",
    "hero.established": "// RIO_DE_JANEIRO",
    "hero.description":
      "Desenvolvimento front-end com foco em performance, arquitetura e experiência do usuário.",
    "hero.scroll": "// EXPLORE",
    "hero.version": "VER: 4.0.0_STABLE",

    // Projects
    "projects.heading": "PROJETOS",
    "projects.subtitle": "Quatro cases reais. Cada um com seu desafio, stack e resultado.",
    "projects.total": "PROJETOS",
    "projects.view_case": "Visualizar Caso",
    "projects.visit_live": "Ver site no ar",
    "projects.read_more": "Leia como aplico isso →",

    // About
    "about.bio":
      "Formado em Desenvolvimento de Sistemas Web pelo Senac, atuo há 5 anos com desenvolvimento de software voltado ao front-end. Meu trabalho combina React, TypeScript e arquitetura server-side com princípios de engenharia de software e design intencional. Tenho experiência prática com otimização de performance e Core Web Vitals em projetos com tráfego real, além de manter testes automatizados e pipelines de CI/CD. Código bem estruturado, entregas consistentes e compromisso com qualidade.",
    "about.based": "// RIO_DE_JANEIRO",
    "about.built_by": "Feito por Bruno Guimarães",

    // Engineering Practices
    "practices.heading": "// PROCESSO",

    // Footer
    "footer.location": "Rio de Janeiro, BR",
    "footer.built_by": "Feito por Bruno Guimarães",

    // CTA
    "cta.compact_question": "Gostou do que viu?",
    "cta.compact_action": "VAMOS_CONVERSAR",
    "cta.ready": "Tem um projeto em mente?",
    "cta.lets_talk": "BORA CONVERSAR",
    "cta.copyright": "© 2026 BRUNO GUIMARÃES. Todos os direitos reservados.",

    // Navigation
    "nav.projetos": "PROJETOS",
    "nav.posts": "POSTS",
    "nav.sobre": "SOBRE",
    "nav.contato": "CONTATO",
    "nav.menu_open": "Abrir menu",

    // Blog
    "blog.label": "// BLOG",
    "blog.heading": "POSTS",
    "blog.description":
      "Artigos técnicos e reflexões sobre programação, engenharia de software e tecnologia.",
    "blog.subtitle": "Artigos e reflexões sobre front-end",
    "blog.total_label": "TOTAL_POSTS",
    "blog.read_label": "Ler →",
    "blog.empty": "Nenhum post encontrado para esta categoria.",
    "blog.load_more": "Carregar mais",
    "blog.remaining": "restantes",
    "blog.all_categories": "Todos",
    "blog.view_all": "Ver todos",
    "blog.back_to_blog": "← VOLTAR AO BLOG",
    "blog.back_title": "Voltar para a listagem do blog",
    "blog.next_post": "PRÓXIMO POST →",
    "blog.min_read": "de leitura",
    "blog.author_role": "Engenheiro Front-End",

    // 404
    "notfound.error_code": "// ERROR_404",
    "notfound.route_status": "Route not found",
    "notfound.page_status": "// PAGE_STATUS",
    "notfound.lost_signal": "LOST_SIGNAL",
    "notfound.heading_line1": "PAGE",
    "notfound.heading_line2": "NOT_FOUND",
    "notfound.description": "A rota que você tentou abrir não existe ou foi movida.",
    "notfound.path_label": "PATH:",
    "notfound.recovery_label": "// RECOVERY_OPTIONS",
    "notfound.back_home": "Voltar ao início",
    "notfound.go_blog": "Ir para o blog",
    "notfound.author": "Bruno Guimarães",
    "notfound.author_role": "Front-end systems",
    "notfound.location": "Rio de Janeiro, BR",
    "notfound.coords": "POS: 22.9068 S / 43.1729 W",
    "notfound.version": "VER: 4.0.4_NOT_FOUND",

    // Case Study
    "case.back": "// VOLTAR_AOS_PROJETOS",
    "case.context": "// CONTEXT",
    "case.problem": "O PROBLEMA",
    "case.stack": "// STACK",
    "case.technologies": "TECNOLOGIAS",
    "case.impact": "// IMPACT",
    "case.results": "RESULTADOS",
    "case.related": "// RELATED_POSTS",
    "case.read_more": "LEIA MAIS",
    "case.next": "// NEXT_STEPS",
    "case.visit_live": "Visitar site ao vivo",
    "case.work_together": "Vamos trabalhar juntos",
    "case.scroll": "SCROLL",

    // Language switcher
    "lang.pt": "PT",
    "lang.en": "EN",
  },
  en: {
    // Hero
    "hero.line1": "BRUNO",
    "hero.line2": "GUIMARÃES",
    "hero.badge":
      "Front-End Developer — Specialist in TypeScript, Next.js, React and Interfaces for web systems and applications.",
    "hero.established": "// RIO_DE_JANEIRO",
    "hero.description":
      "Front-end development focused on performance, architecture, and user experience.",
    "hero.scroll": "// EXPLORE",
    "hero.version": "VER: 4.0.0_STABLE",

    // Projects
    "projects.heading": "PROJECTS",
    "projects.subtitle": "Four real cases. Each with its challenge, stack, and result.",
    "projects.total": "PROJECTS",
    "projects.view_case": "View Case",
    "projects.visit_live": "Visit live site",
    "projects.read_more": "Read how I apply this →",

    // About
    "about.bio":
      "Graduated in Web Systems Development from Senac, I have 5 years of experience in front-end software development. My work combines React, TypeScript, and server-side architecture with software engineering principles and intentional design. I have hands-on experience optimizing performance and Core Web Vitals on production traffic, along with maintaining automated tests and CI/CD pipelines. Well-structured code, consistent delivery, and a commitment to quality.",
    "about.based": "// RIO_DE_JANEIRO",
    "about.built_by": "Built by Bruno Guimarães",

    // Engineering Practices
    "practices.heading": "// PROCESS",

    // Footer
    "footer.location": "Rio de Janeiro, BR",
    "footer.built_by": "Built by Bruno Guimarães",

    // CTA
    "cta.compact_question": "Liked what you saw?",
    "cta.compact_action": "LET'S_TALK",
    "cta.ready": "Have a project in mind?",
    "cta.lets_talk": "LET'S TALK",
    "cta.copyright": "© 2026 BRUNO GUIMARÃES. All rights reserved.",

    // Navigation
    "nav.projetos": "PROJECTS",
    "nav.posts": "POSTS",
    "nav.sobre": "ABOUT",
    "nav.contato": "CONTACT",
    "nav.menu_open": "Open menu",

    // Blog
    "blog.label": "// BLOG",
    "blog.heading": "POSTS",
    "blog.description":
      "Technical articles and reflections on programming, software engineering, and technology.",
    "blog.subtitle": "Articles and reflections on front-end",
    "blog.total_label": "TOTAL_POSTS",
    "blog.read_label": "Read →",
    "blog.empty": "No posts found for this category.",
    "blog.load_more": "Load more",
    "blog.remaining": "remaining",
    "blog.all_categories": "All",
    "blog.view_all": "View all",
    "blog.back_to_blog": "← BACK TO BLOG",
    "blog.back_title": "Back to blog listing",
    "blog.next_post": "NEXT POST →",
    "blog.min_read": "min read",
    "blog.author_role": "Front-End Engineer",

    // 404
    "notfound.error_code": "// ERROR_404",
    "notfound.route_status": "Route not found",
    "notfound.page_status": "// PAGE_STATUS",
    "notfound.lost_signal": "LOST_SIGNAL",
    "notfound.heading_line1": "PAGE",
    "notfound.heading_line2": "NOT_FOUND",
    "notfound.description": "The route you tried to access does not exist or has been moved.",
    "notfound.path_label": "PATH:",
    "notfound.recovery_label": "// RECOVERY_OPTIONS",
    "notfound.back_home": "Back to home",
    "notfound.go_blog": "Go to blog",
    "notfound.author": "Bruno Guimarães",
    "notfound.author_role": "Front-end systems",
    "notfound.location": "Rio de Janeiro, BR",
    "notfound.coords": "POS: 22.9068 S / 43.1729 W",
    "notfound.version": "VER: 4.0.4_NOT_FOUND",

    // Case Study
    "case.back": "// BACK_TO_PROJECTS",
    "case.context": "// CONTEXT",
    "case.problem": "THE PROBLEM",
    "case.stack": "// STACK",
    "case.technologies": "TECHNOLOGIES",
    "case.impact": "// IMPACT",
    "case.results": "RESULTS",
    "case.related": "// RELATED_POSTS",
    "case.read_more": "READ MORE",
    "case.next": "// NEXT_STEPS",
    "case.visit_live": "Visit live site",
    "case.work_together": "Let's work together",
    "case.scroll": "SCROLL",

    // Language switcher
    "lang.pt": "PT",
    "lang.en": "EN",
  },
} as const;

export type TranslationKey = keyof typeof dictionary.pt;

export function t(locale: Locale, key: TranslationKey): string {
  return dictionary[locale]?.[key] ?? dictionary.pt[key] ?? key;
}

export function getHtmlLang(locale: Locale): string {
  return locale === "en" ? "en" : "pt-BR";
}

export function getOgLocale(locale: Locale): string {
  return locale === "en" ? "en_US" : "pt_BR";
}

export function applyLocaleDocumentMetadata(locale: Locale): void {
  if (typeof document === "undefined") return;

  document.documentElement.lang = getHtmlLang(locale);

  const ogLocale = document.querySelector<HTMLMetaElement>('meta[property="og:locale"]');
  if (ogLocale) {
    ogLocale.content = getOgLocale(locale);
  }
}

// ─── Reactive locale store (works across React roots) ───

type Listener = (locale: Locale) => void;

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const stored = localStorage.getItem("locale") as Locale | null;
  if (stored && (stored === "pt" || stored === "en")) return stored;
  return defaultLocale;
}

let currentLocale: Locale = defaultLocale;
const listeners = new Set<Listener>();

// Only run on client
if (typeof window !== "undefined") {
  currentLocale = getInitialLocale();
  applyLocaleDocumentMetadata(currentLocale);
}

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  if (locale === currentLocale) {
    applyLocaleDocumentMetadata(locale);
    return;
  }
  currentLocale = locale;
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", locale);
    applyLocaleDocumentMetadata(locale);
  }
  listeners.forEach(fn => {
    fn(locale);
  });
}

export function subscribeToLocale(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
