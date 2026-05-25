import type React from "react";
import { useState, useEffect, memo } from "react";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";
import { contactData } from "@/config/site";
import { socialIconMap } from "@/lib/socialIcons";

const LiveClock = memo(function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString("pt-BR", { hour12: false }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span className="tabular-nums font-bold">{time || "--:--:--"}</span>;
});

const InfoBar: React.FC = () => {
  const locale = useLocale();

  return (
    <section className="py-12 border-y border-white/10 bg-black text-white overflow-hidden">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 px-6 md:px-12 text-[10px] type-mono uppercase tracking-[0.2em]">
        <div className="flex flex-wrap items-center gap-8 justify-center md:justify-start">
          <span className="font-bold">&copy; {new Date().getFullYear()}</span>
          <LiveClock />
          <span className="font-bold">Rio de Janeiro, BR</span>

          <div className="flex items-center gap-5 ml-2 border-l border-white/10 pl-8">
            {contactData.socialLinks.map(link => {
              const Icon = socialIconMap[link.id];
              if (!Icon) return null;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent transition-colors duration-300 transform hover:scale-110"
                  title={link.label}
                >
                  <Icon size={16} />
                </a>
              );
            })}
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
