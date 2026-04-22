import type React from "react";
import { footerData } from "@/config/site";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-10 sm:py-12 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-7 sm:gap-8 relative z-10">
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <div className="bg-white text-black px-3 py-1 type-ui-label text-xs">V4.0_FINAL</div>
              <span className="type-body text-xs sm:text-sm uppercase text-white/60">
                {footerData.copyright.toUpperCase()}
              </span>
            </div>
            <span className="type-ui-label text-xs sm:text-sm text-stone-500">
              Built with precision
            </span>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-6 sm:gap-10 md:gap-12 type-ui-label text-sm sm:text-base md:text-lg text-stone-500 w-full md:w-auto">
            <div className="flex flex-col items-end">
              <span>LAT: 22.9068° S</span>
              <span>LON: 43.1729° W</span>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white pixel-border-sm flex items-center justify-center text-black shrink-0">
              <span className="font-pixel text-lg">BG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative dots */}
      <div
        className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#fff 2px, transparent 2px)",
          backgroundSize: "16px 16px",
        }}
      ></div>
    </footer>
  );
};

export default Footer;
