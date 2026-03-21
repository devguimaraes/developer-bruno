import React, { useState, useEffect } from "react";
import { ArrowUpRight, Code, Palette, Zap, Box } from "lucide-react";
import {
  FadeInStagger,
  FadeInItem,
  TextReveal,
} from "@/components/ui/motion-components";
import {
  RIVE_ASSETS,
  RIVE_STATE_MACHINES,
  RIVE_OPACITY,
} from "@/lib/constants/rive";

const ServicesBackground = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [RiveMod, setRiveMod] = useState<any>(null);

  useEffect(() => {
    import("@rive-app/react-canvas").then((mod) => {
      const exportsExtracted = { ...mod, ...(mod.default || {}) };
      setRiveMod(() => exportsExtracted);
    }).catch(console.error);
  }, []);

  if (!RiveMod) return null;

  const { useRive, Layout, Fit, Alignment } = RiveMod;

  const RiveRenderer = () => {
    const { RiveComponent } = useRive({
      src: RIVE_ASSETS.ISO_TOY,
      stateMachines: RIVE_STATE_MACHINES.DEFAULT,
      autoplay: true,
      layout: new Layout({
        fit: Fit.Cover,
        alignment: Alignment.Center,
      }),
    });
    return (
      <RiveComponent
        className={`w-full h-full ${RIVE_OPACITY.SERVICES_BACKGROUND}`}
      />
    );
  };

  return <RiveRenderer />;
};

const services = [
  {
    id: "01",
    title: "FRONT-END ENGINEERING",
    desc: "React, Next.js, Architecture",
    color: "bg-brutal-orange",
    icon: Code,
  },
  {
    id: "02",
    title: "UI & UX",
    desc: "Typography Systems, Visual Hierarchy",
    color: "bg-brutal-yellow",
    icon: Palette,
  },
  {
    id: "03",
    title: "PERFORMANCE",
    desc: "SEO, Core Web Vitals, Speed",
    color: "bg-brutal-purple",
    icon: Zap,
  },
  {
    id: "04",
    title: "MOTION DESIGN",
    desc: "GSAP, Framer Motion, WebGL",
    color: "bg-brutal-blue",
    icon: Box,
  },
];

type ServicesProps = React.HTMLAttributes<HTMLElement>;

const Services: React.FC<ServicesProps> = ({ className, ...props }) => {
  return (
    <section
      className={`py-24 bg-stone-100 relative overflow-hidden ${
        className ?? ""
      }`}
      {...props}
    >
      {/* Rive Background */}
      <div className="absolute inset-0 z-0">
        <ServicesBackground />
      </div>

      {/* Technical Grid Background */}
      <div className="absolute inset-0 bg-neo-grid opacity-50 pointer-events-none z-[1]" />

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-4 border-brutal-orange opacity-20 rotate-12" />
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-brutal-yellow opacity-20 -rotate-6" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-2xl border-4 border-brutal-orange">
            02
          </div>
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
            <TextReveal text="SERVIÇOS" />
          </h2>
          <div className="h-2 flex-1 bg-black hidden md:block"></div>
        </div>

        <FadeInStagger className="grid grid-cols-1 gap-6">
          {services.map((service) => (
            <FadeInItem
              key={service.id}
              className="group relative bg-white border-4 border-black flex flex-col md:flex-row min-h-[150px] hover:-translate-y-2 transition-all duration-300 shadow-brutal-lg hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden cursor-pointer"
            >
              {/* Service Number Badge */}
              <div className="md:absolute md:-top-4 md:-left-4 w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-lg border-4 border-white shadow-neo z-10">
                {service.id}
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex-1 relative z-10 flex items-center justify-between">
                {/* Icon on mobile only */}
                <div className="md:hidden">
                  <div
                    className={`${service.color} ${
                      service.color === "bg-brutal-yellow"
                        ? "text-black"
                        : "text-white"
                    } w-12 h-12 flex items-center justify-center border-4 border-black shadow-neo group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon size={24} className="font-black" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left md:ml-8">
                  <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-2 group-hover:translate-x-2 transition-transform duration-300">
                    <TextReveal text={service.title} delay={0.1} />
                  </h3>

                  <p className="font-mono font-bold text-lg text-gray-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                {/* Icon and Arrow on desktop */}
                <div className="hidden md:flex items-center gap-4">
                  {/* Icon Container - desktop only */}
                  <div
                    className={`${service.color} ${
                      service.color === "bg-brutal-yellow"
                        ? "text-black"
                        : "text-white"
                    } w-12 h-12 flex items-center justify-center border-4 border-black shadow-neo group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon size={24} className="font-black" />
                  </div>

                  {/* Hover Arrow */}
                  <ArrowUpRight
                    size={32}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0 text-black"
                  />
                </div>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>

        {/* Footer Tag */}
        <div className="mt-16 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-black text-white font-mono px-4 py-2 text-sm font-bold border-4 border-black shadow-neo">
            <div className="w-2 h-2 bg-brutal-green animate-pulse rounded-full"></div>
            SERVICOS_ATIVOS
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
