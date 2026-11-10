import type React from "react";
import { Hero } from "@/components/hero/Hero";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeBlog, type HomePost } from "@/components/home/HomeBlog";
import { HomeContact } from "@/components/home/HomeContact";
import { HomeProcess } from "@/components/home/HomeProcess";
import { HomeProjects } from "@/components/home/HomeProjects";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeGiro } from "@/components/home/story/HomeGiro";
import { useChapterScenes } from "@/components/home/story/useChapterScenes";
import SectionEntrance from "@/components/ui/SectionEntrance";

interface IndexProps {
  posts: HomePost[];
}

interface HomeSectionProps {
  id: string;
  /** Superfície da seção: g-papel (leitura) ou g-azul (marca). Alternadas como na prancha. */
  surface: "g-papel" | "g-azul";
  children: React.ReactNode;
}

// Cada seção entra uma vez ao aparecer (SectionEntrance) e as ids são as da navegação.
function HomeSection({ id, surface, children }: HomeSectionProps) {
  return (
    <SectionEntrance id={id} className={`${surface} home-section`}>
      <div className="home-section__inner relative">
        <i
          className="hs-stop home-section__stop"
          data-stop={id}
          data-size={id === "contato" ? "44" : "64"}
          data-size-m="44"
          aria-hidden="true"
        />
        <div className="home-section__body">{children}</div>
      </div>
    </SectionEntrance>
  );
}

const Index: React.FC<IndexProps> = ({ posts }) => {
  // Fundação das cenas de rolagem da home; carrega o chunk do GSAP sob demanda
  useChapterScenes();

  return (
    <div className="flex flex-col relative">
      <HomeGiro />
      <SectionEntrance id="hero" className="relative g-azul">
        <i
          className="hs-stop home-section__stop"
          data-stop="hero"
          data-size="64"
          data-size-m="44"
          aria-hidden="true"
        />
        <Hero />
      </SectionEntrance>

      <HomeServices />

      <HomeProjects />

      <HomeProcess />

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
