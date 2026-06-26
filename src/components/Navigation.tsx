import type React from "react";
import { useState, useEffect } from "react";
import GlassSurface from "@/components/ui/GlassSurface";
import StaggeredMenu from "@/components/ui/StaggeredMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import Magnetic from "@/components/ui/Magnetic";
import { t, setLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t(locale, "nav.projetos"), href: "/#projetos" },
    { name: t(locale, "nav.posts"), href: "/blog" },
    { name: t(locale, "nav.sobre"), href: "/#about" },
    { name: t(locale, "nav.contato"), href: "/#contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <GlassSurface
          className={`w-full transition-all duration-500`}
          height={isMobile ? 64 : 80}
          backgroundOpacity={scrolled ? 0.3 : 0.05}
          blur={scrolled ? 20 : 0}
          brightness={scrolled ? 30 : 50}
          saturation={1.8}
          distortionScale={scrolled ? -150 : 0}
          borderRadius={0}
        >
          <div className="flex justify-between items-center w-full h-full px-4 sm:px-6 md:px-8 max-w-[1800px] mx-auto">
            <Magnetic>
              <a href="/" className="flex items-center gap-2 sm:gap-4 group py-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-accent transition-all duration-300">
                  <img
                    src="/avatar-bruno-bg.jpg"
                    alt="Bruno Guimarães"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="type-mono text-sm sm:text-base font-black text-white tracking-widest uppercase items-center flex gap-3">
                  BRUNO
                  <span className="opacity-40 font-thin">/</span>
                  GUIMARÃES
                </span>
              </a>
            </Magnetic>

            <div className="hidden md:flex items-center gap-12">
              {navLinks.map(link => (
                <Magnetic key={link.name}>
                  <a
                    href={link.href}
                    className="type-mono tracking-[0.2em] hover:text-accent transition-colors text-white/80 hover:text-white uppercase font-bold"
                  >
                    {link.name}
                  </a>
                </Magnetic>
              ))}
              <div className="flex gap-3 ml-4 pl-4 border-l border-white/10">
                {(["pt", "en"] as Locale[]).map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLocale(l)}
                    className={`type-mono tracking-[0.2em] uppercase transition-colors ${
                      l === locale ? "text-accent font-bold" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="md:hidden flex flex-col items-end justify-center gap-1.5 p-2 min-h-[44px] min-w-[44px] pressable"
              onClick={() => setIsOpen(true)}
              aria-label={t(locale, "nav.menu_open")}
            >
              <div className="w-8 h-0.5 bg-white" />
              <div className="w-5 h-0.5 bg-white" />
              <div className="w-8 h-0.5 bg-white" />
            </button>
          </div>
        </GlassSurface>
      </nav>

      {/* Mobile Staggered Menu */}
      <StaggeredMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={navLinks.map(link => ({ label: link.name, href: link.href }))}
      />
    </>
  );
};

export default Navigation;
