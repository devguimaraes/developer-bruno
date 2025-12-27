import React from "react";
import { motion } from "framer-motion";
import { NeoButton } from "@/components/ui/NeoButton";
import { Zap, Check, ArrowRight } from "lucide-react";

interface PricingSectionProps {
  onBuyClick: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onBuyClick,
}) => {
  const includedItems = [
    "GEMINI.md universal (Antigravity + Gemini CLI)",
    "GEMINI-verbose.md com explicações",
    "6 comandos TOML para Antigravity",
    "6 comandos MD para Gemini CLI",
    "Guia em PDF",
    "Atualizações vitalícias",
  ];

  return (
    <section className="py-20 bg-brutal-bg">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto"
        >
          {/* Pricing Card */}
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] relative">
            {/* Header */}
            <div className="bg-black text-white p-6 text-center">
              <div className="inline-flex items-center gap-2 bg-brutal-yellow text-black px-4 py-1 font-mono text-sm font-bold mb-4 border-2 border-black">
                <Zap className="w-4 h-4" />
                PAGAMENTO ÚNICO
              </div>
              <h3 className="text-2xl font-black mb-2">GEMINI CONFIG PACK</h3>
              <p className="text-stone-300 text-sm">
                Uma config para Antigravity e Gemini CLI
              </p>
            </div>

            {/* Price */}
            <div className="p-8 text-center border-b-4 border-black">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-stone-400 line-through">
                  R$ 97
                </span>
                <span className="bg-green-500 text-white px-2 py-1 text-sm font-bold border-2 border-black">
                  -52%
                </span>
              </div>
              <div className="mt-2">
                <span className="text-6xl font-black">R$ 47</span>
                <span className="text-xl font-bold text-stone-600">,00</span>
              </div>
              <p className="mt-2 text-stone-500 font-mono text-sm">
                Pagamento via PIX
              </p>
            </div>

            {/* Features */}
            <div className="p-8 space-y-4">
              {includedItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-green-500 p-1 border-2 border-black">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="p-8 pt-0">
              <NeoButton
                onClick={onBuyClick}
                fullWidth
                className="bg-brutal-orange text-white text-xl py-5 shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000]"
              >
                COMPRAR AGORA
                <ArrowRight className="ml-2 w-6 h-6" />
              </NeoButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
