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
    <section id="about" className="py-32 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Text Content */}
          <div className="space-y-16 animate-slide-right">
            <div className="flex items-center justify-between">
              <div className="inline-block border-4 border-foreground bg-accent px-4 py-2 shadow-brutal-sm">
                <span className="font-mono font-bold text-sm">SOBRE</span>
              </div>

              {/* Mobile Avatar (Visible only on small screens) */}
              <div className="md:hidden relative w-20 h-20">
                <img
                  src={avatar}
                  alt="Bruno Guimarães"
                  className="rounded-full border-4 border-foreground shadow-brutal object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="relative">
              {/* Desktop Avatar (Floating right of text) */}
              <div className="hidden md:block float-right ml-8 mb-6 relative w-40 h-40">
                <img
                  src={avatar}
                  alt="Bruno Guimarães"
                  className="rounded-full border-4 border-foreground shadow-brutal object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 border-2 border-foreground shadow-sm">
                  5+ Anos
                </div>
              </div>

              <h2 className="font-mono font-bold text-4xl md:text-5xl leading-tight mb-8">
                Desenvolvedor Front-End
                <br />& UI Engineer<span className="text-primary">.</span>
              </h2>

              <div className="space-y-6 font-sans text-lg text-muted-foreground leading-relaxed">
                <p>
                  Sou apaixonado por criar experiências digitais que combinam{" "}
                  <span className="text-foreground font-semibold">
                    estética moderna
                  </span>
                  ,{" "}
                  <span className="text-foreground font-semibold">
                    performance
                  </span>{" "}
                  e{" "}
                  <span className="text-foreground font-semibold">
                    código de qualidade
                  </span>
                  .
                </p>

                <p>
                  Com mais de 5 anos de experiência, especializo-me em
                  transformar designs complexos em interfaces funcionais e
                  responsivas usando as mais recentes tecnologias web. Minha
                  abordagem combina atenção aos detalhes, raciocínio técnico
                  sólido e colaboração efetiva com designers e equipes de
                  produto para entregar soluções que realmente fazem a
                  diferença.
                </p>
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid sm:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <div
                key={skill.title}
                className="border-4 border-foreground shadow-neo-brutal hover:shadow-neo-brutal-xl transition-all hover:-translate-y-1 bg-card animate-scale-in relative overflow-hidden group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="p-8 space-y-6">
                  <div
                    className={`inline-flex p-4 ${skill.color} border-2 border-foreground`}
                  >
                    <skill.icon size={28} className="text-foreground" />
                  </div>
                  <h3 className="font-mono font-bold text-xl">{skill.title}</h3>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
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
