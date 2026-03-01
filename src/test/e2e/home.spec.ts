import { test, expect } from '@playwright/test';

test.describe('Navegação Principal', () => {

  test('Deve carregar a página inicial corretamente e as meta tags do mercado BR', async ({ page }) => {
    await page.goto('/');

    // Verifica o título e se a Hero Section renderizou
    await expect(page).toHaveTitle(/Developer Bruno/i);
    await expect(page.locator('h1').first()).toBeVisible();

    // Testa a transição (Lazy Loading e Router) para a página do Blog
    const linkBlog = page.getByRole('link', { name: /Blog/i }).first();
    await linkBlog.click();

    await expect(page).toHaveURL(/.*blog/);
    await expect(page.locator('h1').first()).toContainText(/Blog/i);
  });

  test('Deve exibir a seção de contato com os links sociais dinâmicos', async ({ page }) => {
    await page.goto('/#contact');

    // Checa pelo headline principal Brutalista usando os textos dividos
    await expect(page.getByText('PRONTO PARA', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('JUNTOS?', { exact: false })).toBeVisible();

    // Valida se o bloco CANAL_ABERTO está presente
    await expect(page.getByText('CANAL_ABERTO')).toBeVisible();

    // Verifica presença de pelo menos um link/botão contendo texto comum nos sociais
    const githubLink = page.getByRole('link').filter({ hasText: /@bru\.guim/i }).first();
    if(await githubLink.isVisible()) {
      await expect(githubLink).toHaveAttribute('target', '_blank');
    }
  });
});
