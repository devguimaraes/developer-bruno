import { Code2, MessagesSquare, PenTool, Rocket, type LucideIcon } from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";
import type { ProcessLogoSlug } from "./process-logos";

export type ProcessStepId = "talk" | "design" | "code" | "launch";

export interface ProcessTool {
  slug: ProcessLogoSlug;
  /** Nome exibido no diagrama. Marca, não traduz. */
  name: string;
}

/** Ferramentas de uma etapa reunidas pela função que cumprem (base, conteúdo, hospedagem...). */
export interface ProcessToolGroup {
  labelKey: TranslationKey;
  tools: readonly ProcessTool[];
}

export interface ProcessStep {
  id: ProcessStepId;
  /** Número da etapa, de 1 a 4. */
  number: number;
  icon: LucideIcon;
  nameKey: TranslationKey;
  bodyKey: TranslationKey;
  deliverableKey: TranslationKey;
  groups: readonly ProcessToolGroup[];
}

// Ferramentas por etapa: decisão 49 e tabela do ProcessDiagram no DS, agrupadas por função.
export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    id: "talk",
    number: 1,
    icon: MessagesSquare,
    nameKey: "process.talk.name",
    bodyKey: "process.talk.body",
    deliverableKey: "process.talk.deliverable",
    groups: [
      {
        labelKey: "process.group.communication",
        tools: [
          { slug: "google-meet", name: "Google Meet" },
          { slug: "whatsapp", name: "WhatsApp" },
          { slug: "slack", name: "Slack" },
        ],
      },
      {
        labelKey: "process.group.organization",
        tools: [
          { slug: "google-drive", name: "Google Drive" },
          { slug: "linear", name: "Linear" },
        ],
      },
    ],
  },
  {
    id: "design",
    number: 2,
    icon: PenTool,
    nameKey: "process.design.name",
    bodyKey: "process.design.body",
    deliverableKey: "process.design.deliverable",
    groups: [
      { labelKey: "process.group.screens", tools: [{ slug: "figma", name: "Figma" }] },
      { labelKey: "process.group.exploration", tools: [{ slug: "claude", name: "Claude" }] },
    ],
  },
  {
    id: "code",
    number: 3,
    icon: Code2,
    nameKey: "process.code.name",
    bodyKey: "process.code.body",
    deliverableKey: "process.code.deliverable",
    groups: [
      {
        labelKey: "process.group.foundation",
        tools: [
          { slug: "react", name: "React" },
          { slug: "nextjs", name: "Next.js" },
          { slug: "astro", name: "Astro" },
          { slug: "typescript", name: "TypeScript" },
        ],
      },
      {
        labelKey: "process.group.interface",
        tools: [
          { slug: "tailwindcss", name: "Tailwind CSS" },
          { slug: "shadcn-ui", name: "shadcn/ui" },
          { slug: "motion", name: "Motion" },
        ],
      },
      {
        labelKey: "process.group.content",
        tools: [
          { slug: "sanity", name: "Sanity" },
          { slug: "wordpress", name: "WordPress" },
        ],
      },
      {
        labelKey: "process.group.workflow",
        tools: [
          { slug: "github", name: "GitHub" },
          { slug: "claude-code", name: "Claude Code" },
        ],
      },
    ],
  },
  {
    id: "launch",
    number: 4,
    icon: Rocket,
    nameKey: "process.launch.name",
    bodyKey: "process.launch.body",
    deliverableKey: "process.launch.deliverable",
    groups: [
      {
        labelKey: "process.group.hosting",
        tools: [
          { slug: "vercel", name: "Vercel" },
          { slug: "cloudflare", name: "Cloudflare" },
          { slug: "hostinger", name: "Hostinger" },
          { slug: "aws", name: "AWS" },
        ],
      },
      {
        labelKey: "process.group.quality",
        tools: [
          { slug: "github-actions", name: "GitHub Actions" },
          { slug: "playwright", name: "Playwright" },
        ],
      },
      {
        labelKey: "process.group.metrics",
        tools: [{ slug: "plausible-analytics", name: "Plausible" }],
      },
    ],
  },
];

/** Todas as ferramentas da etapa, na ordem dos grupos. */
export function stepTools(step: ProcessStep): ProcessTool[] {
  return step.groups.flatMap(group => group.tools);
}
