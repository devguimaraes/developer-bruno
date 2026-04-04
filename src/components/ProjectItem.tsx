import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import GlitchImage from "@/components/ui/GlitchImage";
import TextReveal from "@/components/ui/TextReveal";
import Magnetic from "@/components/ui/Magnetic";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
  aspectClass: string;
  technologies: string[];
}

interface ProjectItemProps {
  project: Project;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const containerRef = useRef(null);
  
  // Rastreia o scroll relativo a este container específico
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax: Move a imagem internamente de -50px a 50px
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  // Parallax Oposta para o texto: O texto "flutua" na direção oposta ou velocidade diferente
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <div ref={containerRef} className="relative w-full group">
      <a
        href={project.link}
        target="_blank"
        rel="noreferrer"
        className={`relative block w-full ${project.aspectClass} overflow-hidden bg-zinc-900 shadow-2xl`}
      >
        {/* Parallax Image Container */}
        <motion.div 
          style={{ y, scale: 1.1 }} 
          className="absolute inset-0 w-full h-full"
        >
          <GlitchImage 
            src={project.image} 
            alt={project.title} 
            active={true}
            className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60"
          />
        </motion.div>
        
        {/* Camada de Texto Sobreposta com Parallax e Scramble */}
        <motion.div 
          style={{ y: textY }}
          className="absolute inset-0 p-6 md:p-12 bg-black/20 flex flex-col justify-center items-center text-center pointer-events-none z-20"
        >
          <p className="type-mono text-xs md:text-sm text-accent mb-2 tracking-[0.2em] uppercase font-bold">
            {project.category}
          </p>
          <h3 className="type-raster-section text-3xl sm:text-5xl md:text-6xl text-white tracking-[0.1em] leading-none drop-shadow-2xl mt-1">
            <TextReveal text={project.title} />
          </h3>
        </motion.div>
        
        <div className="absolute top-6 md:top-8 right-6 md:right-8 type-mono text-[10px] text-white/0 group-hover:text-white/80 transition-colors uppercase tracking-widest z-30 select-none pointer-events-none">
          [ OPEN LIVE SITE ]
        </div>
      </a>

      {/* Elementos Externos à Imagem (Gaps) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-10%" }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute -bottom-10 md:-bottom-12 left-0 flex flex-wrap gap-2 z-20 pointer-events-none"
      >
        {project.technologies.map((tech: string) => (
          <span 
            key={tech} 
            className="border border-white text-white px-3 py-1.5 rounded-full type-mono text-[9px] md:text-[10px] uppercase tracking-widest"
          >
            {tech}
          </span>
        ))}
      </motion.div>

      {/* Badge de Acesso Global (Canto Inferior Direito) Magnético */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-10%" }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="absolute -bottom-10 md:-bottom-12 right-0 hidden sm:block z-20"
      >
        <Magnetic>
          <a 
            href={project.link} 
            target="_blank" 
            rel="noreferrer"
            className="bg-white text-black hover:bg-zinc-200 transition-colors px-4 py-1.5 rounded-full type-mono text-[10px] font-bold uppercase tracking-widest flex items-center justify-center h-10"
          >
            View Project
          </a>
        </Magnetic>
      </motion.div>
    </div>
  );
};
