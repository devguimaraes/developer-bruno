import type React from "react";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import EngineeringPractices from "@/components/EngineeringPractices";
import LatestPosts from "@/components/pages/LatestPosts";
import InfoBar from "@/components/InfoBar";
import SocialIcons from "@/components/SocialIcons";
import SectionEntrance from "@/components/ui/SectionEntrance";
import { contactData } from "@/config/site";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/lib/i18n";
import type { BlogPost } from "@/types/blog";

interface IndexProps {
  latestPosts?: BlogPost[];
}

const Index: React.FC<IndexProps> = ({ latestPosts = [] }) => {
  const locale = useLocale();

  return (
    <div className="flex flex-col">
      <SectionEntrance id="hero">
        <Hero />
      </SectionEntrance>

      <SectionEntrance id="projetos">
        <Projects />
      </SectionEntrance>

      <InfoBar />

      {latestPosts.length > 0 && (
        <SectionEntrance id="blog">
          <LatestPosts posts={latestPosts} />
        </SectionEntrance>
      )}

      <SectionEntrance id="about">
        <About />
      </SectionEntrance>

      <SectionEntrance id="practices">
        <EngineeringPractices />
      </SectionEntrance>

      <SectionEntrance
        id="contact"
        className="py-40 flex flex-col items-center justify-center text-center"
      >
        <div className="type-mono mb-8">{t(locale, "cta.ready")}</div>
        <a
          href={`mailto:${contactData.email}`}
          className="type-raster-section text-[12vw] hover:text-accent transition-colors cursor-pointer block"
          title={t(locale, "cta.work_together")}
        >
          {t(locale, "cta.lets_talk")}
        </a>
        <SocialIcons />
        <div className="mt-20 type-mono opacity-50">{t(locale, "cta.copyright")}</div>
      </SectionEntrance>
    </div>
  );
};

export default Index;
