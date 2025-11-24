import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Services from "@/components/Services";
import Skills from "@/components/Skills";
import Metrics from "@/components/Metrics";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import { useStackingSections } from "@/hooks/useStackingSections";

import TechTicker from "@/components/TechTicker";

const Index = () => {
  // Define section IDs for stacking
  const sectionIds = ['hero', 'about', 'services', 'blog', 'skills', 'projects', 'metrics', 'contact'];
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
      <Services
        id="services"
        style={{ transform: getTransform('services'), zIndex: getZIndex('services') }}
        className="stacking-section"
      />
      <Blog
        id="blog"
        style={{ transform: getTransform('blog'), zIndex: getZIndex('blog') }}
        className="stacking-section"
      />
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
