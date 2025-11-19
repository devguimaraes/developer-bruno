import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "E-commerce Platform",
    description:
      "Plataforma de e-commerce construída com Next.js 14, Stripe e Tailwind CSS. Performance otimizada com ISR e edge functions.",
    tech: ["Next.js", "TypeScript", "Tailwind", "Stripe"],
    github: "#",
    live: "#",
    color: "bg-accent",
  },
  {
    title: "Design System",
    description:
      "Sistema de design completo com componentes React reutilizáveis, documentação Storybook e testes automatizados.",
    tech: ["React", "Storybook", "Radix UI", "CSS Modules"],
    github: "#",
    live: "#",
    color: "bg-secondary",
  },
  {
    title: "Portfolio Generator",
    description:
      "Ferramenta para criação de portfólios com Astro, Markdown e animações Framer Motion. SSG para máxima performance.",
    tech: ["Astro", "React", "Framer Motion", "MDX"],
    github: "#",
    live: "#",
    color: "bg-primary",
  },
  {
    title: "Dashboard Analytics",
    description:
      "Dashboard de analytics em tempo real com React Query, Recharts e WebSockets. Visualização de dados interativa.",
    tech: ["React", "TanStack Query", "WebSocket", "Recharts"],
    github: "#",
    live: "#",
    color: "bg-muted",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-32 px-4">
      <div className="container mx-auto">
        <div className="mb-24 animate-slide-up">
          <div className="inline-block border-4 border-foreground bg-accent px-4 py-2 shadow-brutal-sm mb-6">
            <span className="font-mono font-bold text-sm">PROJETOS</span>
          </div>
          <h2 className="font-mono font-bold text-4xl md:text-6xl mb-6">
            Trabalhos Recentes<span className="text-primary">.</span>
          </h2>
          <p className="font-sans text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Seleção de projetos que demonstram expertise técnica, design moderno
            e atenção aos detalhes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="border-4 border-foreground shadow-brutal hover:shadow-brutal-lg transition-all hover:-translate-y-2 bg-card animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`h-48 ${project.color} border-b-4 border-foreground relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-transparent"></div>
              </div>

              <div className="p-8 space-y-6">
                <h3 className="font-mono font-bold text-2xl">
                  {project.title}
                </h3>
                <p className="font-sans text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 border-2 border-foreground bg-muted text-sm font-mono font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 shadow-brutal-sm h-10 px-4"
                    asChild
                  >
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={18} className="mr-2" />
                      Código
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    className="border-2 shadow-brutal-sm h-10 px-4"
                    asChild
                  >
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={18} className="mr-2" />
                      Ver Projeto
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
