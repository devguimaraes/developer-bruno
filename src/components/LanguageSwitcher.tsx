import type React from "react";
import { useState, useEffect } from "react";
import { getLocale, setLocale, subscribeToLocale, type Locale } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";

const LanguageSwitcher: React.FC = () => {
  const [locale, setLocalLocale] = useState<Locale>(getLocale());
  const isMobile = useIsMobile();

  useEffect(() => {
    const unsubscribe = subscribeToLocale(newLocale => {
      setLocalLocale(newLocale);
    });
    return unsubscribe;
  }, []);

  if (isMobile) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2 type-mono text-[10px]">
      {(["pt", "en"] as Locale[]).map(l => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={`uppercase tracking-widest transition-colors ${
            l === locale ? "text-accent font-bold" : "text-white/40 hover:text-white/70"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
