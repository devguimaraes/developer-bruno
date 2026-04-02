import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { X, Github, Linkedin, Mail, Instagram } from 'lucide-react';

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

      {/* Menu Content */}
      <div
        ref={menuRef}
        className={`fixed inset-0 z-[90] flex flex-col px-6 py-5 sm:px-8 sm:py-6 ${isOpen ? 'visible' : 'invisible'}`}
      >
        <div className="flex justify-end mb-8">
          <button onClick={onClose} className="min-h-11 min-w-11 p-2 text-white" aria-label="Fechar menu">
            <X size={30} />
          </button>
        </div>

        <div ref={contentRef} className="flex flex-col h-full justify-center">
          <nav className="space-y-5 sm:space-y-6">
            {items.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={onClose}
                className="menu-item flex items-center gap-3 py-2 text-[1.9rem] sm:text-4xl font-black font-pixel text-white uppercase hover:text-brutal-orange transition-colors"
              >
                <span className="text-xs opacity-50 font-mono">0{idx + 1}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-auto flex gap-6 menu-item border-t-4 border-white/10 pt-6">
            <a href="https://github.com/devguimaraes" target="_blank" rel="noreferrer" className="min-h-11 min-w-11 inline-flex items-center justify-center text-white hover:text-brutal-orange"><Github size={24} /></a>
            <a href="https://linkedin.com/in/bcguimaraes" target="_blank" rel="noreferrer" className="min-h-11 min-w-11 inline-flex items-center justify-center text-white hover:text-brutal-orange"><Linkedin size={24} /></a>
            <a href="https://instagram.com/devguimaraes" target="_blank" rel="noreferrer" className="min-h-11 min-w-11 inline-flex items-center justify-center text-white hover:text-brutal-orange"><Instagram size={24} /></a>
            <a href="mailto:bc.guimaraes@outlook.com" className="min-h-11 min-w-11 inline-flex items-center justify-center text-white hover:text-brutal-orange"><Mail size={24} /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaggeredMenu;
