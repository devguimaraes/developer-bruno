import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Mail, CheckCircle, ArrowRight, FileText } from "lucide-react";

const LeadMagnetSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call - replace with actual email collection service
    // Options: Mailchimp, ConvertKit, Buttondown, or your own backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsLoading(false);

    // Track conversion with Plausible Analytics
    if (typeof window !== "undefined") {
      const win = window as Window & { plausible?: (event: string) => void };
      win.plausible?.("Lead Magnet Signup");
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 bg-brutal-yellow">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h3 className="text-3xl font-black mb-4">PRONTO! 🎉</h3>
            <p className="text-xl mb-4">
              Confira seu email para baixar o mini-guia gratuito.
            </p>
            <p className="text-stone-700">
              Enquanto isso, que tal garantir o Config Pack completo?
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-brutal-yellow border-y-4 border-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-8 h-8" />
                <span className="font-mono font-bold bg-black text-white px-3 py-1">
                  GRÁTIS
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-4">
                MINI-GUIA: <br />
                <span className="text-brutal-orange">
                  5 COMANDOS ESSENCIAIS
                </span>
              </h3>

              <p className="text-lg text-stone-700 mb-6">
                Receba gratuitamente os 5 comandos mais úteis para começar com
                Gemini CLI ou Antigravity. Um aperitivo do Config Pack completo.
              </p>

              <ul className="space-y-2 mb-6">
                {[
                  "Comando para debug inteligente",
                  "Comando para refatoração rápida",
                  "Comando para documentação automática",
                  "2 comandos bônus secretos",
                  "Instruções de instalação",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brutal-orange" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block font-bold mb-2 text-sm"
                  >
                    SEU MELHOR EMAIL:
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="dev@exemplo.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border-4 border-black font-mono focus:outline-none focus:border-brutal-orange transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white font-bold py-4 border-4 border-black hover:bg-brutal-orange transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    "ENVIANDO..."
                  ) : (
                    <>
                      QUERO O MINI-GUIA GRÁTIS
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-stone-500 text-center">
                  Sem spam. Você pode cancelar quando quiser.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetSection;
