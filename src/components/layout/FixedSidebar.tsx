import React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";
import ShuffleText from "@/components/ui/ShuffleText";

interface FixedSidebarProps {
  activeSection: {
    id: string;
    index: number;
    label: string;
  };
}

const FixedSidebar: React.FC<FixedSidebarProps> = ({ activeSection }) => {
  return (
    <aside 
      className="fixed left-0 top-0 h-screen hidden md:flex flex-col border-r border-black/10 bg-background/80 backdrop-blur-xl z-40 py-8 px-2 justify-between items-center transition-all duration-500 ease-in-out"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Top Part: Avatar (Round) & Vertical Name */}
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="relative group">
          <div className="absolute -inset-1 bg-black/5 rounded-full -z-10 group-hover:bg-brutal-orange/20 transition-colors" />
          <Avatar 
            size={48} 
            containerClassName="border border-black/20 rounded-full p-0.5 bg-white shadow-sm" 
            className="grayscale contrast-125 rounded-full border-none"
          />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-[1px] bg-black/10" />
          <h2 className="text-[10px] font-black font-pixel tracking-[0.3em] uppercase [writing-mode:vertical-lr] rotate-180 opacity-70">
            BRUNO GUIMARÃES
          </h2>
        </div>
      </div>

      {/* Middle Part: Minimal Section Indicator (Vertical) */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-[8px] font-pixel text-stone-400 uppercase tracking-[0.2em] opacity-40 [writing-mode:vertical-lr] rotate-180">
          SECTION
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-black font-pixel text-brutal-orange/80">0{activeSection.index + 1}</span>
          <div className="h-6 w-[1px] bg-black/10" />
          <div className="text-[10px] font-black font-pixel uppercase tracking-widest leading-none [writing-mode:vertical-lr] rotate-180 py-2">
            <ShuffleText 
              key={activeSection.id} 
              text={activeSection.label} 
              duration={0.5}
              shuffleTimes={2}
              className="text-black/60"
            />
          </div>
        </div>
      </div>

      {/* Bottom Part: Minimal Social Links (Vertical) */}
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="flex flex-col gap-6 items-center">
          <a href="https://github.com/devguimaraes" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform text-black/40 hover:text-brutal-orange">
            <Github size={16} />
          </a>
          <a href="https://linkedin.com/in/bcguimaraes" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform text-black/40 hover:text-brutal-orange">
            <Linkedin size={16} />
          </a>
          <a href="https://instagram.com/devguimaraes" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform text-black/40 hover:text-brutal-orange">
            <Instagram size={16} />
          </a>
          <a href="mailto:bc.guimaraes@outlook.com" className="hover:scale-110 transition-transform text-black/40 hover:text-brutal-orange">
            <Mail size={16} />
          </a>
        </div>
        
        <div className="text-[8px] font-pixel text-stone-400 uppercase tracking-[0.4em] rotate-180 [writing-mode:vertical-lr] opacity-30 mt-4">
          SYSTEM_v6.0.8
        </div>
      </div>

      {/* Technical Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.01] scanlines z-50 rounded-r-3xl" />
    </aside>
  );
};

export default FixedSidebar;
