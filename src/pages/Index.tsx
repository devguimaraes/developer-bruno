import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Metrics from "@/components/Metrics";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

import TechTicker from "@/components/TechTicker";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      <main>
        <Hero />
        <TechTicker />
        <About />
        <Blog />
        <Skills />
        <Projects />
        <Metrics />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
