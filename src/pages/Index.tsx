import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Metrics from "@/components/Metrics";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";

import TechTicker from "@/components/TechTicker";

const Index = () => {
  return (
    <>
      <Hero />
      <About />
      <Blog />
      <Skills />
      <Projects />
      <Metrics />
      <Contact />
    </>
  );
};

export default Index;
