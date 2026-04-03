import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import GlassSurface from "@/components/ui/GlassSurface";
import StaggeredMenu from "@/components/ui/StaggeredMenu";
import BorderGlow from "@/components/ui/BorderGlow";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "SOBRE", href: "/#about" },
    { name: "PROJETOS", href: "/#projects" },
    { name: "SKILLS", href: "/#skills" },
    { name: "CONTATO", href: "/#contact" },
  ];

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ left: !isMobile ? 'var(--sidebar-width)' : '0' }}
      >
        <GlassSurface 
          className={`w-full transition-all duration-500 ${
            scrolled ? "opacity-100 border-b-4 border-black" : "opacity-0"
          }`}
          height={scrolled ? (isMobile ? 64 : 72) : 0}
          backgroundOpacity={0.4}
          blur={12}
          saturation={1.5}
        >
          <div className="flex justify-between items-center w-full h-full px-4 sm:px-6 md:px-8">
            <a href="/" className="flex items-center gap-2 sm:gap-3 group min-h-11 py-1 pr-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black text-white flex items-center justify-center pixel-border-sm group-hover:bg-brutal-orange transition-colors">
                <span className="font-pixel text-base sm:text-lg">BG</span>
              </div>
              <span className="type-display-card text-base sm:text-xl hidden sm:block font-black">BRUNO_GUIMARAES</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="type-ui-label text-sm hover:text-brutal-orange transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <BorderGlow glowColor="162 100% 27%" borderRadius={0} className="md:hidden">
              <button 
                className="min-h-11 min-w-11 p-2 bg-black text-white border-2 border-black"
                onClick={() => setIsOpen(true)}
                aria-label="Abrir menu"
              >
                <Menu size={24} />
              </button>
            </BorderGlow>
          </div>
        </GlassSurface>

        {/* Transparent initial state content */}
        {!scrolled && (
          <div className="absolute top-0 left-0 w-full py-4 sm:py-6 transition-all duration-500">
            <div className="flex justify-between items-center w-full px-4 sm:px-6 md:px-8">
              <a href="/" className="flex items-center gap-2 sm:gap-3 group min-h-11 py-1 pr-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black text-white flex items-center justify-center pixel-border-sm group-hover:bg-brutal-orange transition-colors">
                  <span className="font-pixel text-base sm:text-lg">BG</span>
                </div>
                <span className="type-display-card text-base sm:text-xl hidden sm:block font-black text-black">BRUNO_GUIMARAES</span>
              </a>

              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    className="type-ui-label text-sm hover:text-brutal-orange transition-colors text-black"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <BorderGlow glowColor="162 100% 27%" borderRadius={0} className="md:hidden">
                <button 
                  className="min-h-11 min-w-11 p-2 bg-black text-white border-2 border-black"
                  onClick={() => setIsOpen(true)}
                  aria-label="Abrir menu"
                >
                  <Menu size={24} />
                </button>
              </BorderGlow>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Staggered Menu */}
      <StaggeredMenu 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        items={[
          { label: "HOME", href: "/#hero" },
          ...navLinks.map(link => ({ label: link.name, href: link.href }))
        ]}
      />
    </>
  );
};

export default Navigation;
