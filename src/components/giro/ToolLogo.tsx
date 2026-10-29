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
