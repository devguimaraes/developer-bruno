import { Code2, MessagesSquare, PenTool, Rocket, type LucideIcon } from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";
import type { ProcessLogoSlug } from "./process-logos";

export type ProcessStepId = "talk" | "design" | "code" | "launch";

export interface ProcessTool {
  slug: ProcessLogoSlug;
  /** Nome exibido no diagrama. Marca, não traduz. */
  name: string;
}

export interface ProcessStep {
  id: ProcessStepId;
  /** Número da etapa, de 1 a 4. */
  number: number;
  icon: LucideIcon;
  nameKey: TranslationKey;
  bodyKey: TranslationKey;
  deliverableKey: TranslationKey;
  tools: readonly ProcessTool[];
}

// Ferramentas por etapa: decisão 49 e tabela do ProcessDiagram no DS.
export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    id: "talk",
    number: 1,
    icon: MessagesSquare,
    nameKey: "process.talk.name",
    bodyKey: "process.talk.body",
    deliverableKey: "process.talk.deliverable",
    tools: [
      { slug: "google-meet", name: "Google Meet" },
      { slug: "whatsapp", name: "WhatsApp" },
      { slug: "google-drive", name: "Google Drive" },
      { slug: "slack", name: "Slack" },
      { slug: "linear", name: "Linear" },
    ],
  },
  {
    id: "design",
    number: 2,
    icon: PenTool,
    nameKey: "process.design.name",
    bodyKey: "process.design.body",
    deliverableKey: "process.design.deliverable",
    tools: [
      { slug: "figma", name: "Figma" },
      { slug: "claude", name: "Claude" },
    ],
  },
  {
    id: "code",
    number: 3,
    icon: Code2,
    nameKey: "process.code.name",
    bodyKey: "process.code.body",
    deliverableKey: "process.code.deliverable",
    tools: [
      { slug: "react", name: "React" },
      { slug: "nextjs", name: "Next.js" },
      { slug: "astro", name: "Astro" },
      { slug: "typescript", name: "TypeScript" },
      { slug: "tailwindcss", name: "Tailwind CSS" },
      { slug: "shadcn-ui", name: "shadcn/ui" },
      { slug: "motion", name: "Motion" },
      { slug: "sanity", name: "Sanity" },
      { slug: "wordpress", name: "WordPress" },
      { slug: "github", name: "GitHub" },
      { slug: "claude-code", name: "Claude Code" },
    ],
  },
  {
    id: "launch",
    number: 4,
    icon: Rocket,
    nameKey: "process.launch.name",
    bodyKey: "process.launch.body",
    deliverableKey: "process.launch.deliverable",
    tools: [
      { slug: "vercel", name: "Vercel" },
      { slug: "cloudflare", name: "Cloudflare" },
      { slug: "hostinger", name: "Hostinger" },
      { slug: "aws", name: "AWS" },
      { slug: "github-actions", name: "GitHub Actions" },
      { slug: "playwright", name: "Playwright" },
      { slug: "plausible-analytics", name: "Plausible" },
    ],
  },
];
