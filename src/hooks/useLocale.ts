import { useState, useEffect } from "react";
import { getLocale, subscribeToLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>(getLocale());

  useEffect(() => {
    return subscribeToLocale(l => setLocale(l));
  }, []);

  return locale;
}
