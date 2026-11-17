import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { homeCases } from "./projects";

describe("capas dos cases", () => {
  // No celular a caixa da capa tem a proporção de imageSize: se o arquivo mudar e o dado não,
  // a imagem volta a ser cortada.
  it.each(
    homeCases.map(project => [project.slug, project] as const)
  )("imageSize de %s bate com o arquivo em public/", async (_slug, project) => {
    const meta = await sharp(path.join(process.cwd(), "public", project.image)).metadata();
    expect({ width: meta.width, height: meta.height }).toEqual(project.imageSize);
  });
});
