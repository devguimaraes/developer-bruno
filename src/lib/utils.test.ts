import { describe, it, expect } from "vitest";
import { serializeJSONForScript, sanitizeCSSValue } from "./utils";

describe("serializeJSONForScript", () => {
  it("should escape '<' characters", () => {
    const data = {
      content: "<script>alert(1)</script>",
    };
    const serialized = serializeJSONForScript(data);
    expect(serialized).not.toContain("<script>");
    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003cscript>alert(1)\\u003c/script>");
  });

  it("should correctly serialize normal objects", () => {
    const data = { name: "test", value: 123 };
    const serialized = serializeJSONForScript(data);
    expect(JSON.parse(serialized.replace(/\\u003c/g, "<"))).toEqual(data);
  });
});

describe("sanitizeCSSValue", () => {
  it("should remove dangerous characters", () => {
    const dangerous = "red; color: blue";
    expect(sanitizeCSSValue(dangerous)).toBe("red color: blue");

    const dangerous2 = "red } body { display: none";
    expect(sanitizeCSSValue(dangerous2)).toBe("red  body  display: none");

    const dangerous3 = "url(<javascript:alert(1)>)";
    // We allow parens because they are needed for functions like rgb(), var(), etc.
    expect(sanitizeCSSValue(dangerous3)).toBe("url(javascript:alert(1))");
  });

  it("should return empty string for null/undefined/empty input", () => {
    expect(sanitizeCSSValue("")).toBe("");
    // @ts-expect-error Testing runtime safety
    expect(sanitizeCSSValue(null)).toBe("");
    // @ts-expect-error Testing runtime safety
    expect(sanitizeCSSValue(undefined)).toBe("");
  });
});
