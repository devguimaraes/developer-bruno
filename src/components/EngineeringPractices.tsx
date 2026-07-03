import type React from "react";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";

const practices = [
  "Code Review",
  "Testing",
  "CI/CD",
  "Acessibilidade",
  "Design Handoff",
  "SEO Técnico",
  "Colaboração com Produto e Marketing",
];

const EngineeringPractices: React.FC = () => {
  const locale = useLocale();

  return (
    <section className="w-full bg-black text-white overflow-hidden">
      <div className="w-full py-16 md:py-24 lg:py-32 border-y border-white/[0.08] bg-white/[0.02]">
        <div className="px-6 md:px-12">
          {/* Label */}
          <div className="type-mono text-[10px] mb-6 tracking-[0.3em] opacity-30">
            {t(locale, "practices.heading")}
          </div>

          {/* Practices List */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {practices.map((practice, index) => (
              <div key={practice} className="flex items-center gap-x-3">
                <span className="type-mono text-[11px] md:text-xs opacity-60 hover:opacity-100 transition-opacity">
                  {practice}
                </span>
                {index < practices.length - 1 && (
                  <span className="text-white/10 text-lg font-black select-none">/</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngineeringPractices;
