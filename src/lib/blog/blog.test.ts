import { describe, it, expect } from "vitest";
import { generateSlug, toISODate } from ".";

describe("Blog Utils", () => {
  describe("generateSlug", () => {
    it("should convert filename to simple slug", () => {
      expect(generateSlug("meu-post.md")).toBe("meu-post");
    });

    it("should handle special characters", () => {
      expect(generateSlug("Post com Acentuacao!.md")).toBe("post-com-acentuacao");
    });

    it("should remove file extension", () => {
      expect(generateSlug("react-hooks.md")).toBe("react-hooks");
    });

    it("should lowercase everything", () => {
      expect(generateSlug("UPPERCASE-POST.md")).toBe("uppercase-post");
    });
  });

  describe("toISODate", () => {
    it("converts Brazilian format to ISO", () => {
      expect(toISODate("30 ABR 2026")).toBe("2026-04-30");
      expect(toISODate("01 JAN 2025")).toBe("2025-01-01");
      expect(toISODate("15 DEZ 2025")).toBe("2025-12-15");
    });

    it("passes through already-ISO dates", () => {
      expect(toISODate("2026-04-30")).toBe("2026-04-30");
    });

    it("handles single-digit days", () => {
      expect(toISODate("5 MAR 2026")).toBe("2026-03-05");
    });

    it("handles all month abbreviations", () => {
      expect(toISODate("10 FEV 2026")).toBe("2026-02-10");
      expect(toISODate("10 MAI 2026")).toBe("2026-05-10");
      expect(toISODate("10 SET 2026")).toBe("2026-09-10");
      expect(toISODate("10 OUT 2026")).toBe("2026-10-10");
    });
  });
});
