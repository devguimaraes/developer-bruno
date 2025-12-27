import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials, socialProofStats } from "@/data/testimonials";

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
          {socialProofStats.map((stat) => (
            <div key={stat.label} className="text-center">
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
