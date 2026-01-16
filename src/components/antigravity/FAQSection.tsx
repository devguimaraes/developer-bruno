import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "O que são as 6 Skills incluídas?",
      answer:
        "São guias especializados que o Gemini usa para melhorar seu código: Planning (arquitetura), Software Engineering (princípios KISS/YAGNI), React (React 19), TypeScript (type-safety), Reviewing Code (code review) e Writing (documentação). Cada skill é um arquivo .md modular.",
    },
    {
      question: "Como recebo os arquivos após o pagamento?",
      answer:
        "Após a confirmação do pagamento via PIX, você receberá automaticamente um link de download na mesma página. O link também será enviado para o seu e-mail.",
    },
    {
      question: "Funciona com Antigravity e Gemini CLI?",
      answer:
        "Sim! O GEMINI.md e as 6 skills funcionam em ambos os ambientes. Os comandos vêm em dois formatos: MD para Antigravity e TOML para Gemini CLI.",
    },
    {
      question: "Posso usar em múltiplos projetos?",
      answer:
        "Sim! A licença é pessoal e você pode usar as configurações em todos os seus projetos. As skills são instaladas globalmente.",
    },
    {
      question: "Recebo atualizações futuras?",
      answer:
        "Sim! Todas as atualizações do pacote são vitalícias. Quando lançarmos novas skills ou melhorias, você receberá acesso automaticamente.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
            PERGUNTAS{" "}
            <span className="bg-black text-white px-3 border-2 border-black inline-block rotate-1">
              FREQUENTES
            </span>
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_#000]"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-stone-50 transition-colors"
              >
                <span className="font-bold text-lg pr-4">{item.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-black p-1 border-2 border-black"
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 border-t-2 border-black bg-brutal-yellow">
                      <p className="text-stone-800">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
