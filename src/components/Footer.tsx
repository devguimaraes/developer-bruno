import { navigationSections, footerData } from "@/config/site";
import { Link } from "react-router-dom";
import { FadeInStagger, FadeInItem } from "@/components/ui/motion-components";
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  Terminal,
  Zap,
  Heart,
} from "lucide-react";

const Footer = () => {
  const handleFooterNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      if (window.location.pathname === "/") {
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.location.href = "/" + href;
      }
    } else {
      window.location.href = href;
    }
  };

  const socialIcons = [
    { icon: Github, href: "https://github.com/devguimaraes", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/devguimaraes",
      label: "LinkedIn",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/brunoguimraes/",
      label: "Instagram",
    },
    { icon: Mail, href: "mailto:contato@brunoguimaraes.dev", label: "Email" },
  ];

  return (
    <footer className="border-t-4 border-black bg-stone-100 relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 bg-neo-dots opacity-5 pointer-events-none" />

      {/* Decorative Geometric Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brutal-yellow border-l-4 border-b-4 border-black opacity-50" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-brutal-orange border-r-4 border-t-4 border-black opacity-30" />

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <FadeInItem className="md:col-span-4">
            <Link
              to="/"
              className="flex items-center gap-3 group mb-6"
              onClick={(e) => handleFooterNavClick(e, "/")}
            >
              <div className="w-14 h-14 bg-black flex items-center justify-center text-white shadow-neo transition-all duration-200 group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none border-2 border-black">
                <span className="font-black font-mono text-xl">BG</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter uppercase">
                  Bruno <span className="text-brutal-orange">Guimarães</span>
                </span>
                <span className="font-mono text-[10px] font-bold tracking-widest text-stone-500">
                  FRONT-END ENGINEER
                </span>
              </div>
            </Link>

            <p className="font-mono text-sm text-stone-600 border-l-4 border-brutal-orange pl-4 mb-6">
              Transformando ideias em interfaces
              <br />
              pixel-perfect de alta performance.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-neo-sm hover:bg-brutal-yellow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </FadeInItem>

          {/* Navigation Column */}
          <FadeInItem className="md:col-span-4">
            <div className="bg-white border-4 border-black shadow-brutal p-6">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-black">
                <Terminal size={16} className="text-brutal-green" />
                <span className="font-mono text-xs font-bold">
                  NAVIGATION.SH
                </span>
              </div>

              <div className="space-y-2">
                {navigationSections.map((section, idx) => (
                  <a
                    key={section.id}
                    href={section.href}
                    className="flex items-center gap-2 font-mono text-sm hover:text-brutal-orange transition-colors group"
                    onClick={(e) => handleFooterNavClick(e, section.href)}
                  >
                    <span className="text-stone-400 group-hover:text-brutal-orange">
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {section.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </FadeInItem>

          {/* Status Column */}
          <FadeInItem className="md:col-span-4">
            <div className="bg-black text-white border-4 border-black p-6">
              {/* System Status Header */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/20">
                <Zap size={16} className="text-brutal-yellow" />
                <span className="font-mono text-xs font-bold">
                  SYSTEM_STATUS
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-stone-400">
                    SERVIDOR
                  </span>
                  <span className="flex items-center gap-2 font-mono text-xs">
                    <span className="w-2 h-2 bg-brutal-green rounded-full animate-pulse" />
                    ONLINE
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-stone-400">
                    VERSÃO
                  </span>
                  <span className="font-mono text-xs">v4.0.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-stone-400">
                    DISPONÍVEL
                  </span>
                  <span className="font-mono text-xs text-brutal-green">
                    PROJETOS
                  </span>
                </div>
              </div>

              {/* Quick Contact */}
              <a
                href="mailto:contato@brunoguimaraes.dev"
                className="mt-6 block w-full bg-brutal-orange text-white font-bold py-3 text-center border-2 border-white hover:bg-orange-600 transition-colors font-mono text-sm"
              >
                INICIAR_CONTATO →
              </a>
            </div>
          </FadeInItem>
        </FadeInStagger>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-4 border-black bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-xs text-stone-600 flex items-center gap-1">
              {footerData.copyright}
            </p>

            <p className="font-mono text-xs text-stone-600 flex items-center gap-1">
              Feito com{" "}
              <Heart
                size={12}
                className="text-brutal-orange fill-brutal-orange"
              />{" "}
              e muito café
            </p>

            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-stone-400">
                RIO DE JANEIRO, BR
              </span>
              <span className="font-mono text-xs bg-black text-white px-2 py-1">
                22.9068° S, 43.1729° W
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
