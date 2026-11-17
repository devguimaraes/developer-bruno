import { type Locale, t } from "@/lib/i18n";
import type { StackLabels } from "./StackScene";

/** Rótulos da pilha (hero e Processo da home), no idioma pedido. */
export function layerNames(locale: Locale): StackLabels["layers"] {
  return [
    t(locale, "hero.layer.tokens"),
    t(locale, "hero.layer.components"),
    t(locale, "hero.layer.screen"),
    t(locale, "hero.layer.state"),
  ];
}

export function stackLabelsFor(locale: Locale): StackLabels {
  return {
    layers: layerNames(locale),
    colors: [
      t(locale, "hero.color.blue"),
      t(locale, "hero.color.lime"),
      t(locale, "hero.color.paper"),
      t(locale, "hero.color.ink"),
      t(locale, "hero.color.coral"),
    ],
    ctaProjects: t(locale, "hero.cta_projects"),
    ctaContact: t(locale, "hero.cta_contact"),
    ready: t(locale, "hero.stack.ready"),
    loading: t(locale, "hero.stack.loading"),
    greeting: t(locale, "hero.stack.greeting"),
    error: t(locale, "hero.stack.error"),
    miniTitle: t(locale, "hero.stack.mini_title"),
  };
}
