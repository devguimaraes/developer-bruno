import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatarUrl: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Lucas Mendes",
    role: "Full Stack Developer",
    company: "Startup Tech SP",
    content:
      "O Config Pack economizou horas do meu tempo. Antes eu ficava perdido configurando o Gemini CLI, agora é só copiar e começar. O GEMINI.md universal funciona perfeitamente nos dois ambientes.",
    rating: 5,
    avatarUrl:
      "https://ui-avatars.com/api/?name=Lucas+Mendes&background=facc15&color=000&bold=true&size=128",
  },
  {
    id: 2,
    name: "Carla Oliveira",
    role: "UX Designer & Dev",
    company: "Freelancer",
    content:
      "Comprei achando que seria só mais um produto. Me surpreendi com a qualidade dos comandos e do PDF explicativo. Valeu cada centavo. Recomendo demais!",
    rating: 5,
    avatarUrl:
      "https://ui-avatars.com/api/?name=Carla+Oliveira&background=f97316&color=fff&bold=true&size=128",
  },
  {
    id: 3,
    name: "Rafael Santos",
    role: "Tech Lead",
    company: "Fintech BR",
    content:
      "Uso Antigravity no trabalho e Gemini CLI em projetos pessoais. Ter uma config que funciona nos dois foi game changer. O suporte do Bruno também é excelente.",
    rating: 5,
    avatarUrl:
      "https://ui-avatars.com/api/?name=Rafael+Santos&background=000&color=fff&bold=true&size=128",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-stone-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-brutal-yellow px-4 py-2 font-mono text-sm font-bold border-2 border-black mb-4">
            PROVA SOCIAL
          </span>
          <h2 className="text-4xl md:text-5xl font-black">
            O QUE ESTÃO <span className="text-brutal-orange">DIZENDO</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-brutal-yellow mb-4" />

              {/* Content */}
              <p className="text-stone-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-brutal-yellow text-brutal-yellow"
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t-2 border-stone-200">
                <img
                  src={testimonial.avatarUrl}
                  alt={testimonial.name}
                  className="w-12 h-12 border-2 border-black"
                />
                <div>
                  <p className="font-bold text-black">{testimonial.name}</p>
                  <p className="text-sm text-stone-500">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { number: "50+", label: "Devs usando" },
            { number: "5.0", label: "Avaliação média" },
            { number: "100%", label: "Satisfação" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl md:text-5xl font-black text-brutal-orange">
                {stat.number}
              </p>
              <p className="font-mono text-sm text-stone-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
