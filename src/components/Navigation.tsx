import type React from "react";
import { useState, useEffect } from "react";
import { LiquidGlassLens } from "@/components/ui/LiquidGlassLens";
import StaggeredMenu from "@/components/ui/StaggeredMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Languages } from "lucide-react";
import { t, setLocale } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";
import { BrandMascot } from "@/components/brand/BrandMascot";

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
    { name: t(locale, "nav.sobre"), href: "/#about" },
    { name: t(locale, "nav.projetos"), href: "/#projetos" },
    { name: t(locale, "nav.posts"), href: "/blog" },
    { name: t(locale, "nav.contato"), href: "/#contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <LiquidGlassLens
          className="w-full transition-all duration-500"
          height={isMobile ? 64 : 80}
          backgroundOpacity={scrolled ? 0.3 : 0.05}
          blur={scrolled ? 20 : 0}
          saturation={1.8}
          // Props do liquidGL — transição via scroll
          frost={scrolled ? 3 : 0.5}
          refraction={scrolled ? 0.02 : 0.01}
          bevelDepth={scrolled ? 0.08 : 0.04}
          bevelWidth={0.15}
          specular={true}
          shadow={true}
        >
          <div className="flex justify-between items-center w-full h-full px-4 sm:px-6 md:px-8 max-w-[1800px] mx-auto">
            <a href="/" className="flex items-center gap-2 sm:gap-4 group py-2 pressable">
              <div className="rounded-lg overflow-hidden border-2 border-white/20 group-hover:border-accent transition-all duration-300 flex items-center justify-center p-1">
                <BrandMascot variant="cor" size={40} />
              </div>
              <span className="type-mono text-sm sm:text-base font-black text-white tracking-widest uppercase items-center flex gap-3">
                BRUNO
                <span className="opacity-40 font-thin">/</span>
                GUIMARÃES
              </span>
            </a>

            <div className="hidden md:flex items-center gap-12">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className="type-mono tracking-[0.2em] hover:text-accent transition-colors text-white/80 hover:text-white uppercase font-bold pressable"
                >
                  {link.name}
                </a>
              ))}
              <div className="ml-4 pl-4 border-l border-white/10">
                <button
                  type="button"
                  onClick={() => setLocale(locale === "pt" ? "en" : "pt")}
                  className="flex items-center gap-1.5 type-mono tracking-[0.2em] uppercase text-white/60 hover:text-accent transition-colors font-bold pressable"
                  aria-label={locale === "pt" ? "Switch to English" : "Mudar para português"}
                >
                  <Languages size={20} className="text-accent" />
                  <span className="w-5 text-center">{locale === "pt" ? "PT" : "EN"}</span>
                </button>
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
        </LiquidGlassLens>
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
