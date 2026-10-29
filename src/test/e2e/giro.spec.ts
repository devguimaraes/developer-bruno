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
    const copy = page.locator(".home-mail .g-button");
    await copy.click();
    await expect(copy.locator('.g-giro[data-moment="wink"]')).toBeAttached();
    await expect(copy.locator(".g-giro")).toHaveCount(0, { timeout: 4000 });
  });

  test("Deve ouvir enquanto a mensagem é digitada e voltar ao repouso", async ({ page }) => {
    await openContact(page);
    const giro = page.locator(".home-form__submit .g-giro");
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

test.describe("Giro: movimento reduzido", () => {
  test("Deve trocar de estado sem transição, só piscando, e sem momentos", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await recordMoments(page);
    await openContact(page);

    const giro = page.locator(".home-form__submit .g-giro");
    const motion = await giro.evaluate(svg => ({
      arc: getComputedStyle(svg.querySelector(".g-giro__arc") as Element).transitionDuration,
      body: getComputedStyle(svg.querySelector(".g-giro__body") as Element).animationName,
      lid: getComputedStyle(svg.querySelector(".g-giro__lid") as Element).animationName,
    }));
    expect(motion).toEqual({ arc: "0s", body: "none", lid: "g-blink" });

    await page.locator(".home-mail .g-button").click();
    await page.getByLabel("mensagem").pressSequentially("Olá", { delay: 40 });
    await expect(page.locator(".home-mail .g-button .g-giro")).toBeAttached();
    expect(await moments(page)).toEqual([]);
  });
});
