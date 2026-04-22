import { test, expect } from "@playwright/test";

test.describe("Fluxo do Blog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
  });

  test("Deve listar os posts do blog e permitir navegação para um post específico", async ({
    page,
  }) => {
    // Verifica título da página
    await expect(page.locator("h1").first()).toContainText(/INSIGHTS/i);

    // Espera os posts carregarem (lazy loading)
    const blogCards = page.locator("article");
    await blogCards.first().waitFor({ state: "visible", timeout: 15000 });
    await expect(blogCards.first()).toBeVisible();

    const initialCount = await blogCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Pega o título do primeiro post para comparar depois
    const firstPostTitle = await blogCards.first().locator("h2").textContent();

    const postLink = blogCards.first().getByRole("link", { name: /Ler/i });
    const postHref = await postLink.getAttribute("href");
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
    const blogCard = page.locator("article").first();
    await blogCard.click();

    // Botão de voltar (deve existir na página de post)
    const backButton = page
      .getByRole("link", { name: /Voltar para o blog/i })
      .or(page.getByRole("link", { name: /posts/i }));
    await backButton.first().click();

    await expect(page).toHaveURL(/.*blog$/);
  });

  test("Deve exibir erro 404 para posts inexistentes", async ({ page }) => {
    await page.goto("/blog/post-que-nao-existe");
    await expect(page.getByText(/404/i).or(page.getByText(/Página não encontrada/i))).toBeVisible();
  });
});
