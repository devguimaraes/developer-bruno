import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroAnimation from "@/assets/hero-animation.gif";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-[70%_30%] gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-slide-right">
            <div className="inline-block border-4 border-foreground bg-accent px-4 py-2 shadow-brutal-sm">
              <span className="font-mono font-bold text-sm">FRONT-END DEVELOPER</span>
            </div>
            
            <h1 className="font-mono font-bold text-5xl md:text-7xl leading-tight">
              Bruno
              <br />
              Guimarães<span className="text-primary">.</span>
            </h1>
            
            <p className="font-sans text-xl md:text-2xl text-muted-foreground max-w-xl">
              Especializado em <span className="text-primary font-semibold">React, Next.js e Tailwind</span>.
              Construindo experiências web performáticas, acessíveis e visualmente modernas.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="shadow-brutal border-4 border-foreground group"
              >
                Ver Projetos
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="shadow-brutal border-4 border-foreground"
              >
                Download CV
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "#", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-3 border-4 border-foreground bg-background shadow-brutal-sm hover:bg-muted transition-all hover:-translate-y-1 hover:shadow-brutal"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative animate-scale-in">
            <div className="aspect-square border-4 border-foreground shadow-brutal-lg relative overflow-hidden">
              <img 
                src={heroAnimation} 
                alt="Animação de código e tecnologia"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
