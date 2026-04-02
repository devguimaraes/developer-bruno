import React from "react";
import BlurText from "@/components/ui/BlurText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ShuffleText from "@/components/ui/ShuffleText";

const About: React.FC = () => {
  return (
    <section id="about" className="min-h-screen flex flex-col justify-center py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="space-y-10 sm:space-y-14 md:space-y-16">
            
            {/* Title - Hero Style Match */}
            <div className="space-y-3 sm:space-y-4">
              <div className="type-ui-label text-[10px] md:text-xs opacity-40 mb-4">
                <ShuffleText text="// PROFILE_DATA_STORAGE" stagger={0.02} duration={0.8} />
              </div>
              <h2 className="type-display-section text-[16vw] leading-[0.9] sm:text-8xl md:text-[110px] font-black flex flex-col">
                <span className="block mb-2">
                  <ShuffleText text="DESENVOLVEDOR" duration={1.2} />
                </span>
                <span className="text-transparent block" style={{ WebkitTextStroke: "2px black" }}>
                  <ShuffleText 
                    text="WEB_CORE" 
                    duration={1.2} 
                    delay={0.4} 
                  />
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-16 items-start pt-2 sm:pt-4 md:pt-8">
              {/* Description - Technical Border */}
              <div className="md:col-span-8 border-l-8 sm:border-l-[12px] border-black pl-5 sm:pl-8 md:pl-10 relative">
                <div className="absolute -left-3 top-0 w-3 h-3 bg-brutal-orange" />
                <BlurText 
                  text="com 5 anos de experiência em desenvolvimento front-end e formação em desenvolvimento web pelo senac-rj, transformo conceitos de design em interfaces reais, rápidas e funcionais para sites e softwares."
                  className="type-body-lg text-lg sm:text-xl md:text-3xl lg:text-4xl"
                  delay={0.04}
                />
              </div>

              {/* Technical HUD Stats - Reimagined */}
              <div className="md:col-span-4 space-y-7 p-5 sm:p-6 bg-black/5 backdrop-blur-sm border-2 border-dashed border-stone-300 relative">
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-black" />
                <div className="flex flex-col gap-6">
                  {[
                    { label: "LOCAL_", val: "Rio de Janeiro", color: "bg-brutal-green" },
                    { label: "EXP_", val: "+5 Anos", color: "bg-brutal-orange" },
                    { label: "CARGO_", val: "Dev. Front-end", color: "bg-brutal-blue" }
                  ].map((stat, i) => (
                    <ScrollReveal key={stat.label} direction="left" delay={0.4 + (i * 0.1)}>
                      <div className="group space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 ${stat.color} animate-pulse`} />
                          <p className="type-ui-label text-[9px] text-stone-400 font-bold">{stat.label}</p>
                        </div>
                        <p className="type-display-card text-base sm:text-lg md:text-xl text-black font-black group-hover:text-brutal-orange transition-colors">
                          {stat.val}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
                
                {/* HUD Footer Decor */}
                <div className="pt-4 border-t border-stone-200 mt-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(dot => (
                      <div key={dot} className="w-1.5 h-1.5 bg-black/20" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default About;
