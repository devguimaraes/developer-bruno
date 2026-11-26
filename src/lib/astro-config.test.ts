import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Guarda mínima, lendo o texto (como vercel-config.test.ts): o Vitest não carrega o astro.config.mjs.
// A prova do bug é a função buildada com Host/X-Forwarded-Host da Vercel, que respondia 403 a tudo.
const source = readFileSync(join(process.cwd(), "astro.config.mjs"), "utf8");
const site = new URL(source.match(/site: '([^']+)'/)?.[1] ?? "");
const allowed = source.match(/allowedDomains: \[([\s\S]*?)\n {4}\]/)?.[1] ?? "";
const hostnames = [...allowed.matchAll(/hostname: '([^']+)'/g)].map(match => match[1]);

describe("astro.config security.allowedDomains", () => {
  it("confia no host do site e dos previews, ou a função do contato vê localhost e recusa todo envio", () => {
    expect(hostnames).toEqual(
      expect.arrayContaining([site.hostname, `www.${site.hostname}`, "*.vercel.app"])
    );
  });
});
