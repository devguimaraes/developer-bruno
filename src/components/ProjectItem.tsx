import type React from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/types";
import LiquidGlitchImage from "@/components/ui/LiquidGlitchImage";
import TextReveal from "@/components/ui/TextReveal";
import Magnetic from "@/components/ui/Magnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ProjectItemProps {
  project: Project;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const displayImage = project.bannerImage ?? project.image;

  return (
    <div ref={containerRef} className="relative w-full py-12 md:py-20 group">
      {/* 1. Camada de Fundo: Identificador Técnico (Sutil) */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full flex justify-between px-8 pointer-events-none opacity-[0.03]">
        <span className="type-mono text-[8vw] leading-none select-none tracking-[-0.05em] font-black uppercase">
          {project.id.slice(0, 3)}
        </span>
        <span className="type-mono text-[8vw] leading-none select-none tracking-[-0.05em] font-black uppercase">
          /26
        </span>
      </div>

      {/* 2. Composição Principal: Imagem Hero + Título Rasgado */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Container de Imagem: Título Centralizado sobre a Imagem */}
        <a
          href={`/projetos/${project.slug ?? project.id}`}
          className="relative block w-full aspect-video md:aspect-[16/9] overflow-hidden bg-zinc-950 border-x-2 border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.9)]"
        >
          {/* Scanlines & Grid Overlay */}
          <div className="absolute inset-0 z-20 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700 scanlines" />
          <div className="absolute inset-0 z-20 pointer-events-none grid-technical opacity-10" />

          <motion.div
            style={{ y: reducedMotion ? 0 : imageY, scale: 1.15 }}
            className="absolute inset-0 w-full h-full"
          >
            <LiquidGlitchImage
              src={displayImage}
              alt={project.title}
              active={true}
              loadingLazy
              className="w-full h-full grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 opacity-90 group-hover:opacity-100 contrast-125"
            />
          </motion.div>

          {/* Título Centralizado sobre a Imagem */}
          <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.65)_100%)]" />
            <h3 className="relative type-raster-section text-[clamp(2rem,8vw,3.5rem)] sm:text-7xl md:text-8xl lg:text-9xl text-white leading-none tracking-tighter mix-blend-difference drop-shadow-[0_0_40px_rgba(0,0,0,0.8)] px-6 text-center">
              <TextReveal text={project.title} />
            </h3>
          </div>

          {/* Label Técnico Flutuante */}
          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-30 flex flex-col items-end gap-2">
            <div className="bg-accent text-black px-2 py-0.5 md:px-3 md:py-1 type-mono text-[9px] md:text-[11px] font-black uppercase shadow-brutal">
              {project.category}
            </div>
            <div className="hidden md:flex bg-white text-black px-2 py-0.5 type-mono text-[11px] font-bold">
              CORE_ENGINE_V4.0
            </div>
          </div>
        </a>
      </div>

      {/* 3. Rodapé Editorial: Legenda de Autoridade */}
      <div className="relative z-20 mt-10 md:mt-12 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-0">
        <div className="md:col-span-8 lg:col-span-7">
          <p className="font-serif italic text-lg md:text-xl text-stone-200 leading-relaxed max-w-2xl">
            "{project.description}"
          </p>
        </div>

        <div className="md:col-span-5 flex flex-col items-start md:items-end justify-end gap-8">
          <div className="flex flex-wrap justify-start md:justify-end gap-2">
            {project.tech.map((tech: string) => (
              <span
                key={tech}
                className="text-[11px] md:text-xs text-white font-mono border border-white/10 px-2.5 py-1 uppercase tracking-[0.2em] bg-white/5 backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-10">
            <Magnetic>
              <a
                href={`/projetos/${project.slug ?? project.id}`}
                className="group/btn flex items-center gap-4 type-mono text-white uppercase tracking-[0.3em] hover:text-accent transition-all pressable"
              >
                <span className="border-b border-white/20 pb-1 group-hover/btn:border-accent">
                  Visualizar Caso
                </span>
                <div className="w-8 h-px bg-white/40 group-hover/btn:w-12 group-hover/btn:bg-accent transition-all" />
              </a>
            </Magnetic>

            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500"
                title="Visitar Site Ao Vivo"
              >
                <div className="w-1.5 h-1.5 bg-accent rotate-45" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
