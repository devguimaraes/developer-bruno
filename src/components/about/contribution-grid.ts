import type { ContributionCalendar } from "@/lib/github/contributions";

/** Lado da célula e passo entre células, em unidades do viewBox. */
export const GRID_CELL = 12;
export const GRID_STEP = 15;
/** Faixa de cima, onde ficam os nomes dos meses. */
export const GRID_TOP = 20;
/** Distância mínima entre dois nomes de mês, em colunas, para não encavalarem. */
const MIN_LABEL_GAP = 3;
const DAY_MS = 86_400_000;

export interface GridCell {
  x: number;
  y: number;
  /** 0 a 4. */
  level: number;
}

export interface GridMonth {
  x: number;
  /** 0 (janeiro) a 11. */
  month: number;
}

export interface ContributionGrid {
  width: number;
  height: number;
  cells: GridCell[];
  months: GridMonth[];
}

/**
 * Posição de cada dia na grade: semanas em colunas, domingo em cima. Com `lastWeeks`, só as
 * colunas mais recentes entram (o celular mostra seis meses).
 */
export function layoutContributionGrid(
  calendar: Pick<ContributionCalendar, "start" | "levels">,
  lastWeeks?: number
): ContributionGrid {
  const start = new Date(`${calendar.start}T00:00:00Z`);
  const offset = start.getUTCDay();
  const dayCount = calendar.levels.length;
  const columns = Math.ceil((dayCount + offset) / 7);
  const firstColumn = lastWeeks === undefined ? 0 : Math.max(0, columns - lastWeeks);
  const shown = columns - firstColumn;

  const cells: GridCell[] = [];
  const months: GridMonth[] = [];
  let lastLabel = -MIN_LABEL_GAP;

  for (let i = 0; i < dayCount; i += 1) {
    const column = Math.floor((i + offset) / 7) - firstColumn;
    if (column < 0) continue;
    const row = (i + offset) % 7;
    cells.push({
      x: column * GRID_STEP,
      y: GRID_TOP + row * GRID_STEP,
      level: Number(calendar.levels[i]),
    });

    // O mês ganha nome na primeira semana que começa dentro dele, menos na última coluna.
    const date = new Date(start.getTime() + i * DAY_MS);
    const opensMonth = row === 0 && date.getUTCDate() <= 7;
    if (opensMonth && column - lastLabel >= MIN_LABEL_GAP && column < shown - 1) {
      months.push({ x: column * GRID_STEP, month: date.getUTCMonth() });
      lastLabel = column;
    }
  }

  return {
    width: shown * GRID_STEP - (GRID_STEP - GRID_CELL),
    height: GRID_TOP + 7 * GRID_STEP - (GRID_STEP - GRID_CELL),
    cells,
    months,
  };
}
