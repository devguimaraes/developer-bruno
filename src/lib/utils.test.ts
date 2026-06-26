import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("should merge Tailwind classes", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("should resolve conflicting Tailwind classes", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  it("should handle empty input", () => {
    expect(cn()).toBe("");
  });
});
