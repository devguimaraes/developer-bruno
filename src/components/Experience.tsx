import { experiences } from "@/data/experience";

const Experience = () => {
  return (
    <section id="experience" className="py-32 px-4 bg-muted">
      <div className="container mx-auto">
        <div className="mb-24 animate-slide-up">
          <div className="inline-block border-4 border-foreground bg-accent px-4 py-2 shadow-brutal-sm mb-6">
            <span className="font-mono font-bold text-sm">EXPERIÊNCIA</span>
          </div>
          <h2 className="font-mono font-bold text-4xl md:text-6xl mb-6">
            Trajetória Profissional<span className="text-primary">.</span>
          </h2>
          <p className="font-sans text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Evolução técnica e projetos que moldaram minha expertise em
            desenvolvimento front-end.
          </p>
        </div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div
              key={exp.company}
              className="border-4 border-foreground bg-background shadow-neo-brutal hover:shadow-neo-brutal-xl transition-all hover:-translate-y-1 animate-slide-right relative group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="p-10">
                <div className="grid md:grid-cols-[200px_1fr] gap-8">
                  <div className="space-y-2">
                    <div className="inline-block border-2 border-foreground bg-primary px-3 py-1">
                      <span className="font-mono font-bold text-sm text-primary-foreground">
                        {exp.year}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-mono font-bold text-4xl mb-2">
                        {exp.role}
                      </h3>
                      <p className="font-sans text-2xl text-primary font-semibold">
                        {exp.company}
                      </p>
                    </div>

                    <p className="font-sans text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="space-y-3">
                      <p className="font-mono font-semibold text-sm uppercase tracking-wide">
                        Responsabilidades:
                      </p>
                      <ul className="space-y-3">
                        {exp.achievements.map((achievement) => (
                          <li
                            key={achievement}
                            className="flex items-start gap-3"
                          >
                            <div className="w-2 h-2 bg-primary mt-2 flex-shrink-0" />
                            <span className="font-sans text-muted-foreground">
                              {achievement}
                            </span>
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
