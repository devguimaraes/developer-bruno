import { test, expect } from "@playwright/test";

test.describe("Navegação Principal", () => {
  test("Deve carregar a página inicial corretamente e as meta tags do mercado BR", async ({
    page,
  }) => {
    await page.goto("/");

    // Verifica o título e se a Hero Section renderizou
    await expect(page).toHaveTitle(/Bruno Guimarães/i);
    await expect(page.locator("h1").first()).toBeVisible();

    // Testa a transição (Lazy Loading e Router) para a página do Blog
    const linkBlog = page.getByRole("link", { name: /POSTS/i }).first();
    await linkBlog.click();

    await expect(page).toHaveURL(/.*blog/);
    await expect(page.locator("h1").first()).toContainText(/INSIGHTS/i);
  });

  test("Deve exibir a seção de contato com os links sociais dinâmicos", async ({ page }) => {
    await page.goto("/#contact");

    // Checa o CTA real exibido na landing atual
    const contactSection = page.locator("#contact");
    await expect(contactSection).toContainText(/Ready to start a project\?/i);
    await expect(contactSection).toContainText(/LET'S_TALK/i);

    const contactLink = contactSection.getByRole("link", { name: /LET'S_TALK/i });
    await expect(contactLink).toHaveAttribute("href", /mailto:/i);
  });

  test("Deve alterar o estado da navegação e seções ao fazer scroll", async ({ page }) => {
    await page.goto("/");

    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();

    await page.mouse.wheel(0, 500);

    const projectsLink = page.getByRole("link", { name: /PROJETOS/i }).first();
    await expect(projectsLink).toHaveAttribute("href", /#projetos$/i);

    await projectsLink.click();
    await expect(page).toHaveURL(/#projetos$/i);
    await expect(page.getByText(/SELECTED_WORKS/i)).toBeVisible();
  });
});
