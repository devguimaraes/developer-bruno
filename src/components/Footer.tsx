import logo from "@/assets/bg-logo.jpg";

const Footer = () => {
  return (
    <footer className="border-t-4 border-foreground bg-background py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="block hover:scale-105 transition-transform">
            <img
              src={logo}
              alt="BG Logo"
              className="h-10 w-auto border-2 border-foreground shadow-brutal-sm"
            />
          </div>

          <div className="flex gap-8">
            <a
              href="#projects"
              className="font-sans text-sm hover:text-primary transition-colors"
            >
              Projetos
            </a>
            <a
              href="#experience"
              className="font-sans text-sm hover:text-primary transition-colors"
            >
              Experiência
            </a>
            <a
              href="#about"
              className="font-sans text-sm hover:text-primary transition-colors"
            >
              Sobre
            </a>
            <a
              href="#contact"
              className="font-sans text-sm hover:text-primary transition-colors"
            >
              Contato
            </a>
          </div>

          <p className="font-mono text-sm text-muted-foreground">
            © 2025 Bruno Guimarães
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
