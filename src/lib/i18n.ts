export type Locale = "pt" | "en";

export const defaultLocale: Locale = "pt";

export const locales: Locale[] = ["pt", "en"];

// Simple dictionary for UI strings
export const dictionary = {
  pt: {
    // Hero
    "hero.badge": "DESENVOLVEDOR FRONT END",
    "hero.established": "// ESTABLISHED_IN_RJ",
    "hero.description":
      "Transformando complexidade em simplicidade através de design editorial e tecnologia de ponta.",
    "hero.scroll": "SCROLL_FOR_MORE",
    "hero.version": "VER: 4.0.0_STABLE",

    // Projects
    "projects.heading": "SELECTED_WORKS",
    "projects.subtitle": "Explorando fronteiras da interação digital",
    "projects.total": "TOTAL",

    // About
    "about.bio":
      "Com 5 anos de experiência, crio landing pages de alta conversão e sites institucionais que combinam engenharia robusta com design intencional. Especializado em performance, SEO técnico e Core Web Vitals — interfaces que carregam rápido, rankeiam bem e convertem visitantes em clientes.",
    "about.based": "// BASED_IN_RIO_DE_JANEIRO",
    "about.built_by": "Built by Bruno Guimarães",

    // Engineering Practices
    "practices.heading": "// HOW_I_WORK",

    // CTA
    "cta.compact_question": "Gostou do que viu?",
    "cta.compact_action": "VAMOS_CONVERSAR",

    // Navigation
    "nav.projetos": "PROJETOS",
    "nav.posts": "POSTS",
    "nav.sobre": "SOBRE",
    "nav.contato": "CONTATO",
    "nav.menu_open": "Abrir menu",

    // Latest Posts
    "blog.heading": "LATEST_POSTS",
    "blog.subtitle": "Artigos e reflexões sobre front-end",
    "blog.view_all": "Ver todos",

    // Case Study
    "case.back": "// BACK_TO_PROJECTS",
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

    // Language switcher
    "lang.pt": "PT",
    "lang.en": "EN",
  },
  en: {
    // Hero
    "hero.badge": "FRONT END DEVELOPER",
    "hero.established": "// ESTABLISHED_IN_RJ",
    "hero.description":
      "Transforming complexity into simplicity through editorial design and cutting-edge technology.",
    "hero.scroll": "SCROLL_FOR_MORE",
    "hero.version": "VER: 4.0.0_STABLE",

    // Projects
    "projects.heading": "SELECTED_WORKS",
    "projects.subtitle": "Exploring the frontiers of digital interaction",
    "projects.total": "TOTAL",

    // About
    "about.bio":
      "With 5 years of experience, I build high-conversion landing pages and institutional sites that combine robust engineering with intentional design. Specialized in performance, technical SEO, and Core Web Vitals — interfaces that load fast, rank well, and convert visitors into clients.",
    "about.based": "// BASED_IN_RIO_DE_JANEIRO",
    "about.built_by": "Built by Bruno Guimarães",

    // Engineering Practices
    "practices.heading": "// HOW_I_WORK",

    // CTA
    "cta.compact_question": "Liked what you saw?",
    "cta.compact_action": "LET'S_TALK",

    // Navigation
    "nav.projetos": "PROJECTS",
    "nav.posts": "POSTS",
    "nav.sobre": "ABOUT",
    "nav.contato": "CONTACT",
    "nav.menu_open": "Open menu",

    // Latest Posts
    "blog.heading": "LATEST_POSTS",
    "blog.subtitle": "Articles and reflections on front-end",
    "blog.view_all": "View all",

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

    // Language switcher
    "lang.pt": "PT",
    "lang.en": "EN",
  },
} as const;

export type TranslationKey = keyof typeof dictionary.pt;

export function t(locale: Locale, key: TranslationKey): string {
  return dictionary[locale]?.[key] ?? dictionary.pt[key] ?? key;
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
}

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  if (locale === currentLocale) return;
  currentLocale = locale;
  if (typeof window !== "undefined") {
    localStorage.setItem("locale", locale);
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
