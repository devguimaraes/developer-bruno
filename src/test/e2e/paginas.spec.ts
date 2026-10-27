import { expect, test } from "@playwright/test";

test.describe("Case, 404 e movimento reduzido", () => {
  test("Deve abrir o case e seguir para o próximo", async ({ page }) => {
    await page.goto("/projetos/estudio-entre");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Estúdio Entre");
    await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
      "href",
      /\/projetos\/estudio-entre/
    );

    await page.waitForFunction(() => !document.documentElement.hasAttribute("data-loader"));
    await page
      .getByRole("link", { name: /Atlas Marine Solutions/ })
      .last()
      .click();
    await expect(page).toHaveURL(/\/projetos\/atlas-marine-solutions/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Atlas Marine Solutions");
  });

  test("Deve mostrar a 404 com o endereço pedido e voltar ao início", async ({ page }) => {
    const response = await page.goto("/rota-que-nao-existe");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Essa página se perdeu." })).toBeVisible();
    await expect(page.getByText("// endereço: /rota-que-nao-existe")).toBeVisible();

    await page.waitForFunction(() => !document.documentElement.hasAttribute("data-loader"));
    await page.getByRole("link", { name: "Voltar ao início" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Interfaces com vida.");
  });

  test("Com movimento reduzido o Giro do hero fica parado e a página continua usável", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Interfaces com vida.");
    // Só desabilita depois da hidratação, que demora mais com o servidor frio.
    await expect(page.locator(".hr-giro")).toBeDisabled({ timeout: 45_000 });
    await page.getByRole("link", { name: "Ver projetos" }).click();
    await expect(page).toHaveURL(/#projetos$/);
  });
});
