import logo from "@/assets/bg-logo.jpg";
import { navigationSections, footerData } from "@/config/site";
import { Link } from "react-router-dom";
import { FadeInStagger, FadeInItem } from "@/components/ui/motion-components";

const Footer = () => {
  const handleFooterNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      // Se estamos na página inicial e o link é interno, fazer scroll
      if (window.location.pathname === "/") {
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Se não estamos na página inicial, navegar para a home com o hash
        window.location.href = "/" + href;
      }
    } else {
      // Para outras páginas, navegar normalmente
      window.location.href = href;
    }
  };

  return (
    <footer className="border-t-4 border-foreground bg-background py-12 px-4">
      <div className="container mx-auto">
        <FadeInStagger className="flex flex-col md:flex-row justify-between items-center gap-8">
          <FadeInItem>
            <Link
              to="/"
              className="block hover:scale-105 transition-transform"
              onClick={(e) => handleFooterNavClick(e, "/")}
            >
              <img
                src={logo}
                alt="BG Logo"
                className="h-12 w-auto border-2 border-foreground shadow-brutal-sm"
              />
            </Link>
          </FadeInItem>

          <FadeInItem className="flex gap-8">
            {navigationSections.map((section) => (
              <a
                key={section.id}
                href={section.href}
                className="font-sans text-sm hover:text-primary transition-colors"
                onClick={(e) => handleFooterNavClick(e, section.href)}
              >
                {section.label}
              </a>
            ))}
          </FadeInItem>

          <FadeInItem>
            <p className="font-mono text-sm text-muted-foreground">
              {footerData.copyright}
            </p>
          </FadeInItem>
        </FadeInStagger>
      </div>
    </footer>
  );
};

export default Footer;
