import React, { useState, useEffect } from "react";
import { NeoButton } from "@/components/ui/NeoButton";
import {
  MoveRight,
  ArrowDown,
  Globe,
  Terminal,
  Cpu,
  Zap,
  Code2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
} from "@icons-pack/react-simple-icons";

// --- COMPONENTS ---

// 1. System Log Component
const SystemLog = () => {
  const [logs, setLogs] = useState<{ id: number; text: string }[]>([]);

  useEffect(() => {
    const messages = [
      "INITIALIZING_CORE...",
      "LOADING_ASSETS...",
      "OPTIMIZING_RENDER...",
      "CONNECTING_TO_MAINNET...",
      "SYSTEM_READY",
      "ESTABLISHING_UPLINK...",
      "COMPILING_MODULES...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        text: `> ${messages[i % messages.length]}`,
      };
      setLogs((prev) => [...prev.slice(-3), newLog]);
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-green-500 font-mono text-xs p-4 h-full flex flex-col justify-end border-t-4 border-black overflow-hidden relative gap-1 leading-relaxed shadow-inner">
      <div className="absolute top-2 right-2 flex gap-1">
        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
        <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
      </div>
      <div className="opacity-50 mb-auto border-b border-green-500/30 pb-1 mt-6">
        TERMINAL_OUTPUT
      </div>

      <div className="flex flex-col gap-1 justify-end min-h-0">
        <AnimatePresence mode="popLayout">
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="truncate"
            >
              {log.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        animate={{ opacity: [0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="mt-1"
      >
        _
      </motion.div>
    </div>
  );
};

interface TechCardProps {
  Icon: React.ElementType;
  label: string;
  color: string;
  bgHover: string;
}

// 2. Tech Card Component
const TechCard: React.FC<TechCardProps> = ({ Icon, label, color, bgHover }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-white border-4 border-black p-4 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden group transition-colors duration-300"
      style={{
        backgroundColor: isHovered ? bgHover : "white",
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]" />

      <motion.div
        animate={{ scale: isHovered ? 1.2 : 1, rotate: isHovered ? 5 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon size={48} color={isHovered ? "white" : color} />
      </motion.div>

      <span
        className={`font-black uppercase text-sm tracking-widest z-10 transition-colors ${
          isHovered ? "text-white" : "text-black"
        }`}
      >
        {label}
      </span>

      {/* Corner decoration */}
      <div className="absolute top-1 right-1 w-2 h-2 border border-black group-hover:bg-white transition-colors" />
    </motion.div>
  );
};

// 3. Marquee Component
const Marquee = () => (
  <div className="bg-brutal-yellow border-b-4 border-black py-3 mb-4 overflow-hidden whitespace-nowrap relative z-10">
    <motion.div
      animate={{ x: ["0%", "-50%"] }}
      transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      className="inline-flex gap-8 font-mono font-bold text-sm md:text-base tracking-widest uppercase items-center"
    >
      {[...Array(4)].map((_, i) => (
        <React.Fragment key={i}>
          <span className="flex items-center gap-2">
            <Cpu size={16} /> Available for Projects
          </span>
          <span className="text-brutal-orange text-xl">●</span>
          <span className="flex items-center gap-2">
            <Code2 size={16} /> Front-End Engineer
          </span>
          <span className="text-black text-xl">●</span>
          <span className="flex items-center gap-2">
            <Zap size={16} /> High Performance
          </span>
          <span className="text-brutal-green text-xl">●</span>
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);

type HeroProps = React.HTMLAttributes<HTMLElement>;

const Hero: React.FC<HeroProps> = ({ className, ...props }) => {
  return (
    <section
      {...props}
      className={`relative h-screen max-h-screen overflow-hidden flex flex-col pt-20 md:pt-24 bg-brutal-bg ${
        className ?? ""
      }`}
    >
      {/* Top Marquee */}
      <Marquee />

      {/* Main Grid Container */}
      <div className="flex-1 container mx-auto px-4 md:px-8 pb-4 md:pb-4 flex flex-col min-h-0">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 border-4 border-black bg-white shadow-brutal-2xl relative min-h-0">
          {/* LEFT COLUMN: Content (8 cols) */}
          <div className="lg:col-span-12 xl:col-span-8 p-6 md:p-8 lg:p-12 pb-12 flex flex-col justify-center relative overflow-hidden bg-white">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Globe size={200} strokeWidth={0.5} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border-2 border-black bg-black text-white px-3 py-1 font-mono text-xs font-bold mb-8 shadow-[4px_4px_0px_0px_#facc15]">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                SYSTEM_READY // v.4.0
              </div>

              {/* Headlines */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl 2xl:text-[9rem] font-black uppercase leading-[0.9] tracking-tighter mb-8 text-black">
                Bruno
                <br />
                <span
                  className="relative inline-block text-white drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-300"
                  style={{ WebkitTextStroke: "2px black" }}
                >
                  Guimarães
                </span>
              </h1>

              <p className="text-lg md:text-2xl font-medium max-w-2xl leading-relaxed text-stone-800 border-l-4 border-brutal-orange pl-6 mb-10">
                Desenvolvedor Front-end focado em{" "}
                <span className="bg-brutal-yellow/50 px-1 border border-black/10 font-bold">
                  performance
                </span>
                . Crio interfaces modernas e responsivas para sites e aplicações
                web.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 py-2">
                <NeoButton
                  onClick={() =>
                    document
                      .getElementById("projects")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-brutal-orange text-white hover:bg-black border-black shadow-[6px_6px_0px_0px_#000] text-lg py-6 px-8"
                >
                  EXPLORAR PORTFÓLIO <MoveRight className="ml-2 inline" />
                </NeoButton>
                <NeoButton
                  variant="outline"
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-white hover:bg-stone-100 border-black shadow-[6px_6px_0px_0px_#000] text-lg py-6 px-8"
                >
                  INICIAR PROJETO
                </NeoButton>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: The Visual Dashboard (4 cols) */}
          {/* Hidden on mobile/tablet, shown on LG+ */}
          <div className="hidden xl:col-span-4 xl:grid grid-rows-6 border-l-4 border-black bg-stone-100 h-full min-h-0">
            {/* Row 1: Header/Stat */}
            <div className="row-span-1 border-b-4 border-black bg-brutal-yellow p-6 flex justify-between items-center bg-clip-padding">
              <div>
                <div className="font-mono text-xs font-bold mb-1">
                  CURRENT_STATUS
                </div>
                <div className="font-black text-2xl flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  ONLINE
                </div>
              </div>
              <Terminal size={32} strokeWidth={2.5} />
            </div>

            {/* Row 2-4: The Tech Grid (3 rows) */}
            <div className="row-span-3 bg-stone-200 p-6 grid grid-cols-2 gap-4">
              <TechCard
                Icon={SiReact}
                label="React"
                color="#000"
                bgHover="#61DAFB"
              />
              <TechCard
                Icon={SiTypescript}
                label="TS"
                color="#000"
                bgHover="#3178C6"
              />
              <TechCard
                Icon={SiNextdotjs}
                label="Next.js"
                color="#000"
                bgHover="#000000"
              />
              <TechCard
                Icon={SiTailwindcss}
                label="Tailwind"
                color="#000"
                bgHover="#06B6D4"
              />
            </div>

            {/* Row 5-6: System Logs (2 rows) */}
            <div className="row-span-2 h-full min-h-0 relative">
              <SystemLog />
            </div>
          </div>
        </div>

        {/* Footer Decoration */}
        <div className="mt-4 flex gap-4 items-center">
          <div className="h-4 bg-black flex-1 flex items-center justify-end px-2">
            <span className="text-[10px] text-white font-mono hidden md:block">
              COORDS: 22.9068° S, 43.1729° W
            </span>
          </div>
          <div className="h-4 bg-brutal-orange w-1/4 border-2 border-black"></div>
          <div className="h-4 bg-brutal-green w-16 border-2 border-black flex items-center justify-center">
            <div className="w-1 h-1 bg-black rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
