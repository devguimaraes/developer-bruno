import { useLocale } from "@/hooks/useLocale";
import { locales, setLocale } from "@/lib/i18n";

export interface LanguageSwitchProps {
  /**
   * Nome do grupo para leitores de tela (ex.: "Idioma"). Vem por prop porque o dicionário
   * ainda não tem a chave para ele.
   */
  groupLabel: string;
  className?: string;
}

/** Troca de idioma em pílula: pt e en, cada opção 48 x 44 px. */
export function LanguageSwitch({ groupLabel, className }: LanguageSwitchProps) {
  const current = useLocale();

  return (
    // fieldset é o grupo semântico; zera a borda e a margem do navegador (o g-lang desenha a pílula).
    <fieldset
      aria-label={groupLabel}
      className={["g-lang m-0 min-w-0 border-0", className].filter(Boolean).join(" ")}
    >
      {locales.map(locale => (
        <button
          key={locale}
          type="button"
          className="g-lang__option"
          aria-pressed={locale === current}
          onClick={() => setLocale(locale)}
        >
          {locale}
        </button>
      ))}
    </fieldset>
  );
}
