import React from "react";
import PixelBlast from "@/components/ui/PixelBlast";
import ShuffleText from "@/components/ui/ShuffleText";
import BorderGlow from "@/components/ui/BorderGlow";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-28 pb-16 sm:py-20 md:py-0 px-4 sm:px-6">
      {/* Pixel Blast Animation Background */}
      <div className="absolute inset-0 z-0 opacity-80">
        <PixelBlast 
          pixelSize={20}
          pixelColor="#000000"
          animationSpeed={1.5}
        />
      </div>

      <div className="w-full text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="type-ui-label text-[10px] md:text-xs mb-5 md:mb-12 opacity-40">
            <ShuffleText text="Developer Front-End" stagger={0.02} duration={1} />
          </div>

          <h1 className="type-display-hero text-[16vw] leading-[0.88] sm:text-[8vw] md:text-[11vw] font-black mb-6 md:mb-12 w-full max-w-[98vw]">
            <ShuffleText 
              text="BRUNO" 
              className="block"
              shuffleTimes={3}
              duration={1.2}
            />
            <span className="text-transparent block mt-1 sm:mt-0" style={{ WebkitTextStroke: "1.5px black" }}>
              <ShuffleText 
                text="GUIMARAES" 
                className="block text-[13.8vw] sm:text-[8vw] md:text-[11vw] uppercase tracking-[0.03em] md:tracking-[0.05em]"
                shuffleTimes={3}
                duration={1.2}
                delay={0.4}
              />
            </span>
          </h1>

          <div className="max-w-[380px] sm:max-w-2xl md:max-w-3xl mb-9 md:mb-16 px-2 sm:px-6 flex flex-col items-center gap-2.5">
            <ShuffleText 
              text="Desenvolvedor Front-End especializado na criação de sites e sistemas web."
              className="type-body-lg text-[15px] leading-relaxed md:text-xl block"
              stagger={0.008}
              duration={0.4}
              delay={1}
            />
            <ShuffleText 
              text="Entrego interfaces escaláveis com React e Next.js para projetos ao redor do mundo."
              className="type-body-lg text-[15px] leading-relaxed md:text-xl block"
              stagger={0.008}
              duration={0.4}
              delay={1.6}
            />
          </div>

          <BorderGlow glowColor="162 100% 27%" borderRadius={0} className="inline-block">
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative min-h-12 bg-black text-white type-ui-label text-sm sm:text-base md:text-lg py-4 sm:py-5 px-8 sm:px-10 md:py-6 md:px-12 border-4 border-black transition-all hover:bg-white hover:text-black active:scale-95"
            >
              VER_PROJETOS
            </button>
          </BorderGlow>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;


