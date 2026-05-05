import type React from "react";
import { useState, useEffect } from "react";
import { contactData } from "@/config/site";
import { t, getLocale, subscribeToLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const CompactCTA: React.FC = () => {
  const [locale, setLocale] = useState<Locale>(getLocale());

  useEffect(() => {
    return subscribeToLocale(l => setLocale(l));
  }, []);

  return (
    <section className="py-16 bg-black border-y border-white/10">
      <div className="text-center px-6">
        <p className="type-mono text-sm text-white/60 mb-4">{t(locale, "cta.compact_question")}</p>
        <a
          href={`mailto:${contactData.email}`}
          className="type-raster-section text-4xl md:text-6xl text-white hover:text-accent transition-colors"
        >
          {t(locale, "cta.compact_action")}
        </a>
      </div>
    </section>
  );
};

export default CompactCTA;
