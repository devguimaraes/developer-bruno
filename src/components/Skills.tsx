import React from "react";
import ShuffleText from "@/components/ui/ShuffleText";
import { featuredSkills } from "@/data/skills";
import ScrollReveal from "@/components/ui/ScrollReveal";

const Skills: React.FC = () => {
  return (
    <section id="skills" className="min-h-screen py-24 px-8 md:px-16 relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="mb-32 space-y-4">
          <div className="font-pixel text-[10px] md:text-xs tracking-[0.4em] opacity-40 uppercase mb-4">
            <ShuffleText text="// MODULE_ENGINE_CORE" stagger={0.02} duration={0.8} />
          </div>
          <h2 className="text-6xl sm:text-8xl md:text-[110px] font-black font-pixel leading-[0.8] tracking-tighter flex flex-col uppercase text-black">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {featuredSkills.map((skill, idx) => (
            <ScrollReveal 
              key={skill.id} 
              direction="up" 
              delay={idx * 0.1}
            >
              <div className="group relative p-8 border-2 border-black hover:bg-black transition-all duration-300 shadow-brutal hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white/5 backdrop-blur-sm">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-black flex items-center justify-center font-pixel text-[10px] text-white">
                  0{idx + 1}
                </div>
                
                <div className="space-y-8">
                  <h3 className="font-pixel text-xl md:text-2xl tracking-tighter uppercase text-black font-black group-hover:text-brutal-orange transition-colors">
                    {skill.title}
                  </h3>

                  <div className="flex flex-col gap-4">
                    {skill.technologies?.map(tech => (
                      <div key={tech} className="flex items-center gap-3 group/item">
                        <div className="w-2 h-2 bg-black group-hover:bg-brutal-blue transition-colors group-hover/item:animate-ping" />
                        <span className="font-pixel text-sm md:text-base text-stone-500 uppercase tracking-widest group-hover:text-white transition-colors cursor-default">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Decor */}
                <div className="absolute bottom-2 right-2 opacity-10 font-pixel text-[8px] tracking-thinnest text-black font-bold">
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
