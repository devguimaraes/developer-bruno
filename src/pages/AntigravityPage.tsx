import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/antigravity/HeroSection";
import ComparisonSection from "@/components/antigravity/ComparisonSection";
import FeaturesSection from "@/components/antigravity/FeaturesSection";
import PricingSection from "@/components/antigravity/PricingSection";
import FAQSection from "@/components/antigravity/FAQSection";
import CheckoutModal from "@/components/antigravity/CheckoutModal";
import TestimonialsSection from "@/components/antigravity/TestimonialsSection";
import UrgencyBanner from "@/components/antigravity/UrgencyBanner";
import LeadMagnetSection from "@/components/antigravity/LeadMagnetSection";

const AntigravityPage: React.FC = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  return (
    <>
      <Helmet>
        <title>
          Gemini Config Pack | Configuração para Antigravity e Gemini CLI
        </title>
        <meta
          name="description"
          content="Uma única configuração para Antigravity e Gemini CLI. GEMINI.md universal, comandos TOML + MD, guia em PDF. Pagamento único via PIX."
        />
        <meta
          name="keywords"
          content="Gemini CLI, Antigravity, GEMINI.md, configuração, produtividade, comandos TOML, comandos MD, automação"
        />
        <meta property="og:title" content="Gemini Config Pack - 2 em 1" />
        <meta
          property="og:description"
          content="Uma config para Antigravity e Gemini CLI. GEMINI.md universal + comandos TOML/MD + Guia PDF."
        />
        <meta property="og:type" content="product" />
        <meta
          property="og:url"
          content="https://brunoguimaraes.dev/antigravity"
        />
        <link rel="canonical" href="https://brunoguimaraes.dev/antigravity" />

        {/* Product structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Gemini Config Pack",
            description:
              "Configuração universal para Antigravity e Gemini CLI. GEMINI.md otimizado, comandos TOML e MD, guia em PDF.",
            offers: {
              "@type": "Offer",
              price: "47.00",
              priceCurrency: "BRL",
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Person",
                name: "Bruno Guimarães",
              },
            },
          })}
        </script>
      </Helmet>

      <main className="min-h-screen">
        <UrgencyBanner />
        <HeroSection onBuyClick={openCheckout} />
        <ComparisonSection />
        <FeaturesSection />
        <TestimonialsSection />
        <LeadMagnetSection />
        <PricingSection onBuyClick={openCheckout} />
        <FAQSection />

        {/* Footer CTA */}
        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              PRONTO PARA <span className="text-brutal-yellow">DOMINAR</span>{" "}
              ANTIGRAVITY E GEMINI CLI?
            </h2>
            <p className="text-xl text-stone-300 mb-8">
              Uma configuração, dois ambientes. Comece agora.
            </p>
            <button
              onClick={openCheckout}
              className="bg-brutal-orange text-white font-bold text-xl px-10 py-5 border-4 border-white shadow-[8px_8px_0px_0px_#facc15] hover:shadow-[4px_4px_0px_0px_#facc15] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              GARANTIR MEU ACESSO POR R$ 47
            </button>
          </div>
        </section>
      </main>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />
    </>
  );
};

export default AntigravityPage;
