import React from "react";
import ShuffleText from "@/components/ui/ShuffleText";
import { featuredSkills } from "@/data/skills";
import ScrollReveal from "@/components/ui/ScrollReveal";

const Skills: React.FC = () => {
  return (
    <section id="skills" className="min-h-screen py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="mb-12 sm:mb-16 md:mb-32 space-y-3 sm:space-y-4">
          <div className="type-ui-label text-[10px] md:text-xs opacity-40 mb-4">
            <ShuffleText text="// MODULE_ENGINE_CORE" stagger={0.02} duration={0.8} />
          </div>
          <h2 className="type-display-section text-[16vw] leading-[0.9] sm:text-8xl md:text-[110px] font-black flex flex-col text-black">
            <span className="block mb-2 text-black">
              <ShuffleText text="TECHNICAL" duration={1.2} />
            </span>
            <span className="text-transparent block" style={{ WebkitTextStroke: "2px black" }}>
              <ShuffleText 
                text="STACK_" 
                duration={1.2} 
                delay={0.4} 
              />
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 md:gap-12">
          {featuredSkills.map((skill, idx) => (
            <ScrollReveal 
              key={skill.id} 
              direction="up" 
              delay={idx * 0.1}
            >
              <div className="group relative p-6 sm:p-8 border-2 border-black bg-black transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-black flex items-center justify-center type-ui-label text-[10px] text-white">
                  0{idx + 1}
                </div>
                
                <div className="space-y-6 sm:space-y-8">
                  <h3 className="type-display-card text-base sm:text-lg md:text-[1.65rem] text-brutal-orange font-black">
                    {skill.title}
                  </h3>

                  <div className="flex flex-col gap-4">
                    {skill.technologies?.map(tech => (
                      <div key={tech} className="flex items-center gap-3 group/item">
                        <div className="w-2 h-2 bg-brutal-blue animate-pulse" />
                        <span className="font-sans text-sm md:text-base uppercase tracking-[0.01em] leading-relaxed text-white cursor-default">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Decor */}
                <div className="absolute bottom-2 right-2 opacity-20 type-ui-label text-[8px] text-white font-bold">
                  SYS_LIB_LOADED
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
