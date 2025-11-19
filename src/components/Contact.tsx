import { Mail, Linkedin, Github, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section id="contact" className="py-24 px-4 bg-foreground text-background">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block border-4 border-background bg-accent px-4 py-2 shadow-[6px_6px_0px_hsl(var(--background))] mb-6">
            <span className="font-mono font-bold text-sm text-foreground">
              CONTATO
            </span>
          </div>

          <h2 className="font-mono font-bold text-4xl md:text-6xl animate-slide-up">
            Vamos Conversar<span className="text-accent">?</span>
          </h2>

          <p className="font-sans text-xl text-background/80 max-w-2xl mx-auto animate-fade-in">
            Estou sempre aberto a discutir novos projetos, ideias criativas ou
            oportunidades de fazer parte da sua visão. Entre em contato!
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-scale-in">
            <Button
              size="lg"
              className="bg-accent text-foreground hover:bg-accent/90 border-4 border-background shadow-[6px_6px_0px_hsl(var(--background))] hover:shadow-[8px_8px_0px_hsl(var(--background))] hover:-translate-y-1 transition-all group"
              asChild
            >
              <a href="mailto:bc.guimaraes@outlook.com">
                <Mail className="mr-2" size={20} />
                bruno@devguimaraes.io
                <Send
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={16}
                />
              </a>
            </Button>
          </div>

          <div className="flex gap-6 justify-center pt-12">
            {[
              {
                icon: Linkedin,
                href: "https://www.linkedin.com/in/bcguimaraes/",
                label: "LinkedIn",
                color: "bg-accent",
              },
              {
                icon: Github,
                href: "https://github.com/devguimaraes",
                label: "GitHub",
                color: "bg-background",
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                className={`p-4 border-4 border-background ${social.color} shadow-[4px_4px_0px_hsl(var(--background))] hover:shadow-[6px_6px_0px_hsl(var(--background))] transition-all hover:-translate-y-1 group`}
                aria-label={social.label}
              >
                <social.icon
                  size={24}
                  className="text-foreground group-hover:scale-110 transition-transform"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
