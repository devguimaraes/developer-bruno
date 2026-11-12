import { expect, type Page, test } from "@playwright/test";
import { waitForHydration } from "./ready";

// A área de transferência varia por navegador (permissão no Chromium, gesto no WebKit). O que
// importa aqui é a reação do Giro, então a cópia sempre dá certo.
async function stubClipboard(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.resolve() },
    });
  });
}

// Guarda cada data-moment que aparece na página, para conferir momentos que já passaram.
async function recordMoments(page: Page) {
  await page.addInitScript(() => {
    const seen: string[] = [];
    Object.defineProperty(window, "__giroMoments", { value: seen });
    new MutationObserver(records => {
      for (const record of records) {
        const moment = (record.target as Element).getAttribute("data-moment");
        if (moment) seen.push(moment);
      }
    }).observe(document, { attributes: true, attributeFilter: ["data-moment"], subtree: true });
  });
}

function moments(page: Page) {
  return page.evaluate(() => (window as unknown as { __giroMoments: string[] }).__giroMoments);
}

async function openContact(page: Page) {
  await stubClipboard(page);
  await page.goto("/#contato");
  await waitForHydration(page);
}

test.describe("Giro: momentos", () => {
  test("Deve piscar ao copiar o e-mail e voltar ao ícone", async ({ page }) => {
    await openContact(page);
    const copy = page.locator(".ct-mail .g-button");
    await copy.click();
    await expect(copy.locator('.g-giro[data-moment="wink"]')).toBeAttached();
    await expect(copy.locator(".g-giro")).toHaveCount(0, { timeout: 4000 });
  });

  test("Deve ouvir enquanto a mensagem é digitada e voltar ao repouso", async ({ page }) => {
    await openContact(page);
    const giro = page.locator(".ct-submit .g-giro");
    await expect(giro).not.toHaveAttribute("data-moment");

    await page.getByLabel("mensagem").pressSequentially("Olá, tudo bem?", { delay: 40 });
    await expect(giro).toHaveAttribute("data-moment", "listening");
    await expect(giro).not.toHaveAttribute("data-moment", { timeout: 4000 });
  });

  test("Deve acenar no pouso do loader fora da home", async ({ page }) => {
    await recordMoments(page);
    await page.goto("/blog");
    await waitForHydration(page);
    await expect.poll(() => moments(page), { timeout: 4000 }).toContain("hello");
  });

  test("Não deve acenar na home, onde o hero cumprimenta", async ({ page }) => {
    await recordMoments(page);
    await page.goto("/");
    await waitForHydration(page);
    await page.waitForTimeout(800);
    expect(await moments(page)).toEqual([]);
  });
});

// O Giro da navegação: a ilha no computador e o trilho no celular. Os dois seguem o diretor.
const NAV_GIRO = ".g-island .g-giro, .g-dock .g-giro";

async function setTabHidden(page: Page, hidden: boolean) {
  await page.evaluate(value => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => value });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
}

// O diretor só aceita momento com um Giro da navegação à vista, pelo mesmo critério do código.
async function waitForNavGiro(page: Page) {
  await page.waitForFunction(selector => {
    for (const giro of document.querySelectorAll(selector)) {
      if (giro.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return true;
    }
    return false;
  }, NAV_GIRO);
}

async function openPastHero(page: Page) {
  await page.goto("/#processo");
  await waitForHydration(page);
  await waitForNavGiro(page);
}

test.describe("Giro: reações da navegação", () => {
  test("Deve piscar ao escolher uma categoria do blog", async ({ page }) => {
    // No celular o trilho está sempre à vista; no computador a ilha só depois do header.
    await page.setViewportSize({ width: 390, height: 844 });
    await recordMoments(page);
    await page.goto("/blog");
    await waitForHydration(page);
    await page.locator(".blog-page__filters [data-giro-wink]").last().click();
    await expect.poll(() => moments(page), { timeout: 4000 }).toContain("wink");
  });

  test("Deve dormir com a aba escondida e acordar dizendo oi", async ({ page }) => {
    await recordMoments(page);
    await openPastHero(page);

    await setTabHidden(page, true);
    await expect(page.locator(NAV_GIRO).first()).toHaveAttribute("data-state", "sleeping");
    await setTabHidden(page, false);
    await expect.poll(() => moments(page), { timeout: 4000 }).toContain("hello");
  });

  test("Deve trocar o favicon para o Giro dormindo com a aba escondida", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
    const icon = page.locator('link[rel="icon"][type="image/svg+xml"]');

    await setTabHidden(page, true);
    await expect(icon).toHaveAttribute("href", /\/favicon-sleep\.svg$/);
    await setTabHidden(page, false);
    await expect(icon).toHaveAttribute("href", /\/favicon\.svg$/);
  });

  test("Deve cochilar depois de 60 s parado e acordar no primeiro gesto", async ({ page }) => {
    await page.clock.install();
    await recordMoments(page);
    await openPastHero(page);

    await page.clock.fastForward(61_000);
    await expect(page.locator(NAV_GIRO).first()).toHaveAttribute("data-state", "sleeping");
    await page.keyboard.press("Shift");
    await expect(page.locator(NAV_GIRO).first()).not.toHaveAttribute("data-state", "sleeping");
    await expect.poll(() => moments(page), { timeout: 4000 }).toContain("hello");
  });

  test("Deve espiar depois de 5 s parado numa seção e parar na rolagem", async ({ page }) => {
    await page.clock.install();
    await openPastHero(page);
    // A contagem recomeça na rolagem: assim ela começa depois do pouso na seção.
    await page.mouse.wheel(0, 120);
    // O evento de rolagem chega assíncrono: sem esperar, ele zeraria a contagem já adiantada.
    await page.waitForTimeout(300);
    const box = page.locator(".g-island__giro, .g-dock__giro").filter({ visible: true }).first();

    await page.clock.fastForward(5_500);
    await expect(box).toHaveAttribute("style", /--g-tilt: 3deg/);
    await page.mouse.wheel(0, 120);
    await expect(box).not.toHaveAttribute("style", /--g-tilt/);
  });

  test("Não deve dizer oi com o Giro da navegação fora de vista, no hero", async ({ page }) => {
    await recordMoments(page);
    await page.goto("/");
    await waitForHydration(page);

    await setTabHidden(page, true);
    await setTabHidden(page, false);
    await page.waitForTimeout(800);
    expect(await moments(page)).not.toContain("hello");
  });
});

