import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { X, Github, Linkedin, Mail, Instagram } from 'lucide-react';
import GlassSurface from './GlassSurface';

interface StaggeredMenuItem {
  label: string;
  href: string;
}

interface StaggeredMenuProps {
  items: StaggeredMenuItem[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  items,
  isOpen,
  onClose,
  className = '',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Open Animation
      timeline.current = gsap.timeline();
      
      timeline.current.to(layersRef.current, {
        xPercent: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'expo.inOut'
      });

      timeline.current.fromTo(contentRef.current?.querySelectorAll('.menu-item') || [], 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power3.out' },
        "-=0.3"
      );
    } else {
      // Close Animation
      const tl = gsap.timeline();

      tl.to(contentRef.current?.querySelectorAll('.menu-item') || [], {
        y: 20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in'
      });

      tl.to(layersRef.current, {
        xPercent: 100,
        duration: 0.6,
        stagger: -0.08,
        ease: 'expo.inOut'
      }, "-=0.2");
    }
  }, [isOpen]);

  useEffect(() => {
    // Initial setup for GSAP to avoid flashes
    gsap.set(layersRef.current, { xPercent: 100 });
  }, []);

  return (
    <div className={`md:hidden ${className} ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Underlay Layers */}
      {[ '#f97316', '#000'].map((color, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) layersRef.current[index] = el;
          }}
          className="fixed inset-0 z-[80]"
          style={{ backgroundColor: color }}
        />
      ))}

      {/* Menu Content with Glass Effect */}
      <div
        ref={menuRef}
        className={`fixed inset-0 z-[90] flex flex-col ${isOpen ? 'visible' : 'invisible'}`}
      >
        <GlassSurface
          className="w-full h-full"
          height="100vh"
          backgroundOpacity={0.8}
          blur={30}
          brightness={20}
          distortionScale={-200}
        >
          <div ref={contentRef} className="flex flex-col h-full w-full justify-center px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex justify-end mb-8 pt-4">
              <button onClick={onClose} className="min-h-11 min-w-11 p-2 text-white" aria-label="Fechar menu">
                <X size={32} strokeWidth={3} />
              </button>
            </div>

            <nav className="space-y-6 sm:space-y-8 flex-1 flex flex-col justify-center">
              {items.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className="menu-item flex items-center gap-4 py-2 text-4xl sm:text-6xl font-black font-pixel text-white uppercase hover:text-accent transition-colors"
                >
                  <span className="text-xs opacity-30 font-mono tracking-tighter">0{idx + 1}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-8 flex gap-8 menu-item border-t border-white/10 pt-8 pb-8">
              <a href="https://github.com/devguimaraes" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><Github size={28} /></a>
              <a href="https://linkedin.com/in/bcguimaraes" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><Linkedin size={28} /></a>
              <a href="https://instagram.com/devguimaraes" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors"><Instagram size={28} /></a>
              <a href="mailto:bc.guimaraes@outlook.com" className="text-white/60 hover:text-white transition-colors"><Mail size={28} /></a>
            </div>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
};

export default StaggeredMenu;
