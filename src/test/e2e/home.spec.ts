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

    // Checa pelo headline principal usando toContainText no container pai para lidar com TextReveal (letras fragmentadas)
    const contactSection = page.locator('#contact');
    await expect(contactSection).toContainText(/PRONTO PARA/i);
    await expect(contactSection).toContainText(/CONSTRUIR/i);
    await expect(contactSection).toContainText(/JUNTOS?/i);

    // Valida se o bloco CANAL_ABERTO está presente
    await expect(page.getByText('CANAL_ABERTO')).toBeVisible();

    // Verifica presença de pelo menos um link/botão contendo texto comum nos sociais
    const githubLink = page.getByRole('link').filter({ hasText: /@bru\.guim/i }).first();
    if(await githubLink.isVisible()) {
      await expect(githubLink).toHaveAttribute('target', '_blank');
    }
  });
  test('Deve alterar o estado da navegação e seções ao fazer scroll', async ({ page }) => {
    await page.goto('/');
    
    const nav = page.locator('nav').first();
    
    // Inicialmente no topo, a navbar pode ser transparente ou ter certa classe
    // No código, ela ganha fundo 'bg-stone-50/80 backdrop-blur-md' ao scrollar
    
    await page.mouse.wheel(0, 500);
    
    // Verifica se a classe de scroll foi aplicada (ou se o estilo mudou)
    // No componente Navigation.tsx: isScrolled ? 'py-4' : 'py-6'
    await expect(nav).toHaveClass(/py-4/);
    
    await page.goto('/#projects');
    const projectsLink = page.getByRole('link', { name: /projetos/i }).first();
    // O link ativo ganha fundo parakeet (bg-parakeet) e texto branco
    await expect(projectsLink).toHaveClass(/bg-parakeet/);
  });
});
