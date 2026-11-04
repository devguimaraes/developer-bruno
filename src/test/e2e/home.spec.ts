import { expect, test } from "@playwright/test";
import { waitForHydration } from "./ready";

test.describe("Navegação Principal", () => {
  test("Deve carregar a home com as seções na ordem e abrir o blog", async ({ page }) => {
    await page.goto("/");

    // Verifica o título e se a Hero Section renderizou
    await expect(page).toHaveTitle(/Bruno Guimarães/i);
    await expect(page.locator("h1").first()).toBeVisible();

    // Âncoras das seções da home, usadas pela navegação
    for (const id of ["servicos", "projetos", "processo", "sobre", "blog", "contato"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }

    // "Ver o blog" dentro da seção leva para a página do blog
    await page.locator("#blog").getByRole("link", { name: "Ver o blog" }).click();
    await expect(page).toHaveURL(/.*blog/);
    // O h1 da página de blog é "Blog" (i18n blog.heading)
    await expect(page.locator("h1").first()).toHaveText("Blog");
  });

  test("Deve exibir a seção de contato com formulário e links", async ({ page }) => {
    await page.goto("/#contato");

    const contactSection = page.locator("#contato");
    await expect(contactSection.getByRole("heading", { name: "Vamos conversar." })).toBeVisible();
    await expect(contactSection.getByRole("form", { name: "Formulário de contato" })).toBeVisible();
    await expect(contactSection.getByRole("button", { name: "Enviar mensagem" })).toBeVisible();

    await expect(contactSection.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      /github\.com/
    );
  });

  test("Deve rolar só a janela, sem contêiner de rolagem dentro das seções", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("section.hb")).toBeVisible();

    const inner = await page.evaluate(() =>
      Array.from(document.querySelectorAll("body *"))
        .filter(el => el.tagName !== "TEXTAREA")
        .filter(el => /(auto|scroll)/.test(getComputedStyle(el).overflowY))
        .map(el => el.tagName)
    );
    expect(inner).toEqual([]);

    // scrollBy porque o WebKit de celular não tem mouse.wheel. A janela é o único contêiner.
    await page.evaluate(() => window.scrollBy(0, 400));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
    expect(await page.evaluate(() => document.querySelector("main")?.scrollTop)).toBe(0);
  });

  test("Deve levar o menu até a seção de projetos ao rolar", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
    await page.evaluate(() => window.scrollBy(0, 500));

    // O header (computador) e a barra de abas (celular) têm o link. O getByRole só vê o visível.
    const projectsLink = page.getByRole("link", { name: /^Projetos$/ }).first();
    await expect(projectsLink).toHaveAttribute("href", /#projetos$/i);

    await projectsLink.click();
    await expect(page).toHaveURL(/#projetos$/i);
    await expect(
      page.locator("#projetos").getByRole("heading", { name: "No ar.", level: 2 })
    ).toBeVisible();
  });

  test("Deve pintar a faixa ao entrar e levar ao estudo", async ({ page }) => {
    await page.goto("/#projetos");
    await waitForHydration(page);

    const projectsSection = page.locator("#projetos");
    await expect(projectsSection.getByRole("heading", { name: "No ar.", level: 2 })).toBeVisible();

    const entre = projectsSection.getByRole("link", { name: "Estúdio Entre" });
    await expect(entre).toHaveAttribute("href", "/projetos/estudio-entre");
    await entre.scrollIntoViewIfNeeded();
    await expect(projectsSection.locator(".home-band").first()).toHaveAttribute(
      "data-painted",
      "true"
    );

    await entre.click();
    await expect(page).toHaveURL(/\/projetos\/estudio-entre$/);
  });
});
