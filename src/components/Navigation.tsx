import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'INÍCIO', href: '#hero' },
    { name: 'SOBRE', href: '#about' },
    { name: 'SKILLS', href: '#skills' },
    { name: 'PROJETOS', href: '#projects' },
    { name: 'BLOG', href: '/blog' },
    { name: 'CONTATO', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b-4 border-black py-2' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">

        {/* Logo - Terminal Style */}
        <div className="flex items-center gap-2 group cursor-pointer">
           <div className="w-12 h-12 bg-black flex items-center justify-center text-white shadow-neo transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none">
             <span className="font-black font-mono text-xl">BG</span>
           </div>
           <div className="flex flex-col leading-none">
             <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">Bruno <span className="text-brutal-orange">Guimarães</span></span>
             <span className="font-mono text-[10px] font-bold tracking-widest opacity-60">DEV_FRONTEND</span>
           </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 font-bold items-center bg-white border-2 border-black px-6 py-2 shadow-neo">
           {navLinks.map(link => (
             <a
               key={link.name}
               href={link.href}
               className={link.href.startsWith('/') ? "font-mono hover:text-brutal-orange hover:bg-black hover:text-white px-2 transition-colors" : "font-mono hover:text-brutal-orange hover:bg-black hover:text-white px-2 transition-colors"}
               onClick={link.href.startsWith('/') ? (e) => window.location.href = link.href : undefined}
             >
               {`//${link.name}`}
             </a>
           ))}
           <div className="w-px h-6 bg-black mx-2"></div>
           <button className="font-black uppercase tracking-wider hover:text-brutal-orange blink-animation">
             Status: Online
           </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 border-4 border-black bg-brutal-yellow shadow-neo active:translate-y-1 active:shadow-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X strokeWidth={3} /> : <Menu strokeWidth={3} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-stone-900 border-b-4 border-black p-0 flex flex-col shadow-xl z-50">
           {navLinks.map((link, idx) => (
             <a
               key={link.name}
               href={link.href}
               className={`text-2xl font-black text-white p-6 border-b border-white/20 hover:bg-brutal-orange hover:text-black transition-colors font-mono flex justify-between group`}
               onClick={() => {
                 setIsOpen(false);
                 if (link.href.startsWith('/')) {
                   window.location.href = link.href;
                 }
               }}
             >
               <span>{link.name}</span>
               <span className="opacity-0 group-hover:opacity-100">➜</span>
             </a>
           ))}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
