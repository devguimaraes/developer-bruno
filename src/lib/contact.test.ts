import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setLocale } from "@/lib/i18n";
import {
  CONTACT_ENDPOINT,
  type ContactValues,
  hasContactErrors,
  submitContact,
  validateContact,
} from "./contact";

const valid: ContactValues = {
  name: "Ana",
  email: "ana@empresa.com.br",
  type: "website",
  message: "Preciso de um site.",
  website: "",
};

describe("validateContact", () => {
  it("aceita valores completos", () => {
    expect(validateContact(valid)).toEqual({});
    expect(hasContactErrors(validateContact(valid))).toBe(false);
  });

  it("pede nome, e-mail e mensagem quando estão vazios", () => {
    const errors = validateContact({ ...valid, name: "  ", email: "", message: "" });
    expect(errors).toEqual({
      name: "contact.form.error.name",
      email: "contact.form.error.email",
      message: "contact.form.error.message",
    });
    expect(hasContactErrors(errors)).toBe(true);
  });

  it("separa e-mail incompleto de e-mail vazio", () => {
    expect(validateContact({ ...valid, email: "ana@empresa" }).email).toBe(
      "contact.form.error.email_invalid"
    );
    expect(validateContact({ ...valid, email: "ana.empresa.com" }).email).toBe(
      "contact.form.error.email_invalid"
    );
  });

  it("não exige tipo de projeto", () => {
    expect(validateContact({ ...valid, type: null })).toEqual({});
  });
});

describe("submitContact", () => {
  beforeEach(() => {
    setLocale("pt");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    setLocale("pt");
  });

  it("envia POST JSON para o endpoint e devolve ok com 2xx", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(submitContact(valid)).resolves.toBe("ok");
    expect(fetchMock).toHaveBeenCalledWith(
      CONTACT_ENDPOINT,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ ...valid, locale: "pt" }),
      })
    );
  });

  it("manda o idioma atual no corpo", async () => {
    setLocale("en");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(submitContact(valid)).resolves.toBe("ok");
    expect(fetchMock).toHaveBeenCalledWith(
      CONTACT_ENDPOINT,
      expect.objectContaining({
        body: JSON.stringify({ ...valid, locale: "en" }),
      })
    );
  });

  it("devolve rate_limit com 429", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 429 })));
    await expect(submitContact(valid)).resolves.toBe("rate_limit");
  });

  it("devolve error com 404, 500 e falha de rede", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 404 })));
    await expect(submitContact(valid)).resolves.toBe("error");

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    await expect(submitContact(valid)).resolves.toBe("error");

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(submitContact(valid)).resolves.toBe("error");
  });
});
