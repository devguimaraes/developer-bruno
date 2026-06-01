import type React from "react";
import { motion } from "framer-motion";
import { ProjectItem } from "./ProjectItem";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { selectedWorks } from "@/data/projects";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";

const Projects: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const locale = useLocale();

  return (
    <section id="projetos" className="relative pt-20 pb-40 bg-black">
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

      <div className="mb-32 md:mb-48 px-6 md:px-12">
        <h2
          className="type-raster-section text-[10vw] md:text-[8vw] text-white"
          title="Curated selection of my best projects"
        >
          {t(locale, "projects.heading")}
        </h2>
        <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
          <p className="type-mono">{t(locale, "projects.subtitle")}</p>
          <p className="type-mono hidden md:block">
            {String(selectedWorks.length).padStart(2, "0")} {t(locale, "projects.total")}
          </p>
        </div>
      </div>

      {/* Container com Foco Total na Imagem e Ritmo Vertical Recalibrado */}
      <div className="flex flex-col gap-16 sm:gap-24 md:gap-32 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
        {selectedWorks.map(project => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
