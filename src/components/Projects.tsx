import React, { useState } from "react";
import { projects } from "@/data/projects";
import ShuffleText from "@/components/ui/ShuffleText";
import TiltedCard from "@/components/ui/TiltedCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

const Projects: React.FC = () => {
  const [activeProject, setActiveProject] = useState(projects[0]);

  return (
    <section id="projects" className="min-h-screen py-24 px-8 md:px-16 bg-white relative overflow-hidden flex flex-col justify-center">
      <div className="w-full max-w-7xl mx-auto space-y-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="font-pixel text-[10px] md:text-xs tracking-[0.4em] opacity-40 uppercase mb-4">
              <ShuffleText text="// REPOSITORY_ACCESS_GRANTED" stagger={0.02} duration={0.8} />
            </div>
            <h2 className="text-6xl sm:text-8xl md:text-[110px] font-black font-pixel leading-[0.8] tracking-tighter flex flex-col uppercase text-black">
              <span className="block mb-2">
                <ShuffleText text="SELECTED" duration={1.2} />
              </span>
              <span className="text-transparent block" style={{ WebkitTextStroke: "2px black" }}>
                <ShuffleText 
                  text="WORKS_" 
                  duration={1.2} 
                  delay={0.4} 
                />
              </span>
            </h2>
          </div>
          
          <div className="hidden md:block pb-4 border-b-2 border-black max-w-xs text-right">
            <p className="font-pixel text-xs opacity-40 leading-relaxed uppercase">
              Curated selection of high-performance web applications and digital experiences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Project List */}
          <div className="lg:col-span-5 space-y-4">
            {projects.map((project, idx) => (
              <ScrollReveal 
                key={project.id} 
                direction="right" 
                delay={idx * 0.1}
              >
                <div 
                  onMouseEnter={() => setActiveProject(project)}
                  className={`group relative p-8 border-2 cursor-pointer transition-all duration-300 flex justify-between items-center ${activeProject.id === project.id ? 'bg-black text-white border-black translate-x-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent text-black border-transparent hover:border-black/10'}`}
                >
                  <div className="flex items-center gap-6">
                    <span className="font-pixel text-xs opacity-40">0{idx + 1}</span>
                    <h3 className="font-pixel text-2xl md:text-4xl uppercase tracking-tighter font-black">
                      {project.title}
                    </h3>
                  </div>
                  <div className={`w-2 h-2 ${activeProject.id === project.id ? 'bg-brutal-orange animate-pulse' : 'bg-black/10'}`} />
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Project Detail View */}
          <div className="lg:col-span-7 relative min-h-[500px]">
            <div className="sticky top-24 space-y-12">
              <div className="relative aspect-video">
                <TiltedCard className="w-full h-full">
                  <div className="relative w-full h-full group overflow-hidden border-4 border-black shadow-brutal">
                    <img 
                      src={activeProject.image} 
                      alt={activeProject.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-4 bg-black/80 text-white font-pixel text-xs uppercase tracking-widest border-2 border-white">
                        {activeProject.tech.join(" + ")}
                      </div>
                    </div>
                  </div>
                </TiltedCard>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {activeProject.tech.map(t => (
                    <span key={t} className="px-3 py-1 bg-black text-white font-pixel text-[10px] uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
                
                <div className="h-[2px] w-24 bg-brutal-orange" />
                
                <div className="max-w-xl text-stone-600 font-pixel text-sm md:text-lg leading-relaxed lowercase">
                   {activeProject.description}
                </div>

                <div className="flex gap-8 pt-4">
                  <a href={activeProject.live} target="_blank" className="font-pixel text-sm uppercase font-black border-b-2 border-black hover:text-brutal-orange transition-colors flex items-center gap-2">
                    VIEW_LIVE [^]
                  </a>
                  <a href={activeProject.github} target="_blank" className="font-pixel text-sm uppercase font-black border-b-2 border-black hover:text-brutal-orange transition-colors flex items-center gap-2">
                    SOURCE_CODE {"</>"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
