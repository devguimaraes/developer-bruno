import { expect, test } from "@playwright/test";
import { waitForHydration } from "./ready";

test.describe("Navegação Principal", () => {
  test("Deve carregar a home com as seções na ordem e abrir o blog", async ({ page }) => {
    await page.goto("/");

    // Verifica o título e se a Hero Section renderizou
    await expect(page).toHaveTitle(/Bruno Guimarães/i);
    await expect(page.locator("h1").first()).toBeVisible();

    // Âncoras das seções da home, usadas pela navegação
    for (const id of [
      "hero",
      "servicos",
      "projetos",
      "processo",
      "sobre",
      "blog",
      "contato",
      "fim",
    ]) {
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

  test.describe("no celular", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("Não deve criar rolagem lateral durante a entrada do Giro", async ({ page }) => {
      await page.goto("/");
      await waitForHydration(page);

      // Amostra a cada quadro até o Giro estacionar na estação de tokens.
      const entrance = await page.evaluate(
        () =>
          new Promise<{ widest: number; width: number; parked: boolean }>(resolve => {
            const hud = document.querySelector('[data-hud="state"]');
            const width = window.innerWidth;
            const t0 = performance.now();
            let widest = document.documentElement.scrollWidth;
            let air = false;
            const tick = (): void => {
              widest = Math.max(widest, document.documentElement.scrollWidth);
              const state = hud?.textContent;
              if (state === "no ar") air = true;
              const parked = air && state === "pronto";
              if (parked || performance.now() - t0 > 9000) {
                resolve({ widest, width, parked });
                return;
              }
              requestAnimationFrame(tick);
            };
            tick();
          })
      );
      expect(entrance.parked).toBe(true);
      expect(entrance.widest).toBeLessThanOrEqual(entrance.width);
    });
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

  test("Deve trazer a janela do case ao rolar e abrir o case", async ({ page }) => {
    await page.goto("/#projetos");
    await waitForHydration(page);

    const projectsSection = page.locator("#projetos");
    await expect(projectsSection.getByRole("heading", { name: "No ar.", level: 2 })).toBeVisible();

    // Com as cenas ligadas a primeira janela está toda na tela em t = 2,5 de 12,2.
    await page.evaluate(() => {
      const sec = document.getElementById("projetos");
      if (!sec) return;
      const top = sec.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + (sec.offsetHeight - window.innerHeight) * (2.5 / 12.2));
    });

    const entre = projectsSection.getByRole("link", { name: /Estúdio Entre/ });
    await expect(entre).toHaveAttribute("href", "/projetos/estudio-entre");
    await expect(entre).toBeInViewport();

    await entre.click();
    await expect(page).toHaveURL(/\/projetos\/estudio-entre$/);
  });

  test("Deve levar cada número dos outros sites ao site no ar", async ({ page }) => {
    await page.goto("/#projetos");
    await waitForHydration(page);

    const stats = page.locator("#projetos .pj-stat");
    await expect(stats).toHaveCount(3);
    await expect(stats.first()).toHaveAttribute("href", "https://www.agenciamultibr.com/");
    await expect(stats.first()).toHaveAttribute("target", "_blank");
  });

  test("Deve publicar, falhar, tentar de novo e ficar pronto na tela de exemplo", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForHydration(page);
    // Batida "vazio" do capítulo Estados: t = 3 na linha de 10 unidades da abertura
    await page.evaluate(() => {
      const s = document.getElementById("hero") as HTMLElement;
      window.scrollTo(0, (s.offsetHeight - window.innerHeight) * 0.3);
    });
    await expect(page.locator('.ab-demo [data-stop="card"]')).toHaveCount(1);
    await expect(page.locator('.ab-demo [data-stop="card-done"]')).toHaveCount(0);

    const status = page.getByText(/^estado: /).first();
    const word = page.locator(".ab-demo .dm-word").first();
    await expect(status).toHaveText("estado: vazio");
    await expect(word).toHaveText("vazio");

    await page.getByRole("button", { name: "Publicar", exact: true }).click();
    await expect(status).toHaveText("estado: carregando");
    await expect(word).toHaveText("carregando");
    await expect(status).toHaveText("estado: erro", { timeout: 4000 });
    await expect(word).toHaveText("erro");

    await page.getByRole("button", { name: "Tentar de novo" }).click();
    await expect(status).toHaveText("estado: carregando");
    await expect(status).toHaveText("estado: pronto", { timeout: 4000 });
    await expect(word).toHaveText("No ar.");
  });
});
