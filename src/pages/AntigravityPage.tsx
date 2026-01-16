import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/antigravity/HeroSection";
import ComparisonSection from "@/components/antigravity/ComparisonSection";
import FeaturesSection from "@/components/antigravity/FeaturesSection";
import PricingSection from "@/components/antigravity/PricingSection";
import FAQSection from "@/components/antigravity/FAQSection";
import CheckoutModal from "@/components/antigravity/CheckoutModal";
import TestimonialsSection from "@/components/antigravity/TestimonialsSection";
import UrgencyBanner from "@/components/antigravity/UrgencyBanner";

const AntigravityPage: React.FC = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Garante que a página sempre carregue no topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  return (
    <>
      <Helmet>
        <title>
          Gemini Config Pack | 6 Skills + Comandos para Antigravity e Gemini CLI
        </title>
        <meta
          name="description"
          content="6 skills modularizadas (React, TypeScript, Planning...) + comandos prontos para Antigravity e Gemini CLI. Melhore seu código com padrões de engenharia."
        />
        <meta
          name="keywords"
          content="Gemini CLI, Antigravity, skills, planning, software engineering, react, typescript, code review, writing, GEMINI.md"
        />
        <meta
          property="og:title"
          content="Gemini Config Pack - 6 Skills + Comandos"
        />
        <meta
          property="og:description"
          content="6 skills modularizadas + comandos prontos para Antigravity e Gemini CLI. React, TypeScript, Planning e mais."
        />
        <meta property="og:type" content="product" />
        <meta
          property="og:url"
          content="https://www.devguimaraes.com.br/antigravity"
        />
        <link
          rel="canonical"
          href="https://www.devguimaraes.com.br/antigravity"
        />

        {/* Product structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Gemini Config Pack",
            description:
              "6 skills modularizadas + comandos prontos para Antigravity e Gemini CLI. Planning, React, TypeScript, Software Engineering, Code Review e Writing.",
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
