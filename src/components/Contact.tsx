import React from "react";
import { NeoButton } from "@/components/ui/NeoButton";
import { contactData } from "@/config/site";
import { Linkedin, Github, Instagram, Mail, Send, Clock } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { TextReveal } from "@/components/ui/motion-components";

// Dynamic icon import helper
const iconMap: Record<string, LucideIcon> = {
  Linkedin,
  Github,
  Instagram,
  Mail,
  Send,
};

const Contact: React.FC<{ id?: string }> = ({ id }) => {
  const handleEmailContact = () => {
    const subject = encodeURIComponent(
      "Proposta de Projeto - Portfolio Contact"
    );
    const body = encodeURIComponent(`Olá Bruno,

Vi seu portfólio e gostaria de discutir um projeto.

[Descreva brevemente seu projeto aqui]

Aguardo seu retorno!`);

    window.location.href = `mailto:${contactData.email}?subject=${subject}&body=${body}`;
  };

  const handleLinkedInContact = () => {
    // Enhanced LinkedIn message URL
    const message = encodeURIComponent(
      "Olá Bruno! Vim através do seu portfólio e gostaria de discutir uma oportunidade de projeto."
    );
    window.open(
      `${contactData.socialLinks[0].href}?message=${message}`,
      "_blank"
    );
  };

  return (
    <section
      id={id}
      className="py-24 bg-white border-t-4 border-black relative overflow-hidden"
    >
      {/* Warning Stripes Background */}
      <div className="absolute top-0 left-0 w-full h-4 caution-stripes"></div>
      <div className="absolute bottom-0 left-0 w-full h-4 caution-stripes"></div>

      {/* Circuit Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-black rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-black transform rotate-45"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-black transform rotate-12"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto bg-stone-100 border-4 border-black shadow-brutal-lg p-8 md:p-12 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1 font-mono font-bold text-sm mb-6 rounded-full animate-pulse">
            <div className="w-2 h-2 bg-brutal-green rounded-full animate-ping"></div>
            CANAL_ABERTO • RESPONDO EM 24H
          </div>

          {/* Main Heading */}
          <h2 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            <TextReveal text="PRONTO PARA" />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brutal-orange to-red-600 inline-block">
              <TextReveal text="CONSTRUIR" delay={0.3} />
            </span>
            <br />
            <TextReveal text="JUNTOS?" delay={0.6} />
          </h2>

          <p className="text-xl md:text-2xl font-bold text-stone-600 mb-12 max-w-3xl mx-auto">
            {contactData.description}
          </p>

          {/* Social Links */}
          <div className="mb-12">
            <h3 className="font-mono text-sm text-black font-bold mb-6">
              // CONECTE-SE
            </h3>
            <div className="flex justify-center gap-6 flex-wrap">
              {contactData.socialLinks.map((item, idx) => {
                const IconComponent = iconMap[item.icon];
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 transform hover:scale-110 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center shadow-neo group-hover:-translate-y-1 group-hover:shadow-brutal-lg transition-all">
                      {IconComponent && (
                        <IconComponent size={28} className="text-black" />
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {item.label}
                    </span>
                    <span className="font-mono text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                      @{item.username}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 p-6 bg-black text-white border-4 border-black">
            <div className="flex items-center justify-center gap-3">
              <Clock size={20} />
              <span className="font-mono text-sm">
                STATUS: DISPONÍVEL PARA NOVOS PROJETOS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
