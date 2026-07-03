import type React from "react";
import { ArrowUpRight } from "lucide-react";
import { contactData } from "@/config/site";
import { socialIconMap } from "@/lib/socialIcons";
import ScrollReveal from "@/components/ui/ScrollReveal";

const SocialIcons: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-12 mb-8">
      {contactData.socialLinks.map((link, idx) => {
        const Icon = socialIconMap[link.id];
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
