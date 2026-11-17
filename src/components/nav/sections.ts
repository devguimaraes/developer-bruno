import { type Locale, type TranslationKey, t } from "@/lib/i18n";

export interface HomeSection {
  /** id do elemento na home. Seções que não existem no DOM são ignoradas pelo scroll spy. */
  id: string;
  /** Rótulo do menu, ex.: "Projetos". */
  menuKey: TranslationKey;
  /** Rótulo mono da ilha, já com "// ", ex.: "// projetos". */
  labelKey: TranslationKey;
  /** Aparece no menu da ilha, no computador. */
  inMenu: boolean;
  /** Página própria da seção. Sem ela, o link leva ao capítulo na home. */
  href?: string;
}

/** Rota da página Sobre. O capítulo da home continua em /#sobre, alcançado pela rolagem. */
export const ABOUT_PATH = "/sobre";

/** Seções da home, na ordem do documento. */
export const HOME_SECTIONS: readonly HomeSection[] = [
  // Fora do menu: entra no scroll spy para a ilha e as reações do Giro saberem onde o leitor está.
  { id: "servicos", menuKey: "menu.services", labelKey: "services.label", inMenu: false },
  { id: "projetos", menuKey: "menu.projects", labelKey: "projects.label", inMenu: true },
  { id: "processo", menuKey: "menu.process", labelKey: "process.label", inMenu: true },
  {
    id: "sobre",
    menuKey: "menu.about",
    labelKey: "about.label",
    inMenu: true,
    href: ABOUT_PATH,
  },
  { id: "blog", menuKey: "menu.blog", labelKey: "posts.label", inMenu: true },
  { id: "contato", menuKey: "menu.contact", labelKey: "contact.label", inMenu: true },
];

export const SECTION_IDS: readonly string[] = HOME_SECTIONS.map(section => section.id);

/** Destino do link de uma seção: a página própria, ou o capítulo na home. */
export function sectionHref(section: HomeSection): string {
  return section.href ?? `/#${section.id}`;
}

/** Seção que a rota representa fora da home ("sobre" em /sobre), ou null. */
export function routeSectionId(pathname: string): string | null {
  const path = pathname.replace(/\/$/, "");
  return HOME_SECTIONS.find(section => section.href === path)?.id ?? null;
}

export type TabId = "home" | "projects" | "blog" | "contact";

export interface TabItem {
  id: TabId;
  href: string;
  labelKey: TranslationKey;
}

/** Abas por rota. Nomeiam a página na ilha de rolagem; o trilho de ícones usa dock-map. */
export const TABS: readonly TabItem[] = [
  { id: "home", href: "/", labelKey: "tabs.home" },
  { id: "projects", href: "/#projetos", labelKey: "tabs.projects" },
  { id: "blog", href: "/blog", labelKey: "tabs.blog" },
  { id: "contact", href: "/#contato", labelKey: "tabs.contact" },
];

export const SECTION_TAB: Readonly<Record<string, TabId>> = {
  // Serviços vem logo depois do hero e ainda é o começo da home: Início continua acesa.
  servicos: "home",
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

/** Rótulo mono da ilha: a seção em leitura ou, fora dela, a aba da rota ("// blog"). */
export function islandLabel(locale: Locale, activeId: string | null, pathname: string): string {
  const sectionId = activeId ?? routeSectionId(pathname);
  const section = HOME_SECTIONS.find(item => item.id === sectionId);
  if (section) return t(locale, section.labelKey);
  const tab = TABS.find(item => item.id === tabForLocation(pathname, null));
  return tab ? `// ${t(locale, tab.labelKey).toLowerCase()}` : "";
}
