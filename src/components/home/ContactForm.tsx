import { type FormEvent, useRef, useState } from "react";
import { Button } from "@/components/giro/Button";
import { Chip } from "@/components/giro/Chip";
import { Field, TextArea } from "@/components/giro/Field";
import { Notice } from "@/components/giro/Notice";
import { useLocale } from "@/hooks/useLocale";
import {
  type ContactErrors,
  type ContactResult,
  type ContactType,
  type ContactValues,
  hasContactErrors,
  submitContact,
  validateContact,
} from "@/lib/contact";
import { type TranslationKey, t } from "@/lib/i18n";

const TYPE_OPTIONS: readonly { value: ContactType; labelKey: TranslationKey }[] = [
  { value: "website", labelKey: "contact.form.type.website" },
  { value: "landing_page", labelKey: "contact.form.type.landing_page" },
  { value: "store", labelKey: "contact.form.type.store" },
  { value: "app", labelKey: "contact.form.type.app" },
  { value: "other", labelKey: "contact.form.type.other" },
];

const EMPTY_VALUES: ContactValues = {
  name: "",
  email: "",
  type: null,
  message: "",
  hp_extra: "",
};

/** Estado do envio. "ok" da API vira "sent" na tela. */
type FormStatus = "idle" | "sending" | "sent" | Exclude<ContactResult, "ok">;

export function ContactForm() {
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ContactValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactErrors>({});
  // Depois da primeira tentativa, cada campo é revalidado enquanto o visitante digita.
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");

  const locked = status === "sending" || status === "sent";

  function updateValues(next: ContactValues) {
    setValues(next);
    if (attempted) setErrors(validateContact(next));
  }

  function messageFor(key: TranslationKey | undefined): string | undefined {
    return key ? t(locale, key) : undefined;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked) return;

    setAttempted(true);
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    if (hasContactErrors(nextErrors)) {
      // O foco vai para o primeiro campo com erro desta tentativa. aria-invalid ainda não existe no DOM.
      const firstInvalid = (["name", "email", "message"] as const).find(field => nextErrors[field]);
      formRef.current?.querySelector<HTMLElement>(`[name='${firstInvalid}']`)?.focus();
      return;
    }

    setStatus("sending");
    const result = await submitContact(values);
    setStatus(result === "ok" ? "sent" : result);
  }

  function resetForm() {
    setValues(EMPTY_VALUES);
    setErrors({});
    setAttempted(false);
    setStatus("idle");
  }

  const buttonStatus = status === "sending" ? "loading" : status === "sent" ? "done" : "idle";
  const buttonText =
    status === "sending"
      ? t(locale, "contact.form.submitting")
      : status === "sent"
        ? t(locale, "contact.form.sent")
        : t(locale, "contact.form.submit");

  return (
    <form
      ref={formRef}
      className="home-form"
      aria-label={t(locale, "contact.form.label")}
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="home-form__row">
        <Field
          name="name"
          autoComplete="name"
          label={t(locale, "contact.form.name_label")}
          placeholder={t(locale, "contact.form.name_placeholder")}
          value={values.name}
          onChange={event => updateValues({ ...values, name: event.target.value })}
          error={messageFor(errors.name)}
          disabled={locked}
        />
        <Field
          name="email"
          type="email"
          autoComplete="email"
          label={t(locale, "contact.form.email_label")}
          placeholder={t(locale, "contact.form.email_placeholder")}
          value={values.email}
          onChange={event => updateValues({ ...values, email: event.target.value })}
          error={messageFor(errors.email)}
          disabled={locked}
        />
      </div>

      <fieldset className="home-form__types" disabled={locked}>
        <legend className="g-field__label">{t(locale, "contact.form.type_label")}</legend>
        <div className="home-form__chips">
          {TYPE_OPTIONS.map(option => (
            <Chip
              key={option.value}
              selected={values.type === option.value}
              onClick={() =>
                updateValues({
                  ...values,
                  type: values.type === option.value ? null : option.value,
                })
              }
            >
              {t(locale, option.labelKey)}
            </Chip>
          ))}
        </div>
      </fieldset>

      <TextArea
        name="message"
        label={t(locale, "contact.form.message_label")}
        placeholder={t(locale, "contact.form.message_placeholder")}
        value={values.message}
        onChange={event => updateValues({ ...values, message: event.target.value })}
        error={messageFor(errors.message)}
        disabled={locked}
        rows={5}
      />

      {/* Campo armadilha: fora da tela e fora da ordem de tabulação. Humano nunca preenche. */}
      <input
        className="g-sr"
        type="text"
        name="hp_extra"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={values.hp_extra}
        onChange={event => updateValues({ ...values, hp_extra: event.target.value })}
      />

      <div className="home-form__submit">
        <Button
          type="submit"
          variant="primary"
          status={buttonStatus}
          disabled={status === "sending" || status === "sent"}
        >
          {buttonText}
        </Button>
        {status === "sent" && (
          <>
            <Notice variant="success">{t(locale, "contact.form.success")}</Notice>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              {t(locale, "contact.form.write_another")}
            </Button>
          </>
        )}
        {status === "error" && (
          <Notice variant="error">{t(locale, "contact.form.error.send_failed")}</Notice>
        )}
        {status === "rate_limit" && (
          <Notice variant="error">{t(locale, "contact.form.error.rate_limit")}</Notice>
        )}
      </div>
    </form>
  );
}
