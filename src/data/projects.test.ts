import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { homeCases, outcomeSites, type Project } from "./projects";

const publicDir = join(process.cwd(), "public");

type Bilingual = { readonly pt: string; readonly en: string };

function bilingualFields(project: Project): Bilingual[] {
  const fields: Bilingual[] = [
    project.kicker,
    project.summary,
    project.label,
    project.role,
    project.context.title,
    project.context.text,
    project.problem.title,
    project.problem.text,
    project.solution.title,
    project.solution.text,
  ];
  if (project.result.title) fields.push(project.result.title);
  if (project.result.text) fields.push(project.result.text);
  return fields;
}

describe("homeCases", () => {
  it("lista os cinco cases da home na ordem certa", () => {
    expect(homeCases.map(project => project.title)).toEqual([
      "Estúdio Entre",
      "Atlas Marine Solutions",
      "Movies Bremen",
      "Agência Multi BR",
      "Danila Rizo Palmieri",
    ]);
  });

  it("tem pt e en preenchidos em todos os campos de texto", () => {
    for (const project of homeCases) {
      for (const field of bilingualFields(project)) {
        expect(field.pt.trim(), project.id).not.toBe("");
        expect(field.en.trim(), project.id).not.toBe("");
      }
    }
  });

  it("tem pt e en nas listas do problema e do resultado", () => {
    for (const project of homeCases) {
      if (project.problem.needs) {
        expect(project.problem.needs.pt.length, project.id).toBeGreaterThan(0);
        expect(project.problem.needs.pt.length, project.id).toBe(project.problem.needs.en.length);
      }
      if (project.result.items) {
        expect(project.result.items.pt.length, project.id).toBe(project.result.items.en.length);
      }
    }
  });

  it("encadeia o próximo case e volta ao início no último", () => {
    const ids = homeCases.map(project => project.id);
    homeCases.forEach((project, index) => {
      expect(project.nextCase).toBe(ids[(index + 1) % ids.length]);
    });
  });

  it("aponta para imagens que existem em public/", () => {
    for (const project of homeCases) {
      for (const src of [project.image, project.bannerImage]) {
        if (!src) continue;
        expect(existsSync(`${publicDir}${src}`), src).toBe(true);
      }
      for (const shot of project.screenshots) {
        expect(existsSync(`${publicDir}${shot.src}`), shot.src).toBe(true);
      }
    }
  });

  it("Estúdio Entre tem a stack certa, sem GSAP, e integra CRM e WhatsApp", () => {
    const estudio = homeCases[0];
    expect(estudio.id).toBe("estudio-entre");
    expect(estudio.stack).toEqual(["Astro", "React", "Sanity", "Tailwind CSS", "Vercel"]);
    expect(JSON.stringify(estudio).toLowerCase()).not.toContain("gsap");
    expect(estudio.problem.needs?.pt).toHaveLength(4);
    expect(estudio.solution.text.pt).toContain("CRM");
    expect(estudio.solution.text.pt).toContain("WhatsApp");
  });

  it("Atlas marca problema, papel e resultado como pendentes da #48", () => {
    const atlas = homeCases[1];
    expect(atlas.id).toBe("atlas-marine-solutions");
    expect([...atlas.pendingConfirmation]).toEqual(["problem", "role", "result"]);
    expect(homeCases.filter(project => project.pendingConfirmation.length > 0)).toEqual([atlas]);
  });

  it("não usa travessão (em dash ou en dash) em nenhum texto", () => {
    expect(JSON.stringify(homeCases)).not.toMatch(/[—–]/);
    expect(JSON.stringify(outcomeSites)).not.toMatch(/[—–]/);
  });
});

describe("outcomeSites", () => {
  it("lista os três sites com número, com pt e en", () => {
    expect(outcomeSites.map(site => site.id)).toEqual([
      "engerod",
      "semogrj",
      "luis-felipe-pereira",
    ]);
    for (const site of outcomeSites) {
      expect(site.summary.pt, site.id).not.toBe("");
      expect(site.summary.en, site.id).not.toBe("");
    }
    expect(outcomeSites[0].summary.pt.startsWith("−30%")).toBe(true);
  });
});
