import React from "react";
import { footerData } from "@/config/site";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t-4 border-black py-12 px-8 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-4">
              <div className="bg-black text-white px-3 py-1 font-pixel text-xs">V4.0_FINAL</div>
              <span className="font-pixel text-sm tracking-tighter">{footerData.copyright.toUpperCase()}</span>
            </div>
            <span className="font-vt text-lg text-stone-400 uppercase tracking-[0.3em]">Built with precision</span>
          </div>

          <div className="flex items-center gap-12 font-vt text-xl uppercase tracking-widest text-stone-500">
            <div className="flex flex-col items-end">
              <span>LAT: 22.9068° S</span>
              <span>LON: 43.1729° W</span>
            </div>
            <div className="w-12 h-12 bg-black pixel-border-sm flex items-center justify-center text-white">
              <span className="font-pixel text-lg">BG</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative dots */}
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '16px 16px' }}>
      </div>
    </footer>
  );
};

export default Footer;
