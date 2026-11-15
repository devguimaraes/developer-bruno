import { expect, test } from "@playwright/test";
import { waitForHydration } from "./ready";

test.describe("Página Sobre", () => {
  test("Deve abrir com o histórico, sem rolagem horizontal", async ({ page }) => {
    await page.goto("/sobre");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Oi, eu sou o Bruno.");
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", /\/sobre\/?$/);
    await expect(page.getByRole("heading", { name: "Experiência" })).toBeVisible();
    await expect(page.getByText("Pixel Pro Technologies", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "GitHub" })).toBeVisible();
    await expect(page.locator(".g-site-footer")).toBeAttached();

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflows).toBe(false);
  });

  test("Deve trocar para inglês", async ({ page }) => {
    await page.goto("/sobre");
    await waitForHydration(page);
    await page.getByRole("button", { name: "en" }).first().click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Hi, I'm Bruno.");
    await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
  });

  test("Deve manter a grade do topo parada com movimento reduzido", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/sobre");
    await waitForHydration(page);
    const canvas = page.locator(".sobre-page__grid canvas");
    await expect(canvas).toBeAttached();
    const snapshot = () => canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL());
    const before = await snapshot();
    await page.waitForTimeout(600);
    expect(await snapshot()).toBe(before);
  });

  test("Deve chegar pelo menu a partir da home, com Sobre como página atual", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
    await page.locator("[data-site-header]").getByRole("link", { name: "Sobre" }).click();
    await expect(page).toHaveURL(/\/sobre\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Oi, eu sou o Bruno.");
    await expect(
      page.locator("[data-site-header]").getByRole("link", { name: "Sobre" })
    ).toHaveAttribute("aria-current", "page");
  });

  test("Deve seguir para o contato da home", async ({ page }) => {
    await page.goto("/sobre");
    await waitForHydration(page);
    await page.getByRole("link", { name: "Falar comigo" }).click();
    await expect(page).toHaveURL(/\/#contato$/);
  });
});
