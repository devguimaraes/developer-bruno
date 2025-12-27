import React, { useEffect, useRef } from "react";
import { TrendingUp, Users, Clock } from "lucide-react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

const Counter: React.FC<{ value: number; duration?: number }> = ({
  value,
  duration = 2,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
    duration: duration * 1000,
  });
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
};

type MetricsProps = React.HTMLAttributes<HTMLElement>;

const Metrics: React.FC<MetricsProps> = ({ className, ...props }) => {
  return (
    <section
      {...props}
      className={`py-16 bg-black text-white border-y-4 border-brutal-yellow relative overflow-hidden ${
        className ?? ""
      }`}
    >
      {/* Neo-Brutalist Background Pattern */}
      <div className="absolute inset-0 bg-neo-dots opacity-5 pointer-events-none" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-brutal-orange/10 to-transparent" />
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-brutal-purple/10 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-brutal-yellow/30">
          {/* Stat 1 */}
          <div className="p-8 flex items-center justify-between group hover:bg-white/5 transition-colors">
            <div>
              <p className="font-mono text-stone-500 text-xs mb-1">NIVEL_XP</p>
              <h3 className="text-5xl font-black text-brutal-yellow group-hover:translate-x-2 transition-transform flex items-center">
                <Counter value={5} />
                <span className="text-2xl text-white ml-1">+</span>
              </h3>
              <p className="font-bold text-sm uppercase tracking-widest mt-2">
                Anos de Experiência
              </p>
            </div>
            <Clock
              size={40}
              className="text-brutal-yellow opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
            />
          </div>

          {/* Stat 2 */}
          <div className="p-8 flex items-center justify-between group hover:bg-white/5 transition-colors">
            <div>
              <p className="font-mono text-stone-500 text-xs mb-1">
                PROJETOS_CONCLUIDOS
              </p>
              <h3 className="text-5xl font-black text-brutal-orange group-hover:translate-x-2 transition-transform flex items-center">
                <Counter value={42} />
                <span className="text-2xl text-white ml-1">x</span>
              </h3>
              <p className="font-bold text-sm uppercase tracking-widest mt-2">
                Deploys com Sucesso
              </p>
            </div>
            <TrendingUp
              size={40}
              className="text-brutal-orange opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
            />
          </div>

          {/* Stat 3 */}
          <div className="p-8 flex items-center justify-between group hover:bg-white/5 transition-colors">
            <div>
              <p className="font-mono text-stone-500 text-xs mb-1">
                SATISFACAO_CLIENTE
              </p>
              <h3 className="text-5xl font-black text-brutal-purple group-hover:translate-x-2 transition-transform flex items-center">
                <Counter value={100} />
                <span className="text-2xl text-white ml-1">%</span>
              </h3>
              <p className="font-bold text-sm uppercase tracking-widest mt-2">
                Avaliações 5 Estrelas
              </p>
            </div>
            <Users
              size={40}
              className="text-brutal-purple opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Metrics;
