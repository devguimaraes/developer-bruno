import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitContact } from "@/lib/contact";
import { setLocale } from "@/lib/i18n";
import { ContactForm } from "./ContactForm";

vi.mock("@/lib/contact", async importOriginal => {
  const actual = await importOriginal<typeof import("@/lib/contact")>();
  return { ...actual, submitContact: vi.fn() };
});

const submitMock = vi.mocked(submitContact);

function fillValid(container: HTMLElement) {
  fireEvent.change(screen.getByLabelText("nome"), { target: { value: "Ana Souza" } });
  fireEvent.change(screen.getByLabelText("e-mail"), { target: { value: "ana@empresa.com.br" } });
  fireEvent.change(screen.getByLabelText("mensagem"), {
    target: { value: "Preciso de um site para a loja." },
  });
  const honeypot = container.querySelector<HTMLInputElement>('input[name="hp_extra"]');
  expect(honeypot).not.toBeNull();
}

describe("ContactForm", () => {
  beforeEach(() => {
    submitMock.mockReset();
  });

  afterEach(() => {
    setLocale("pt");
  });

  it("tem nome, e-mail, tipo de projeto e mensagem", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("nome")).toBeInTheDocument();
    expect(screen.getByLabelText("e-mail")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "tipo de projeto" })).toBeInTheDocument();
    expect(screen.getByLabelText("mensagem")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "site" })).toHaveAttribute("aria-pressed", "false");
  });

  it("escolhe um tipo de projeto e desfaz a escolha ao clicar de novo", () => {
    render(<ContactForm />);
    const site = screen.getByRole("button", { name: "site" });
    fireEvent.click(site);
    expect(site).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(site);
    expect(site).toHaveAttribute("aria-pressed", "false");
  });

  it("campo armadilha fica fora da tela e fora da tabulação", () => {
    const { container } = render(<ContactForm />);
    const honeypot = container.querySelector<HTMLInputElement>('input[name="hp_extra"]');
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("aria-hidden", "true");
    expect(honeypot).toHaveClass("g-sr");
  });

  it("sem preencher, mostra erro em cada campo obrigatório e não envia", () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    expect(screen.getByText("Escreva seu nome.")).toBeInTheDocument();
    expect(screen.getByText("Escreva seu e-mail.")).toBeInTheDocument();
    expect(screen.getByText("Escreva uma mensagem.")).toBeInTheDocument();
    expect(screen.getByLabelText("nome")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("nome")).toHaveAttribute("aria-describedby");
    expect(submitMock).not.toHaveBeenCalled();
  });

  it("aponta e-mail incompleto com mensagem própria", () => {
    const { container } = render(<ContactForm />);
    fillValid(container);
    fireEvent.change(screen.getByLabelText("e-mail"), { target: { value: "ana@empresa" } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensagem" }));
    expect(
      screen.getByText("Esse e-mail está incompleto. Confira o @ e o domínio.")
    ).toBeInTheDocument();
    expect(submitMock).not.toHaveBeenCalled();
  });

  it("com dados válidos, envia e mostra o sucesso com opção de escrever outra", async () => {
    submitMock.mockResolvedValue("ok");
    const { container } = render(<ContactForm />);
    fillValid(container);
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    expect(submitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Ana Souza",
        email: "ana@empresa.com.br",
        message: "Preciso de um site para a loja.",
        hp_extra: "",
      })
    );
    expect(
      await screen.findByText("Recebi sua mensagem. A resposta vai para o e-mail que você deixou.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Escrever outra" })).toBeInTheDocument();
  });

  it("limite de envios mostra o aviso de espera", async () => {
    submitMock.mockResolvedValue("rate_limit");
    const { container } = render(<ContactForm />);
    fillValid(container);
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensagem" }));
    expect(
      await screen.findByText("Muitos envios seguidos. Espere alguns minutos e tente de novo.")
    ).toBeInTheDocument();
  });

  it("falha de envio mostra o aviso de erro e deixa tentar de novo", async () => {
    submitMock.mockResolvedValue("error");
    const { container } = render(<ContactForm />);
    fillValid(container);
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    expect(
      await screen.findByText(
        "Não deu para enviar. Tente de novo ou escreva para o e-mail ao lado."
      )
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Enviar mensagem" })).toBeEnabled()
    );
  });

  it("em inglês, usa as mensagens em inglês", () => {
    setLocale("en");
    render(<ContactForm />);
    expect(screen.getByLabelText("name")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(screen.getByText("Enter your name.")).toBeInTheDocument();
  });
});
