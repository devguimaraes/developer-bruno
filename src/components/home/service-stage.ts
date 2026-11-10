import type { ServiceArtName } from "@/components/services/ServiceArt";
import type { TranslationKey } from "@/lib/i18n";

export type ServiceColor = "azul" | "nevoa" | "tinta";

export interface ServiceItem {
  id: string;
  stop: string;
  art: ServiceArtName;
  color: ServiceColor;
  colorCss: string;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
  tagsKey: TranslationKey;
}

export const SERVICES: readonly ServiceItem[] = [
  {
    id: "sites",
    stop: "sv0",
    art: "sites-completos",
    color: "azul",
    colorCss: "var(--azul-sinal)",
    titleKey: "services.sites.title",
    bodyKey: "services.sites.body",
    tagsKey: "services.sites.tags",
  },
  {
    id: "landing",
    stop: "sv1",
    art: "landing-pages",
    color: "nevoa",
    colorCss: "#edece8",
    titleKey: "services.landing.title",
    bodyKey: "services.landing.body",
    tagsKey: "services.landing.tags",
  },
  {
    id: "product",
    stop: "sv2",
    art: "product-ui",
    color: "tinta",
    colorCss: "var(--tinta)",
    titleKey: "services.product.title",
    bodyKey: "services.product.body",
    tagsKey: "services.product.tags",
  },
  {
    id: "fullstack",
    stop: "sv3",
    art: "full-stack",
    color: "nevoa",
    colorCss: "#edece8",
    titleKey: "services.fullstack.title",
    bodyKey: "services.fullstack.body",
    tagsKey: "services.fullstack.tags",
  },
  {
    id: "branding",
    stop: "sv4",
    art: "branding",
    color: "azul",
    colorCss: "var(--azul-sinal)",
    titleKey: "services.branding.title",
    bodyKey: "services.branding.body",
    tagsKey: "services.branding.tags",
  },
] as const;

/**
 * Calcula o índice do serviço ativo (0 a 4) com base no progresso normalizado do capítulo (0 a 1).
 * Fórmula: min(4, Math.floor(p * 5))
 */
export function calcServiceStep(progress: number): number {
  if (Number.isNaN(progress)) return 0;
  const clamped = Math.max(0, Math.min(1, progress));
  return Math.min(4, Math.floor(clamped * 5));
}

/**
 * Calcula a posição vertical de rolagem para saltar diretamente para um determinado serviço,
 * mirando no centro do degrau para evitar instabilidades de subpixel nas fronteiras.
 */
export function calcServiceScrollTop(
  index: number,
  chapterTop: number,
  chapterLen: number
): number {
  const i = Math.max(0, Math.min(4, Math.floor(index)));
  const targetProgress = (i + 0.5) / 5;
  return chapterTop + targetProgress * chapterLen;
}
