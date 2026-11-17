import type React from "react";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeBlog, type HomePost } from "@/components/home/HomeBlog";
import { HomeContact } from "@/components/home/HomeContact";
import { HomeEnd } from "@/components/home/HomeEnd";
import { HomeOpening } from "@/components/home/HomeOpening";
import { HomeProcess } from "@/components/home/HomeProcess";
import { HomeProjects } from "@/components/home/HomeProjects";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeGiro } from "@/components/home/story/HomeGiro";
import { useChapterScenes } from "@/components/home/story/useChapterScenes";

interface IndexProps {
  posts: HomePost[];
}

const Index: React.FC<IndexProps> = ({ posts }) => {
  // Fundação das cenas de rolagem da home; carrega o chunk do GSAP sob demanda
  useChapterScenes();

  return (
    <div className="flex flex-col relative">
      <HomeGiro />
      <HomeOpening />

      <HomeServices />

      <HomeProjects />

      <HomeProcess />

      <HomeAbout />

      <HomeBlog posts={posts} />

      <HomeContact />

      <HomeEnd />
    </div>
  );
};

export default Index;
