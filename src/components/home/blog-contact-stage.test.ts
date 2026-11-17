import { describe, expect, it } from "vitest";
import { calcBlogStep, calcContactStep } from "./blog-contact-stage";
import type { StorySignals } from "./story/story-signals";

const signals = (patch: Partial<StorySignals> = {}): StorySignals => ({
  blogHover: -1,
  endHover: -1,
  contactSend: "idle",
  contactTyping: false,
  ...patch,
});

describe("calcBlogStep", () => {
  it("sem ponteiro numa linha, o Giro cochila em cima da régua", () => {
    expect(calcBlogStep(signals())).toEqual({ k: "nap", stop: "bl-nap", state: "sleeping" });
  });

  it("com o ponteiro na linha i, o Giro vai até a data dela e fica curioso", () => {
    expect(calcBlogStep(signals({ blogHover: 0 }))).toEqual({
      k: "h0",
      stop: "bl0",
      state: "curious",
    });
    expect(calcBlogStep(signals({ blogHover: 2 }))).toEqual({
      k: "h2",
      stop: "bl2",
      state: "curious",
    });
  });
});

describe("calcContactStep", () => {
  it("em repouso, o Giro do botão fica idle", () => {
    expect(calcContactStep(signals())).toEqual({ k: "idle", stop: "ct-send", state: "idle" });
  });

  it("digitando, fica curioso e a chave muda", () => {
    expect(calcContactStep(signals({ contactTyping: true }))).toEqual({
      k: "idlet",
      stop: "ct-send",
      state: "curious",
    });
  });

  it("cada fase do envio tem o seu rosto", () => {
    expect(calcContactStep(signals({ contactSend: "loading" })).state).toBe("loading");
    expect(calcContactStep(signals({ contactSend: "done" })).state).toBe("celebrating");
    expect(calcContactStep(signals({ contactSend: "error" })).state).toBe("error");
  });

  it("o envio vence a digitação no rosto, mas a chave ainda anota que digita", () => {
    expect(calcContactStep(signals({ contactSend: "loading", contactTyping: true }))).toEqual({
      k: "loadingt",
      stop: "ct-send",
      state: "loading",
    });
  });
});
