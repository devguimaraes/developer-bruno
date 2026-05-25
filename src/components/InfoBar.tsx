import type React from "react";
import { useState, useEffect } from "react";
import { t, getLocale, subscribeToLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { SiInstagram, SiX, SiWhatsapp, SiGithub } from "@icons-pack/react-simple-icons";
import { Linkedin } from "lucide-react";

const InfoBar: React.FC = () => {
  const [time, setTime] = useState("");
  const [locale, setLocale] = useState<Locale>(getLocale());

  useEffect(() => {
    return subscribeToLocale(l => setLocale(l));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString("pt-BR", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/bcguimaraes/" },
    { name: "Instagram", icon: SiInstagram, href: "https://www.instagram.com/brunoguimraes/" },
    {
      name: "WhatsApp",
      icon: SiWhatsapp,
      href: "https://wa.me/5521969715247?text=Ol%C3%A1%20Bruno%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!",
    },
    { name: "X", icon: SiX, href: "https://x.com/devguimraes" },
    { name: "GitHub", icon: SiGithub, href: "https://github.com/devguimaraes" },
  ];

  return (
    <section className="py-12 border-y border-white/10 bg-black text-white overflow-hidden">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 px-6 md:px-12 text-[10px] type-mono uppercase tracking-[0.2em]">
        <div className="flex flex-wrap items-center gap-8 justify-center md:justify-start">
          <span className="font-bold">&copy; {new Date().getFullYear()}</span>
          <span className="tabular-nums font-bold">{time || "--:--:--"}</span>
          <span className="font-bold">Rio de Janeiro, BR</span>

          <div className="flex items-center gap-5 ml-2 border-l border-white/10 pl-8">
            {socialLinks.map(social => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent transition-colors duration-300 transform hover:scale-110"
                title={social.name}
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="text-white hover:text-accent transition-colors cursor-default tracking-[0.3em] font-bold">
          {t(locale, "about.built_by")}
        </div>
      </div>
    </section>
  );
};

export default InfoBar;
