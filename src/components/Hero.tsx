import type React from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useVideoLoading } from "@/hooks/useVideoLoading";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { t } from "@/lib/i18n";
import { useLocale } from "@/hooks/useLocale";

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { videoRef, isVisible } = useVideoLoading();
  const { scrollY } = useScroll();
  const locale = useLocale();

  const reducedMotion = useReducedMotion();

  // Efeito de movimento sutil para as camadas
  const textY = useTransform(scrollY, [0, 500], [0, 100]);
  const videoScale = useTransform(scrollY, [0, 1000], [1, 1.2]);
  const videoOpacity = useTransform(scrollY, [0, 500], [0.7, 0.4]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black w-full"
    >
      {/* Background Video Section - Full Edge-to-Edge */}
      <motion.div
        style={{
          scale: reducedMotion ? 1 : videoScale,
          opacity: isVisible ? (reducedMotion ? 0.7 : videoOpacity) : 0,
        }}
        className="absolute inset-0 z-0 pointer-events-none w-full h-full"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-render-1.webp"
          className="w-full h-full object-cover"
        >
          {isVisible && (
            <>
              <source src="/backgroundvideo.webm" type="video/webm" />
              <source src="/backgroundvideo.mp4" type="video/mp4" />
            </>
          )}
        </video>
        {/* Adjusted gradient for zero-border feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </motion.div>

      {/* Content - No fixed container for full impact but keep text central */}
      <div className="relative z-10 w-full px-6 sm:px-12 pt-32 sm:pt-40">
        <div className="flex flex-col items-center text-center">
          {/* Massive Raster Headline */}
          <motion.h1
            style={{ y: reducedMotion ? 0 : textY }}
            className="type-raster-hero text-[15vw] lg:text-[11vw] leading-[0.8] mb-8 select-none"
          >
            <div className="flex flex-col items-center">
              <span className="block opacity-100 text-white leading-[0.8]">FRONT END</span>
              <span className="block opacity-100 text-white leading-[0.8]">DEVELOPER</span>
            </div>
          </motion.h1>

          <motion.div
            style={{ y: reducedMotion ? 0 : textY }}
            className="mb-12 type-mono tracking-[0.12em] text-[8px] sm:text-[10px] md:text-xs opacity-100 uppercase text-white"
          >
            React, Next.js & TypeScript | SEO & DX
          </motion.div>

          {/* Action Row - Simplified without button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row items-center gap-12 sm:gap-24 w-full justify-between mt-12 border-t border-white/10 pt-8"
          >
            <div className="text-left max-w-[320px]">
              <p
                className="type-mono text-[10px] mb-4 opacity-40 uppercase"
                title="Based in Rio de Janeiro, Brazil"
              >
                {t(locale, "hero.established")}
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                {t(locale, "hero.description")}
              </p>
            </div>

            <div className="flex flex-col items-end">
              <div
                className="type-mono text-[10px] opacity-40 mb-2"
                title="Scroll down to see more content"
              >
                {t(locale, "hero.scroll")}
              </div>
              <div className="w-px h-12 bg-white/20 animate-pulse mx-auto md:mr-0" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Matrix/Coordinate Elements */}
      <div
        className="absolute top-28 left-4 sm:left-10 type-mono text-[8px] opacity-40 hidden md:block"
        title="Geographic coordinates: Rio de Janeiro, Brazil"
      >
        POS: 22.9068 S / 43.1729 W
      </div>
      <div
        className="absolute bottom-1/4 right-10 type-mono text-[8px] opacity-20 hidden md:block vertical-text"
        title="Current portfolio version"
      >
        VER: 4.0.0_STABLE
      </div>
    </section>
  );
};

export default Hero;
