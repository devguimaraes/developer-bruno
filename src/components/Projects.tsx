import type React from "react";
import { motion } from "framer-motion";
import { ProjectItem } from "./ProjectItem";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { selectedWorks } from "@/data/projects";

const Projects: React.FC = () => {
  const reducedMotion = useReducedMotion();

  return (
    <section id="projetos" className="relative py-20 bg-black">
      {/* Inversion Flash Trigger: Pisca branco quando a seção entra em vista */}
      {!reducedMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 1, 0] }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-white pointer-events-none z-[100] mix-blend-difference"
        />
      )}

      <div className="mb-20 px-6 md:px-12">
        <h2 className="type-raster-section text-[10vw] md:text-[8vw] text-white">SELECTED_WORKS</h2>
        <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
          <p className="type-mono">Explorando fronteiras da interação digital</p>
          <p className="type-mono hidden md:block">03 TOTAL</p>
        </div>
      </div>

      {/* Container com Mais Respiro Vertical e Horizontal */}
      <div className="flex flex-col gap-24 sm:gap-32 md:gap-40 w-full max-w-5xl mx-auto px-8 sm:px-16 md:px-24">
        {selectedWorks.map(project => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
