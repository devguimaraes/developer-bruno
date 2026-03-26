import React from "react";
import PixelBlast from "@/components/ui/PixelBlast";
import ShuffleText from "@/components/ui/ShuffleText";
import BorderGlow from "@/components/ui/BorderGlow";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white py-20 sm:py-0">
      {/* Pixel Blast Animation Background */}
      <div className="absolute inset-0 z-0 opacity-40">
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
          <div className="font-pixel text-[10px] md:text-xs tracking-[0.4em] mb-6 md:mb-12 opacity-40 uppercase">
            <ShuffleText text="Developer Front-End" stagger={0.02} duration={1} />
          </div>

          <h1 className="text-5xl sm:text-[8vw] md:text-[11vw] font-black font-pixel leading-[0.9] md:leading-[0.8] tracking-tighter mb-6 md:mb-12 w-full">
            <ShuffleText 
              text="BRUNO" 
              className="block"
              shuffleTimes={3}
              duration={1.2}
            />
            <span className="text-transparent block" style={{ WebkitTextStroke: "1.5px black" }}>
              <ShuffleText 
                text="GUIMARÃES" 
                className="block text-[46px] xs:text-6xl sm:text-[8vw] md:text-[11vw] uppercase tracking-[-0.02em] md:tracking-tighter"
                shuffleTimes={3}
                duration={1.2}
                delay={0.4}
              />
            </span>
          </h1>

          <div className="max-w-[340px] sm:max-w-2xl md:max-w-none mb-10 md:mb-16 px-6 flex flex-col items-center">
            <ShuffleText 
              text="Desenvolvedor Front-End especializado na criação de sites e sistemas web"
              className="text-[13px] md:text-xl font-pixel lowercase leading-relaxed md:leading-snug text-stone-500 tracking-[0.12em] md:tracking-[0.1em] block"
              stagger={0.008}
              duration={0.4}
              delay={1}
            />
            <ShuffleText 
              text="entregando interfaces escaláveis com react e next.js para projetos ao redor do mundo."
              className="text-[13px] md:text-xl font-pixel lowercase leading-relaxed md:leading-snug text-stone-500 tracking-[0.12em] md:tracking-[0.1em] block"
              stagger={0.008}
              duration={0.4}
              delay={1.6}
            />
          </div>

          <BorderGlow glowColor="162 100% 27%" borderRadius={0} className="inline-block">
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative bg-black text-white font-pixel text-lg md:text-xl py-5 px-10 md:py-6 md:px-12 border-4 border-black transition-all hover:bg-white hover:text-black hover:px-14 active:scale-95"
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
