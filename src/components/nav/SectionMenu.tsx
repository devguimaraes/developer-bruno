import { ArrowRight } from "lucide-react";
import { LanguageSwitch } from "@/components/giro/LanguageSwitch";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/lib/i18n";
import type { HomeSection } from "./sections";

export interface SectionMenuProps {
  id: string;
  sections: readonly HomeSection[];
  activeId: string | null;
  className?: string;
  /** Chamado ao tocar numa seção. Quem usa fecha o menu. */
  onNavigate?: () => void;
}

/** Painel do menu (g-menu): seções e troca de idioma. Usado pela ilha e pela barra de abas. */
export function SectionMenu({ id, sections, activeId, className, onNavigate }: SectionMenuProps) {
  const locale = useLocale();

  return (
    <div
      id={id}
      className={["g-menu", className].filter(Boolean).join(" ")}
      role="dialog"
      aria-label={t(locale, "global.main_nav_label")}
    >
      {sections.map(section => (
        <a
          key={section.id}
          className="g-menu__item"
          href={`/#${section.id}`}
          aria-current={section.id === activeId ? "true" : undefined}
          onClick={onNavigate}
        >
          {t(locale, section.menuKey)}
          <ArrowRight className="g-icon" aria-hidden="true" />
        </a>
      ))}
      <div className="g-menu__divider" aria-hidden="true" />
      <div className="g-menu__row">
        <span>{t(locale, "language.group_label")}</span>
        <LanguageSwitch groupLabel={t(locale, "language.group_label")} />
      </div>
    </div>
  );
}
