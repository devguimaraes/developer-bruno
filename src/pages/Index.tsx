import { lazy, Suspense, useMemo } from 'react';
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Metrics from "@/components/Metrics";
import Contact from "@/components/Contact";
import { useStackingSections } from "@/hooks/useStackingSections";
import TechTicker from "@/components/TechTicker";

// Lazy load non-critical components for better initial load performance
const LazyServices = lazy(() => import("@/components/Services").then(module => ({
  default: module.default
})));
const LazyBlog = lazy(() => import("@/components/Blog").then(module => ({
  default: module.default
})));

// Loading component for lazy loaded sections
const SectionLoader = () => (
  <div className="min-h-[400px] bg-brutal-yellow border-y-4 border-black flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent animate-spin mb-4"></div>
      <p className="font-mono font-bold">CARREGANDO_SEÇÃO...</p>
    </div>
  </div>
);

const Index = () => {
  // Define section IDs for stacking (memoized to prevent infinite loops)
  const sectionIds = useMemo(() => [
    'hero', 'about', 'services', 'blog', 'skills', 'projects', 'metrics', 'contact'
  ], []);
  const { getTransform, getZIndex } = useStackingSections(sectionIds);

  return (
    <div className="stacking-wrapper">
      <Hero
        id="hero"
        style={{ transform: getTransform('hero'), zIndex: getZIndex('hero') }}
        className="stacking-section"
      />
      <About
        id="about"
        style={{ transform: getTransform('about'), zIndex: getZIndex('about') }}
        className="stacking-section"
      />
      <Suspense fallback={<SectionLoader />}>
        <LazyServices
          id="services"
          style={{ transform: getTransform('services'), zIndex: getZIndex('services') }}
          className="stacking-section"
        />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <LazyBlog
          id="blog"
          style={{ transform: getTransform('blog'), zIndex: getZIndex('blog') }}
          className="stacking-section"
        />
      </Suspense>
      <Skills
        id="skills"
        style={{ transform: getTransform('skills'), zIndex: getZIndex('skills') }}
        className="stacking-section"
      />
      <Projects
        id="projects"
        style={{ transform: getTransform('projects'), zIndex: getZIndex('projects') }}
        className="stacking-section"
      />
      <Metrics
        id="metrics"
        style={{ transform: getTransform('metrics'), zIndex: getZIndex('metrics') }}
        className="stacking-section"
      />
      <Contact
        id="contact"
        style={{ transform: getTransform('contact'), zIndex: getZIndex('contact') }}
        className="stacking-section"
      />
    </div>
  );
};

export default Index;
