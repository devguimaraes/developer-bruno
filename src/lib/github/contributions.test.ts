import { describe, expect, it, vi } from "vitest";
import { fetchContributionCalendar, parseContributionCalendar } from "./contributions";

function payload(weeks: { date: string; contributionLevel: string }[][], total = 12) {
  return {
    data: {
      viewer: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: total,
            weeks: weeks.map(contributionDays => ({ contributionDays })),
          },
        },
      },
    },
  };
}

const WEEKS = [
  [
    { date: "2026-11-13", contributionLevel: "NONE" },
    { date: "2026-11-14", contributionLevel: "FOURTH_QUARTILE" },
  ],
  [{ date: "2026-11-15", contributionLevel: "FIRST_QUARTILE" }],
];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

describe("parseContributionCalendar", () => {
  it("reduz a resposta ao total, ao primeiro dia e a um nível por dia", () => {
    expect(parseContributionCalendar(payload(WEEKS))).toEqual({
      ok: true,
      calendar: { total: 12, start: "2026-11-13", levels: "041" },
    });
  });

  it("recusa resposta fora do formato, como o erro de token sem permissão", () => {
    const result = parseContributionCalendar({ errors: [{ message: "Bad credentials" }] });
    expect(result).toMatchObject({ ok: false, reason: "invalid" });
  });

  it("recusa nível que a grade não conhece", () => {
    const weeks = [[{ date: "2026-11-15", contributionLevel: "FIFTH_QUARTILE" }]];
    expect(parseContributionCalendar(payload(weeks))).toMatchObject({ ok: false });
  });
});

describe("fetchContributionCalendar", () => {
  it("sem token não chama a API", async () => {
    const fetchImpl = vi.fn();
    const result = await fetchContributionCalendar({ token: undefined, fetchImpl });
    expect(result).toEqual({ ok: false, reason: "no-token" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("manda o token no cabeçalho e devolve o calendário", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(payload(WEEKS, 2381)));
    const result = await fetchContributionCalendar({ token: "segredo", fetchImpl });
    expect(result).toMatchObject({ ok: true, calendar: { total: 2381 } });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.github.com/graphql");
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer segredo");
  });

  it("resposta de erro vira falha de pedido, com o status", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ message: "Bad credentials" }, 401));
    const result = await fetchContributionCalendar({ token: "vencido", fetchImpl });
    expect(result).toEqual({ ok: false, reason: "request", detail: "HTTP 401" });
  });

  it("queda de rede não lança: volta como falha de pedido", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("network down");
    });
    const result = await fetchContributionCalendar({ token: "segredo", fetchImpl });
    expect(result).toEqual({ ok: false, reason: "request", detail: "network down" });
  });
});
