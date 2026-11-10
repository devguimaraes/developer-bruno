import { afterEach, describe, expect, it } from "vitest";
import { getStorySignals, resetStorySignals, setStorySignal } from "./story-signals";

afterEach(resetStorySignals);

describe("story-signals", () => {
  it("começa sem hover, sem envio e sem digitação", () => {
    expect(getStorySignals()).toEqual({
      blogHover: -1,
      endHover: -1,
      contactSend: "idle",
      contactTyping: false,
    });
  });

  it("guarda o que o capítulo escreve sem mexer no resto", () => {
    setStorySignal("blogHover", 2);
    setStorySignal("contactSend", "loading");
    expect(getStorySignals()).toMatchObject({ blogHover: 2, contactSend: "loading", endHover: -1 });
  });
});
