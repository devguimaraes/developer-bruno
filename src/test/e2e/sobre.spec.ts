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

  test("Deve trocar para inglês", async ({ page, isMobile }) => {
    await page.goto("/sobre");
    await waitForHydration(page);
    if (isMobile) {
      // No celular o seletor fica no rodapé, que hidrata ao entrar na tela (client:visible).
      const footerSwitch = page.locator(".g-site-footer").getByRole("button", { name: "en" });
      await footerSwitch.scrollIntoViewIfNeeded();
      await page.waitForFunction(
        () => !document.querySelector('astro-island[ssr][client="visible"]')
      );
      await footerSwitch.click();
    } else {
      // No computador a página não tem header: o seletor fica no menu da ilha.
      await page.locator("#scroll-island-toggle").click();
      await page.locator("#scroll-island-menu").getByRole("button", { name: "en" }).click();
    }
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

  test("Deve chegar pelo menu a partir da home, sem o header do topo", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");
    await waitForHydration(page);
    const nav = isMobile ? page.locator(".g-dock") : page.locator("[data-site-header]");
    await nav.getByRole("link", { name: "Sobre" }).click();
    await expect(page).toHaveURL(/\/sobre\/?$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Oi, eu sou o Bruno.");
    await expect(page.locator("[data-site-header]")).toHaveCount(0);
  });

  test("Deve seguir para o contato da home", async ({ page }) => {
    await page.goto("/sobre");
    await waitForHydration(page);
    await page.getByRole("link", { name: "Falar comigo" }).click();
    await expect(page).toHaveURL(/\/#contato$/, { timeout: 15_000 });
  });
});
