import React from 'react';
import { Braces, Database, Layout, Server, Box, Layers, Cpu, Zap } from 'lucide-react';

const skills = [
  { name: 'React', icon: Braces, color: 'bg-[#61DAFB]', text: 'text-black' },
  { name: 'Next.js', icon: Layers, color: 'bg-black', text: 'text-white' },
  { name: 'Tailwind', icon: Layout, color: 'bg-[#38B2AC]', text: 'text-black' },
  { name: 'TypeScript', icon: Box, color: 'bg-[#3178C6]', text: 'text-white' },
  { name: 'Supabase', icon: Database, color: 'bg-[#3ECF8E]', text: 'text-black' },
  { name: 'Node.js', icon: Server, color: 'bg-[#339933]', text: 'text-white' },
];

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 bg-brutal-yellow border-y-4 border-black relative overflow-hidden">

      {/* Scrolling Marquee Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-col justify-between rotate-3 scale-110">
         {[1,2,3].map(i => (
           <div key={i} className="whitespace-nowrap text-[10rem] font-black leading-none text-black">
              STACK STACK STACK STACK STACK STACK
           </div>
         ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">

        <div className="bg-white border-4 border-black p-8 md:p-12 shadow-brutal-lg">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-4 border-black pb-8">
               <div>
                  <h2 className="text-2xl md:text-6xl font-black uppercase">
                     MÓDULOS_INSTALADOS
                  </h2>
                  <p className="font-mono mt-2 text-gray-500 font-bold">
                     // TECNOLOGIAS_DETECTADAS
                  </p>
               </div>
               <div className="hidden md:block text-right">
                  <Cpu size={48} className="ml-auto mb-2" strokeWidth={1.5} />
                  <span className="font-mono text-xs block">SISTEMA_OTIMIZADO</span>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               {skills.map((skill, idx) => (
                 <div
                   key={skill.name}
                   className={`group relative h-48 border-4 border-black bg-white hover:bg-stone-100 transition-colors cursor-none`}
                 >
                    {/* Chip Connector Visuals */}
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-black flex gap-1 px-1">
                       {[1,2,3,4,5].map(i => <div key={i} className="flex-1 bg-brutal-yellow"></div>)}
                    </div>

                    <div className="p-4 h-full flex flex-col justify-between">
                       <div className="flex justify-between items-start">
                          <span className="font-mono text-xs font-bold opacity-50">0{idx + 1}</span>
                          <Zap size={16} className="text-gray-300 group-hover:text-brutal-orange" />
                       </div>

                       <div className="flex flex-col items-center gap-2">
                          <div className={`${skill.color} ${skill.text} p-3 border-2 border-black rounded shadow-neo group-hover:scale-110 transition-transform`}>
                             <skill.icon size={28} />
                          </div>
                          <span className="font-black uppercase tracking-wider">{skill.name}</span>
                       </div>

                       <div className="w-full bg-gray-200 h-1 mt-2">
                          <div className="bg-black h-full w-[90%]"></div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default Skills;