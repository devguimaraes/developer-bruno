import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeProcess } from "./HomeProcess";

vi.mock("@/components/giro/ProcessDiagram", () => ({
  ProcessDiagram: () => <div data-testid="process-diagram" />,
}));

describe("HomeProcess", () => {
  it("tem o título, e o diagrama (a dica de uso vem dele)", () => {
    render(<HomeProcess />);
    expect(screen.getByRole("heading", { level: 2, name: "Processo" })).toBeInTheDocument();
    expect(screen.getByText("// processo")).toBeInTheDocument();
    expect(screen.getByTestId("process-diagram")).toBeInTheDocument();
  });
});
