import { useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, getLocale, subscribeToLocale } from "@/lib/i18n";

// As páginas saem pré-renderizadas no idioma padrão. Na hidratação o React usa esse mesmo idioma
// (o snapshot do servidor) e logo depois renderiza de novo com o idioma salvo no navegador. Ler o
// salvo já na primeira renderização divergia do HTML e o React jogava fora o HTML de cada ilha.
const serverLocale = (): Locale => defaultLocale;

export function useLocale(): Locale {
  return useSyncExternalStore(subscribeToLocale, getLocale, serverLocale);
}
