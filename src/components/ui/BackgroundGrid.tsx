import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BackgroundGrid: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#f5f5f4]" />;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#f5f5f4]">
      {/* Base Grid Layer */}
      <div className="absolute inset-0 grid-technical opacity-50" />
      
      {/* Dots Layer (finer pattern) */}
      <div className="absolute inset-0 grid-dots opacity-30" />

      {/* Animated Scanline - Horizontal */}
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: "100vh" }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-0 right-0 h-[1px] bg-black/10 z-0"
      />

      {/* Animated Scanline - Vertical */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100vw" }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 5,
        }}
        className="absolute top-0 bottom-0 w-[1px] bg-black/10 z-0"
      />

      {/* Technical Corner Markers (Optional but cool) */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-black/20" />
      <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-black/20" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-black/20" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-black/20" />
      
      {/* Decorative Text Coordinates */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 font-pixel text-[8px] opacity-10 tracking-[1em] uppercase">
        LOC_SYNC_SYSTEM_ACTIVE
      </div>
    </div>
  );
};

export default BackgroundGrid;
