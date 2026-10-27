import { expect, test } from "@playwright/test";

test.describe("Idioma", () => {
  test("Deve trocar para inglês, atualizar o lang e lembrar a escolha ao navegar e recarregar", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForFunction(() => !document.documentElement.hasAttribute("data-loader"));
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Interfaces com vida.");

    // O clique antes da hidratação não faz nada, então repete até a página responder.
    await expect(async () => {
      await page.getByRole("button", { name: "en", exact: true }).first().click();
      await expect(page.getByRole("heading", { level: 1 })).toContainText("Interfaces that live.", {
        timeout: 2000,
      });
    }).toPass({ timeout: 30_000 });
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Blog");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // O seletor fica no hero (celular) e no header (computador), então a conferência é na home.
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("button", { name: "en", exact: true }).first()).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
