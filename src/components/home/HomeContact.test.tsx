import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { contactData } from "@/config/site";
import { HomeContact } from "./HomeContact";

describe("HomeContact", () => {
  it("mostra o título Contato e o formulário", () => {
    render(<HomeContact />);
    expect(screen.getByRole("heading", { level: 2, name: "Contato" })).toBeInTheDocument();
    expect(screen.getByRole("form", { name: "Formulário de contato" })).toBeInTheDocument();
  });

  it("mostra o e-mail direto com botão de copiar", () => {
    render(<HomeContact />);
    expect(screen.getByText(contactData.email)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copiar e-mail" })).toBeInTheDocument();
  });

  it("linka só GitHub e LinkedIn", () => {
    render(<HomeContact />);
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/devguimaraes"
    );
    expect(screen.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/bcguimaraes/"
    );
    expect(screen.queryByRole("link", { name: /Instagram/ })).not.toBeInTheDocument();
  });
});
