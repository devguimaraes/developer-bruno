import type React from "react";
import { Hero } from "@/components/hero/Hero";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeBlog, type HomePost } from "@/components/home/HomeBlog";
import { HomeContact } from "@/components/home/HomeContact";
import { HomeOtherSites } from "@/components/home/HomeOtherSites";
import { HomeProcess } from "@/components/home/HomeProcess";
import { HomeProjects } from "@/components/home/HomeProjects";
import SectionEntrance from "@/components/ui/SectionEntrance";

interface IndexProps {
  posts: HomePost[];
}

interface HomeSectionProps {
  id: string;
  /** Superfície da seção: g-papel (leitura) ou g-azul (marca). Alternadas como na prancha. */
  surface: "g-papel" | "g-azul";
  ruled?: boolean;
  children: React.ReactNode;
}

// Cada seção entra uma vez ao aparecer (SectionEntrance) e as ids são as da navegação.
function HomeSection({ id, surface, ruled = false, children }: HomeSectionProps) {
  const className = [surface, "home-section", ruled && "home-section--ruled"]
    .filter(Boolean)
    .join(" ");
  return (
    <SectionEntrance id={id} className={className}>
      <div className="home-section__inner">
        <div className="home-section__body">{children}</div>
      </div>
    </SectionEntrance>
  );
}

const Index: React.FC<IndexProps> = ({ posts }) => {
  return (
    <div className="flex flex-col">
      <SectionEntrance id="hero">
        <Hero />
      </SectionEntrance>

      <HomeSection id="projetos" surface="g-papel">
        <HomeProjects />
        <HomeOtherSites />
      </HomeSection>

      <HomeSection id="processo" surface="g-papel" ruled>
        <HomeProcess />
      </HomeSection>

      <HomeSection id="sobre" surface="g-azul">
        <HomeAbout />
      </HomeSection>

      <HomeSection id="blog" surface="g-papel">
        <HomeBlog posts={posts} />
      </HomeSection>

      <HomeSection id="contato" surface="g-azul">
        <HomeContact />
      </HomeSection>
    </div>
  );
};

export default Index;
