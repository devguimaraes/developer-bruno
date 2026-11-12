import { describe, expect, it, vi } from "vitest";
import { BEAT_MAX, calcBeatDuration, calcBeatIndex, createBeatPlayer } from "./beats";

describe("calcBeatDuration", () => {
  it("entre batidas vizinhas é o tempo da própria cena", () => {
    expect(calcBeatDuration(0.8, 1.95)).toBeCloseTo(1.15, 5);
    expect(calcBeatDuration(1.95, 0.8)).toBeCloseTo(1.15, 5);
  });

  it("pulando várias batidas não passa do teto", () => {
    expect(calcBeatDuration(0, 3.95)).toBe(BEAT_MAX);
  });

  it("já na batida não há o que tocar", () => {
    expect(calcBeatDuration(2.9, 2.9)).toBe(0);
  });
});

describe("calcBeatIndex", () => {
  const starts = [1, 2, 3.5];

  it("antes da primeira batida devolve -1", () => {
    expect(calcBeatIndex(0.99, starts)).toBe(-1);
  });

  it("devolve a última batida alcançada", () => {
    expect(calcBeatIndex(1, starts)).toBe(0);
    expect(calcBeatIndex(3.49, starts)).toBe(1);
    expect(calcBeatIndex(9, starts)).toBe(2);
  });
});

describe("createBeatPlayer", () => {
  const fakeTimeline = (now: number) => {
    const chase = { kill: vi.fn() };
    const timeline = {
      time: vi.fn((value?: number) => (value === undefined ? now : timeline)),
      tweenTo: vi.fn(() => chase),
      kill: vi.fn(),
    };
    return { timeline, chase };
  };
  type Timeline = Parameters<typeof createBeatPlayer>[0];

  it("toca até a batida com a duração calculada a partir de onde a cena está", () => {
    const { timeline } = fakeTimeline(0.8);
    createBeatPlayer(timeline as unknown as Timeline).playTo(1.95);
    expect(timeline.tweenTo).toHaveBeenCalledWith(1.95, {
      duration: expect.closeTo(1.15, 5),
      ease: "power1.out",
    });
  });

  it("uma batida nova interrompe a perseguição anterior", () => {
    const { timeline, chase } = fakeTimeline(0);
    const player = createBeatPlayer(timeline as unknown as Timeline);
    player.playTo(0.8);
    player.playTo(1.95);
    expect(chase.kill).toHaveBeenCalledTimes(1);
  });

  it("jumpTo põe a cena no ponto sem animar e cancela a perseguição", () => {
    const { timeline, chase } = fakeTimeline(0);
    const player = createBeatPlayer(timeline as unknown as Timeline);
    player.playTo(0.8);
    player.jumpTo(2.9);
    expect(chase.kill).toHaveBeenCalledTimes(1);
    expect(timeline.time).toHaveBeenCalledWith(2.9);
  });

  it("kill encerra a perseguição e a linha do tempo", () => {
    const { timeline, chase } = fakeTimeline(0);
    const player = createBeatPlayer(timeline as unknown as Timeline);
    player.playTo(0.8);
    player.kill();
    expect(chase.kill).toHaveBeenCalled();
    expect(timeline.kill).toHaveBeenCalled();
  });
});
