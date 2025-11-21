import { Mail, Linkedin, Github, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactData, socialLinks } from "@/config/site";

const Contact = () => {
  return (
    <section id="contact" className="py-32 px-4 bg-foreground text-background">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="inline-block border-4 border-background bg-accent px-4 py-2 shadow-[6px_6px_0px_hsl(var(--background))] mb-6">
            <span className="font-mono font-bold text-sm text-foreground">
              CONTATO
            </span>
          </div>

          <h2 className="font-mono font-bold text-4xl md:text-6xl animate-slide-up">
            {contactData.title}<span className="text-accent">?</span>
          </h2>

          <p className="font-sans text-xl text-background/80 max-w-2xl mx-auto animate-fade-in leading-relaxed">
            {contactData.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12 animate-scale-in">
            <Button
              size="lg"
              className="h-16 px-8 text-lg bg-accent text-foreground hover:bg-accent/90 border-4 border-background shadow-[6px_6px_0px_hsl(var(--background))] hover:shadow-[8px_8px_0px_hsl(var(--background))] hover:-translate-y-1 transition-all group relative overflow-hidden"
              asChild
            >
              <a href={`mailto:${contactData.email}`}>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Mail className="mr-3 relative z-10" size={24} />
                <span className="relative z-10">{contactData.email}</span>
                <Send
                  className="ml-3 group-hover:translate-x-1 transition-transform relative z-10"
                  size={20}
                />
              </a>
            </Button>
          </div>

          <div className="flex gap-8 justify-center pt-16">
            {socialLinks
              .filter(social => social.id !== 'email') // Exclude email since it's already shown above
              .map((social) => {
                const iconMap = {
                  github: Github,
                  linkedin: Linkedin,
                };
                const IconComponent = iconMap[social.id as keyof typeof iconMap];
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    className="p-5 border-4 border-background bg-accent shadow-[4px_4px_0px_hsl(var(--background))] hover:shadow-[6px_6px_0px_hsl(var(--background))] transition-all hover:-translate-y-1 group relative overflow-hidden"
                    aria-label={social.label}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <IconComponent
                      size={28}
                      className="text-foreground group-hover:scale-110 transition-transform"
                    />
                  </a>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
