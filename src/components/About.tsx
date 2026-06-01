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
      <div className="container mx-auto px-6 md:px-12 pt-24 md:pt-48">
        <div className="relative">
          {/* Lado Esquerdo/Fundo: Imagem Editorial com Glitch */}
          <div className="md:absolute md:top-0 md:right-0 w-full md:w-[55%] aspect-[3/4] md:aspect-[4/5] z-0 grayscale opacity-40 md:opacity-100 group">
            <div className="w-full h-full overflow-hidden border-2 border-white/5 shadow-2xl transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-[1.02]">
              <GlitchImage
                src="/brunoGuimaraes.png"
                alt="Bruno Guimarães"
                className="w-full h-full object-cover"
                active={true}
                loadingLazy
              />
            </div>
            {/* Technical Tag */}
            <div className="absolute -bottom-4 right-4 bg-accent text-black px-4 py-1.5 type-mono text-[10px] font-black uppercase tracking-widest z-10 shadow-brutal">
              IDENT_STREAM_03
            </div>
          </div>

          {/* Lado Direito/Sobreposto: Conteúdo Editorial */}
          <div className="relative z-10 pt-12 md:pt-20 md:w-[60%] pointer-events-none">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="type-raster-section text-[12vw] md:text-[7.5vw] leading-[0.75] uppercase tracking-tighter mb-10 mix-blend-difference"
            >
              BRUNO
              <br />
              GUIMARÃES
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-lg md:ml-12 border-l-2 border-accent pl-10 py-2 pointer-events-auto"
            >
              <p className="text-xl md:text-2xl leading-[1.5] font-serif italic text-white/95 text-left mb-8 drop-shadow-sm">
                {t(locale, "about.bio")}
              </p>

              <div className="flex flex-col gap-2">
                <p className="type-mono text-[10px] text-accent uppercase tracking-[0.4em] font-bold">
                  {t(locale, "about.based")}
                </p>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-white" />
                  <div className="w-2 h-2 bg-white/40" />
                  <div className="w-2 h-2 bg-white/10" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stack Ticker - Full Width */}
      <div className="w-full relative mt-40 md:mt-64 py-20 border-y border-white/5 overflow-hidden bg-white/[0.01] backdrop-blur-[2px]">
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
