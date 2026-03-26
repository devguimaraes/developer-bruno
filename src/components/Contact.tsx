import React, { useState } from "react";
import ShuffleText from "@/components/ui/ShuffleText";
import { ArrowUpRight, Mail } from "lucide-react";
import { contactData } from "@/config/site";
import ScrollReveal from "@/components/ui/ScrollReveal";
import BorderGlow from "@/components/ui/BorderGlow";

const Contact: React.FC = () => {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <section id="contact" className="min-h-screen py-24 px-8 md:px-16 text-black relative overflow-hidden flex flex-col justify-center">
      <div className="w-full max-w-6xl mx-auto space-y-32">
        <ScrollReveal direction="down">
          <div className="space-y-4">
            <div className="font-pixel text-[10px] md:text-xs tracking-[0.4em] opacity-40 uppercase mb-4">
              <ShuffleText text="// COMMUNICATION_PORT_OPEN" stagger={0.02} duration={0.8} />
            </div>
            <h2 className="text-6xl sm:text-8xl md:text-[110px] font-black font-pixel leading-[0.8] tracking-tighter flex flex-col uppercase text-black">
              <span className="block mb-2 text-black">
                <ShuffleText text="LET'S" duration={1.2} />
              </span>
              <span className="text-transparent block" style={{ WebkitTextStroke: "2px black" }}>
                <ShuffleText 
                  text="CONNECT_" 
                  duration={1.2} 
                  delay={0.4} 
                />
              </span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-12">
            <ScrollReveal direction="up" delay={0.3}>
              <div className="relative group">
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-brutal-orange transition-all group-hover:-top-6 group-hover:-left-6" />
                <BorderGlow 
                  glowColor="162 100% 27%" 
                  borderRadius={0} 
                  className="inline-block w-full"
                >
                  <div 
                    onClick={() => setShowEmail(true)}
                    className={`block p-10 bg-white/5 backdrop-blur-md border-4 border-black shadow-brutal transition-all duration-500 overflow-hidden relative cursor-pointer ${showEmail ? 'bg-black text-white' : 'hover:bg-stone-100'}`}
                  >
                    {!showEmail ? (
                      <div className="flex flex-col items-center justify-center py-4 gap-4 animate-in fade-in duration-700">
                        <Mail size={48} className="text-brutal-orange animate-pulse" />
                        <span className="font-pixel text-xl uppercase tracking-[0.3em] font-black">
                          [ ACCESS_SIGNAL_PORT ]
                        </span>
                        <span className="font-pixel text-[10px] opacity-40 uppercase">Click to decrypt contact address</span>
                      </div>
                    ) : (
                      <a 
                        href={`mailto:${contactData.email}`}
                        className="animate-in slide-in-from-bottom-4 duration-500 block"
                      >
                        <span className="font-pixel text-xl md:text-5xl leading-none uppercase break-all block relative z-10 font-black">
                          {contactData.email}
                        </span>
                      </a>
                    )}
                    
                    {/* Background Text Decor */}
                    <div className="absolute -bottom-4 -right-4 font-pixel text-6xl opacity-5 select-none pointer-events-none font-black italic">
                      {showEmail ? 'DECRYPTED' : 'ENCRYPTED'}
                    </div>
                  </div>
                </BorderGlow>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5 space-y-12 lg:pt-4">
            <div className="space-y-6">
              <p className="font-pixel text-[10px] opacity-30 tracking-[0.3em] uppercase font-bold text-black border-b border-black/10 pb-2">
                SOCIAL_NETWORKS
              </p>
              <div className="flex flex-col gap-6">
                {contactData.socialLinks.map((link, idx) => (
                  <ScrollReveal key={link.id} direction="left" delay={0.4 + (idx * 0.1)}>
                    <a 
                      href={link.href}
                      target="_blank"
                      className="group flex justify-between items-center border-b-2 border-black/5 hover:border-black pb-4 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-pixel text-[10px] opacity-20">0{idx + 1}</span>
                        <span className="font-pixel text-lg md:text-2xl uppercase tracking-widest font-black group-hover:text-brutal-orange transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <ArrowUpRight size={24} className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-brutal-orange" />
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </div>
            
            <div className="pt-8 opacity-20 font-pixel text-[9px] tracking-[0.2em] leading-relaxed uppercase font-bold text-black">
              DISCLAIMER: ESTE PORTFÓLIO É UMA DEMONSTRAÇÃO DE ENGENHARIA E DESIGN SYSTEM DE ALTA PERFORMANCE.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
