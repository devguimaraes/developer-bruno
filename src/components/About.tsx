import { Code2, Palette, Rocket, Zap } from "lucide-react";
import avatar from "@/assets/avatar.jpg";

const skills = [
  {
    icon: Code2,
    title: "Desenvolvimento",
    description:
      "React, Next.js, TypeScript, Astro. Código limpo, performático e escalável.",
    color: "bg-primary",
  },
  {
    icon: Palette,
    title: "Design & UI",
    description:
      "Tailwind CSS, Radix UI, Framer Motion. Interfaces modernas e responsivas.",
    color: "bg-secondary",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Otimização de bundle, lazy loading, code splitting. Web Vitals excelentes.",
    color: "bg-accent",
  },
  {
    icon: Rocket,
    title: "Deploy & CI/CD",
    description:
      "Vercel, GitHub Actions, Docker. Pipelines automatizados e confiáveis.",
    color: "bg-muted",
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-slide-right">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0">
                <img
                  src={avatar}
                  alt="Bruno Guimarães"
                  className="rounded-full border-4 border-foreground shadow-brutal object-cover w-full h-full"
                />
              </div>
              <div className="inline-block border-4 border-foreground bg-accent px-4 py-2 shadow-brutal-sm h-fit">
                <span className="font-mono font-bold text-sm">SOBRE</span>
              </div>
            </div>

            <h2 className="font-mono font-bold text-4xl md:text-6xl">
              Desenvolvedor Front-End
              <br />& UI Engineer<span className="text-primary">.</span>
            </h2>

            <div className="space-y-4 font-sans text-lg text-muted-foreground">
              <p>
                Sou apaixonado por criar experiências digitais que combinam{" "}
                <span className="text-foreground font-semibold">
                  estética moderna
                </span>
                ,{" "}
                <span className="text-foreground font-semibold">
                  performance excepcional
                </span>{" "}
                e{" "}
                <span className="text-foreground font-semibold">
                  código de qualidade
                </span>
                .
              </p>

              <p>
                Com mais de 5 anos de experiência, especializo-me em transformar
                designs complexos em interfaces funcionais e responsivas usando
                as mais recentes tecnologias web.
              </p>

              <p>
                Minha abordagem combina atenção aos detalhes, raciocínio técnico
                sólido e colaboração efetiva com designers e equipes de produto
                para entregar soluções que realmente fazem a diferença.
              </p>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <div
                key={skill.title}
                className="border-4 border-foreground shadow-brutal hover:shadow-brutal-lg transition-all hover:-translate-y-2 bg-card animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-6 space-y-4">
                  <div
                    className={`inline-flex p-3 ${skill.color} border-2 border-foreground`}
                  >
                    <skill.icon size={24} className="text-foreground" />
                  </div>
                  <h3 className="font-mono font-bold text-xl">{skill.title}</h3>
                  <p className="font-sans text-sm text-muted-foreground">
                    {skill.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
