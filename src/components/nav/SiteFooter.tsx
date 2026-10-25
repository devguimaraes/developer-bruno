import { ArrowUpRight } from "lucide-react";
import { contactData } from "@/config/site";
import { CopyButton } from "@/components/giro/CopyButton";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/lib/i18n";
import { Signature } from "./Signature";

const FOOTER_LINK_IDS = ["github", "linkedin"];

/** Rodapé em azul: assinatura, copiar e-mail, redes e linha de base. */
export function SiteFooter() {
  const locale = useLocale();
  const links = contactData.socialLinks.filter(link => FOOTER_LINK_IDS.includes(link.id));

  return (
    <footer className="g-azul g-site-footer">
      <div className="g-site-footer__main">
        <Signature className="g-site-footer__signature" />
        <CopyButton
          value={contactData.email}
          copyLabel={t(locale, "contact.direct.copy")}
          copiedLabel={t(locale, "contact.direct.copied")}
          errorLabel={t(locale, "post.link.copy_error")}
          errorHint={t(locale, "contact.direct.copy_error_hint")}
        />
      </div>
      <nav className="g-site-footer__links">
        {links.map(link => (
          <a key={link.id} className="g-link" href={link.href}>
            {link.label}
            <ArrowUpRight className="g-icon" aria-hidden="true" />
          </a>
        ))}
      </nav>
      <div className="g-site-footer__base">
        <span>{t(locale, "footer.copyright")}</span>
        <span>{t(locale, "footer.built_with")}</span>
      </div>
    </footer>
  );
}
