import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  type ContactMail,
  clearContactRateLimit,
  createResendMailSender,
  handleContactSubmission,
  isSameOriginRequest,
  resolveResendApiKey,
} from "./contact-server";

const validBody = {
  name: "Ana",
  email: "ana@empresa.com.br",
  type: "website",
  message: "Preciso de um site.",
  locale: "pt",
  hp_extra: "",
};

const brunoText =
  "Nome: Ana · E-mail: ana@empresa.com.br · Tipo: site · Idioma do site: pt · Mensagem: Preciso de um site.";

const confirmationText =
  "Oi. Recebi sua mensagem pelo devguimaraes.com.br e respondo por este e-mail. Se quiser acrescentar alguma coisa, é só responder. Bruno Guimarães";

function sender() {
  return vi.fn<(mail: ContactMail) => Promise<void>>().mockResolvedValue(undefined);
}

describe("handleContactSubmission", () => {
  beforeEach(() => {
    clearContactRateLimit();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejeita nome, e-mail ou mensagem vazios e locale inválido", async () => {
    const send = sender();
    const cases: unknown[] = [
      { ...validBody, name: "   " },
      { ...validBody, email: "" },
      { ...validBody, email: "   " },
      { ...validBody, email: "ana@empresa" },
      { ...validBody, message: "  \n  " },
      { ...validBody, locale: "fr" },
      { name: validBody.name, email: validBody.email, message: validBody.message },
    ];

    for (const body of cases) {
      const result = await handleContactSubmission({ body, ip: "203.0.113.4", send });
      expect(result).toEqual({ status: 400, body: { ok: false } });
    }
    expect(send).not.toHaveBeenCalled();
  });

  it("rejeita nome, mensagem e campo armadilha acima do limite", async () => {
    const send = sender();
    const cases: unknown[] = [
      { ...validBody, name: "a".repeat(121) },
      { ...validBody, message: "a".repeat(5001) },
      { ...validBody, hp_extra: "a".repeat(201) },
    ];
    for (const body of cases) {
      const result = await handleContactSubmission({ body, ip: "203.0.113.9", send });
      expect(result).toEqual({ status: 400, body: { ok: false } });
    }
    expect(send).not.toHaveBeenCalled();
  });

  it("se só a confirmação falha, responde ok para o reenvio não duplicar a mensagem", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const send = sender()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("confirmation down"));
    const result = await handleContactSubmission({ body: validBody, ip: "203.0.113.10", send });
    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("campo armadilha preenchido não envia e não conta no limite", async () => {
    const send = sender();
    const ip = "203.0.113.5";

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const trapped = await handleContactSubmission({
        body: { ...validBody, hp_extra: "https://spam.example" },
        ip,
        send,
      });
      expect(trapped).toEqual({ status: 200, body: { ok: true } });
    }

    const real = await handleContactSubmission({ body: validBody, ip, send });
    expect(real).toEqual({ status: 200, body: { ok: true } });
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("no sexto envio do mesmo IP devolve 429 e não envia", async () => {
    const send = sender();
    const ip = "203.0.113.6";

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const result = await handleContactSubmission({ body: validBody, ip, send });
      expect(result.status).toBe(200);
    }
    expect(send).toHaveBeenCalledTimes(10);

    const blocked = await handleContactSubmission({ body: validBody, ip, send });
    expect(blocked).toEqual({ status: 429, body: { ok: false } });
    expect(send).toHaveBeenCalledTimes(10);

    const otherIp = await handleContactSubmission({
      body: validBody,
      ip: "203.0.113.61",
      send,
    });
    expect(otherIp.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(12);
  });

  it("com dados válidos envia o e-mail do Bruno e a confirmação", async () => {
    const send = sender();
    const result = await handleContactSubmission({
      body: {
        ...validBody,
        name: "  Ana  ",
        email: "  ana@empresa.com.br  ",
        message: "  Preciso de um site.  ",
      },
      ip: "203.0.113.7",
      send,
    });

    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(send).toHaveBeenNthCalledWith(1, {
      from: "contato@devguimaraes.com.br",
      to: "bc.guimaraes@outlook.com",
      replyTo: "ana@empresa.com.br",
      subject: "Contato pelo site: Ana · site",
      text: brunoText,
    });
    expect(send).toHaveBeenNthCalledWith(2, {
      from: "contato@devguimaraes.com.br",
      to: "ana@empresa.com.br",
      replyTo: "bc.guimaraes@outlook.com",
      subject: "Recebi sua mensagem",
      text: confirmationText,
    });
  });

  it("a confirmação não repete nome nem mensagem digitados", async () => {
    const send = sender();
    await handleContactSubmission({
      body: {
        ...validBody,
        name: "Nome https://evil.example",
        message: "Clique https://evil.example",
      },
      ip: "203.0.113.11",
      send,
    });
    const confirmation = send.mock.calls[1][0];
    expect(confirmation.text).not.toContain("evil.example");
  });

  it("confirmação em inglês usa o idioma enviado e o Bruno continua em português", async () => {
    const send = sender();
    const result = await handleContactSubmission({
      body: { ...validBody, locale: "en" },
      ip: "203.0.113.8",
      send,
    });

    expect(result.status).toBe(200);
    expect(send).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        to: "bc.guimaraes@outlook.com",
        replyTo: "ana@empresa.com.br",
        subject: "Contato pelo site: Ana · site",
        text: brunoText.replace("Idioma do site: pt", "Idioma do site: en"),
      })
    );
    expect(send).toHaveBeenNthCalledWith(2, {
      from: "contato@devguimaraes.com.br",
      to: "ana@empresa.com.br",
      replyTo: "bc.guimaraes@outlook.com",
      subject: "I got your message",
      text: "Hi. I got your message from devguimaraes.com.br and I'll reply to this email. If you want to add anything, just reply. Bruno Guimarães",
    });
  });

  it("sem tipo de projeto ainda envia, e o assunto não fica com separador sobrando", async () => {
    const send = sender();
    const result = await handleContactSubmission({
      body: { ...validBody, type: null },
      ip: "203.0.113.9",
      send,
    });

    expect(result.status).toBe(200);
    expect(send).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        subject: "Contato pelo site: Ana",
        text: "Nome: Ana · E-mail: ana@empresa.com.br · Tipo:  · Idioma do site: pt · Mensagem: Preciso de um site.",
      })
    );
  });

  it("se o envio falha, devolve 500 e o log não leva a mensagem nem a chave", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const send = vi
      .fn<(mail: ContactMail) => Promise<void>>()
      .mockRejectedValue(new Error("smtp down re_secretkey"));

    const result = await handleContactSubmission({
      body: validBody,
      ip: "203.0.113.10",
      send,
    });

    expect(result).toEqual({ status: 500, body: { ok: false } });
    expect(send).toHaveBeenCalledTimes(1);
    const logged = vi.mocked(console.error).mock.calls.flat().join(" ");
    expect(logged).toContain("smtp down");
    expect(logged).not.toContain("Preciso de um site.");
    expect(logged).not.toContain("re_secretkey");
  });

  it("sem RESEND_API_KEY devolve 500 antes de falar com o Resend", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await handleContactSubmission({
      body: validBody,
      ip: "203.0.113.11",
      send: createResendMailSender(undefined),
    });

    expect(result).toEqual({ status: 500, body: { ok: false } });
    const logged = vi.mocked(console.error).mock.calls.flat().join(" ");
    expect(logged).toContain("RESEND_API_KEY is not set");
    expect(logged).not.toContain("Preciso de um site.");
  });
});

describe("resolveResendApiKey", () => {
  it("prefere a chave do processo e cai para a do arquivo", () => {
    expect(resolveResendApiKey("re_process", "re_file")).toBe("re_process");
    expect(resolveResendApiKey(undefined, "re_file")).toBe("re_file");
    expect(resolveResendApiKey("", "re_file")).toBe("re_file");
    expect(resolveResendApiKey(undefined, undefined)).toBeUndefined();
    expect(resolveResendApiKey("", "")).toBeUndefined();
  });
});

describe("isSameOriginRequest", () => {
  const url = "https://devguimaraes.com.br/api/contato";

  it("aceita a própria origem, inclusive em preview e no dev", () => {
    expect(isSameOriginRequest("https://devguimaraes.com.br", url)).toBe(true);
    expect(isSameOriginRequest("http://localhost:4321", "http://localhost:4321/api/contato")).toBe(
      true
    );
  });

  it("recusa outro domínio, origem ausente e origem inválida", () => {
    expect(isSameOriginRequest("https://evil.example", url)).toBe(false);
    expect(isSameOriginRequest(null, url)).toBe(false);
    expect(isSameOriginRequest("not a url", url)).toBe(false);
  });
});
