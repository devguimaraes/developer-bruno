import React from "react";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

interface Section {
  id: string;
  label: string;
  component: React.ReactNode;
  /** Se true, o conteúdo desta seção terá scroll vertical com snap */
  hasVerticalScroll?: boolean;
}

interface HorizontalSplitLayoutProps {
  sections: Section[];
  onSectionChange: (index: number) => void;
}

const HorizontalSplitLayout: React.FC<HorizontalSplitLayoutProps> = ({ sections, onSectionChange }) => {
  const { containerRef, activeIndex, scrollToSection } = useHorizontalScroll(sections.length);

  // Notifica o pai quando a seção muda
  React.useEffect(() => {
    onSectionChange(activeIndex);
  }, [activeIndex, onSectionChange]);

  // Bloqueia overflow do body enquanto o layout horizontal estiver montado
  React.useEffect(() => {
    document.documentElement.classList.add('has-horizontal-layout');
    return () => {
      document.documentElement.classList.remove('has-horizontal-layout');
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* Container horizontal principal */}
      <div
        ref={containerRef}
        className="horizontal-scroll-container scrollbar-hide"
      >
        {sections.map((section) => (
          <section
            key={section.id}
            data-section={section.id}
            className="horizontal-section border-l-4 border-black relative"
          >
            {section.hasVerticalScroll ? (
              /* Container com scroll vertical interno + snap */
              <div
                data-vertical-scroll
                className="vertical-scroll-inner scrollbar-hide"
              >
                <div className="vertical-snap-child">
                  {section.component}
                </div>
              </div>
            ) : (
              /* Conteúdo estático sem scroll vertical */
              <div className="h-full w-full overflow-hidden px-4 md:px-12 flex items-center">
                <div className="w-full">
                  {section.component}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Indicador de navegação — dots */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
        {sections.map((section, idx) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(idx)}
            aria-label={`Ir para seção ${section.label}`}
            className={`
              relative block border-2 border-black transition-all duration-300
              ${idx === activeIndex
                ? 'w-8 h-3 bg-black shadow-neo-sm'
                : 'w-3 h-3 bg-transparent hover:bg-stone-300'
              }
            `}
          />
        ))}
      </nav>
    </div>
  );
};

export default HorizontalSplitLayout;
