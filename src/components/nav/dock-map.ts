import type { TranslationKey } from "@/lib/i18n";
import { ABOUT_PATH, routeSectionId } from "./sections";

export type DockTone = "light" | "dark";

export interface DockItem {
  id: "home" | "services" | "projects" | "about";
  href: string;
  labelKey: TranslationKey;
  /** id do capítulo na home: na própria home o toque salta para ele em vez de trocar de página. */
  sectionId: string;
  /** Cor do disco que cobre o salto. É a superfície do destino. */
  cover: "azul" | "papel";
  /** Abre a página do href mesmo na home, em vez de saltar para o capítulo. */
  opensPage?: boolean;
}

/**
 * Os quatro ícones do trilho, na ordem em que aparecem: dois de cada lado do Giro. No celular,
 * Blog e Contato ficam nos rodapés e nos capítulos da home.
 */
export const DOCK_ITEMS: readonly DockItem[] = [
  {
    id: "home",
    href: "/",
    labelKey: "tabs.home",
    sectionId: "hero",
    cover: "azul",
  },
  {
    id: "about",
    href: ABOUT_PATH,
    labelKey: "menu.about",
    sectionId: "sobre",
    cover: "papel",
    opensPage: true,
  },
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
];

const HOME_ICON = 0;
const ABOUT_ICON = 1;
const SERVICES_ICON = 2;
const PROJECTS_ICON = 3;

// Blog, contato e fim não têm ícone no trilho: nesses capítulos nenhum fica aceso.
const CHAPTER_ICON: Readonly<Record<string, number | null>> = {
  hero: HOME_ICON,
  servicos: SERVICES_ICON,
  projetos: PROJECTS_ICON,
  processo: PROJECTS_ICON,
  sobre: ABOUT_ICON,
  blog: null,
  contato: null,
  fim: null,
};

// Capítulos em que a página é de papel e o trilho vira tinta.
const DARK_CHAPTERS: ReadonlySet<string> = new Set(["servicos", "projetos", "blog"]);

/** Ícone do trilho para um capítulo da home, ou null se ele não tem ícone. Desconhecido cai em Início. */
export function chapterToDockIndex(chapterId: string): number | null {
  return chapterId in CHAPTER_ICON ? CHAPTER_ICON[chapterId] : HOME_ICON;
}

/** Ícone de uma rota fora da home, ou null se a rota não tem ícone próprio. */
export function routeToDockIndex(pathname: string): number | null {
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
  return pathname.startsWith("/blog") || routeToDockIndex(pathname) !== null ? "dark" : "light";
}
