import { test, expect } from "@playwright/test";

test.describe("Navegação Principal", () => {
  test("Deve carregar a página inicial corretamente e navegar para o blog", async ({ page }) => {
    await page.goto("/");

    // Verifica o título e se a Hero Section renderizou
    await expect(page).toHaveTitle(/Bruno Guimarães/i);
    await expect(page.locator("h1").first()).toBeVisible();

    // No computador o item "Blog" do menu rola até a seção de blog da home (ainda não existe).
    // Até ela entrar, a página do blog é aberta direto.
    const linkBlog = page.getByRole("link", { name: /^Blog$/ }).first();
    await expect(linkBlog).toHaveAttribute("href", "/#blog");
    await page.goto("/blog");

    await expect(page).toHaveURL(/.*blog/);
    // O h1 da página de blog é "POSTS" (i18n blog.heading)
    await expect(page.locator("h1").first()).toContainText(/POSTS/i);
  });

  test("Deve exibir a seção de contato com os links sociais dinâmicos", async ({ page }) => {
    await page.goto("/#contact");

    // Checa o CTA exibido — usa locale pt-BR como padrão
    const contactSection = page.locator("#contact");
    await expect(contactSection).toContainText(/Tem um projeto em mente\?/i);
    await expect(contactSection).toContainText(/BORA CONVERSAR/i);

    const contactLink = contactSection.getByRole("link", { name: /BORA CONVERSAR/i });
    await expect(contactLink).toHaveAttribute("href", /mailto:/i);
  });

  test("Deve alterar o estado da navegação e seções ao fazer scroll", async ({ page }) => {
    await page.goto("/");

    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();

    await page.mouse.wheel(0, 500);

    const projectsLink = page.getByRole("link", { name: /^Projetos$/ }).first();
    await expect(projectsLink).toHaveAttribute("href", /#projetos$/i);

    await projectsLink.click();
    await expect(page).toHaveURL(/#projetos$/i);
    // A seção de projetos usa heading "PROJETOS" (i18n projects.heading)
    await expect(page.getByText(/PROJETOS/i).first()).toBeVisible();
  });
});
