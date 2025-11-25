import React from 'react';
import { Cpu, Zap } from 'lucide-react';
import { featuredSkills, getAllTechnologies } from '@/data/skills';
import type { Skill } from '@/types';

const Skills: React.FC = () => {
  // Get featured skills for display (first 6 skills or use categories)
  const displaySkills = featuredSkills.slice(0, 6);

  // Transform skills data to match chip design format
  const getSkillDisplayData = (skill: Skill, index: number) => {
    // Map skill categories to appropriate display colors
    const colorMap = {
      'bg-primary': 'bg-[hsl(162,100%,27%)]',
      'bg-secondary': 'bg-[hsl(282,32%,42%)]',
      'bg-accent': 'bg-[hsl(45,87%,57%)]',
      'bg-muted': 'bg-[hsl(0,0%,8%)]',
    };

    // Determine text color based on background
    const textColor = skill.color === 'bg-muted' || skill.color === 'bg-primary' ? 'text-white' : 'text-black';

    return {
      name: skill.title,
      icon: skill.icon,
      color: colorMap[skill.color as keyof typeof colorMap] || skill.color,
      text: textColor,
      technologies: skill.technologies?.slice(0, 3) || [], // Show first 3 technologies
    };
  };

  const totalTechnologies = getAllTechnologies().length;

  return (
    <section className="py-20 bg-brutal-yellow border-y-4 border-black relative overflow-hidden">

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
                     // {totalTechnologies} TECNOLOGIAS_DETECTADAS
                  </p>
               </div>
               <div className="hidden md:block text-right">
                  <Cpu size={48} className="ml-auto mb-2" strokeWidth={1.5} />
                  <span className="font-mono text-xs block">SISTEMA_OTIMIZADO</span>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               {displaySkills.map((skill, idx) => {
                 const displayData = getSkillDisplayData(skill, idx);
                 return (
                   <div
                     key={skill.id}
                     className="group relative h-48 border-4 border-black bg-white hover:bg-stone-100 transition-colors cursor-none"
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
                            <div className={`${displayData.color} ${displayData.text} p-3 border-2 border-black rounded shadow-neo group-hover:scale-110 transition-transform`}>
                               <displayData.icon size={28} />
                            </div>
                            <span className="font-black uppercase tracking-wider text-center text-sm leading-tight">
                               {displayData.name.replace(' & ', ' & ').replace(' ', '_')}
                            </span>
                         </div>

                         {/* Technology tags */}
                         {displayData.technologies.length > 0 && (
                           <div className="flex flex-wrap gap-1 justify-center mt-1">
                             {displayData.technologies.slice(0, 2).map((tech, techIdx) => (
                               <span
                                 key={techIdx}
                                 className="text-[8px] font-mono bg-black text-white px-1 py-0.5 leading-none"
                               >
                                 {tech.length > 6 ? tech.slice(0, 6) : tech}
                               </span>
                             ))}
                             {displayData.technologies.length > 2 && (
                               <span className="text-[8px] font-mono bg-black text-white px-1 py-0.5 leading-none">
                                 +{displayData.technologies.length - 2}
                               </span>
                             )}
                           </div>
                         )}

                         <div className="w-full bg-gray-200 h-1 mt-2">
                            <div className="bg-black h-full w-[90%]"></div>
                         </div>
                      </div>
                   </div>
                 );
               })}
            </div>

            {/* Stats Section */}
            <div className="mt-12 pt-8 border-t-4 border-black">
               <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                     <span className="font-mono text-sm text-gray-500">// SKILL_CATEGORIES_LOADED</span>
                     <div className="text-2xl font-black mt-1">
                        {new Set(displaySkills.map(s => s.category)).size} CATEGORIAS
                     </div>
                  </div>
                  <div className="text-center md:text-left">
                     <span className="font-mono text-sm text-gray-500">// TOTAL_TECHNOLOGIES</span>
                     <div className="text-2xl font-black mt-1">
                        {totalTechnologies}+ TECNOLOGIAS
                     </div>
                  </div>
                  <div className="text-center md:text-left">
                     <span className="font-mono text-sm text-gray-500">// SYSTEM_STATUS</span>
                     <div className="text-2xl font-black mt-1 text-green-600">
                        ● ONLINE
                     </div>
                  </div>
               </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Skills;