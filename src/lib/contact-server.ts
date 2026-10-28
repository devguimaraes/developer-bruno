import { Resend } from "resend";
import { z } from "zod";
import { contactData } from "@/config/site";
import type { ContactType } from "@/lib/contact";
import { type Locale, type TranslationKey, t } from "@/lib/i18n";

const CONTACT_FROM = "contato@devguimaraes.com.br";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/** O corpo legítimo cabe em ~6 KB (mensagem de até 5000 caracteres). */
export const CONTACT_MAX_BODY_BYTES = 16 * 1024;

const CONTACT_TYPES = ["website", "landing_page", "store", "app", "other"] as const;

const TYPE_LABEL_KEYS = {
  website: "contact.form.type.website",
  landing_page: "contact.form.type.landing_page",
  store: "contact.form.type.store",
  app: "contact.form.type.app",
  other: "contact.form.type.other",
} as const satisfies Record<ContactType, TranslationKey>;

const contactRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().max(254).pipe(z.email()),
  type: z.enum(CONTACT_TYPES).nullable(),
  message: z.string().trim().min(1).max(5000),
  locale: z.enum(["pt", "en"]),
  hp_extra: z.string().max(200),
});

type ContactRequest = z.infer<typeof contactRequestSchema>;

export interface ContactMail {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}

export type ContactMailSender = (mail: ContactMail) => Promise<void>;

export type ContactSubmissionResult =
  | { status: 200; body: { ok: true } }
  | { status: 400 | 429 | 500; body: { ok: false } };

// O mapa vive nesta instância do servidor. Na Vercel cada isolate tem o seu,
// então o limite não é global entre as funções.
const hitsByIp = new Map<string, number[]>();

/** Só aceita envio vindo de uma página do próprio site, para um form em outro domínio não disparar e-mails. */
export function isSameOriginRequest(origin: string | null, requestUrl: string): boolean {
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(requestUrl).host;
  } catch {
    return false;
  }
}

export function clearContactRateLimit(): void {
  hitsByIp.clear();
}

function takeContactSlot(ip: string, now: number): boolean {
  for (const [key, timestamps] of hitsByIp) {
    if (timestamps.every(timestamp => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
      hitsByIp.delete(key);
    }
  }
  const recent = hitsByIp.get(ip) ?? [];
  if (recent.length >= RATE_LIMIT_MAX) return false;
  recent.push(now);
  hitsByIp.set(ip, recent);
  return true;
}

function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ");
}

function typeLabel(type: ContactType | null): string {
  if (!type) return "";
  return t("pt", TYPE_LABEL_KEYS[type]);
}

function brunoSubject(name: string, label: string): string {
  const subject = t("pt", "email.contact.subject", { name, type: label });
  // Sem tipo escolhido, o modelo deixa o separador no final.
  if (label) return subject;
  return subject.replace(/ ·\s*$/, "");
}

function composeContactMails(data: ContactRequest): [ContactMail, ContactMail] {
  const name = oneLine(data.name);
  const label = typeLabel(data.type);
  const bruno: ContactMail = {
    from: CONTACT_FROM,
    to: contactData.email,
    replyTo: data.email,
    subject: brunoSubject(name, label),
    text: t("pt", "email.contact.body", {
      name,
      email: data.email,
      type: label,
      language: data.locale,
      message: data.message,
    }),
  };
  const locale: Locale = data.locale;
  // A confirmação pede para responder o e-mail. A resposta volta para o Bruno.
  const confirmation: ContactMail = {
    from: CONTACT_FROM,
    to: data.email,
    replyTo: contactData.email,
    subject: t(locale, "email.reply.subject"),
    // Texto fixo: nada digitado no formulário volta para o endereço informado (evita abuso como relay).
    text: t(locale, "email.reply.body"),
  };
  return [bruno, confirmation];
}

function redact(message: string, secret: string | undefined): string {
  const withoutToken = message.replace(/re_[A-Za-z0-9_-]+/g, "[redacted]");
  if (!secret) return withoutToken;
  return withoutToken.split(secret).join("[redacted]");
}

function logContactFailure(error: unknown): void {
  const raw = error instanceof Error ? error.message : "unknown error";
  console.error("Failed to send contact email:", redact(raw, undefined));
}

export function resolveResendApiKey(
  processValue: string | undefined,
  fileValue: string | undefined
): string | undefined {
  if (processValue) return processValue;
  if (fileValue) return fileValue;
  return undefined;
}

export function createResendMailSender(apiKey: string | undefined): ContactMailSender {
  return async mail => {
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const resend = new Resend(apiKey);
    try {
      const { error } = await resend.emails.send({
        from: mail.from,
        to: mail.to,
        replyTo: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
      });
      if (error) {
        throw new Error(`${error.name}: ${redact(error.message, apiKey)}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "resend request failed";
      throw new Error(redact(message, apiKey));
    }
  };
}

export async function handleContactSubmission(input: {
  body: unknown;
  ip: string;
  send: ContactMailSender;
}): Promise<ContactSubmissionResult> {
  const parsed = contactRequestSchema.safeParse(input.body);
  if (!parsed.success) {
    return { status: 400, body: { ok: false } };
  }

  // Honeypot preenchido: responde ok, não envia e não conta no limite.
  if (parsed.data.hp_extra.trim() !== "") {
    return { status: 200, body: { ok: true } };
  }

  if (!takeContactSlot(input.ip, Date.now())) {
    return { status: 429, body: { ok: false } };
  }

  const [bruno, confirmation] = composeContactMails(parsed.data);
  try {
    await input.send(bruno);
  } catch (error) {
    logContactFailure(error);
    return { status: 500, body: { ok: false } };
  }

  // O aviso ao Bruno já saiu. Falhar a confirmação não pode virar erro: o reenvio duplicaria a mensagem.
  try {
    await input.send(confirmation);
  } catch (error) {
    logContactFailure(error);
  }
  return { status: 200, body: { ok: true } };
}
