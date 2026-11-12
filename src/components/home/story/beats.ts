/** Tempo máximo, em segundos, para a cena alcançar a batida quando a rolagem pula várias. */
export const BEAT_MAX = 1.3;

/**
 * Quanto a cena leva para ir de `from` até `to`, em segundos. Entre batidas vizinhas é o tempo da
 * própria cena; pulando várias, o teto.
 */
export function calcBeatDuration(from: number, to: number, max = BEAT_MAX): number {
  return Math.min(max, Math.abs(to - from));
}

/**
 * Última batida já alcançada para um ponto `t` do capítulo: `starts[i]` é onde a batida i começa.
 * Devolve -1 antes da primeira.
 */
export function calcBeatIndex(t: number, starts: readonly number[]): number {
  let index = -1;
  for (let i = 0; i < starts.length; i += 1) {
    if (t >= starts[i]) index = i;
  }
  return index;
}

export interface BeatPlayer {
  /** Toca a cena até `time`, no tempo, a partir de onde ela estiver. */
  playTo: (time: number) => void;
  /** Põe a cena direto em `time`, sem animar (montagem e remontagem no resize). */
  jumpTo: (time: number) => void;
  kill: () => void;
}

/**
 * Toca as batidas de um capítulo: a rolagem escolhe a batida e a linha do tempo, pausada, vai até
 * o ponto em que o desenho dela está completo, mesmo com a rolagem parada.
 */
export function createBeatPlayer(timeline: gsap.core.Timeline): BeatPlayer {
  let chase: gsap.core.Tween | null = null;
  const stop = () => {
    chase?.kill();
    chase = null;
  };
  return {
    playTo(time) {
      stop();
      chase = timeline.tweenTo(time, {
        duration: calcBeatDuration(timeline.time(), time),
        ease: "power1.out",
      });
    },
    jumpTo(time) {
      stop();
      timeline.time(time);
    },
    kill() {
      stop();
      timeline.kill();
    },
  };
}
