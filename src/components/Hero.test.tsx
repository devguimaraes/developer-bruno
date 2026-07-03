import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Hero from "./Hero";

// Mock do Marquee
vi.mock("@/components/ui/Marquee", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marquee">{children}</div>
  ),
}));

describe("Hero Component - Editorial Redesign", () => {
  it("deve renderizar o nome BRUNO GUIMARÃES como título principal", () => {
    render(<Hero />);
    expect(screen.getByText("BRUNO")).toBeInTheDocument();
    expect(screen.getByText("GUIMARÃES")).toBeInTheDocument();
  });

  it("deve renderizar a descrição com Especialista em TypeScript", () => {
    render(<Hero />);
    expect(screen.getByText(/Especialista em TypeScript/)).toBeInTheDocument();
  });

  it("deve renderizar o elemento de vídeo", () => {
    render(<Hero />);
    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
  });
});