// O trilho de ícones só existe no celular: aqui o viewport é de 390 px.
test.describe("Trilho de ícones", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const current = (page: Page) => page.locator(".g-dock [aria-current='page']");

  test("Deve acender o ícone do capítulo em leitura na home", async ({ page }) => {
    await page.goto("/#projetos");
    await waitForHydration(page);
    await expect(current(page)).toHaveAttribute("aria-label", "Projetos");
    await expect(page.locator(".g-dock")).toHaveAttribute("data-tone", "dark");

    await page.goto("/#sobre");
    await expect(current(page)).toHaveAttribute("aria-label", "Sobre");
    await expect(page.locator(".g-dock")).toHaveAttribute("data-tone", "light");
  });

  test("Deve acender Blog e Projetos pela rota, com o Giro no lugar do ícone", async ({ page }) => {
    await page.goto("/blog");
    await waitForHydration(page);
    await expect(current(page)).toHaveAttribute("aria-label", "Blog");
    await expect(page.locator(".g-dock")).toHaveAttribute("data-stage", "false");
    await expect(page.locator(".g-dock .g-giro")).toBeVisible();

    await page.goto("/projetos/atlas-marine-solutions");
    await waitForHydration(page);
    await expect(current(page)).toHaveAttribute("aria-label", "Projetos");
  });

  test("Deve levar Serviços e Sobre para a home quando se está fora dela", async ({ page }) => {
    await page.goto("/blog");
    await waitForHydration(page);
    await page.getByRole("link", { name: "Sobre" }).click();
    await expect(page).toHaveURL(/\/#sobre$/);
  });

  test("Deve trocar o arco de lugar sem animação com movimento reduzido", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#sobre");
    await waitForHydration(page);
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(current(page)).toHaveAttribute("aria-label", "Início");
    await page.waitForTimeout(100);
    const running = await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter(
            animation =>
              animation.effect instanceof KeyframeEffect &&
              animation.effect.target instanceof Element &&
              animation.effect.target.matches(".g-dock__ring, .g-dock__giro, .g-dock__cover") &&
              animation.playState === "running"
          ).length
    );
    expect(running).toBe(0);
  });
});

test.describe("Giro: movimento reduzido", () => {
  test("Deve trocar de estado sem transição, só piscando, e sem momentos", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await recordMoments(page);
    await openContact(page);

    const giro = page.locator(".ct-submit .g-giro");
    const motion = await giro.evaluate(svg => ({
      arc: getComputedStyle(svg.querySelector(".g-giro__arc") as Element).transitionDuration,
      body: getComputedStyle(svg.querySelector(".g-giro__body") as Element).animationName,
      lid: getComputedStyle(svg.querySelector(".g-giro__lid") as Element).animationName,
    }));
    expect(motion).toEqual({ arc: "0s", body: "none", lid: "g-blink" });

    await page.locator(".ct-mail .g-button").click();
    await page.getByLabel("mensagem").pressSequentially("Olá", { delay: 40 });
    await expect(page.locator(".ct-mail .g-button .g-giro")).toBeAttached();
    expect(await moments(page)).toEqual([]);
  });
});
