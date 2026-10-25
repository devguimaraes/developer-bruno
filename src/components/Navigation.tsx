import type React from "react";
import { Languages } from "lucide-react";
import { t, setLocale } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";

const Navigation: React.FC = () => {
  const locale = useLocale();

  const navLinks = [
    { name: t(locale, "nav.sobre"), href: "/#about" },
    { name: t(locale, "nav.projetos"), href: "/#projetos" },
    { name: t(locale, "nav.posts"), href: "/blog" },
    { name: t(locale, "nav.contato"), href: "/#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80">
      <div className="flex flex-wrap justify-between items-center gap-4 w-full px-4 sm:px-6 md:px-8 py-4 max-w-[1800px] mx-auto">
        <a
          href="/"
          className="type-mono text-sm sm:text-base font-black text-white tracking-widest uppercase"
        >
          BRUNO
          <span className="opacity-40 font-thin"> / </span>
          GUIMARÃES
        </a>

        <div className="flex flex-wrap items-center gap-6">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="type-mono tracking-[0.2em] text-white/80 hover:text-white uppercase font-bold"
            >
              {link.name}
            </a>
          ))}
          <button
            type="button"
            onClick={() => setLocale(locale === "pt" ? "en" : "pt")}
            className="flex items-center gap-1.5 type-mono tracking-[0.2em] uppercase text-white/60 hover:text-accent font-bold"
            aria-label={locale === "pt" ? "Switch to English" : "Mudar para português"}
          >
            <Languages size={20} className="text-accent" />
            <span className="w-5 text-center">{locale === "pt" ? "PT" : "EN"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
