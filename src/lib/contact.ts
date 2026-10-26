import { getLocale, type TranslationKey } from "@/lib/i18n";

/** Rota da função de contato na Vercel (issue #54). */
export const CONTACT_ENDPOINT = "/api/contato";

export type ContactType = "website" | "landing_page" | "store" | "app" | "other";

export interface ContactValues {
  name: string;
  email: string;
  type: ContactType | null;
  message: string;
  /** Campo armadilha: humano deixa vazio. Vai junto para o servidor descartar bots. */
  website: string;
}

export type ContactField = "name" | "email" | "message";

/** Chave de erro por campo. Ausente quando o campo está certo. */
export type ContactErrors = Partial<Record<ContactField, TranslationKey>>;

export type ContactResult = "ok" | "rate_limit" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (values.name.trim() === "") errors.name = "contact.form.error.name";
  if (values.email.trim() === "") {
    errors.email = "contact.form.error.email";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "contact.form.error.email_invalid";
  }
  if (values.message.trim() === "") errors.message = "contact.form.error.message";
  return errors;
}

export function hasContactErrors(errors: ContactErrors): boolean {
  return Object.values(errors).some(Boolean);
}

/** Envia o formulário. Rede, 404 e 500 viram "error"; 429 vira "rate_limit". */
export async function submitContact(values: ContactValues): Promise<ContactResult> {
  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, locale: getLocale() }),
    });
    if (response.ok) return "ok";
    if (response.status === 429) return "rate_limit";
    console.error("Contact form rejected:", response.status);
    return "error";
  } catch (error) {
    console.error("Failed to send contact form:", error);
    return "error";
  }
}
