import React from "react";
import { motion } from "framer-motion";
import {
  FileCode2,
  BookOpen,
  Terminal,
  GitBranch,
  Search,
  FileCheck,
  Scissors,
  Shield,
  Layers,
} from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
}

interface Command {
  icon: React.ReactNode;
  name: string;
  description: string;
}

export const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <FileCode2 className="w-8 h-8" />,
      title: "6 Skills Modularizadas",
      description:
        "Planning, Software Engineering, React, TypeScript, Code Review e Writing. Cada skill é um guia especializado que melhora a qualidade do seu código.",
      tag: "PRINCIPAL",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "GEMINI.md Universal",
      description:
        "Arquivo de regras otimizado, compatível com Antigravity e Gemini CLI. Referencia as skills automaticamente.",
    },
    {
      icon: <Terminal className="w-8 h-8" />,
      title: "Guia PDF + Comandos",
      description:
        "Manual completo de configuração + comandos TOML/MD para ambos os ambientes. Inclui dicas de economia de tokens.",
      tag: "BÔNUS",
    },
  ];

  const antigravityCommands: Command[] = [
    {
      icon: <GitBranch className="w-5 h-5" />,
      name: "/create-feature",
      description: "Cria feature com worktree",
    },
    {
      icon: <Search className="w-5 h-5" />,
      name: "/investigate",
      description: "Descoberta sistemática",
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      name: "/open-pr",
      description: "PR com diagramas Mermaid",
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      name: "/review-staged",
      description: "Review de código staged",
    },
    {
      icon: <Scissors className="w-5 h-5" />,
      name: "/trim",
      description: "Reduz PR descriptions",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      name: "/audit",
      description: "Auditoria de segurança",
    },
  ];

  const geminiCliCommands: Command[] = [
    {
      icon: <GitBranch className="w-5 h-5" />,
      name: "/create-feature",
      description: "Cria feature com worktree",
    },
    {
      icon: <Search className="w-5 h-5" />,
      name: "/investigate",
      description: "Descoberta sistemática",
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      name: "/open-pr",
      description: "PR com diagramas Mermaid",
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      name: "/review-staged",
      description: "Review de código staged",
    },
    {
      icon: <Scissors className="w-5 h-5" />,
      name: "/trim",
      description: "Reduz PR descriptions",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      name: "/audit",
      description: "Auditoria de segurança",
    },
  ];

  return (
    <section className="py-20 bg-stone-100 border-y-4 border-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            O QUE VEM NO{" "}
            <span className="bg-brutal-orange text-white px-3 border-2 border-black inline-block -rotate-1">
              PACOTE
            </span>
          </h2>
          <p className="text-xl text-stone-600 font-medium">
            Uma configuração, dois ambientes: Antigravity e Gemini CLI
          </p>
        </motion.div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all relative"
            >
              {feature.tag && (
                <div className="absolute -top-3 -right-3 bg-brutal-yellow text-black font-bold px-3 py-1 border-2 border-black text-xs">
                  {feature.tag}
                </div>
              )}
              <div className="bg-black text-white p-3 inline-block mb-4 border-2 border-black">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black mb-2 font-mono">
                {feature.title}
              </h3>
              <p className="text-stone-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Skills Grid Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black mb-2">
              <span className="bg-brutal-yellow px-4 py-2 inline-block border-2 border-black">
                🎯 AS 6 SKILLS INCLUÍDAS
              </span>
            </h3>
            <p className="text-stone-600 mt-4 font-medium">
              Cada skill é um guia especializado que o Gemini usa para melhorar
              seu código
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                emoji: "📋",
                name: "planning",
                desc: "Arquitetura e decisões técnicas",
              },
              {
                emoji: "⚙️",
                name: "software-engineering",
                desc: "Princípios core (KISS, YAGNI)",
              },
              { emoji: "⚛️", name: "react", desc: "React 19 + Next.js" },
              { emoji: "📘", name: "typescript", desc: "Type-safety e2e" },
              {
                emoji: "🔍",
                name: "reviewing-code",
                desc: "Code review guidelines",
              },
              { emoji: "✍️", name: "writing", desc: "Documentação clara" },
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <div className="text-2xl mb-2">{skill.emoji}</div>
                <h4 className="font-mono font-bold text-sm text-brutal-orange">
                  {skill.name}
                </h4>
                <p className="text-xs text-stone-600 mt-1">{skill.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Commands Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black mb-2">
              <span className="bg-black text-white px-4 py-2 inline-block border-2 border-black">
                <Layers className="inline w-5 h-5 mr-2" />
                COMANDOS POR AMBIENTE
              </span>
            </h3>
            <p className="text-stone-600 mt-4 font-medium">
              Mesmos comandos, formatos diferentes: TOML para Antigravity, MD
              para Gemini CLI
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Antigravity Commands */}
            <div className="bg-brutal-yellow border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000]">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-black">
                <Terminal className="w-6 h-6" />
                <h4 className="font-black text-lg">ANTIGRAVITY</h4>
                <span className="ml-auto bg-black text-white px-2 py-1 text-xs font-mono">
                  .md
                </span>
              </div>
              <div className="space-y-3">
                {antigravityCommands.map((cmd, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {cmd.icon}
                    <span className="font-mono font-bold">{cmd.name}</span>
                    <span className="text-stone-700 text-xs hidden sm:inline">
                      — {cmd.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gemini CLI Commands */}
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000]">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-black">
                <Terminal className="w-6 h-6" />
                <h4 className="font-black text-lg">GEMINI CLI</h4>
                <span className="ml-auto bg-brutal-orange text-white px-2 py-1 text-xs font-mono">
                  .toml
                </span>
              </div>
              <div className="space-y-3">
                {geminiCliCommands.map((cmd, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {cmd.icon}
                    <span className="font-mono font-bold">{cmd.name}</span>
                    <span className="text-stone-600 text-xs hidden sm:inline">
                      — {cmd.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
