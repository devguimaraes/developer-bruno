import { describe, expect, it } from "vitest";
import {
  arc,
  computePileContact,
  createEntrySegments,
  DESKTOP_ENTRY_PATH,
  DIP_MAX,
  DIP_NEIGHBOR,
  DIP_PER_VI,
  dipLetters,
  KICK_MIN_VI,
  type Letter,
  type LetterSpring,
  launchPath,
  MOBILE_ENTRY_PATH,
  type PathHit,
  type Point,
  pathHit,
  stepLetterSprings,
  stepPath,
} from "./entry-path";
import { DESKTOP_STACK, layerHeights, makeCamera, project, stations } from "./stack";

const FPS = 60;
const DT = 1 / FPS;

/** Gera letras contíguas a partir de larguras e topos. */
function criarLetras(
  x0: number,
  larguras: readonly number[],
  topos: readonly number[],
  line = 0
): Letter[] {
  let x = x0;
  return larguras.map((w, i) => {
    const letra: Letter = {
      l: x + 3,
      r: x + w - 3,
      top: topos[i],
      line,
    };
    x += w;
    return letra;
  });
}

// "Interfaces" (10 letras) + "com vida." (8 letras com espaço entre elas)
const LARGURAS_L0 = [36, 78, 50, 72, 54, 46, 72, 66, 72, 64];
const TOPO_L0 = [100, 122, 110, 122, 122, 96, 122, 122, 122, 122];

const LARGURAS_L1 = [64, 68, 92, 60, 32, 68, 64, 30]; // c, o, m, v, i, d, a, .
const TOPO_L1 = [224, 224, 224, 224, 218, 224, 224, 224];

function letras1440(): Letter[] {
  const l0 = criarLetras(64, LARGURAS_L0, TOPO_L0, 0);
  const l1 = criarLetras(64, LARGURAS_L1, TOPO_L1, 1);
  return [...l0, ...l1];
}

function stack1440() {
  const origin: Point = { x: 1440 / 2 + 270, y: 900 * 0.69 };
  const cam = makeCamera(DESKTOP_STACK, origin, 1, 0, 0, 0);
  const zs = layerHeights(DESKTOP_STACK, [0, 0, 0, 0], [0, 0, 0, 0]);
  const st = stations(DESKTOP_STACK, cam, zs, 1);
  const c = project(cam, DESKTOP_STACK.s * 2, -DESKTOP_STACK.s * 2, zs[2]);
  const pilePoint = computePileContact(c, DESKTOP_ENTRY_PATH.R);
  const stationPoint = st[1];
  return { cam, zs, st, c, pilePoint, stationPoint };
}

