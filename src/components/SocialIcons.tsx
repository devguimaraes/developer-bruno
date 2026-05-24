import type React from "react";
import { ArrowUpRight } from "lucide-react";
import { SiGithub, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import { contactData } from "@/config/site";
import ScrollReveal from "@/components/ui/ScrollReveal";

const LinkedInIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>LinkedIn</title>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  github: SiGithub,
  linkedin: LinkedInIcon,
  instagram: SiInstagram,
  x: SiX,
};

const SocialIcons: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      {contactData.socialLinks.map((link, idx) => {
        const Icon = iconMap[link.id];
        if (!Icon) return null;

        return (
          <ScrollReveal key={link.id} direction="up" delay={0.1 + idx * 0.1}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              className="group flex items-center gap-2 border-b-2 border-white/10 hover:border-accent py-2 px-1 transition-all min-h-12"
            >
              <span className="type-ui-label text-[10px] opacity-20 text-white">0{idx + 1}</span>
              <Icon size={22} className="text-white/60 group-hover:text-accent transition-colors" />
              <ArrowUpRight
                size={18}
                className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-accent"
              />
            </a>
          </ScrollReveal>
        );
      })}
    </div>
  );
};

export default SocialIcons;
