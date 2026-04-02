import React, { useMemo, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Layout Components
import HorizontalSplitLayout from "@/components/layout/HorizontalSplitLayout";
import FixedSidebar from "@/components/layout/FixedSidebar";
import BackgroundGrid from "@/components/ui/BackgroundGrid";

// Section Components
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

const Index: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);

  const sections = useMemo(() => [
    { id: "hero", label: "Início", component: <Hero /> },
    { id: "about", label: "Sobre", component: <About /> },
    { id: "projects", label: "Projetos", component: <Projects />, hasVerticalScroll: true },
    { id: "skills", label: "Skills", component: <Skills />, hasVerticalScroll: true },
    { id: "contact", label: "Contato", component: <Contact /> },
  ], []);

  return (
    <div className="relative w-full bg-background min-h-screen">
      {/* Background fixo */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundGrid />
      </div>
      <div className="scanlines fixed inset-0 pointer-events-none z-[100] opacity-[0.03]" />
      
      {!isMobile && (
        <FixedSidebar 
          activeSection={{
            id: sections[activeIndex].id,
            index: activeIndex,
            label: sections[activeIndex].label
          }} 
        />
      )}

      <main 
        className="relative z-10"
        style={{ paddingLeft: !isMobile ? 'var(--sidebar-width)' : '0' }}
      >
        {isMobile ? (
          <div className="flex flex-col">
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Contact />
          </div>
        ) : (
          <HorizontalSplitLayout 
            sections={sections} 
            onSectionChange={(index) => setActiveIndex(index)}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
