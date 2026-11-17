import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { getLocale, setLocale } from "@/lib/i18n";
import { LanguageSwitch } from "./LanguageSwitch";

vi.mock("@/lib/i18n", () => ({
  locales: ["pt", "en"],
  getLocale: vi.fn(() => "pt"),
  setLocale: vi.fn(),
  subscribeToLocale: vi.fn(() => () => {}),
}));

beforeEach(() => {
  vi.mocked(getLocale).mockReturnValue("pt");
  vi.mocked(setLocale).mockClear();
});

describe("LanguageSwitch", () => {
  it("é um grupo com o nome passado e dois botões pt e en", () => {
    render(<LanguageSwitch groupLabel="Idioma" />);
    expect(screen.getByRole("group", { name: "Idioma" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "pt" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "en" })).toBeTruthy();
  });

  it("aria-pressed marca só o idioma atual", () => {
    vi.mocked(getLocale).mockReturnValue("en");
    render(<LanguageSwitch groupLabel="Idioma" />);
    expect(screen.getByRole("button", { name: "en" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "pt" }).getAttribute("aria-pressed")).toBe("false");
  });

  it("clicar numa opção chama setLocale com o idioma escolhido", () => {
    render(<LanguageSwitch groupLabel="Idioma" />);
    fireEvent.click(screen.getByRole("button", { name: "en" }));
    expect(setLocale).toHaveBeenCalledWith("en");
  });
});
