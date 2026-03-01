import { useState } from "react";
import type { ExtendedNavigator } from "./useWebVitals";

/**
 * Hook para enviar eventos ao Plausible (LGPD compliant)
 */
export const usePlausible = () => {
  const sendEvent = (
    eventName: string,
    props?: Record<string, string | number | boolean>
  ) => {
    // Only send events in production and with consent
    if (
      process.env.NODE_ENV !== "production" ||
      typeof window === "undefined" ||
      !window.plausible ||
      localStorage.getItem("analytics_consent") !== "true"
    ) {
      return;
    }

    try {
      window.plausible(eventName, {
        props: {
          ...props,
          // Add Brazilian market context
          market: "brasil",
          language: "pt-BR",
          version: "1.0",
        },
      });
    } catch (error) {
      console.error("Erro ao enviar evento para analytics:", error);
    }
  };

  return { sendEvent };
};

/**
 * Hook para tracking de eventos específicos do portfólio
 */
export const usePortfolioAnalytics = () => {
  const { sendEvent } = usePlausible();

  return {
    // Track project interactions
    trackProjectView: (projectTitle: string, technologies: string[]) => {
      sendEvent("portfolio_project_view", {
        project: projectTitle,
        technologies: technologies.join(","),
        section: "projects",
      });
    },

    // Track contact attempts
    trackContactAttempt: (method: "linkedin" | "email" | "instagram") => {
      sendEvent("portfolio_contact_attempt", {
        method,
        section: "contact",
      });
    },

    // Track CTA clicks
    trackCTAClick: (ctaText: string, section: string) => {
      sendEvent("portfolio_cta_click", {
        cta_text: ctaText,
        section: section,
      });
    },

    // Track navigation
    trackNavigation: (section: string) => {
      sendEvent("portfolio_navigation", {
        section: section,
      });
    },

    // Track time on page
    trackTimeOnPage: (duration: number, section?: string) => {
      sendEvent("portfolio_time_on_page", {
        duration_seconds: Math.round(duration),
        section: section || "unknown",
      });
    },

    // Track scroll depth
    trackScrollDepth: (depth: number) => {
      sendEvent("portfolio_scroll_depth", {
        depth_percent: depth,
      });
    },

    // Track form submissions (when implemented)
    trackFormSubmission: (formType: string, success: boolean) => {
      sendEvent("portfolio_form_submission", {
        form_type: formType,
        success: success,
      });
    },

    // Track performance metrics
    trackPerformance: (metric: string, value: number) => {
      sendEvent("portfolio_performance", {
        metric: metric,
        value: value,
      });
    },

    // Track device information for Brazilian market
    trackDeviceInfo: () => {
      const deviceInfo = {
        platform: navigator.platform,
        language: navigator.language,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        connection:
          "connection" in navigator
            ? (navigator as ExtendedNavigator).connection?.effectiveType || "unknown"
            : "unknown",
      };

      sendEvent("portfolio_device_info", deviceInfo);
    },

    // Track error boundaries
    trackError: (errorType: string, error: string) => {
      sendEvent("portfolio_error", {
        error_type: errorType,
        error: error.substring(0, 200), // Limit error message length
      });
    },

    // Track user engagement
    trackEngagement: (event: string, details?: Record<string, unknown>) => {
      sendEvent("portfolio_engagement", {
        event_type: event,
        ...details,
      });
    },
  };
};

/**
 * Cookie consent management for LGPD compliance
 */
export const useCookieConsent = () => {
  const [hasConsent, setHasConsent] = useState<boolean>(() => {
    return localStorage.getItem("analytics_consent") === "true";
  });

  const giveConsent = () => {
    localStorage.setItem("analytics_consent", "true");
    setHasConsent(true);

    // Reload to enable analytics
    window.location.reload();
  };

  const withdrawConsent = () => {
    localStorage.removeItem("analytics_consent");
    setHasConsent(false);

    // Remove Plausible cookies
    document.cookie =
      "plausible_ignore=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    document.cookie =
      "plausible_ignore=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=devguimaraes.dev; SameSite=Lax";

    console.log("🔒 Consentimento de analytics removido (conformidade LGPD)");
  };

  return {
    hasConsent,
    giveConsent,
    withdrawConsent,
  };
};
