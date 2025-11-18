const experiences = [
  {
    year: "2023 - Atual",
    role: "Senior Front-End Developer",
    company: "Tech Innovations Inc.",
    description: "Liderança técnica em projetos React e Next.js. Implementação de design systems, otimização de performance e mentoria de desenvolvedores júnior.",
    achievements: [
      "Redução de 40% no tempo de carregamento",
      "Implementação de CI/CD com GitHub Actions",
      "Migração bem-sucedida para Next.js 14",
    ],
  },
  {
    year: "2021 - 2023",
    role: "Front-End Developer",
    company: "Digital Solutions Agency",
    description: "Desenvolvimento de aplicações web modernas com React, TypeScript e Tailwind CSS. Colaboração com designers e back-end para entregar produtos de alta qualidade.",
    achievements: [
      "Criação de 15+ projetos client-facing",
      "Desenvolvimento de componentes reutilizáveis",
      "Integração com APIs RESTful e GraphQL",
    ],
  },
  {
    year: "2019 - 2021",
    role: "Junior Front-End Developer",
    company: "Startup Ventures",
    description: "Construção de interfaces responsivas e implementação de features com JavaScript, HTML5 e CSS3. Trabalho em ambiente ágil com foco em entregas rápidas.",
    achievements: [
      "Desenvolvimento de landing pages de alta conversão",
      "Implementação de testes unitários com Jest",
      "Participação ativa em code reviews",
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-24 px-4 bg-muted">
      <div className="container mx-auto">
        <div className="mb-16 animate-slide-up">
          <div className="inline-block border-4 border-foreground bg-accent px-4 py-2 shadow-brutal-sm mb-6">
            <span className="font-mono font-bold text-sm">EXPERIÊNCIA</span>
          </div>
          <h2 className="font-mono font-bold text-4xl md:text-6xl mb-4">
            Trajetória Profissional<span className="text-primary">.</span>
          </h2>
          <p className="font-sans text-xl text-muted-foreground max-w-2xl">
            Evolução técnica e projetos que moldaram minha expertise em desenvolvimento front-end.
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div
              key={exp.company}
              className="border-4 border-foreground bg-background shadow-brutal hover:shadow-brutal-lg transition-all hover:-translate-y-1 animate-slide-right"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-8">
                <div className="grid md:grid-cols-[200px_1fr] gap-6">
                  <div className="space-y-2">
                    <div className="inline-block border-2 border-foreground bg-primary px-3 py-1">
                      <span className="font-mono font-bold text-sm text-primary-foreground">{exp.year}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-mono font-bold text-2xl mb-1">{exp.role}</h3>
                      <p className="font-sans text-lg text-primary font-semibold">{exp.company}</p>
                    </div>

                    <p className="font-sans text-muted-foreground">{exp.description}</p>

                    <div className="space-y-2">
                      <p className="font-mono font-semibold text-sm uppercase tracking-wide">Key Achievements:</p>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement) => (
                          <li key={achievement} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary mt-2 flex-shrink-0" />
                            <span className="font-sans text-muted-foreground">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
