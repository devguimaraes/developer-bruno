import { Code2, Terminal, Cpu, Globe } from "lucide-react";

const techs = [
  { name: "REACT", icon: Code2 },
  { name: "NEXT.JS", icon: Globe },
  { name: "TYPESCRIPT", icon: Terminal },
  { name: "TAILWIND", icon: Cpu },
  { name: "REACT", icon: Code2 },
  { name: "NEXT.JS", icon: Globe },
  { name: "TYPESCRIPT", icon: Terminal },
  { name: "TAILWIND", icon: Cpu },
];

const TechTicker = () => {
  return (
    <div className="w-full border-y-4 border-foreground bg-accent overflow-hidden py-4 relative z-10 mt-16">
      <div className="flex animate-marquee whitespace-nowrap">
        <div className="flex items-center gap-12 mx-6">
          {techs.map((tech, index) => (
            <div key={index} className="flex items-center gap-3">
              <tech.icon size={24} className="text-foreground" />
              <span className="font-mono font-black text-2xl text-foreground tracking-tighter">
                {tech.name}
              </span>
              <span className="text-foreground/30 font-black text-2xl mx-4">
                +
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-12 mx-6">
          {techs.map((tech, index) => (
            <div key={`duplicate-${index}`} className="flex items-center gap-3">
              <tech.icon size={24} className="text-foreground" />
              <span className="font-mono font-black text-2xl text-foreground tracking-tighter">
                {tech.name}
              </span>
              <span className="text-foreground/30 font-black text-2xl mx-4">
                +
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-12 mx-6">
          {techs.map((tech, index) => (
            <div
              key={`duplicate-2-${index}`}
              className="flex items-center gap-3"
            >
              <tech.icon size={24} className="text-foreground" />
              <span className="font-mono font-black text-2xl text-foreground tracking-tighter">
                {tech.name}
              </span>
              <span className="text-foreground/30 font-black text-2xl mx-4">
                +
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechTicker;
