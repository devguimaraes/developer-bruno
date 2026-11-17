import { ArrowLink } from "@/components/giro/Button";
import { CopyButton } from "@/components/giro/CopyButton";
import { contactData } from "@/config/site";
import { useLocale } from "@/hooks/useLocale";
import { type TranslationKey, t } from "@/lib/i18n";
import { ContactForm } from "./ContactForm";
import { bareLabel } from "./copy";

// Só GitHub e LinkedIn aparecem no contato. Os demais perfis de contactData ficam de fora.
const SOCIALS: readonly { id: string; labelKey: TranslationKey }[] = [
  { id: "github", labelKey: "contact.social.github" },
  { id: "linkedin", labelKey: "contact.social.linkedin" },
];

export function HomeContact() {
  const locale = useLocale();
  const socials = SOCIALS.flatMap(social => {
    const link = contactData.socialLinks.find(item => item.id === social.id);
    return link ? [{ id: social.id, href: link.href, label: t(locale, social.labelKey) }] : [];
  });

  return (
    <section className="ct g-azul" id="contato" aria-labelledby="ct-title">
      <div className="ct-in">
        <p className="g-eyebrow">{bareLabel(t(locale, "contact.label"))}</p>
        <h2 className="ct-title" id="ct-title">
          {t(locale, "contact.title")}
        </h2>
        <p className="ct-lead">{t(locale, "contact.intro")}</p>
        <div className="ct-grid">
          <ContactForm />

          <aside className="g-tinta ct-mail" aria-label={t(locale, "contact.direct.region")}>
            <p className="g-eyebrow">{t(locale, "contact.direct.label")}</p>
            <p className="ct-mail__a">{contactData.email}</p>
            <CopyButton
              value={contactData.email}
              copyLabel={t(locale, "contact.direct.copy")}
              copiedLabel={t(locale, "contact.direct.copied")}
              errorLabel={t(locale, "contact.direct.copy_error")}
              errorHint={t(locale, "contact.direct.copy_error_hint")}
            />
            <div className="ct-mail__l">
              {socials.map(link => (
                <ArrowLink
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-giro-wink=""
                >
                  {link.label}
                </ArrowLink>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
