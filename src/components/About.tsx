import React from "react";
import avatar from "@/assets/avatar.jpg";
import { Code2, Cpu, Globe, User, MapPin, Calendar } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import { Typewriter } from "@/components/ui/typewriter";
import { TextReveal } from "@/components/ui/motion-components";

const About: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <section id={id} className="py-24 bg-white relative">
      {/* Diagonal Stripes Background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[repeating-linear-gradient(45deg,#000,#000_2px,#fff_2px,#fff_10px)] opacity-5 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-2xl border-4 border-brutal-orange">
            01
          </div>
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
            <TextReveal text="SOBRE_MIM" />
          </h2>
          <div className="h-2 flex-1 bg-black hidden md:block"></div>
        </div>

        {/* Main Content "Card" */}
        <ScrollAnimation variant="scaleIn" duration={0.6}>
          <div className="border-4 border-black bg-stone-50 shadow-brutal-lg">
            {/* Window Header */}
            <div className="bg-black text-white p-3 flex justify-between items-center border-b-4 border-black">
              <div className="font-mono text-sm font-bold flex items-center gap-2">
                <User size={16} className="text-brutal-yellow" />
                PERFIL_USUARIO.JSON
              </div>
              <div className="flex gap-2">
                <div className="w-4 h-4 bg-red-500 border border-white/50"></div>
                <div className="w-4 h-4 bg-yellow-500 border border-white/50"></div>
                <div className="w-4 h-4 bg-green-500 border border-white/50"></div>
              </div>
            </div>

            <div className="p-6 md:p-12 grid md:grid-cols-12 gap-12">
              {/* Avatar Column */}
              <div className="md:col-span-4 flex flex-col items-center md:items-start">
                <div className="relative w-full max-w-[300px]">
                  <div className="aspect-square rounded-full bg-brutal-orange border-4 border-black p-2 overflow-hidden relative">
                    <ImageWithSkeleton
                      src={avatar}
                      alt="Bruno Guimarães"
                      className="w-full h-full object-cover rounded-full border-2 border-black contrast-110"
                      wrapperClassName="w-full h-full"
                    />
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 right-0 md:-bottom-2 md:-right-2 bg-white border-4 border-black p-3 shadow-neo z-20 rounded-lg">
                    <div className="flex items-center gap-2 font-bold font-mono text-xs">
                      <div className="w-3 h-3 bg-brutal-green rounded-full"></div>
                      ONLINE
                    </div>
                  </div>
                </div>

                {/* Info Tags */}
                <div className="mt-12 space-y-3 font-mono text-sm w-full">
                  <div className="flex items-center gap-3 border-b-2 border-gray-300 pb-2">
                    <MapPin size={16} />
                    <span className="font-bold">LOCAL:</span>
                    <span>Rio de Janeiro</span>
                  </div>
                  <div className="flex items-center gap-3 border-b-2 border-gray-300 pb-2">
                    <Calendar size={16} />
                    <span className="font-bold">EXP:</span>
                    <span>+5 Anos</span>
                  </div>
                  <div className="flex items-center gap-3 border-b-2 border-gray-300 pb-2">
                    <Code2 size={16} />
                    <span className="font-bold">CARGO:</span>
                    <span>Dev. Front-end</span>
                  </div>
                </div>
              </div>

              {/* Text Column */}
              <div className="md:col-span-8 flex flex-col justify-center space-y-8">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight sm:leading-none">
                  <TextReveal text="Eu crio interfaces de" />{" "}
                  <span className="bg-brutal-yellow px-2 border-2 border-black shadow-neo inline-block">
                    <TextReveal text="alta performance" delay={0.3} />
                  </span>{" "}
                  <TextReveal text="para a web." delay={0.6} />
                </h3>

                <Typewriter
                  text="Com 5 anos de experiência em desenvolvimento front‑end e formação em Desenvolvimento Web pelo Senac‑RJ, transformo conceitos de design em interfaces reais, rápidas e funcionais para sites e softwares."
                  className="text-lg text-stone-600 leading-relaxed font-medium"
                  speed={0.03} // Slower for better readability
                  delay={0.2}
                  variant="mechanical"
                />

                <div className="p-6 bg-white border-4 border-black relative">
                  <div className="absolute -top-3 left-4 bg-black text-white px-2 font-mono text-xs font-bold uppercase">
                    Valores_Centrais
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-black flex items-center gap-2">
                        <Cpu size={20} /> OTIMIZADO
                      </h4>
                      <p className="text-sm text-gray-500">
                        Código limpo que roda rápido em qualquer dispositivo.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-black flex items-center gap-2">
                        <Globe size={20} /> ESCALÁVEL
                      </h4>
                      <p className="text-sm text-gray-500">
                        Arquiteturas construídas para crescer com seu negócio.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {["Criativo", "Lógico", "Preciso"].map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs border border-black px-2 py-1 bg-gray-200 text-gray-600"
                    >
                      #{tag.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default About;
