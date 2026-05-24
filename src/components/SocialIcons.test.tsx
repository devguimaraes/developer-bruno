import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SocialIcons from "./SocialIcons";
import { contactData } from "@/config/site";

// Mock ScrollReveal para renderizar children diretamente
vi.mock("@/components/ui/ScrollReveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("SocialIcons", () => {
  it("renders all 4 social links", () => {
    render(<SocialIcons />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(4);

    contactData.socialLinks.forEach(social => {
      const link = screen.getByRole("link", { name: new RegExp(social.label, "i") });
      expect(link).toHaveAttribute("href", social.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    });
  });

  it("renders index numbers 01-04", () => {
    render(<SocialIcons />);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
  });

  it("renders brand SVG icons", () => {
    render(<SocialIcons />);

    const svgs = document.querySelectorAll("svg");
    // Um SVG por link + 4 ArrowUpRight SVGs = 8 SVGs
    expect(svgs.length).toBeGreaterThanOrEqual(4);
  });
});
