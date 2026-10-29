import { type FormEvent, useEffect, useRef, useState } from "react";
import { Giro } from "@/components/brand/Giro";
import { Button } from "@/components/giro/Button";
import { Chip } from "@/components/giro/Chip";
import { Field, TextArea } from "@/components/giro/Field";
import { Notice } from "@/components/giro/Notice";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
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

// Ouvindo: o Giro do botão acompanha a digitação e volta ao repouso 1,2 s depois da última tecla
// ou ao sair do campo. Os olhos vão de um lado ao outro em 40 colunas e descem 3 unidades; o arco
// pulsa ao começar a ouvir e depois a cada 3 teclas.
const LISTEN_IDLE_MS = 1200;
const LISTEN_COLUMNS = 40;
const LISTEN_LOOK_X = 5;
const LISTEN_LOOK_Y = 3;
const LISTEN_PULSE_EVERY = 3;

/** Estado do envio. "ok" da API vira "sent" na tela. */
type FormStatus = "idle" | "sending" | "sent" | Exclude<ContactResult, "ok">;

export function ContactForm() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ContactValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactErrors>({});
  // Depois da primeira tentativa, cada campo é revalidado enquanto o visitante digita.
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  // O botão só liga depois da hidratação. Antes disso (ou sem JS), o envio seria o submit nativo,
  // por GET, com nome, e-mail e mensagem na URL. Com o botão desligado, o Enter também não envia.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const locked = status === "sending" || status === "sent";

  const [hearing, setHearing] = useState<{ x: number; keys: number } | null>(null);
  const hearingTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(hearingTimer.current), []);

  function hear(target: EventTarget, typed: boolean) {
    // Com movimento reduzido o Giro não ouve: nem o momento, nem os olhos seguindo o texto.
    if (reducedMotion) return;
    const isField = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
    if (!isField || target.name === "hp_extra") return;
    // Coluna do cursor na linha atual: é para onde os olhos olham.
    const before = target.value.slice(0, target.selectionStart ?? target.value.length);
    const column = Math.min(before.length - before.lastIndexOf("\n") - 1, LISTEN_COLUMNS);
    const x = LISTEN_LOOK_X * ((2 * column) / LISTEN_COLUMNS - 1);
    setHearing(current => ({ x, keys: (current?.keys ?? 0) + (typed ? 1 : 0) }));
    window.clearTimeout(hearingTimer.current);
    hearingTimer.current = window.setTimeout(() => setHearing(null), LISTEN_IDLE_MS);
  }

  function stopHearing() {
    window.clearTimeout(hearingTimer.current);
    setHearing(null);
  }

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
      onFocus={event => hear(event.target, false)}
      onInput={event => hear(event.target, true)}
      onBlur={stopHearing}
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
          disabled={!hydrated || status === "sending" || status === "sent"}
          lead={
            <Giro
              moment={hearing ? "listening" : undefined}
              look={hearing ? { x: hearing.x, y: LISTEN_LOOK_Y } : undefined}
              pulse={hearing ? Math.floor(hearing.keys / LISTEN_PULSE_EVERY) : undefined}
            />
          }
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
