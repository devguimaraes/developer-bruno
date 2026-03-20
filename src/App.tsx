import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import NotFound from "./pages/NotFound";
import AntigravityPage from "./pages/AntigravityPage";

import StructuredData from "@/components/StructuredData";
import Analytics from "@/components/Analytics";
import ErrorBoundary, { SafeSuspense } from "@/components/ErrorBoundary";
import { useBrazilianPerformanceReporting } from "@/hooks/useWebVitals";

import { RouteSEO } from "@/components/RouteSEO";

const App = () => {
  // Enable Brazilian market performance monitoring
  useBrazilianPerformanceReporting();

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Analytics />
        <SpeedInsights />
        <BrowserRouter>
          {/* Route-based SEO Component - Meta tags dinâmicas para cada rota */}
          <RouteSEO />

          {/* Structured Data for Brazilian Search Engines */}
          <StructuredData />

          <Layout>
            <SafeSuspense>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/antigravity" element={<AntigravityPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SafeSuspense>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;
