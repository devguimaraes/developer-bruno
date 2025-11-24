import React from 'react';
import { NeoButton } from '@/components/ui/NeoButton';
import { Linkedin, Instagram, Github } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-white border-t-4 border-black relative overflow-hidden">

       {/* Warning Stripes Background */}
       <div className="absolute top-0 left-0 w-full h-4 caution-stripes"></div>
       <div className="absolute bottom-0 left-0 w-full h-4 caution-stripes"></div>

       <div className="container mx-auto px-4 relative z-10">
         <div className="max-w-4xl mx-auto bg-stone-100 border-4 border-black shadow-brutal-lg p-8 md:p-12 text-center">

           <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1 font-mono font-bold text-sm mb-6 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-brutal-green rounded-full"></div>
              CANAL_ABERTO
           </div>

           <h2 className="text-5xl md:text-7xl font-black leading-tight mb-6">
             PRONTO PARA <span className="text-transparent bg-clip-text bg-gradient-to-r from-brutal-orange to-red-600">CRIAR?</span>
           </h2>

           <p className="text-xl md:text-2xl font-bold text-stone-600 mb-12 max-w-2xl mx-auto">
             Inicie o protocolo de colaboração. Conecte-se comigo nas redes sociais para discutirmos seu próximo projeto.
           </p>

           <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
             <a href="https://www.linkedin.com/in/bcguimaraes/" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
               <NeoButton variant="primary" className="text-xl px-12 py-5 w-full md:w-auto" icon>
                 INICIAR PROJETO (LinkedIn)
               </NeoButton>
             </a>
           </div>

           {/* Social Connections */}
           <div className="border-t-4 border-black pt-8 flex justify-center gap-4">
             {[
               { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/bcguimaraes/' },
               { icon: Github, label: 'GitHub', href: 'https://github.com/devguimaraes' },
               { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/dev.guimaraes/' }
             ].map((item, idx) => (
               <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-white border-4 border-black flex items-center justify-center shadow-neo group-hover:-translate-y-1 group-hover:shadow-brutal-lg transition-all">
                    <item.icon size={24} className="text-black" />
                  </div>
                  <span className="font-mono text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">{item.label}</span>
               </a>
             ))}
           </div>

         </div>
       </div>
    </section>
  );
};

export default Contact;
