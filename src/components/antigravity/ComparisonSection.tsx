import React from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

export const ComparisonSection: React.FC = () => {
  const beforeItems = [
    "Repetir instruções a cada conversa",
    "Configuração separada para cada ferramenta",
    "Sem padrões de engenharia definidos",
    "Tarefas manuais: branch, commit, PR...",
    "Código inconsistente entre projetos",
    "Comandos dispersos e não padronizados",
  ];

  const afterItems = [
    "GEMINI.md universal para ambos ambientes",
    "Uma config, funciona no Antigravity e Gemini CLI",
    "Boas práticas de engenharia integradas",
    "Comandos prontos: /create-feature, /open-pr",
    "Código consistente e padronizado",
    "Comandos TOML + MD organizados",
  ];

  return (
    <section className="py-20 bg-white border-y-4 border-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            SEM CONFIG{" "}
            <span className="bg-brutal-yellow px-3 border-2 border-black inline-block rotate-2">
              vs
            </span>{" "}
            COM CONFIG
          </h2>
          <p className="text-xl text-stone-600 font-medium">
            Veja a diferença que uma configuração unificada faz
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Before Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-stone-100 border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] relative"
          >
            <div className="absolute -top-4 -left-4 bg-red-500 text-white font-bold px-4 py-2 border-2 border-black text-sm">
              SEM CONFIG
            </div>
            <div className="space-y-4 mt-4">
              {beforeItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-red-500 p-1 border-2 border-black mt-0.5">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-stone-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* After Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-brutal-yellow border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] relative"
          >
            <div className="absolute -top-4 -right-4 bg-green-500 text-white font-bold px-4 py-2 border-2 border-black text-sm">
              COM ANTIGRAVITY
            </div>
            <div className="space-y-4 mt-4">
              {afterItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-green-500 p-1 border-2 border-black mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-black">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
