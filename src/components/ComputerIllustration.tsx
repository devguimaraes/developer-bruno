import React from 'react';
import { Terminal, Code, Sparkles, Plus, Cpu, MoveRight } from 'lucide-react';

export const ComputerIllustration = () => (
  <div className="relative w-full max-w-[450px] lg:max-w-[550px] mx-auto group perspective-1000 mt-16 lg:mt-0">

    {/* Glitchy Background Elements */}
    <div className="absolute inset-0 bg-brutal-orange/20 transform translate-x-4 translate-y-4 -z-10 border-2 border-dashed border-black rounded-xl"></div>

    {/* Floaters */}
    <div className="absolute -top-12 -right-4 z-30 animate-[float_4s_ease-in-out_infinite]">
       <div className="bg-white border-4 border-black p-2 shadow-[6px_6px_0px_0px_#000] flex gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
          <span className="font-mono text-xs font-bold">SIST_PRONTO</span>
       </div>
    </div>

    {/* Main Monitor Structure */}
    <div className="relative transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:-rotate-1">

      {/* Heavy Shadow */}
      <div className="absolute inset-0 translate-x-4 translate-y-4 bg-black rounded-none -z-10"></div>

      {/* Monitor Casing */}
      <div className="relative bg-[#e5e5e5] border-4 border-black p-4 lg:p-6 flex flex-col items-center z-10">

         {/* Decor Lines */}
         <div className="absolute top-2 left-2 right-2 flex justify-between opacity-30">
            <div className="h-1 w-12 bg-black"></div>
            <div className="h-1 w-4 bg-black"></div>
         </div>

         {/* Screen Bezel */}
         <div className="w-full bg-[#2a2a2a] border-4 border-black p-2 pb-8 shadow-inner relative">
            <div className="absolute bottom-2 right-2 flex gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>

            {/* Screen Content - Retro Terminal */}
            <div className="bg-[#0a0a0a] w-full aspect-[5/4] border-2 border-[#4a4a4a] relative overflow-hidden p-4 font-mono text-sm text-green-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] scanlines-crt">

               {/* Scanline overlay */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[size:100%_2px,3px_100%] pointer-events-none"></div>

               <div className="flex justify-between border-b border-green-900/50 pb-2 mb-4 text-[10px] text-green-600">
                  <span>UBUNTU_KERNEL_V.5.4</span>
                  <span>MEM: 64GB</span>
               </div>

               <div className="space-y-3 relative z-10 text-xs md:text-sm">
                  <div className="typing-effect">
                    <span className="text-brutal-orange mr-2">root@bruno:~$</span>
                    <span className="text-white">iniciar portfolio_v2.exe</span>
                  </div>
                  <div className="text-green-600 pl-4 border-l border-green-800">
                    &gt; Carregando assets criativos... [OK]<br/>
                    &gt; Compilando componentes React... [OK]<br/>
                    &gt; Injetando estilo: NEO_BRUTALISMO... [OK]
                  </div>

                  <div className="mt-4 p-2 bg-green-900/20 border border-green-800">
                    <span className="text-brutal-yellow font-bold">STACK_ATUAL:</span>
                    <div className="grid grid-cols-2 gap-x-4 mt-1 text-gray-400">
                       <span>* React.js</span>
                       <span>* Next.js</span>
                       <span>* Tailwind</span>
                       <span>* Claude Code</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-brutal-orange mr-2">root@mrobot:~$</span>
                    <span className="animate-pulse bg-green-500 text-black px-1">_</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Logo Badge */}
         <div className="absolute bottom-2 left-6 font-black italic text-gray-400 text-xs tracking-widest">
             FUTURO_CORP
         </div>
      </div>

    </div>
  </div>
);
