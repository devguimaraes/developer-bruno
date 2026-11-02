import { LanguageSwitch } from "@/components/giro/LanguageSwitch";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/lib/i18n";
import { Signature } from "./Signature";
import { HOME_SECTIONS, SECTION_IDS } from "./sections";
import { useScrollState } from "./useScrollState";

const HEADER_LINKS = HOME_SECTIONS.filter(section => section.inMenu);

/** Header do hero, só no computador. Sai com o hero e a ilha assume o lugar. */
export function SiteHeader() {
  const locale = useLocale();
  const { activeId } = useScrollState(SECTION_IDS);

  return (
    <div className="hidden md:block g-azul">
      <header className="g-site-header" data-site-header>
        <Signature />
        <div className="g-site-header__end">
          <nav className="g-site-header__nav" aria-label={t(locale, "global.main_nav_label")}>
            {HEADER_LINKS.map(section => (
              <a
                key={section.id}
                className="g-nav-link"
                href={`/#${section.id}`}
                aria-current={section.id === activeId ? "true" : undefined}
              >
                {t(locale, section.menuKey)}
              </a>
            ))}
          </nav>
          <LanguageSwitch groupLabel={t(locale, "language.group_label")} />
        </div>
      </header>
    </div>
  );
}
