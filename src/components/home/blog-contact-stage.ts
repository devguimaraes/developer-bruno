import type { ChapterStep } from "./story/chapters";
import type { StorySignals } from "./story/story-signals";

/** Blog: o Giro cochila em cima da régua até o ponteiro chegar numa linha. */
export function calcBlogStep(signals: Pick<StorySignals, "blogHover">): ChapterStep {
  const i = signals.blogHover;
  if (i < 0) return { k: "nap", stop: "bl-nap", state: "sleeping" };
  return { k: `h${i}`, stop: `bl${i}`, state: "curious" };
}

/** Contato: o Giro é o botão. Envio manda no rosto; sem envio, digitar o deixa curioso. */
export function calcContactStep(
  signals: Pick<StorySignals, "contactSend" | "contactTyping">
): ChapterStep {
  const { contactSend: send, contactTyping: typing } = signals;
  const state =
    send === "loading"
      ? "loading"
      : send === "done"
        ? "celebrating"
        : send === "error"
          ? "error"
          : typing
            ? "curious"
            : "idle";
  return { k: send + (typing ? "t" : ""), stop: "ct-send", state };
}
