import type React from "react";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import SocialIcons from "@/components/SocialIcons";
import SectionEntrance from "@/components/ui/SectionEntrance";
import { contactData } from "@/config/site";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/lib/i18n";

const Index: React.FC = () => {
  const locale = useLocale();

  return (
    <div className="flex flex-col">
      <SectionEntrance id="hero">
        <Hero />
      </SectionEntrance>

      <SectionEntrance id="projetos">
        <Projects />
      </SectionEntrance>

      <SectionEntrance id="about">
        <About />
      </SectionEntrance>

      <SectionEntrance
        id="contact"
        className="pt-8 md:pt-16 lg:pt-24 pb-20 md:pb-32 lg:pb-40 flex flex-col items-center justify-center text-center"
      >
        <div className="type-mono mb-8">{t(locale, "cta.ready")}</div>
        <a
          href={`mailto:${contactData.email}`}
          className="type-raster-section text-[12vw] hover:text-accent transition-colors cursor-pointer block pressable"
          title={t(locale, "cta.lets_talk")}
        >
          {t(locale, "cta.lets_talk")}
        </a>
        <SocialIcons />
        <div className="mt-20 type-mono text-white/40">{t(locale, "cta.copyright")}</div>
      </SectionEntrance>
    </div>
  );
};

export default Index;
