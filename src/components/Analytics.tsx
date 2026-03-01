import React, { useEffect } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { useCookieConsent } from "@/hooks/use-analytics";

/**
 * Brazilian market analytics component with Plausible (LGPD compliant) + Vercel Analytics
 */
const Analytics: React.FC = () => {
  useEffect(() => {
    // Only load analytics in production
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    // Privacy compliance: Only load analytics if user has consent
    const hasAnalyticsConsent =
      localStorage.getItem("analytics_consent") === "true";

    if (!hasAnalyticsConsent) {
      return;
    }

    // Load Plausible script (privacy-focused, no cookies)
    const script = document.createElement("script");
    script.src = "https://plausible.io/js/script.js";
    script.async = true;
    script.defer = true;
    script.setAttribute("data-domain", "devguimaraes.dev"); // Update with actual domain
    script.setAttribute("data-api", "https://plausible.io/api/event"); // For custom events

    script.onload = () => {
      console.log("✅ Analytics carregado (conformidade LGPD)");

      // Track page view
      if (window.plausible) {
        window.plausible("pageview");
      }
    };

    script.onerror = () => {
      console.error("❌ Falha ao carregar analytics");
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Render Vercel Analytics component
  return <VercelAnalytics />;
};

/**
 * Brazilian privacy disclosure component
 */
export const PrivacyDisclosure: React.FC = () => {
  const { hasConsent, giveConsent, withdrawConsent } = useCookieConsent();

  // Only show in Brazil or if no consent yet
  const shouldShowDisclosure = !hasConsent;

  if (!shouldShowDisclosure || process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 border-t-4 border-white z-50">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            <p className="font-mono mb-1">🇧🇷 PRIVACIDADE - CONFORMIDADE LGPD</p>
            <p className="text-xs text-gray-300">
              Usamos Plausible Analytics para insights de uso, sem cookies,
              totalmente em conformidade com LGPD.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={giveConsent}
              className="bg-brutal-orange text-black border-4 border-white px-4 py-2 font-black text-sm hover:bg-orange-400 transition-colors"
            >
              Aceitar
            </button>
            <button
              onClick={withdrawConsent}
              className="bg-transparent text-white border-4 border-white px-4 py-2 font-black text-sm hover:bg-white hover:text-black transition-colors"
            >
              Recusar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
