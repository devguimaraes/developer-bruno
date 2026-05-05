import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlitchImage from "./ui/GlitchImage";
import {
  SiInstagram,
  SiX,
  SiSupabase,
  SiWhatsapp,
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
import { Linkedin, MousePointer2 } from "lucide-react";

const About: React.FC = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString("pt-BR", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
  const marqueeTechs = [
    ...techs.map(tech => ({ ...tech, key: `primary-${tech.name}` })),
    ...techs.map(tech => ({ ...tech, key: `secondary-${tech.name}` })),
  ];

  // Badges removidas para layout editorial minimalista

  return (
    <section
      id="about"
      className="min-h-screen pt-12 md:pt-32 pb-24 bg-black text-white overflow-hidden relative"
    >
      {/* Dynamic Info Bar - Posicionada no topo para transição entre seções */}
      <div className="w-full py-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 px-6 md:px-12 text-[10px] type-mono uppercase tracking-[0.2em] text-white">
        <div className="flex flex-wrap items-center gap-8 justify-center md:justify-start">
          <span className="font-bold">© {new Date().getFullYear()}</span>
          <span className="tabular-nums font-bold">{time || "--:--:--"}</span>
          <span className="font-bold">Rio de Janeiro, BR</span>

          {/* Social Icons Integrados com Separador */}
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
          Built by Bruno Guimarães
        </div>
      </div>

      <div className="w-full px-6 md:px-12 pt-32">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-32 items-center md:items-start">
          {/* Lado Esquerdo: loop em vídeo (WebM + MP4) — muito menor que GIF para a CDN */}
          <div className="relative group grayscale hover:grayscale-0 transition-all duration-700 w-full max-w-[320px] lg:max-w-[400px] shrink-0">
            <div className="aspect-[9/16] w-full overflow-hidden">
              <GlitchImage
                videoSources={[
                  { src: "/avatar-bio3.webm", type: "video/webm" },
                  { src: "/avatar-bio3.mp4", type: "video/mp4" },
                ]}
                posterSrc="/about-avatar.jpg"
                alt="Bruno Guimarães"
                className="w-full h-full object-cover"
                active={true}
                loadingLazy
              />
            </div>
            {/* Overlay Minimalista */}
            <div className="absolute -bottom-4 -left-4 bg-white text-black px-3 py-1 type-mono text-[9px] font-bold uppercase tracking-widest">
              STREAM_BIO_03
            </div>
          </div>

          {/* Lado Direito: Bio Tipográfica Massiva */}
          <div className="flex flex-col justify-center flex-1">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="type-raster-section text-[15vw] md:text-[11vw] leading-[0.75] opacity-100 uppercase tracking-tighter mb-12"
            >
              BRUNO
              <br />
              GUIMARÃES
            </motion.h2>

            <div className="max-w-xl border-l border-white/10 pl-8 ml-2">
              <p className="text-2xl md:text-3xl leading-snug font-serif italic text-white/90">
                Com 5 anos de experiência, crio landing pages de alta conversão e sites
                institucionais que combinam engenharia robusta com design intencional. Especializado
                em performance, SEO técnico e Core Web Vitals — interfaces que carregam rápido,
                rankeiam bem e convertem visitantes em clientes.
              </p>
              <p className="type-mono text-[10px] opacity-30 mt-8 uppercase tracking-[0.3em]">
                {"// BASED_IN_RIO_DE_JANEIRO"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stack Ticker - 100% real de largura (Edge-to-Edge) */}
      <div className="w-full relative mt-32 py-12 border-y border-white/10 overflow-hidden bg-white/[0.02]">
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
