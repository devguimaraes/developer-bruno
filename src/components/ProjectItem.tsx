import type React from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/types";
import GlitchImage from "@/components/ui/GlitchImage";
import TextReveal from "@/components/ui/TextReveal";
import Magnetic from "@/components/ui/Magnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/lib/i18n";

interface ProjectItemProps {
  project: Project;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const locale = useLocale();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const contentY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const displayImage = project.bannerImage ?? project.image;

  return (
    <div
      ref={containerRef}
      className="relative w-full group py-12 md:py-24 border-t border-white/5 first:border-t-0"
    >
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        {/* Coluna da Imagem: Layout Editorial Assimétrico */}
        <div className="w-full lg:w-[60%] order-1 lg:order-2">
          <a
            href={`/projetos/${project.slug ?? project.id}`}
            className="relative block w-full aspect-video overflow-hidden bg-zinc-900 shadow-2xl cursor-pointer"
          >
            <motion.div
              style={{ y: reducedMotion ? 0 : imageY, scale: 1.05 }}
              className="absolute inset-0 w-full h-full"
            >
              <GlitchImage
                src={displayImage}
                alt={project.title}
                active={true}
                loadingLazy
                className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-80 group-hover:opacity-100"
              />
            </motion.div>

            {/* View Case Overlay (Sutil) */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <span className="type-mono text-[10px] text-white uppercase tracking-[0.3em] border border-white/20 px-4 py-2 bg-black/60 backdrop-blur-sm">
                [ OPEN_PROJECT_CASE ]
              </span>
            </div>
          </a>
        </div>

        {/* Coluna de Texto: Autoridade Editorial */}
        <motion.div
          style={{ y: reducedMotion ? 0 : contentY }}
          className="w-full lg:w-[40%] flex flex-col items-start text-left order-2 lg:order-1"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-accent" />
            <p className="type-mono text-[10px] text-accent tracking-[0.2em] uppercase font-bold">
              {project.category}
            </p>
          </div>

          <h3 className="type-raster-section text-4xl sm:text-5xl xl:text-6xl text-white tracking-tighter leading-[0.85] mb-8 group-hover:text-accent transition-colors duration-500">
            <TextReveal text={project.title} />
          </h3>

          <p className="font-serif italic text-lg md:text-xl text-stone-300 leading-relaxed mb-10 max-w-md">
            "{project.description}"
          </p>

          <div className="flex flex-wrap gap-2 mb-12">
            {project.tech.map((tech: string) => (
              <span
                key={tech}
                className="text-[9px] text-stone-500 font-mono border border-white/10 px-2 py-0.5 uppercase tracking-widest"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <Magnetic>
              <a
                href={`/projetos/${project.slug ?? project.id}`}
                className="group/btn flex items-center gap-3 type-mono text-[10px] text-white uppercase tracking-[0.2em] hover:text-accent transition-colors"
              >
                Detalhes do Caso{" "}
                <div className="w-2 h-2 bg-accent rotate-45 group-hover/btn:scale-125 transition-transform" />
              </a>
            </Magnetic>

            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="type-mono text-[9px] text-stone-500 hover:text-white transition-colors uppercase tracking-widest underline underline-offset-4 decoration-stone-800"
              >
                Live Site
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
