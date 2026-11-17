import { PROCESS_LOGOS, type ProcessLogoSlug } from "@/components/giro/process-logos";

// Logo mono da theSVG, na cor do texto ao lado.
export function ToolLogo({ slug, className }: { slug: ProcessLogoSlug; className?: string }) {
  const logo = PROCESS_LOGOS[slug];
  return (
    <svg className={className} viewBox={logo.viewBox} aria-hidden="true" focusable="false">
      {logo.shapes.map(shape => (
        <path key={shape.d} d={shape.d} fillRule={shape.fillRule} transform={shape.transform} />
      ))}
    </svg>
  );
}

// Tecnologias das badges de projeto. Fora da lista (ex.: SEO) a badge fica só com texto.
const STACK_LOGOS: Readonly<Record<string, ProcessLogoSlug>> = {
  Astro: "astro",
  React: "react",
  "Next.js": "nextjs",
  Sanity: "sanity",
  "Tailwind CSS": "tailwindcss",
  Vercel: "vercel",
  WordPress: "wordpress",
  PHP: "php",
};

export function StackLogo({ name }: { name: string }) {
  const slug = STACK_LOGOS[name];
  return slug ? <ToolLogo slug={slug} className="g-tag__logo" /> : null;
}
