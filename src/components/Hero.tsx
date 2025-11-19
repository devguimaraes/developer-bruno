import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import computerGif from "@/assets/Computer.gif";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-32 relative overflow-hidden">
      {/* ... existing code ... */}
      {/* Visual Element */}

      {/* Geometric Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-20"></div>

      {/* Floating Shapes */}
      <div className="absolute top-20 right-[10%] w-16 h-16 border-4 border-foreground bg-accent rotate-12 -z-10 shadow-brutal-sm"></div>
      <div className="absolute bottom-32 left-[5%] w-24 h-24 rounded-full border-4 border-foreground bg-primary/20 -z-10 shadow-brutal-sm"></div>
      <div className="absolute top-1/3 left-1/2 w-12 h-12 bg-foreground rotate-45 -z-10 opacity-10"></div>

      {/* Plus Grid */}
      <div className="absolute top-10 left-10 text-foreground/20 font-mono text-6xl font-black select-none">
        +
      </div>
      <div className="absolute bottom-10 right-10 text-foreground/20 font-mono text-6xl font-black select-none">
        +
      </div>
      <div className="absolute top-1/2 right-5 text-foreground/10 font-mono text-8xl font-black select-none rotate-90">
        DB
      </div>

      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-12 animate-slide-right">
            <div className="inline-block border-4 border-foreground bg-accent px-4 py-2 shadow-brutal-sm transform -rotate-2 hover:rotate-0 transition-transform">
              <span className="font-mono font-bold text-sm tracking-wider">
                DESENVOLVEDOR FRONT END
              </span>
            </div>

            <h1 className="font-mono font-black text-5xl md:text-7xl leading-none tracking-tighter">
              BRUNO
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                GUIMARÃES
              </span>
              <span className="text-foreground">.</span>
            </h1>

            <p className="font-sans text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed border-l-4 border-primary pl-6">
              Transformo visão estratégica em{" "}
              <span className="text-foreground font-bold">
                software e sites de alta performance
              </span>
              . Crio interfaces que unem engenharia robusta e design intencional
              para maximizar resultados.
              <br />
              <div className="flex items-center gap-4 mt-4 text-muted-foreground/80">
                <div className="flex items-center gap-1">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                    className="w-4 h-4"
                    alt="React"
                  />
                  <span className="text-sm">React</span>
                </div>
                <div className="flex items-center gap-1">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                    className="w-4 h-4 dark:invert"
                    alt="Next.js"
                  />
                  <span className="text-sm">Next.js</span>
                </div>
                <div className="flex items-center gap-1">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
                    className="w-4 h-4"
                    alt="TypeScript"
                  />
                  <span className="text-sm">TypeScript</span>
                </div>
                <div className="flex items-center gap-1">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
                    className="w-4 h-4"
                    alt="Tailwind"
                  />
                  <span className="text-sm">Tailwind</span>
                </div>
              </div>
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="shadow-neo-brutal border-4 border-foreground group bg-primary text-primary-foreground hover:bg-primary/90 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Ver Projetos
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="shadow-neo-brutal border-4 border-foreground hover:bg-accent hover:text-accent-foreground hover:translate-y-1 hover:shadow-none transition-all"
              >
                Download CV
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              {[
                {
                  icon: Github,
                  href: "https://github.com/devguimaraes",
                  label: "GitHub",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/bcguimaraes/",
                  label: "LinkedIn",
                },
                {
                  icon: Mail,
                  href: "mailto:bc.guimaraes@outlook.com",
                  label: "Email",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-3 border-4 border-foreground bg-background shadow-brutal-sm hover:bg-primary hover:text-primary-foreground transition-all hover:-translate-y-1 hover:shadow-brutal"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative animate-scale-in group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
            <div className="aspect-square border-4 border-foreground shadow-brutal-lg relative overflow-hidden bg-muted flex items-center justify-center">
              <img
                src={computerGif}
                alt="Computer Animation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent mix-blend-overlay pointer-events-none"></div>

              {/* Glitch Overlay Effect */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
