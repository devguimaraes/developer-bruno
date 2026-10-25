import type { TranslationKey } from "@/lib/i18n";

export interface HomeSection {
  /** id do elemento na home. Seções que não existem no DOM são ignoradas pelo scroll spy. */
  id: string;
  /** Rótulo do menu, ex.: "Projetos". */
  menuKey: TranslationKey;
  /** Rótulo mono da ilha, já com "// ", ex.: "// projetos". */
  labelKey: TranslationKey;
  /** Aparece no menu da ilha e da barra de abas (as abas já cobrem o resto). */
  inMenu: boolean;
}

/** Seções da home, na ordem do documento. */
export const HOME_SECTIONS: readonly HomeSection[] = [
  { id: "projetos", menuKey: "menu.projects", labelKey: "projects.label", inMenu: true },
  { id: "processo", menuKey: "menu.process", labelKey: "process.label", inMenu: true },
  { id: "sobre", menuKey: "menu.about", labelKey: "about.label", inMenu: true },
  { id: "blog", menuKey: "menu.blog", labelKey: "posts.label", inMenu: false },
  { id: "contato", menuKey: "menu.contact", labelKey: "contact.label", inMenu: false },
];

export const SECTION_IDS: readonly string[] = HOME_SECTIONS.map(section => section.id);

export type TabId = "home" | "projects" | "blog" | "contact";

export interface TabItem {
  id: TabId;
  href: string;
  labelKey: TranslationKey;
}

/** As quatro abas do celular, nesta ordem: duas à esquerda do Giro, duas à direita. */
export const TABS: readonly TabItem[] = [
  { id: "home", href: "/", labelKey: "tabs.home" },
  { id: "projects", href: "/#projetos", labelKey: "tabs.projects" },
  { id: "blog", href: "/blog", labelKey: "tabs.blog" },
  { id: "contact", href: "/#contato", labelKey: "tabs.contact" },
];

const SECTION_TAB: Readonly<Record<string, TabId>> = {
  projetos: "projects",
  blog: "blog",
  contato: "contact",
};

/**
 * Aba ativa pela rota e pela seção em leitura. Blog e cases têm aba própria por rota;
 * na home, o topo é Início e as seções que têm aba acendem a sua. Processo e Sobre não têm aba.
 */
export function tabForLocation(pathname: string, sectionId: string | null): TabId | null {
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/projetos")) return "projects";
  if (pathname !== "/") return null;
  if (sectionId === null) return "home";
  return SECTION_TAB[sectionId] ?? null;
}
