import type React from "react";
import { useState, useEffect, memo } from "react";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";

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

const Footer: React.FC = () => {
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/[0.08] py-10 sm:py-12 overflow-hidden">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 px-6 md:px-12 type-mono uppercase tracking-[0.2em]">
        <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
          <span className="font-bold">&copy; {year}</span>
          <LiveClock />
          <span className="font-bold">{t(locale, "footer.location")}</span>
        </div>

        <div className="text-white/40 hover:text-accent transition-colors cursor-default tracking-[0.3em] font-bold">
          {t(locale, "footer.built_by")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
