import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setLocale } from "@/lib/i18n";
import { HomeProcess } from "./HomeProcess";
import { calcProcessScrollTop } from "./process-stage";

afterEach(() => {
  setLocale("pt");
  document.documentElement.removeAttribute("data-scenes");
  vi.restoreAllMocks();
});

describe("HomeProcess", () => {
  it("tem o título e as quatro etapas em ordem, cada uma com o que você recebe e as ferramentas", () => {
    render(<HomeProcess />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Do escopo ao deploy." })
    ).toBeInTheDocument();
    expect(screen.getByText("// processo")).toBeInTheDocument();

    const names = screen.getAllByRole("heading", { level: 3 }).map(h => h.textContent);
    expect(names).toEqual(["Conversa", "Desenho", "Código", "Entrega"]);
    expect(screen.getByText("etapa 01 de 04")).toBeInTheDocument();
    expect(screen.getByText("escopo e prazo por escrito")).toBeInTheDocument();
    expect(screen.getAllByText("você recebe")).toHaveLength(4);

    const [talkTools] = screen.getAllByRole("list");
    expect(
      within(talkTools)
        .getAllByRole("listitem")
        .map(li => li.textContent)
    ).toEqual(["Google Meet", "WhatsApp", "Slack", "Google Drive", "Linear"]);
  });

  it("marca as estações do Giro na linha", () => {
    const { container } = render(<HomeProcess />);
    const stops = [...container.querySelectorAll("[data-stop]")].map(n =>
      n.getAttribute("data-stop")
    );
    expect(stops).toEqual(["pc0", "pc1", "pc2", "pc3"]);
  });

  it("clicar numa estação mostra a etapa dela e acende a linha até ali", () => {
    render(<HomeProcess />);
    fireEvent.click(screen.getByRole("button", { name: "Código" }));

    expect(screen.getByRole("button", { name: "Código" })).toHaveAttribute("aria-current", "step");
    const slots = document.querySelectorAll(".pc-slot");
    expect([...slots].map(s => s.classList.contains("is-on"))).toEqual([false, false, true, false]);
    const past = [...document.querySelectorAll(".pc-st")].map(s => s.classList.contains("is-past"));
    expect(past).toEqual([true, true, true, false]);
  });

  it("com as cenas ligadas, clicar numa estação rola até a etapa", () => {
    document.documentElement.setAttribute("data-scenes", "on");
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<HomeProcess />);
    const section = document.getElementById("processo") as HTMLElement;
    Object.defineProperty(section, "offsetHeight", { configurable: true, value: 4000 });

    fireEvent.click(screen.getByRole("button", { name: "Entrega" }));

    const len = 4000 - window.innerHeight;
    expect(scrollTo).toHaveBeenCalledWith({
      top: calcProcessScrollTop(3, 0, len),
      behavior: "smooth",
    });
  });

  it("em inglês troca título e etapas", () => {
    setLocale("en");
    render(<HomeProcess />);
    expect(screen.getByRole("heading", { level: 2, name: "Scope to deploy." })).toBeInTheDocument();
    expect(screen.getByText("stage 01 of 04")).toBeInTheDocument();
  });
});
