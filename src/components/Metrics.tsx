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

const Metrics: React.FC = () => {
  return (
    <section className="py-12 bg-black text-white border-y-4 border-white/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1  md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-stone-800">
          {/* Stat 1 */}
          <div className="p-6 flex items-center justify-between group">
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
          <div className="p-6 flex items-center justify-between group">
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
          <div className="p-6 flex items-center justify-between group">
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
