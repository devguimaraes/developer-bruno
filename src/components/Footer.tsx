const Footer = () => {
  return (
    <footer className="border-t-4 border-foreground bg-background py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono font-bold text-xl">
            BG<span className="text-primary">.</span>
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
            © 2024 Bruno Guimarães
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
