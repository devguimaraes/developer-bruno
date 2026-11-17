import { expect, type Page, test } from "@playwright/test";
import { waitForHydration } from "./ready";

async function openForm(page: Page) {
  await page.goto("/#contato");
  await waitForHydration(page);
  const form = page.getByRole("form", { name: "Formulário de contato" });
  await expect(form).toBeVisible();
  return form;
}

async function fillValid(form: ReturnType<Page["locator"]>) {
  await form.getByLabel("nome").fill("Ana");
  await form.getByLabel("e-mail").fill("ana@empresa.com.br");
  await form.getByLabel("mensagem").fill("Preciso de um site novo para março.");
}

test.describe("Formulário de contato", () => {
  test("Deve apontar os campos vazios e o e-mail incompleto sem enviar nada", async ({ page }) => {
    let sent = 0;
    await page.route("**/api/contato", route => {
      sent += 1;
      return route.fulfill({ status: 200, json: { ok: true } });
    });
    const form = await openForm(page);

    await form.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(form.getByText("Escreva seu nome.")).toBeVisible();
    await expect(form.getByText("Escreva seu e-mail.")).toBeVisible();
    await expect(form.getByText("Escreva uma mensagem.")).toBeVisible();

    await form.getByLabel("e-mail").fill("ana@empresa");
    await form.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(form.getByText(/e-mail está incompleto/)).toBeVisible();
    expect(sent).toBe(0);
  });

  test("Deve mostrar a confirmação quando o envio dá certo", async ({ page }) => {
    let body: Record<string, unknown> = {};
    await page.route("**/api/contato", route => {
      body = route.request().postDataJSON();
      return route.fulfill({ status: 200, json: { ok: true } });
    });
    const form = await openForm(page);
    await fillValid(form);
    await form.getByRole("button", { name: "Enviar mensagem" }).click();

    await expect(page.getByText(/Recebi sua mensagem/)).toBeVisible();
    expect(body).toMatchObject({
      name: "Ana",
      email: "ana@empresa.com.br",
      locale: "pt",
      hp_extra: "",
    });
  });

  test("Deve avisar o limite de envios e o erro do servidor", async ({ page }) => {
    await page.route("**/api/contato", route =>
      route.fulfill({ status: 429, json: { ok: false } })
    );
    const form = await openForm(page);
    await fillValid(form);
    await form.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.getByText(/Muitos envios seguidos/)).toBeVisible();

    await page.unroute("**/api/contato");
    await page.route("**/api/contato", route =>
      route.fulfill({ status: 500, json: { ok: false } })
    );
    await form.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(form.getByText(/Não deu para enviar/)).toBeVisible();
  });
});

test.describe("Formulário de contato sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("Não deve mandar os dados pela URL quando a página não hidrata", async ({ page }) => {
    await page.goto("/#contato");
    const form = page.getByRole("form", { name: "Formulário de contato" });
    await expect(form.getByRole("button", { name: "Enviar mensagem" })).toBeDisabled();

    // Enter num campo é o envio implícito do navegador. O Playwright espera a navegação que ele
    // dispara, então a URL abaixo já é a de depois do envio, se houver.
    await fillValid(form);
    await form.getByLabel("nome").press("Enter");
    expect(page.url()).not.toContain("name=");
  });
});
