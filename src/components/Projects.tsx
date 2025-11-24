import React from 'react';
import { ExternalLink, ArrowUpRight, Globe } from 'lucide-react';
import { projects } from '@/data/projects';

// Componente para renderizar a arte do projeto baseada no ID
const ProjectVisual: React.FC<{ project: any; index: number }> = ({ project, index }) => {
  // Mapeamento baseado no ID do projeto para visual customizado
  switch (project.id) {
    case 'semogrj': // SEMOG - Maritime/Logistics (Pixel Art Ocean/Container)
      return (
        <div className="w-full h-full bg-blue-600 relative overflow-hidden">
          {/* Pixel Ocean Pattern */}
          <div className="absolute inset-0 opacity-20 pixel-pattern"></div>
          {/* Central Icon: Anchor/Box */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-32 h-32 border-8 border-white bg-brutal-orange shadow-[8px_8px_0px_0px_#000] flex items-center justify-center transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <div className="text-5xl font-black text-white">⚓</div>
             </div>
          </div>
          {/* Decorative Text */}
          <div className="absolute bottom-4 left-4 font-mono text-xs font-bold text-white/50">
             LOGISTICA_GLOBAL // SECTOR_7
          </div>
        </div>
      );
    case 'luis-felipe-pereira': // LFP - Architecture (Minimalist Grid)
      return (
        <div className="w-full h-full bg-stone-100 relative overflow-hidden">
          {/* Blueprint Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(#00000010_1px,transparent_1px),linear-gradient(to_right,#00000010_1px,transparent_1px)]" style={{ backgroundSize: '20px 20px' }}></div>
          {/* Architectural Shapes */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-4 border-black bg-white shadow-[12px_12px_0px_0px_#000] group-hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-300">
             <div className="absolute top-0 left-0 w-full h-8 border-b-4 border-black bg-stone-200 flex gap-2 items-center px-2">
                <div className="w-2 h-2 rounded-full bg-black"></div>
                <div className="w-2 h-2 rounded-full bg-black"></div>
             </div>
             <div className="absolute bottom-4 right-4 w-12 h-12 bg-black"></div>
          </div>
          <div className="absolute top-8 right-8 w-16 h-16 border-4 border-black rounded-full flex items-center justify-center animate-spin-slow">
             <div className="w-full h-0.5 bg-black"></div>
             <div className="h-full w-0.5 bg-black absolute"></div>
          </div>
        </div>
      );
    case 'engerod': // Engerod - Engineering (Industrial Structure)
      return (
        <div className="w-full h-full bg-stone-800 relative overflow-hidden">
          {/* Caution Stripes */}
          <div className="absolute top-0 left-0 w-full h-4 caution-stripes"></div>
          <div className="absolute bottom-0 left-0 w-full h-4 caution-stripes"></div>

          {/* Bridge Truss Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-30" width="100%" height="100%">
             <defs>
               <pattern id="truss" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M0 40 L40 0 M0 0 L40 40" stroke="white" strokeWidth="2"/>
               </pattern>
             </defs>
             <rect width="100%" height="100%" fill="url(#truss)" />
          </svg>

          {/* Solid Block */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-red-600 w-40 h-40 border-4 border-white flex flex-col items-center justify-center text-white font-black tracking-tighter transform group-hover:scale-110 transition-transform">
                <span className="text-4xl">CIVIL</span>
                <span className="text-xl">ENG.</span>
             </div>
          </div>
        </div>
      );
    case 'agencia-multi-br': // Multi BR - Marketing (Growth/Analytics Theme)
      return (
        <div className="w-full h-full bg-brutal-purple relative overflow-hidden group-hover:bg-[#581c87] transition-colors">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

          {/* Rising Bars (Growth) - Positioned at bottom */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-end gap-2 h-2/3 lg:h-3/4 w-1/2 justify-center">
             <div className="w-full max-w-[40px] bg-brutal-yellow border-4 border-black h-[40%] group-hover:h-[50%] transition-all duration-500 shadow-[4px_-4px_0px_0px_rgba(0,0,0,0.3)]"></div>
             <div className="w-full max-w-[40px] bg-brutal-orange border-4 border-black h-[60%] group-hover:h-[75%] transition-all duration-500 delay-75 shadow-[4px_-4px_0px_0px_rgba(0,0,0,0.3)]"></div>
             <div className="w-full max-w-[40px] bg-brutal-green border-4 border-black h-[80%] group-hover:h-[95%] transition-all duration-500 delay-150 relative overflow-hidden shadow-[4px_-4px_0px_0px_rgba(0,0,0,0.3)]">
                {/* Pattern inside bar */}
                <div className="absolute inset-0 caution-stripes opacity-10"></div>
             </div>
          </div>

          {/* Floating Marketing Icons */}
          <div className="absolute top-6 left-6 w-12 h-12 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#000] animate-float-slow z-10">
             <span className="font-black text-xl">@</span>
          </div>

          <div className="absolute top-10 right-10 w-auto px-3 py-1 bg-red-500 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] transform -rotate-6 group-hover:rotate-0 transition-transform z-10">
             <span className="font-black text-white text-xs tracking-widest">ADS</span>
          </div>

          {/* Arrow Graphic Overlay */}
          <div className="absolute inset-0 pointer-events-none">
             <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path
                 d="M 25 80 L 50 50 L 60 65 L 85 20"
                 fill="none"
                 stroke="black"
                 strokeWidth="3"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 className="drop-shadow-[2px_2px_0px_#fff]"
               />
               <circle cx="85" cy="20" r="4" fill="white" stroke="black" strokeWidth="2" />
             </svg>
          </div>
        </div>
      );
    default:
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
           <Globe size={48} className="text-gray-400" />
        </div>
      );
  }
};

const ProjectCard: React.FC<{ project: any; index: number }> = ({ project, index }) => {
  return (
    <div className="group relative bg-white border-4 border-black p-0 transition-all duration-300 hover:-translate-y-2">
       {/* Massive Index Number */}
       <div className="absolute -top-6 -left-6 w-16 h-16 bg-brutal-orange border-4 border-black flex items-center justify-center text-2xl font-black shadow-[4px_4px_0px_0px_#000] z-20">
          0{index + 1}
       </div>

       {/* Image/Visual Container */}
       <div className="relative border-b-4 border-black aspect-video overflow-hidden bg-stone-200 group-hover:shadow-inner">
          <ProjectVisual project={project} index={index} />

          {/* Overlay Actions */}
          <div className="absolute bottom-0 right-0 z-20 flex">
             <a href={project.live} target="_blank" rel="noopener noreferrer" className="bg-brutal-yellow border-t-4 border-l-4 border-black p-3 hover:bg-black hover:text-white transition-colors">
                <ExternalLink size={24} />
             </a>
          </div>
       </div>

       {/* Content */}
       <div className="p-6 md:p-8 bg-white relative">
          {/* Tech Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
             {project.tech.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs font-bold font-mono border border-black bg-stone-100 text-stone-600 uppercase">
                   {tag}
                </span>
             ))}
          </div>

          <h3 className="text-3xl font-black mb-3 uppercase flex items-center gap-2">
             {project.title}
             <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1" />
          </h3>

          <p className="text-stone-600 font-medium leading-relaxed border-l-4 border-stone-300 pl-4">
             {project.description}
          </p>
       </div>
    </div>
  );
};

const Projects: React.FC = () => {
  return (
    <section className="py-24 bg-stone-100">
      <div className="container mx-auto px-4">

        <div className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
           <div className="space-y-2">
              <div className="inline-block bg-black text-white font-mono px-2 py-1 text-xs font-bold mb-2">
                 // ACESSO_DADOS
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                 TRABALHOS<br/>
                 <span className="text-brutal-orange">SELECIONADOS_</span>
              </h2>
           </div>

           <p className="max-w-md text-lg font-medium border-l-4 border-black pl-4 py-2">
              Cases reais de transformação digital, de sites institucionais a plataformas globais.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {projects.map((p, idx) => (
            <div key={p.id} className={idx % 2 !== 0 ? "md:translate-y-16" : ""}>
               <ProjectCard project={p} index={idx} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Projects;
