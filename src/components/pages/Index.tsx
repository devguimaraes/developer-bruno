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

      <HomeAbout />

      <HomeBlog posts={posts} />

      <HomeContact />
    </div>
  );
};

export default Index;
