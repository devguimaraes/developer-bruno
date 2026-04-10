import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Hero from "./Hero";

// Mock do GlassSurface
vi.mock("@/components/ui/GlassSurface", () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="glass-surface" className={className}>{children}</div>
  ),
}));

// Mock do Marquee
vi.mock("@/components/ui/Marquee", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marquee">{children}</div>
  ),
}));

describe("Hero Component - Editorial Redesign", () => {
  it("deve renderizar o título principal FRONT END DEVELOPER", () => {
    render(<Hero />);
    expect(screen.getByText("FRONT END")).toBeInTheDocument();
    expect(screen.getByText("DEVELOPER")).toBeInTheDocument();
  });

  it("deve renderizar a descrição técnica", () => {
    render(<Hero />);
    expect(screen.getByText(/React, Next\.js & TypeScript/)).toBeInTheDocument();
  });

  it("deve renderizar o elemento de vídeo", () => {
    render(<Hero />);
    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
  });
});
