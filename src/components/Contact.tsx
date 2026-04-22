import type React from "react";
import { useState } from "react";
import ShuffleText from "@/components/ui/ShuffleText";
import { ArrowUpRight, Mail } from "lucide-react";
import { contactData } from "@/config/site";
import ScrollReveal from "@/components/ui/ScrollReveal";
import BorderGlow from "@/components/ui/BorderGlow";

const Contact: React.FC = () => {
  const [showEmail, setShowEmail] = useState(false);

  return (
    <section
      id="contact"
      className="min-h-screen py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 text-black relative overflow-hidden flex flex-col justify-center"
    >
      <div className="w-full max-w-6xl mx-auto space-y-12 sm:space-y-16 md:space-y-32">
        <ScrollReveal direction="down">
          <div className="space-y-3 sm:space-y-4">
            <div className="type-ui-label text-[10px] md:text-xs opacity-40 mb-4">
              <ShuffleText text="// COMMUNICATION_PORT_OPEN" stagger={0.02} duration={0.8} />
            </div>
            <h2 className="type-display-section text-[16vw] leading-[0.9] sm:text-8xl md:text-[110px] font-black flex flex-col text-black">
              <span className="block mb-2 text-black">
                <ShuffleText text="LET'S" duration={1.2} />
              </span>
              <span className="text-transparent block" style={{ WebkitTextStroke: "2px black" }}>
                <ShuffleText text="CONNECT_" duration={1.2} delay={0.4} />
              </span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 md:gap-16 items-start">
          <div className="lg:col-span-7 space-y-8 sm:space-y-12">
            <ScrollReveal direction="up" delay={0.3}>
              <div className="relative group">
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-brutal-orange transition-all group-hover:-top-6 group-hover:-left-6" />
                <BorderGlow
                  glowColor="162 100% 27%"
                  borderRadius={0}
                  className="inline-block w-full"
                >
                  {!showEmail ? (
                    <button
                      type="button"
                      onClick={() => setShowEmail(true)}
                      className="block w-full p-6 sm:p-8 md:p-10 bg-white/5 backdrop-blur-md border-4 border-black shadow-brutal transition-all duration-500 overflow-hidden relative cursor-pointer hover:bg-stone-100"
                    >
                      <div className="flex flex-col items-center justify-center py-2 sm:py-4 gap-3 sm:gap-4 animate-in fade-in duration-700">
                        <Mail size={44} className="text-brutal-orange animate-pulse" />
                        <span className="type-display-card text-lg sm:text-xl font-black text-center">
                          [ ACCESS_SIGNAL_PORT ]
                        </span>
                        <span className="type-body text-sm opacity-80 text-center">
                          Click to decrypt contact address
                        </span>
                      </div>

                      {/* Background Text Decor */}
                      <div className="absolute -bottom-4 -right-4 font-pixel text-5xl sm:text-6xl tracking-[0.04em] opacity-5 select-none pointer-events-none font-black italic">
                        ENCRYPTED
                      </div>
                    </button>
                  ) : (
                    <div className="block p-6 sm:p-8 md:p-10 bg-black text-white border-4 border-black shadow-brutal transition-all duration-500 overflow-hidden relative">
                      <a
                        href={`mailto:${contactData.email}`}
                        className="animate-in slide-in-from-bottom-4 duration-500 block"
                      >
                        <span className="type-display-card text-[clamp(1.1rem,5vw,3rem)] leading-tight break-words block relative z-10 font-black">
                          {contactData.email}
                        </span>
                      </a>

                      {/* Background Text Decor */}
                      <div className="absolute -bottom-4 -right-4 font-pixel text-5xl sm:text-6xl tracking-[0.04em] opacity-5 select-none pointer-events-none font-black italic">
                        DECRYPTED
                      </div>
                    </div>
                  )}
                </BorderGlow>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5 space-y-8 sm:space-y-12 lg:pt-4">
            <div className="space-y-4 sm:space-y-6">
              <p className="type-ui-label text-[10px] opacity-30 font-bold text-black border-b border-black/10 pb-2">
                SOCIAL_NETWORKS
              </p>
              <div className="flex flex-col gap-3 sm:gap-4">
                {contactData.socialLinks.map((link, idx) => (
                  <ScrollReveal key={link.id} direction="left" delay={0.4 + idx * 0.1}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex justify-between items-center border-b-2 border-black/5 hover:border-black py-3 transition-all min-h-12"
                    >
                      <div className="flex items-center gap-4">
                        <span className="type-ui-label text-[10px] opacity-20">0{idx + 1}</span>
                        <span className="type-display-card text-lg md:text-2xl font-black group-hover:text-brutal-orange transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <ArrowUpRight
                        size={24}
                        className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-brutal-orange"
                      />
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            <div className="pt-3 sm:pt-6 opacity-40 type-body text-xs sm:text-sm uppercase text-black">
              DISCLAIMER: ESTE PORTFÓLIO É UMA DEMONSTRAÇÃO DE ENGENHARIA E DESIGN SYSTEM DE ALTA
              PERFORMANCE.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
