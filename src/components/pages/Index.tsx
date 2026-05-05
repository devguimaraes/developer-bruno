import type React from "react";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import EngineeringPractices from "@/components/EngineeringPractices";
import LatestPosts from "@/components/pages/LatestPosts";
import CompactCTA from "@/components/CompactCTA";
import SectionEntrance from "@/components/ui/SectionEntrance";
import { contactData } from "@/config/site";
import type { BlogPost } from "@/types/blog";

interface IndexProps {
  latestPosts?: BlogPost[];
}

const Index: React.FC<IndexProps> = ({ latestPosts = [] }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <SectionEntrance id="hero">
        <Hero />
      </SectionEntrance>

      {/* Projects Section */}
      <SectionEntrance id="projetos">
        <Projects />
      </SectionEntrance>

      {/* Compact CTA after projects */}
      <CompactCTA />

      {/* Latest Posts Section */}
      {latestPosts.length > 0 && (
        <SectionEntrance id="blog">
          <LatestPosts posts={latestPosts} />
        </SectionEntrance>
      )}

      {/* About Section */}
      <SectionEntrance id="about">
        <About />
      </SectionEntrance>

      {/* Engineering Practices Section */}
      <SectionEntrance id="practices">
        <EngineeringPractices />
      </SectionEntrance>

      {/* Footer Info / Showreel Placeholder */}
      <SectionEntrance
        id="contact"
        className="py-40 flex flex-col items-center justify-center text-center"
      >
        <div className="type-mono mb-8">Ready to start a project?</div>
        <a
          href={`mailto:${contactData.email}`}
          className="type-raster-section text-[12vw] hover:text-accent transition-colors cursor-pointer block"
          title="Get in touch to start a project"
        >
          LET&apos;S_TALK
        </a>
        <div className="mt-20 type-mono opacity-50">
          © 2026 BRUNO GUIMARÃES / ALL RIGHTS RESERVED
        </div>
      </SectionEntrance>
    </div>
  );
};

export default Index;
