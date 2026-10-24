import { describe, expect, it } from "vitest";
import { parseReadingTime } from "./content";

describe("parseReadingTime", () => {
  it("parses reading time from label", () => {
    expect(parseReadingTime("12 min")).toBe(12);
    expect(parseReadingTime("aprox. 4 minutos")).toBe(4);
    expect(parseReadingTime("sem numero")).toBeUndefined();
  });
});
