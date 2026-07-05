import { test, expect } from "@playwright/test";

test.describe("Fluxo do Blog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test("Deve listar os posts do blog e permitir navegação para um post específico", async ({
    page,
  }) => {
    // O h1 da página de blog é "POSTS" (i18n blog.heading)
    await expect(page.locator("h1").first()).toContainText(/POSTS/i);

    // Os cards de post são links <a> com href /blog/{slug}
    const blogCards = page.locator("a[href^='/blog/']");
    await blogCards.first().waitFor({ state: "visible", timeout: 15000 });
    await expect(blogCards.first()).toBeVisible();

    const initialCount = await blogCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Pega o título do primeiro post para comparar depois
    const firstPostTitle = await blogCards.first().locator("h2").textContent();

    const postHref = await blogCards.first().getAttribute("href");
    expect(postHref).toMatch(/^\/blog\/.+/);
    if (!postHref) {
      throw new Error("O link do post nao foi encontrado");
    }
    await page.goto(postHref);

    // Verifica se a URL mudou para o slug do post
    await expect(page).toHaveURL(/.*blog\/.+/);

    // Verifica se o título do post na página interna corresponde ao da lista
    if (firstPostTitle) {
      await expect(page.locator("h1").first()).toContainText(firstPostTitle.trim());
    }

    // Verifica presença de metatags de SEO para o post
    const canonical = await page.getAttribute('link[rel="canonical"]', "href");
    expect(canonical).toContain("/blog/");
  });

  test("Deve permitir voltar da página do post para a listagem", async ({ page }) => {
    // Cards são links <a>, não <article>
    const blogCard = page.locator("a[href^='/blog/']").first();
    await blogCard.click();

    // Botão de voltar (na página de post)
    const backButton = page
      .getByRole("link", { name: /VOLTAR AO BLOG/i })
      .or(page.getByRole("link", { name: /back to blog/i }));
    await backButton.first().click();

    await expect(page).toHaveURL(/.*blog$/);
  });

  test("Deve exibir erro 404 para posts inexistentes", async ({ page }) => {
    await page.goto("/blog/post-que-nao-existe");
    // Usa first() para evitar strict mode (há múltiplos elementos com "404")
    await expect(page.getByText(/404/i).first()).toBeVisible();
  });
});
