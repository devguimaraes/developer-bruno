import React from "react";

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

interface ContactProps {
  id?: string;
  style?: React.CSSProperties;
  className?: string;
}

const Contact: React.FC<ContactProps> = ({ id, style, className }) => {


  return (
    <section
      id={id}
      style={style}
      className={`py-24 bg-brutal-bg border-t-4 border-black relative overflow-hidden ${
        className ?? ""
      }`}
    >
      {/* Warning Stripes Background */}
      <div className="absolute top-0 left-0 w-full h-6 caution-stripes" />
      <div className="absolute bottom-0 left-0 w-full h-6 caution-stripes" />

      {/* Neo-Brutalist Pattern Background */}
      <div className="absolute inset-0 bg-neo-dots opacity-[0.02] pointer-events-none" />

      {/* Decorative Geometric Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 border-4 border-brutal-orange rotate-12 opacity-20" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-brutal-yellow rotate-45 opacity-20" />
      <div className="absolute top-1/2 left-10 w-16 h-16 border-4 border-black -rotate-12 opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 text-center relative">
          {/* Corner Decorations */}
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-brutal-orange border-2 border-black" />
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-brutal-yellow border-2 border-black" />
          <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-brutal-purple border-2 border-black" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-brutal-green border-2 border-black" />
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
              {contactData.socialLinks.map((item) => {
                const IconComponent = iconMap[item.icon as unknown as keyof typeof iconMap];
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center shadow-neo group-hover:bg-brutal-yellow group-hover:-translate-y-2 group-hover:shadow-brutal-lg transition-all duration-300">
                      {IconComponent && (
                        <IconComponent size={28} className="text-black" />
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {item.label}
                    </span>
                    <span className="font-mono text-[10px] text-stone-500 opacity-0 group-hover:opacity-100 transition-all duration-300">
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
