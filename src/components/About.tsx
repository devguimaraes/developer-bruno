import type React from "react";
import { motion } from "framer-motion";
import GlitchImage from "./ui/GlitchImage";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";
import {
  SiSupabase,
  SiFramer,
  SiOpenai,
  SiGithub,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiVercel,
  SiAnthropic,
} from "@icons-pack/react-simple-icons";
import { MousePointer2 } from "lucide-react";

const About: React.FC = () => {
  const locale = useLocale();

  const techs = [
    { name: "Next.js", icon: SiNextdotjs },
    { name: "TypeScript", icon: SiTypescript },
    { name: "Tailwind", icon: SiTailwindcss },
    { name: "Node.js", icon: SiNodedotjs },
    { name: "Vercel", icon: SiVercel },
    { name: "GitHub", icon: SiGithub },
    { name: "Claude Code", icon: SiAnthropic },
    { name: "Supabase", icon: SiSupabase },
    { name: "OpenAI Codex", icon: SiOpenai },
    { name: "Cursor", icon: MousePointer2 },
    { name: "Framer", icon: SiFramer },
  ];

  const marqueeTechs = [
    ...techs.map(tech => ({ ...tech, key: `primary-${tech.name}` })),
    ...techs.map(tech => ({ ...tech, key: `secondary-${tech.name}` })),
  ];

  // Badges removidas para layout editorial minimalista

  return (
    <section id="about" className="min-h-screen pb-16 bg-black text-white overflow-hidden relative">
      <div className="w-full px-6 md:px-12 pt-16 md:pt-40">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-40 items-center md:items-start">
          {/* Lado Esquerdo: loop em vídeo (WebM + MP4) — muito menor que GIF para a CDN */}
          <div className="relative group grayscale hover:grayscale-0 transition-all duration-700 w-full max-w-[360px] lg:max-w-[480px] shrink-0">
            <div className="aspect-[9/16] w-full overflow-hidden">
              <GlitchImage
                src="/brunoGuimaraes.png"
                alt="Bruno Guimarães"
                className="w-full h-full object-cover"
                active={true}
                loadingLazy
              />
            </div>
            {/* Overlay Minimalista */}
            <div
              className="absolute -bottom-4 -left-4 bg-white text-black px-3 py-1 type-mono text-[9px] font-bold uppercase tracking-widest"
              title="Bio stream — personal introduction"
            >
              STREAM_BIO_03
            </div>
          </div>

          {/* Lado Direito: Bio Tipográfica Massiva */}
          <div className="flex flex-col justify-center flex-1">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="type-raster-section text-[12vw] md:text-[8vw] leading-[0.8] opacity-100 uppercase tracking-tighter mb-8"
            >
              BRUNO
              <br />
              GUIMARÃES
            </motion.h2>

            <div className="max-w-xl border-l border-white/10 pl-10 ml-4">
              <p className="text-xl md:text-2xl leading-relaxed font-serif italic text-white/90 text-justify">
                {t(locale, "about.bio")}
              </p>
              <p className="type-mono text-[10px] opacity-30 mt-10 uppercase tracking-[0.3em]">
                {t(locale, "about.based")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stack Ticker - 100% real de largura (Edge-to-Edge) */}
      <div className="w-full relative mt-24 py-16 border-y border-white/10 overflow-hidden bg-white/[0.02]">
        <div className="flex animate-marquee whitespace-nowrap">
          <div className="flex items-center gap-12">
            {marqueeTechs.map(tech => (
              <div key={tech.key} className="flex items-center gap-4 group px-6">
                <tech.icon
                  size={28}
                  className="text-white group-hover:text-accent transition-colors"
                />
                <span className="type-mono text-[10px] md:text-sm opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-[0.2em]">
                  {tech.name}
                </span>
                <span className="text-white/10 text-xl font-black mx-4 select-none">/</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
