import { experiences } from "@/data/experience";
import {
  FadeInStagger,
  FadeInItem,
  TextReveal,
  ScaleOnHover,
} from "@/components/ui/motion-components";

const Experience = () => {
  return (
    <section id="experience" className="py-32 px-4 bg-muted">
      <div className="container mx-auto">
        <div className="mb-24 animate-slide-up">
          <div className="inline-block border-4 border-foreground bg-accent px-4 py-2 shadow-brutal-sm mb-6">
            <span className="font-mono font-bold text-sm">EXPERIÊNCIA</span>
          </div>
          <h2 className="font-mono font-bold text-4xl md:text-6xl mb-6">
            <TextReveal text="Trajetória" />{" "}
            <span className="text-primary">
              <TextReveal text="Profissional." delay={0.2} />
            </span>
          </h2>
          <p className="font-sans text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Evolução técnica e projetos que moldaram minha expertise em
            desenvolvimento front-end.
          </p>
        </div>

        <FadeInStagger className="space-y-12">
          {experiences.map((job, index) => (
            <FadeInItem
              key={index}
              className="relative p-6 md:p-8 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold uppercase">{job.role}</h3>
                  <div className="text-xl font-bold text-neutral-600 dark:text-neutral-400">
                    {job.company}
                  </div>
                </div>
                <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white font-mono font-bold text-sm whitespace-nowrap">
                  {job.year}
                </div>
              </div>

              <p className="text-lg mb-6 font-medium leading-relaxed">
                {job.description}
              </p>

              <div>
                <h4 className="font-bold uppercase mb-4 text-sm tracking-wider">
                  Tech Stack:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.tech.map((tech) => (
                    <ScaleOnHover
                      key={tech}
                      className="px-3 py-1 text-sm font-bold border-2 border-black dark:border-white bg-white dark:bg-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-default"
                    >
                      {tech}
                    </ScaleOnHover>
                  ))}
                </div>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
};
export default Experience;
