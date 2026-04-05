import React from "react";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import SectionEntrance from "@/components/ui/SectionEntrance";

const Index: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <SectionEntrance>
        <Hero />
      </SectionEntrance>

      {/* Projects Section */}
      <SectionEntrance>
        <Projects />
      </SectionEntrance>

      {/* About Section */}
      <SectionEntrance>
        <About />
      </SectionEntrance>

      {/* Footer Info / Showreel Placeholder */}
      <SectionEntrance className="py-40 flex flex-col items-center justify-center text-center">
        <div className="type-mono mb-8">Ready to start a project?</div>
        <a href="mailto:dev@bruno.com" className="type-raster-section text-[12vw] hover:text-accent transition-colors cursor-pointer block">
          LET'S_TALK
        </a>
        <div className="mt-20 type-mono opacity-50">
          © 2026 BRUNO GUIMARÃES / ALL RIGHTS RESERVED
        </div>
      </SectionEntrance>
    </div>
  );
};


export default Index;
