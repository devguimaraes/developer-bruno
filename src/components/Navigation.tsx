import React, { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  
  useEffect(() => {
    let frameId: number | null = null;
    const handleScroll = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        setScrolled(window.scrollY > 50);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = ["about", "services", "skills", "projects", "blog", "contact"];
    const getSectionElements = () =>
      sectionIds
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => Boolean(element));

    const updateActiveSection = () => {
      const elements = getSectionElements();
      let foundSection = "";
      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          foundSection = element.id;
          break;
        }
      }
      setActiveSection((prev) => (prev === foundSection ? prev : foundSection));
    };

    const observer = new IntersectionObserver(
      () => updateActiveSection(),
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    const elements = getSectionElements();
    elements.forEach((element) => observer.observe(element));
    updateActiveSection();

    window.addEventListener("resize", updateActiveSection);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [pathname]);

  // Effect to handle hash scrolling after navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, []);

  const smoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      if (pathname === "/") {
        const targetId = href.substring(1);
        smoothScroll(e, targetId);
      } else {
        window.location.href = "/" + href;
      }
    } else if (href === "/") {
      e.preventDefault();
      if (pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    } else {
      e.preventDefault();
      window.location.href = href;
    }
  };

  const navLinks = [
    { name: "INÍCIO", href: "/", id: "" },
    { name: "SOBRE", href: "#about", id: "about" },
    { name: "SKILLS", href: "#skills", id: "skills" },
    { name: "PROJETOS", href: "#projects", id: "projects" },
    { name: "BLOG", href: "/blog", id: "blog" },
    { name: "ANTIGRAVITY", href: "/antigravity", id: "antigravity" },
    { name: "CONTATO", href: "#contact", id: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b-4 border-black py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo - Terminal Style */}
        <a
          href="/"
          className="flex items-center gap-3 group cursor-pointer"
          onClick={(e) => handleNavClick(e, "/")}
        >
          <div className="w-12 h-12 bg-black flex items-center justify-center text-white shadow-neo transition-all duration-200 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none border-2 border-black">
            <span className="font-black font-mono text-xl">BG</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">
              Bruno <span className="text-brutal-orange">Guimarães</span>
            </span>
            <span className="font-mono text-[10px] font-bold tracking-widest text-stone-500 flex items-center gap-1">
              <Zap size={10} className="text-brutal-green" />
              DEV_FRONTEND
            </span>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center bg-white border-4 border-black shadow-neo">
          {navLinks.map((link, _idx) => {
            // Lógica de isActive:
            // - INÍCIO: só ativo se estamos em "/" E nenhuma seção está ativa
            // - Seções (#about, etc): ativo se activeSection corresponde
            // - Outras páginas (/blog, etc): ativo se pathname corresponde
            const isHomeLink = link.href === "/";
            const isSectionLink = link.href.startsWith("#");
            const isPageLink = !isHomeLink && !isSectionLink;

            const isActive = isHomeLink
              ? pathname === "/" && !activeSection
              : isSectionLink
              ? link.id && activeSection === link.id
              : isPageLink && link.href === pathname;

            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative px-4 py-3 font-mono font-bold text-sm transition-all duration-200 border-r-2 border-black last:border-r-0 ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-brutal-yellow"
                }`}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                <span className="relative z-10">{`//${link.name}`}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-black -z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-3 border-4 border-black bg-brutal-yellow shadow-neo active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X strokeWidth={3} size={24} />
          ) : (
            <Menu strokeWidth={3} size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-b-4 border-black shadow-brutal-lg"
          >
            {navLinks.map((link, idx) => {
              const isHomeLink = link.href === "/";
              const isSectionLink = link.href.startsWith("#");
              const isPageLink = !isHomeLink && !isSectionLink;

              const isActive = isHomeLink
                ? pathname === "/" && !activeSection
                : isSectionLink
                ? link.id && activeSection === link.id
                : isPageLink && link.href === pathname;

              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center justify-between text-xl font-black p-6 border-b-2 border-black/10 transition-colors font-mono group ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-brutal-yellow"
                  }`}
                  onClick={(e) => {
                    setIsOpen(false);
                    handleNavClick(e, link.href);
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-brutal-orange text-white flex items-center justify-center text-sm border-2 border-black">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {link.name}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-brutal-orange">
                    ➜
                  </span>
                </motion.a>
              );
            })}

            {/* Mobile Menu Footer */}
            <div className="p-4 bg-stone-100 border-t-4 border-black">
              <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold text-stone-600">
                <div className="w-2 h-2 bg-brutal-green rounded-full animate-pulse" />
                SISTEMA_ONLINE • v4.0
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
