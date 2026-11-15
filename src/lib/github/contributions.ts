import { z } from "zod";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const REQUEST_TIMEOUT_MS = 8000;

// `viewer` é o dono do token: só assim as contribuições em repositórios privados entram na conta.
const QUERY = `query {
  viewer {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionLevel } }
      }
    }
  }
}`;

const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const;

const levelSchema = z.enum([
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
]);

const responseSchema = z.object({
  data: z.object({
    viewer: z.object({
      contributionsCollection: z.object({
        contributionCalendar: z.object({
          totalContributions: z.number().int().nonnegative(),
          weeks: z
            .array(
              z.object({
                contributionDays: z
                  .array(
                    z.object({
                      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
                      contributionLevel: levelSchema,
                    })
                  )
                  .min(1)
                  .max(7),
              })
            )
            .min(1),
        }),
      }),
    }),
  }),
});

/**
 * Calendário já enxuto para ir nas props da página: só o nível de cada dia, sem contagem
 * nem nome de repositório.
 */
export interface ContributionCalendar {
  total: number;
  /** Primeiro dia, AAAA-MM-DD. Os dias seguem em ordem, sem buracos. */
  start: string;
  /** Um dígito de 0 a 4 por dia, a partir de `start`. */
  levels: string;
}

export type ContributionFailure = "no-token" | "request" | "invalid";

export type ContributionResult =
  | { ok: true; calendar: ContributionCalendar }
  | { ok: false; reason: ContributionFailure; detail?: string };

/** Valida a resposta da API e reduz ao que a grade precisa. */
export function parseContributionCalendar(payload: unknown): ContributionResult {
  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, reason: "invalid", detail: parsed.error.issues[0]?.message };
  }
  const calendar = parsed.data.data.viewer.contributionsCollection.contributionCalendar;
  const days = calendar.weeks.flatMap(week => week.contributionDays);
  const first = days[0];
  if (!first) return { ok: false, reason: "invalid", detail: "empty calendar" };
  return {
    ok: true,
    calendar: {
      total: calendar.totalContributions,
      start: first.date,
      levels: days.map(day => LEVELS[day.contributionLevel]).join(""),
    },
  };
}

export interface FetchContributionsOptions {
  token: string | undefined;
  fetchImpl?: typeof fetch;
}

/** Busca o calendário de contribuições do dono do token. Nunca lança: a falha volta no resultado. */
export async function fetchContributionCalendar({
  token,
  fetchImpl = fetch,
}: FetchContributionsOptions): Promise<ContributionResult> {
  if (!token) return { ok: false, reason: "no-token" };
  try {
    const response = await fetchImpl(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "portfolio-build",
      },
      body: JSON.stringify({ query: QUERY }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return { ok: false, reason: "request", detail: `HTTP ${response.status}` };
    return parseContributionCalendar(await response.json());
  } catch (error) {
    return {
      ok: false,
      reason: "request",
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

let cached: Promise<ContributionResult> | null = null;

/**
 * Uma busca por processo: no build a página é gerada uma vez, mas no `astro dev` o frontmatter
 * roda a cada pedido. Falha de rede não fica em cache, para a próxima tentativa poder acertar.
 */
export function loadContributionCalendar(token: string | undefined): Promise<ContributionResult> {
  if (cached) return cached;
  const pending = fetchContributionCalendar({ token });
  cached = pending;
  void pending.then(result => {
    if (!result.ok && result.reason === "request" && cached === pending) cached = null;
  });
  return pending;
}
