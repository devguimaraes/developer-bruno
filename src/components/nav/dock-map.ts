import type { TranslationKey } from "@/lib/i18n";
import { ABOUT_PATH, routeSectionId } from "./sections";

export type DockTone = "light" | "dark";

export interface DockItem {
  id: "home" | "services" | "projects" | "about" | "blog" | "contact";
  href: string;
  labelKey: TranslationKey;
  /** id do capítulo na home: na própria home o toque salta para ele em vez de trocar de página. */
  sectionId: string;
  /** Cor do disco que cobre o salto. É a superfície do destino. */
  cover: "azul" | "papel";
  /** Abre a página do href mesmo na home, em vez de saltar para o capítulo. */
  opensPage?: boolean;
}

/** Os seis ícones do trilho, na ordem em que aparecem. */
export const DOCK_ITEMS: readonly DockItem[] = [
  { id: "home", href: "/", labelKey: "tabs.home", sectionId: "hero", cover: "azul" },
  {
    id: "services",
    href: "/#servicos",
    labelKey: "menu.services",
    sectionId: "servicos",
    cover: "papel",
  },
  {
    id: "projects",
    href: "/#projetos",
    labelKey: "tabs.projects",
    sectionId: "projetos",
    cover: "papel",
  },
  {
    id: "about",
    href: ABOUT_PATH,
    labelKey: "menu.about",
    sectionId: "sobre",
    cover: "papel",
    opensPage: true,
  },
  { id: "blog", href: "/blog", labelKey: "tabs.blog", sectionId: "blog", cover: "papel" },
  {
    id: "contact",
    href: "/#contato",
    labelKey: "tabs.contact",
    sectionId: "contato",
    cover: "azul",
  },
];

const HOME_ICON = 0;
const PROJECTS_ICON = 2;
const ABOUT_ICON = 3;
const BLOG_ICON = 4;

const CHAPTER_ICON: Readonly<Record<string, number>> = {
  hero: HOME_ICON,
  servicos: 1,
  projetos: PROJECTS_ICON,
  processo: PROJECTS_ICON,
  sobre: ABOUT_ICON,
  blog: BLOG_ICON,
  contato: 5,
  fim: 5,
};

// Capítulos em que a página é de papel e o trilho vira tinta.
const DARK_CHAPTERS: ReadonlySet<string> = new Set(["servicos", "projetos", "blog"]);

/** Ícone do trilho para um capítulo da home. Capítulo desconhecido cai em Início. */
export function chapterToDockIndex(chapterId: string): number {
  return CHAPTER_ICON[chapterId] ?? HOME_ICON;
}

/** Ícone de uma rota fora da home, ou null se a rota não tem ícone próprio. */
export function routeToDockIndex(pathname: string): number | null {
  if (pathname.startsWith("/blog")) return BLOG_ICON;
  if (pathname.startsWith("/projetos")) return PROJECTS_ICON;
  if (routeSectionId(pathname) === "sobre") return ABOUT_ICON;
  return null;
}

/** Ícone ativo: na home vale o capítulo em leitura, fora dela a rota. Null acende nenhum. */
export function dockIndexFor(pathname: string, chapterId: string | null): number | null {
  if (pathname === "/") return chapterToDockIndex(chapterId ?? "hero");
  return routeToDockIndex(pathname);
}

/** Tinta sobre as páginas de papel (serviços, projetos, blog, cases, sobre), papel sobre azul e tinta. */
export function dockToneFor(pathname: string, chapterId: string | null): DockTone {
  if (pathname === "/") {
    return chapterId !== null && DARK_CHAPTERS.has(chapterId) ? "dark" : "light";
  }
  return routeToDockIndex(pathname) !== null ? "dark" : "light";
}
