import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const config = JSON.parse(readFileSync(join(process.cwd(), "vercel.json"), "utf8")) as {
  rewrites?: { source: string; destination: string }[];
};

describe("vercel.json", () => {
  it("não tem rewrite catch-all, que engole /api/contato antes da função (só aparece em produção)", () => {
    const catchAll = (config.rewrites ?? []).filter(rule =>
      ["/(.*)", "/:path*", "/(.*)*", "/:path(.*)"].includes(rule.source)
    );
    expect(catchAll).toEqual([]);
  });
});
