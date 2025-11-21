import logo from "@/assets/bg-logo.jpg";
import { navigationSections, footerData } from "@/config/site";

const Footer = () => {
  return (
    <footer className="border-t-4 border-foreground bg-background py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="block hover:scale-105 transition-transform">
            <img
              src={logo}
              alt="BG Logo"
              className="h-12 w-auto border-2 border-foreground shadow-brutal-sm"
            />
          </div>

          <div className="flex gap-8">
            {navigationSections.map((section) => (
              <a
                key={section.id}
                href={section.href}
                className="font-sans text-sm hover:text-primary transition-colors"
              >
                {section.label}
              </a>
            ))}
          </div>

          <p className="font-mono text-sm text-muted-foreground">
            {footerData.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
