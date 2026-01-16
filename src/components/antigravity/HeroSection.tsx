import React from "react";
import { motion } from "framer-motion";
import { NeoButton } from "@/components/ui/NeoButton";
import { Zap, Terminal, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onBuyClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBuyClick }) => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center pt-10 pb-20 bg-brutal-bg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-brutal-yellow border-4 border-black rotate-12 hidden md:block" />
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-brutal-orange border-4 border-black -rotate-6 hidden md:block" />
      <div className="absolute top-1/3 right-20 w-8 h-8 bg-black rotate-45 hidden lg:block" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 font-mono text-sm border-2 border-black shadow-[4px_4px_0px_0px_#facc15]"
          >
            <Zap className="w-4 h-4" />6 SKILLS + COMANDOS PRONTOS
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter"
          >
            GEMINI
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brutal-orange to-brutal-yellow text-stroke-2">
              CONFIG PACK
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-xl md:text-2xl text-stone-700 font-medium leading-relaxed">
              <span className="bg-brutal-yellow px-2 font-bold border-2 border-black inline-block">
                6 Skills
              </span>{" "}
              modularizadas +{" "}
              <span className="bg-brutal-orange text-white px-2 font-bold border-2 border-black inline-block">
                Comandos prontos
              </span>{" "}
              para Antigravity e Gemini CLI.
            </p>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              "6 Skills Modularizadas",
              "Comandos TOML + MD",
              "Guia PDF Completo",
              "Atualizações Vitalícias",
            ].map((feature, index) => (
              <span
                key={index}
                className="bg-white border-2 border-black px-4 py-2 font-mono text-sm font-bold shadow-[2px_2px_0px_0px_#000]"
              >
                {feature}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-6"
          >
            <NeoButton
              onClick={onBuyClick}
              className="bg-brutal-orange text-white text-xl px-10 py-5 shadow-[8px_8px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000]"
            >
              <Terminal className="mr-3 w-6 h-6" />
              QUERO CONFIGURAR AGORA
              <ArrowRight className="ml-3 w-6 h-6" />
            </NeoButton>
            <p className="mt-4 font-mono text-sm text-stone-500">
              Pagamento único via PIX • Download instantâneo
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
