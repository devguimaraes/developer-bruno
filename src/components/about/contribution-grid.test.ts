import { describe, expect, it } from "vitest";
import { GRID_STEP, GRID_TOP, layoutContributionGrid } from "./contribution-grid";

/** `days` dias seguidos a partir de `start`, todos no nível 1. */
function calendar(start: string, days: number) {
  return { start, levels: "1".repeat(days) };
}

describe("layoutContributionGrid", () => {
  it("põe as semanas em colunas, com domingo em cima", () => {
    // 2026-11-01 é domingo.
    const grid = layoutContributionGrid({ start: "2026-11-01", levels: "0123401" });
    expect(grid.cells).toHaveLength(7);
    expect(grid.cells[0]).toEqual({ x: 0, y: GRID_TOP, level: 0 });
    expect(grid.cells[6]).toEqual({ x: 0, y: GRID_TOP + 6 * GRID_STEP, level: 1 });
  });

  it("começa a primeira coluna no dia da semana do primeiro dia", () => {
    // 2026-11-04 é quarta: a coluna começa na quarta linha e vira no domingo seguinte.
    const grid = layoutContributionGrid(calendar("2026-11-04", 5));
    expect(grid.cells[0]).toMatchObject({ x: 0, y: GRID_TOP + 3 * GRID_STEP });
    expect(grid.cells[4]).toMatchObject({ x: GRID_STEP, y: GRID_TOP });
  });

  it("um ano de dados dá 53 colunas e cabe na coluna de 800 px do desktop", () => {
    // 2025-11-16 é domingo; 365 dias terminam num domingo, sozinho na última coluna.
    const grid = layoutContributionGrid(calendar("2025-11-16", 365));
    expect(grid.width).toBe(53 * GRID_STEP - 3);
    expect(grid.width).toBeLessThanOrEqual(800);
    expect(grid.cells).toHaveLength(365);
  });

  it("com lastWeeks mostra só as semanas mais recentes, a partir do x zero", () => {
    const grid = layoutContributionGrid(calendar("2025-11-16", 365), 26);
    expect(grid.width).toBe(26 * GRID_STEP - 3);
    expect(grid.cells).toHaveLength(25 * 7 + 1);
    expect(grid.cells[0]).toMatchObject({ x: 0, y: GRID_TOP });
    expect(Math.max(...grid.cells.map(cell => cell.x))).toBe(25 * GRID_STEP);
  });

  it("nomeia cada mês na primeira semana que começa dentro dele", () => {
    const grid = layoutContributionGrid(calendar("2025-11-16", 365));
    // dez de 2025 a nov de 2026: o novembro de partida começou antes da grade.
    expect(grid.months.map(label => label.month)).toEqual([11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    // 2025-12-07 é o primeiro domingo de dezembro, na quarta coluna.
    expect(grid.months[0]).toEqual({ x: 3 * GRID_STEP, month: 11 });
  });

  it("não põe nome de mês na última coluna, onde ele sairia cortado", () => {
    // Termina no domingo 2026-12-06, primeiro domingo de dezembro.
    const grid = layoutContributionGrid(calendar("2026-11-01", 36));
    expect(grid.months.map(label => label.month)).toEqual([10]);
  });
});
