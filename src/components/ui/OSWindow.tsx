import React from "react";
import { motion } from "framer-motion";
import { X, Minus, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface OSWindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndex: number;
  onFocus: () => void;
  className?: string;
  initialPos?: { x: number; y: number };
}

export const OSWindow: React.FC<OSWindowProps> = ({
  title,
  isOpen,
  onClose,
  children,
  zIndex,
  onFocus,
  className,
  initialPos = { x: 50, y: 50 }
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      onMouseDown={onFocus}
      initial={{ scale: 0.9, opacity: 0, x: initialPos.x, y: initialPos.y }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      style={{ zIndex }}
      className={cn("os-window w-full max-w-2xl md:max-w-4xl max-h-[80vh]", className)}
    >
      <div className="os-window-header select-none">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white/20 pixel-border-sm flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-white" />
          </div>
          <span className="font-pixel text-xs tracking-widest uppercase">{title}</span>
        </div>
        
        <div className="flex gap-1">
          <button className="p-1 hover:bg-white/20 transition-colors border-2 border-transparent active:border-white/40">
            <Minus size={14} />
          </button>
          <button className="p-1 hover:bg-white/20 transition-colors border-2 border-transparent active:border-white/40">
            <Square size={12} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-1 bg-red-600 hover:bg-red-500 transition-colors border-2 border-black active:translate-x-0.5 active:translate-y-0.5"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      <div className="os-window-content custom-scrollbar">
        {children}
      </div>

      <div className="bg-stone-100 border-t-2 border-black px-2 py-1 flex justify-between font-vt text-[10px] opacity-50 uppercase">
        <span>Status: Connected</span>
        <span>Encoding: UTF-8</span>
      </div>
    </motion.div>
  );
};
