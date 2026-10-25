import { describe, expect, it } from "vitest";
import { dictionary, formatDate, t, type TranslationKey } from "./i18n";

describe("t", () => {
  it("returns the string for the requested locale", () => {
    expect(t("pt", "hero.title")).toBe("Interfaces com vida.");
    expect(t("en", "hero.title")).toBe("Interfaces that live.");
  });

  it("keeps an empty pt note as an empty string instead of falling back", () => {
    expect(t("pt", "posts.card_language_note")).toBe("");
    expect(t("en", "posts.card_language_note")).toBe("In Portuguese");
  });

  it("falls back to the key when it does not exist in any locale", () => {
    expect(t("en", "missing.key" as TranslationKey)).toBe("missing.key");
  });

  it("replaces {name} placeholders with the given vars", () => {
    expect(t("pt", "posts.count", { n: 12 })).toBe("12 posts");
    expect(t("en", "notfound.address", { path: "/rota" })).toBe("// address: /rota");
    expect(t("pt", "meta.case_title", { project: "Atlas" })).toBe(
      "Atlas · case de Bruno Guimarães"
    );
  });

  it("leaves placeholders without a matching var untouched", () => {
    expect(t("pt", "posts.count")).toBe("{n} posts");
    expect(t("pt", "posts.count", { other: 1 })).toBe("{n} posts");
  });
});

describe("formatDate", () => {
  const date = new Date(Date.UTC(2026, 3, 22));

  it("formats pt dates as day, short month and year without dots or 'de'", () => {
    expect(formatDate("pt", date)).toBe("22 abr 2026");
  });

  it("formats en dates as Apr 22, 2026", () => {
    expect(formatDate("en", date)).toBe("Apr 22, 2026");
  });

  it("keeps the day for dates at UTC midnight", () => {
    expect(formatDate("pt", new Date(Date.UTC(2026, 0, 1)))).toBe("1 jan 2026");
    expect(formatDate("en", new Date(Date.UTC(2026, 0, 1)))).toBe("Jan 1, 2026");
  });
});

describe("dictionary", () => {
  it("has the same keys in pt and en", () => {
    expect(Object.keys(dictionary.en).sort()).toEqual(Object.keys(dictionary.pt).sort());
  });
});
