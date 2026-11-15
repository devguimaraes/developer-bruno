/**
 * Dados da página Sobre (/sobre): experiência, formação e stack.
 * Todo texto de interface tem pt e en, como em projects.ts.
 */
import type { ProcessLogoSlug } from "@/components/giro/process-logos";

interface Localized {
  pt: string;
  en: string;
}

export interface CareerEntry {
  id: string;
  name: string;
  role: Localized;
  period: Localized;
  /** Logo redondo em public/. Sem arquivo, a linha mostra as iniciais. */
  logo: string | null;
  initials: string;
}

/** Experiência, na ordem do desenho: o trabalho principal primeiro e o que já terminou por último. */
export const experience: readonly CareerEntry[] = [
  {
    id: "pixel-pro",
    name: "Pixel Pro Technologies",
    role: { pt: "Desenvolvedor front-end", en: "Front-end developer" },
    period: { pt: "mar 2024 a hoje", en: "Mar 2024 to present" },
    logo: null,
    initials: "PP",
  },
  {
    id: "agencia-multi-br",
    name: "Agência Multi BR",
    role: {
      pt: "Desenvolvedor front-end e especialista em SEO",
      en: "Front-end developer and SEO specialist",
    },
    period: { pt: "nov 2022 a hoje", en: "Nov 2022 to present" },
    logo: "/logos/agencia-multi-br.jpg",
    initials: "MB",
  },
  {
    id: "connect-solutions",
    name: "Connect Solutions",
    role: { pt: "Newsletter Manager", en: "Newsletter Manager" },
    period: { pt: "jun 2026 a hoje", en: "Jun 2026 to present" },
    logo: null,
    initials: "CS",
  },
  {
    id: "instituto-helice",
    name: "Instituto Hélice",
    role: { pt: "Newsletter Manager", en: "Newsletter Manager" },
    period: { pt: "ago 2026 a hoje", en: "Aug 2026 to present" },
    logo: "/logos/instituto-helice.webp",
    initials: "IH",
  },
  {
    id: "solution-seg",
    name: "Solution Seg",
    role: { pt: "Coordenador de TI", en: "IT coordinator" },
    period: { pt: "ago 2020 a abr 2022", en: "Aug 2020 to Apr 2022" },
    logo: null,
    initials: "SS",
  },
];

export const education: readonly CareerEntry[] = [
  {
    id: "senac-rj",
    name: "Senac RJ",
    role: { pt: "Desenvolvimento de Sistemas Web", en: "Web Systems Development" },
    period: { pt: "2019", en: "2019" },
    logo: "/logos/senac-rj.jpg",
    initials: "SE",
  },
];

export interface StackTool {
  name: string;
  /** Logo mono da theSVG. Sem logo, o chip fica só com o nome. */
  logo: ProcessLogoSlug | null;
}

export const stack: readonly StackTool[] = [
  { name: "React", logo: "react" },
  { name: "Next.js", logo: "nextjs" },
  { name: "TypeScript", logo: "typescript" },
  { name: "Astro", logo: "astro" },
  { name: "Tailwind CSS", logo: "tailwindcss" },
  { name: "Sanity", logo: "sanity" },
  { name: "Figma", logo: "figma" },
  { name: "Playwright", logo: "playwright" },
  { name: "Vercel", logo: "vercel" },
  { name: "WordPress", logo: "wordpress" },
  { name: "Framer Motion", logo: "motion" },
  { name: "Claude", logo: "claude" },
  { name: "Claude Code", logo: "claude-code" },
  { name: "Cursor", logo: null },
];
