import React from "react";
import { motion } from "framer-motion";
import GlitchImage from "./ui/GlitchImage";
import TextReveal from "./ui/TextReveal";
import Magnetic from "./ui/Magnetic";
import { 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiNodedotjs, 
  SiVercel, 
  SiGithub, 
  SiAnthropic,
  SiInstagram,
  SiX
} from "@icons-pack/react-simple-icons";
import { Linkedin } from "lucide-react";

const About: React.FC = () => {
  const techs = [
    { name: "Next.js", icon: SiNextdotjs },
    { name: "TypeScript", icon: SiTypescript },
    { name: "Tailwind", icon: SiTailwindcss },
    { name: "Node.js", icon: SiNodedotjs },
    { name: "Vercel", icon: SiVercel },
    { name: "GitHub", icon: SiGithub },
    { name: "Claude Code", icon: SiAnthropic },
  ];

  const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/devguimaraes" },
    { name: "GitHub", icon: SiGithub, href: "https://github.com/devguimaraes" },
    { name: "Instagram", icon: SiInstagram, href: "https://instagram.com/devguimaraes" },
    { name: "X", icon: SiX, href: "https://x.com/devguimraes" },
  ];

  const badges = [
    "5 ANOS DE EXPERIÊNCIA",
    "DEVELOPER FRONT END",
    "RIO DE JANEIRO"
  ];

  return (
    <section id="about" className="min-h-screen py-24 px-6 md:px-12 bg-black text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Lado Esquerdo: Foto com Glitch */}
          <div className="relative group grayscale hover:grayscale-0 transition-all duration-700">
             <div className="aspect-[4/5] w-full overflow-hidden border-4 border-white shadow-brutal">
                <GlitchImage 
                   src="/avatar_bruno.jpg" 
                   alt="Bruno Guimarães" 
                   className="w-full h-full object-cover"
                />
             </div>
             {/* Overlay Brutalista */}
             <div className="absolute -bottom-6 -right-6 bg-accent text-black p-4 type-mono text-xs font-bold border-2 border-black hidden md:block">
                SYS_OPERATOR: BRUNO_G
             </div>
          </div>

          {/* Lado Direito: Conteúdo */}
          <div className="flex flex-col space-y-12">
            
            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {badges.map((badge, i) => (
                <motion.span 
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="px-4 py-1 border-2 border-white/20 type-mono text-[10px] md:text-xs tracking-widest hover:border-accent hover:text-accent transition-colors"
                >
                  {badge}
                </motion.span>
              ))}
            </div>

            {/* Descrição */}
            <div className="space-y-6">
              <h2 className="type-raster-section text-6xl md:text-8xl leading-none">THE_CODER</h2>
              <div className="max-w-xl">
                 <p className="text-xl md:text-2xl leading-relaxed font-serif italic text-white/90">
                    <TextReveal 
                        text="5 anos de experiência em desenvolvimento front-end e formação em desenvolvimento web pelo SENAC-RJ, transformo conceitos de design em interfaces reais, rápidas e funcionais para sites e softwares."
                    />
                 </p>
              </div>
            </div>

            {/* Stack Ticker (Movimento Lateral) */}
            <div className="w-full relative py-8 overflow-hidden">
               <div className="flex animate-marquee whitespace-nowrap">
                  <div className="flex items-center gap-12 mx-6">
                     {techs.map((tech, index) => (
                        <div key={index} className="flex items-center gap-4 group">
                           <tech.icon size={32} className="text-white group-hover:text-accent transition-colors" />
                           <span className="type-mono text-sm opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                              {tech.name}
                           </span>
                           <span className="text-white/10 text-xl font-black mx-4 select-none">/</span>
                        </div>
                     ))}
                  </div>
                  {/* Duplicado para loop infinito */}
                  <div className="flex items-center gap-12 mx-6" aria-hidden="true">
                     {techs.map((tech, index) => (
                        <div key={`dup-${index}`} className="flex items-center gap-4 group">
                           <tech.icon size={32} className="text-white group-hover:text-accent transition-colors" />
                           <span className="type-mono text-sm opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                              {tech.name}
                           </span>
                           <span className="text-white/10 text-xl font-black mx-4 select-none">/</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-white/10">
               <div className="flex items-center gap-8">
                  {socialLinks.map((social) => (
                    <Magnetic key={social.name}>
                        <a 
                           href={social.href} 
                           target="_blank" 
                           rel="noreferrer" 
                           className="group flex flex-col items-center gap-2"
                           title={social.name}
                        >
                           <social.icon size={24} className="text-white/60 group-hover:text-white transition-colors" />
                           <span className="type-mono text-[8px] opacity-0 group-hover:opacity-100 transition-all font-bold tracking-tighter">
                              {social.name.toUpperCase()}
                           </span>
                        </a>
                    </Magnetic>
                  ))}
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
