import type React from "react";
import { motion } from "framer-motion";
import LiquidGlitchImage from "./ui/LiquidGlitchImage";
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
import { BrandIcon } from "@/components/brand";
import type { IconName } from "@/components/brand";
import type { TranslationKey } from "@/lib/i18n";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const capabilities: { icon: IconName; key: TranslationKey }[] = [
  { icon: "codigo", key: "about.cap.development" },
  { icon: "api", key: "about.cap.backend" },
  { icon: "deploy", key: "about.cap.deploy" },
  { icon: "usuario", key: "about.cap.a11y" },
  { icon: "settings", key: "about.cap.practices" },
  { icon: "comunidade", key: "about.cap.collaboration" },
];

const About: React.FC = () => {
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();

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

  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col justify-center bg-black text-white py-16 md:py-20"
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* ─── Header: Nome + Tagline ─── */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "circOut" }}
          className="mb-8"
        >
          <h2 className="type-raster-section text-[7vw] md:text-[5vw] leading-[0.85] text-white mb-2">
            BRUNO
            <br />
            GUIMARÃES
          </h2>
          <p className="type-mono text-[11px] text-accent uppercase tracking-[0.2em]">
            {t(locale, "about.tagline" as TranslationKey)}
          </p>
        </motion.div>

        {/* ─── Bloco Foto + Bio ─── */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
          {/* Foto — 30% width, aspecto editorial */}
          <motion.div
            data-testid="about-photo"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full sm:w-[60%] sm:max-w-[240px] md:w-[30%] md:min-w-[220px] aspect-[3/4] flex-shrink-0 group"
          >
            <div className="w-full h-full overflow-hidden border-2 border-white/[0.08] transition-all duration-700 group-hover:border-white/[0.15]">
              <LiquidGlitchImage
                src="/brunoGuimaraes.webp"
                alt="Bruno Guimarães"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                active
                loadingLazy
              />
            </div>
          </motion.div>

          {/* Bio — editorial com border accent */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex-1 border-l-2 border-accent pl-6 md:pl-8 flex items-center"
          >
            <p className="font-serif italic text-base md:text-lg leading-[1.6] text-white/80">
              {t(locale, "about.bio")}
            </p>
          </motion.div>
        </div>

        {/* ─── Capabilities — Grid 3×2 ─── */}
        <div className="mb-6">
          <p className="type-mono text-[11px] text-accent uppercase tracking-[0.4em] font-bold mb-6">
            {t(locale, "about.capabilities_label")}
          </p>

          <ul
            data-testid="about-capabilities"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {capabilities.map((cap, i) => (
              <motion.li
                key={cap.icon}
                initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex flex-col items-center text-center gap-3 p-5 border border-white/[0.06] hover:border-white/[0.15] transition-colors"
              >
                <BrandIcon name={cap.icon} size={32} decorative />
                <span className="type-mono text-sm uppercase tracking-[0.12em] text-white/70">
                  {t(locale, cap.key)}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* ─── Tech Strip — Ícones apenas ─── */}
        <motion.div
          data-testid="about-tech-strip"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-5 pt-8 border-t border-white/[0.06]"
        >
          {techs.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
              className="group"
              title={tech.name}
            >
              <tech.icon
                size={22}
                className="text-white/40 group-hover:text-accent transition-colors duration-200"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
