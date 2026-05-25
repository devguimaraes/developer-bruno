import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SocialIcons from "./SocialIcons";
import { contactData } from "@/config/site";

vi.mock("@/components/ui/ScrollReveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("SocialIcons", () => {
  it("renders all social links from contactData", () => {
    render(<SocialIcons />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(contactData.socialLinks.length);

    contactData.socialLinks.forEach(social => {
      const link = screen.getByRole("link", { name: new RegExp(social.label, "i") });
      expect(link).toHaveAttribute("href", social.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    });
  });

  it("renders index numbers for each link", () => {
    render(<SocialIcons />);

    contactData.socialLinks.forEach((_, idx) => {
      expect(screen.getByText(`0${idx + 1}`)).toBeInTheDocument();
    });
  });

  it("renders brand SVG icons", () => {
    render(<SocialIcons />);

    const svgs = document.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(contactData.socialLinks.length);
  });
});