describe("entry-path", () => {
  describe("arc", () => {
    it("calcula o tempo T a partir da altura física com gravidade", () => {
      const a = { x: 0, y: 100 };
      const b = { x: 200, y: 100 };
      const yA = 50; // sobe 50px acima de 100
      const g = 2600;
      const seg = arc(a, b, yA, g);

      const up = Math.sqrt((2 * 50) / g);
      const dn = Math.sqrt((2 * 50) / g);
      const expectedT = up + dn;

      expect(seg.T).toBeCloseTo(expectedT, 6);
      expect(seg.vx).toBeCloseTo(200 / expectedT, 6);
      expect(seg.vy).toBeCloseTo(-g * up, 6);
      expect(seg.ax).toBe(0);
      expect(seg.ay).toBe(100);
      expect(seg.bx).toBe(200);
      expect(seg.by).toBe(100);
    });

    it("respeita o piso mínimo de 0.08s para arcos muito rasos", () => {
      const a = { x: 0, y: 10 };
      const b = { x: 10, y: 10 };
      const seg = arc(a, b, 10, 2600);
      expect(seg.T).toBe(0.08);
      expect(seg.vx).toBeCloseTo(10 / 0.08, 6);
    });
  });

  describe("pathHit", () => {
    it("devolve o tipo de contato, o índice da letra se aplicável e vi = vy + g * T", () => {
      const a = { x: 0, y: 50 };
      const b = { x: 100, y: 100 };
      const g = 2600;
      const seg = arc(a, b, 20, g, { hit: "letter", i: 3 });

      const hit = pathHit(seg, g);
      expect(hit.type).toBe("letter");
      expect(hit.kind).toBe("letter");
      expect(hit.index).toBe(3);
      expect(hit.vi).toBeCloseTo(seg.vy + g * seg.T, 6);
    });
  });

  describe("Requisitos da Issue #106", () => {
    it("ordem dos cinco contatos (letter, letter, dot, pile, land)", () => {
      const letters = letras1440();
      const { pilePoint, stationPoint } = stack1440();
      const start: Point = { x: 155, y: -46 };

      const ball = launchPath({
        cfg: DESKTOP_ENTRY_PATH,
        start,
        letters,
        pilePoint,
        stationPoint,
        stageTop: 88,
      });

      expect(ball).not.toBeNull();
      if (!ball) return;

      const contacts: PathHit[] = [];
      let steps = 0;
      const maxSteps = 10_000;

      while (!ball.done && steps < maxSteps) {
        const res = stepPath(ball, DT);
        if (res.hit) {
          contacts.push(res.hit);
        }
        steps += 1;
      }

      expect(ball.done).toBe(true);
      expect(contacts).toHaveLength(5);
      expect(contacts.map(c => c.type)).toEqual(["letter", "letter", "dot", "pile", "land"]);

      // Verifica os índices das letras
      expect(contacts[0].index).toBe(DESKTOP_ENTRY_PATH.hops[0]);
      expect(contacts[1].index).toBe(DESKTOP_ENTRY_PATH.hops[1]);
      expect(contacts[2].index).toBe(letters.length - 1);
    });

    it("o topo do primeiro arco nunca passa de limite (limite = R + 6 - topoDoPalco)", () => {
      const letters = letras1440();
      const { pilePoint, stationPoint } = stack1440();
      const R = DESKTOP_ENTRY_PATH.R;

      // Cenário real do desktop: topoDoPalco = 88px, limite = 32 + 6 - 88 = -50px
      const stageTop = 88;
      const limit = R + 6 - stageTop; // -50
      const start: Point = { x: 155, y: -46 };

      const segs = createEntrySegments({
        cfg: DESKTOP_ENTRY_PATH,
        start,
        letters,
        pilePoint,
        stationPoint,
        stageTop,
      });

      // Sem limite, o topo subiria até min(S.y, P1.y) - h0 = -46 - 70 = -116px (cortando a tela)
      const semLimite = Math.min(start.y, segs[0].by) - DESKTOP_ENTRY_PATH.h0;
      expect(semLimite).toBe(-116);
      expect(semLimite).toBeLessThan(limit);

      // Com o limite aplicado, o primeiro arco é travado exatamente em limit
      const topCalculado =
        Math.min(segs[0].ay, segs[0].by) - (segs[0].vy * segs[0].vy) / (2 * DESKTOP_ENTRY_PATH.g);
      expect(topCalculado).toBeCloseTo(limit, 4);
      expect(topCalculado).toBeGreaterThanOrEqual(limit - 1e-4);

      // Cenário com diferentes alturas do palco onde S e P1 estão abaixo de limit
      for (const st of [40, 88, 120]) {
        const lim = R + 6 - st;
        // Ponto de início na assinatura (42px em coordenadas absolutas da tela)
        const sPoint = { x: 155, y: 42 - st };
        const s = createEntrySegments({
          cfg: DESKTOP_ENTRY_PATH,
          start: sPoint,
          letters,
          pilePoint,
          stationPoint,
          stageTop: st,
        });
        const yTop = Math.min(s[0].ay, s[0].by) - (s[0].vy * s[0].vy) / (2 * DESKTOP_ENTRY_PATH.g);
        expect(yTop).toBeGreaterThanOrEqual(lim - 1e-4);
      }
    });

    it("o tempo total não muda com a largura do palco", () => {
      const letters = letras1440();
      const { pilePoint, stationPoint } = stack1440();
      const start: Point = { x: 155, y: -46 };

      const segsNormal = createEntrySegments({
        cfg: DESKTOP_ENTRY_PATH,
        start,
        letters,
        pilePoint,
        stationPoint,
        stageTop: 88,
      });

      // Desloca horizontalmente o palco todo (simulando tela de 2500px de largura com letras espalhadas)
      const lettersLargo = letters.map(L => ({
        ...L,
        l: L.l * 2 + 300,
        r: L.r * 2 + 300,
      }));
      const pilePointLargo = { x: pilePoint.x + 800, y: pilePoint.y };
      const stationPointLargo = { x: stationPoint.x + 800, y: stationPoint.y };
      const startLargo = { x: start.x + 200, y: start.y };

      const segsLargo = createEntrySegments({
        cfg: DESKTOP_ENTRY_PATH,
        start: startLargo,
        letters: lettersLargo,
        pilePoint: pilePointLargo,
        stationPoint: stationPointLargo,
        stageTop: 88,
      });

      const totalTimeNormal = segsNormal.reduce((sum, s) => sum + s.T, 0);
      const totalTimeLargo = segsLargo.reduce((sum, s) => sum + s.T, 0);

      // O tempo deve ser idêntico porque os y não mudaram
      expect(totalTimeLargo).toBeCloseTo(totalTimeNormal, 6);

      for (let i = 0; i < 5; i += 1) {
        expect(segsLargo[i].T).toBeCloseTo(segsNormal[i].T, 6);
        expect(segsLargo[i].vy).toBeCloseTo(segsNormal[i].vy, 6);
      }
    });

    it("cada arco termina exatamente no ponto de início do próximo arco (bx == ax, by == ay)", () => {
      const letters = letras1440();
      const { pilePoint, stationPoint } = stack1440();
      const start: Point = { x: 155, y: -46 };

      const segs = createEntrySegments({
        cfg: DESKTOP_ENTRY_PATH,
        start,
        letters,
        pilePoint,
        stationPoint,
        stageTop: 88,
      });

      expect(segs).toHaveLength(5);
      for (let i = 0; i < segs.length - 1; i += 1) {
        expect(segs[i].bx).toBe(segs[i + 1].ax);
        expect(segs[i].by).toBe(segs[i + 1].ay);
      }
    });

    it("no computador, com letras medidas em 1440px, o pouso cai perto de 2.49s", () => {
      const letters = letras1440();
      const { pilePoint, stationPoint } = stack1440();
      const start: Point = { x: 155, y: -46 };

      const ball = launchPath({
        cfg: DESKTOP_ENTRY_PATH,
        start,
        letters,
        pilePoint,
        stationPoint,
        stageTop: 88,
      });

      expect(ball).not.toBeNull();
      if (!ball) return;

      const totalArcDuration = ball.segs.reduce((sum, s) => sum + s.T, 0);
      // A duração exata calculada com a física é ~2.4909s
      expect(totalArcDuration).toBeCloseTo(2.49, 2);

      // Simulando quadro a quadro (passos discretos de 60 FPS)
      let simTime = 0;
      let landTime: number | null = null;
      while (!ball.done && simTime < 5.0) {
        simTime += DT;
        const res = stepPath(ball, DT);
        if (res.hit && res.hit.type === "land") {
          landTime = simTime;
        }
      }

      expect(landTime).not.toBeNull();
      if (landTime !== null) {
        expect(landTime).toBeCloseTo(2.49, 1);
      }
    });

    it("stepLetterSprings e dipLetters mantêm o comportamento de amortecimento correto", () => {
      const trio: Letter[] = [
        { l: 0, r: 30, top: 100, line: 0 },
        { l: 30, r: 60, top: 100, line: 0 },
        { l: 60, r: 90, top: 100, line: 0 },
      ];
      const zeros = (): LetterSpring[] => [
        { y: 0, v: 0 },
        { y: 0, v: 0 },
        { y: 0, v: 0 },
      ];

      // Afunda a letra tocada e 35% nas vizinhas da mesma linha
      const molas = zeros();
      dipLetters(molas, trio, 1, 200);
      const expectedK = 200 * DIP_PER_VI; // 32
      expect(molas[1].v).toBeCloseTo(expectedK, 6);
      expect(molas[0].v).toBeCloseTo(expectedK * DIP_NEIGHBOR, 6);
      expect(molas[2].v).toBeCloseTo(expectedK * DIP_NEIGHBOR, 6);

      // Não afunda com contato leve (vi <= 120)
      const molasLeves = zeros();
      dipLetters(molasLeves, trio, 1, KICK_MIN_VI);
      expect(molasLeves).toEqual(zeros());

      // Não afunda vizinha em outra linha
      const outraLinha = trio.map((L, i) => (i === 2 ? { ...L, line: 1 } : L));
      const molasLinha = zeros();
      dipLetters(molasLinha, outraLinha, 1, 200);
      expect(molasLinha[2].v).toBe(0);
      expect(molasLinha[0].v).toBeCloseTo(expectedK * DIP_NEIGHBOR, 6);

      // Limita ao teto DIP_MAX
      const molasMax = zeros();
      dipLetters(molasMax, trio, 1, 5000);
      expect(molasMax[1].v).toBeCloseTo(DIP_MAX, 6);

      // stepLetterSprings assenta e zera molas que assentam (|y| e |v| < 0.02)
      const molasAssentadas: LetterSpring[] = [
        { y: 0.005, v: 0 },
        { y: 0, v: 0.001 },
      ];
      expect(stepLetterSprings(molasAssentadas, DT)).toBe(true);
      expect(molasAssentadas[0]).toEqual({ y: 0, v: 0 });
      expect(molasAssentadas[1]).toEqual({ y: 0, v: 0 });
    });
  });

  describe("Física de deformação, rolagem e escala", () => {
    it("amasso (squash) oscila com mola e fica limitado a [-0.22, 0.32]", () => {
      const letters = letras1440();
      const { pilePoint, stationPoint } = stack1440();
      const ball = launchPath({
        cfg: DESKTOP_ENTRY_PATH,
        start: { x: 155, y: -46 },
        letters,
        pilePoint,
        stationPoint,
        stageTop: 88,
      });
      expect(ball).not.toBeNull();
      if (!ball) return;

      ball.q = 0.5; // forçado além do máximo
      ball.qv = 100;
      stepPath(ball, DT);
      expect(ball.q).toBeLessThanOrEqual(0.32);

      ball.q = -0.5; // forçado além do mínimo
      ball.qv = -100;
      stepPath(ball, DT);
      expect(ball.q).toBeGreaterThanOrEqual(-0.22);
    });

    it("estica (stretch) reage à velocidade e limita a 0.14", () => {
      const letters = letras1440();
      const { pilePoint, stationPoint } = stack1440();
      const ball = launchPath({
        cfg: DESKTOP_ENTRY_PATH,
        start: { x: 155, y: -46 },
        letters,
        pilePoint,
        stationPoint,
        stageTop: 88,
      });
      expect(ball).not.toBeNull();
      if (!ball) return;

      for (let i = 0; i < 60; i += 1) {
        stepPath(ball, DT);
        expect(ball.s).toBeLessThanOrEqual(0.14);
        expect(ball.s).toBeGreaterThanOrEqual(0);
      }
    });

    it("no arco front a escala cresce com seno pi * t / T", () => {
      const letters = letras1440();
      const { pilePoint, stationPoint } = stack1440();
      const ball = launchPath({
        cfg: DESKTOP_ENTRY_PATH,
        start: { x: 155, y: -46 },
        letters,
        pilePoint,
        stationPoint,
        stageTop: 88,
        initialScale: 1,
      });
      expect(ball).not.toBeNull();
      if (!ball) return;

      // Pula até o terceiro arco (i = 2, front: true)
      ball.i = 2;
      ball.t = ball.segs[2].T / 2; // ponto central do arco front
      stepPath(ball, 0.0001);

      // gscale no meio do arco front deve ser scale + 0.14 * sin(pi * 0.5) = scale + 0.14
      expect(ball.gscale).toBeGreaterThan(ball.scale);
      expect(ball.gscale).toBeCloseTo(ball.scale + 0.14, 2);
    });

    it("suporta configuração de celular (MOBILE_ENTRY_PATH)", () => {
      const letters = letras1440();
      const startMobile: Point = { x: 195, y: 770 };
      const pileMobile: Point = { x: 130, y: 450 };
      const stationMobile: Point = { x: 251, y: 489 };

      const ball = launchPath({
        cfg: MOBILE_ENTRY_PATH,
        start: startMobile,
        letters,
        pilePoint: pileMobile,
        stationPoint: stationMobile,
        stageTop: 0,
      });

      expect(ball).not.toBeNull();
      if (!ball) return;
      expect(ball.cfg.g).toBe(2400);
      expect(ball.cfg.R).toBe(22);

      const hits: PathHit[] = [];
      while (!ball.done) {
        const res = stepPath(ball, DT);
        if (res.hit) hits.push(res.hit);
      }
      expect(hits).toHaveLength(5);
      expect(hits[4].type).toBe("land");
    });
  });
});
