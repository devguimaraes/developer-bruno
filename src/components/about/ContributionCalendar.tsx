import { ArrowLink } from "@/components/giro/Button";
import { siteConfig } from "@/config/site";
import type { ContributionCalendar as CalendarData } from "@/lib/github/contributions";
import { type Locale, t } from "@/lib/i18n";
import { type ContributionGrid, GRID_CELL, layoutContributionGrid } from "./contribution-grid";

/** Semanas da grade no celular: seis meses. O ano inteiro em 358 px daria células de 5 px. */
const HALF_YEAR_WEEKS = 26;
const GRID_LEVELS = [0, 1, 2, 3, 4] as const;

function intlLocale(locale: Locale): string {
  return locale === "en" ? "en-US" : "pt-BR";
}

/** Nomes curtos dos meses, sem o ponto do pt-BR ("nov", "Nov"). */
function monthNames(locale: Locale): string[] {
  const format = new Intl.DateTimeFormat(intlLocale(locale), { month: "short", timeZone: "UTC" });
  return Array.from({ length: 12 }, (_, month) =>
    format.format(new Date(Date.UTC(2026, month, 1))).replace(".", "")
  );
}

interface GridSvgProps {
  grid: ContributionGrid;
  months: string[];
  label: string;
  className: string;
}

function GridSvg({ grid, months, label, className }: GridSvgProps) {
  return (
    <svg
      className={`sobre-cal__grid ${className}`}
      viewBox={`0 0 ${grid.width} ${grid.height}`}
      role="img"
      aria-label={label}
    >
      <g className="sobre-cal__months">
        {grid.months.map(month => (
          <text key={month.x} x={month.x} y={10}>
            {months[month.month]}
          </text>
        ))}
      </g>
      {GRID_LEVELS.map(level => (
        <g key={level} className={`sobre-cal__l${level}`}>
          {grid.cells
            .filter(cell => cell.level === level)
            .map(cell => (
              <rect
                key={`${cell.x}-${cell.y}`}
                x={cell.x}
                y={cell.y}
                width={GRID_CELL}
                height={GRID_CELL}
                rx={2.5}
              />
            ))}
        </g>
      ))}
    </svg>
  );
}

export interface ContributionCalendarProps {
  /** Null quando o build rodou sem token ou a API falhou: a seção mostra o aviso e o link. */
  calendar: CalendarData | null;
  locale: Locale;
}

/** Calendário de contribuições do GitHub: o ano inteiro no computador, seis meses no celular. */
export function ContributionCalendar({ calendar, locale }: ContributionCalendarProps) {
  const profileLink = (
    <ArrowLink href={siteConfig.github} target="_blank" rel="noopener noreferrer">
      {t(locale, "aboutpage.github.profile")}
    </ArrowLink>
  );

  if (!calendar) {
    return (
      <div className="sobre-cal sobre-cal--empty">
        <p className="sobre-cal__note">{t(locale, "aboutpage.github.unavailable")}</p>
        {profileLink}
      </div>
    );
  }

  const total = new Intl.NumberFormat(intlLocale(locale)).format(calendar.total);
  const months = monthNames(locale);

  return (
    <div className="sobre-cal">
      {/* As duas versões vão no HTML e o CSS escolhe uma: sem matchMedia, a hidratação não diverge. */}
      <p className="sobre-cal__total">
        <strong>{total}</strong>{" "}
        <span className="sobre-cal__year">{t(locale, "aboutpage.github.year")}</span>
        <span className="sobre-cal__half">{t(locale, "aboutpage.github.half")}</span>
      </p>
      <GridSvg
        grid={layoutContributionGrid(calendar)}
        months={months}
        label={t(locale, "aboutpage.github.year_alt", { total })}
        className="sobre-cal__year"
      />
      <GridSvg
        grid={layoutContributionGrid(calendar, HALF_YEAR_WEEKS)}
        months={months}
        label={t(locale, "aboutpage.github.half_alt", { total })}
        className="sobre-cal__half"
      />
      <div className="sobre-cal__foot">
        <span className="sobre-cal__legend" aria-hidden="true">
          {t(locale, "aboutpage.github.less")}
          {GRID_LEVELS.map(level => (
            <i key={level} className={`sobre-cal__l${level}`} />
          ))}
          {t(locale, "aboutpage.github.more")}
        </span>
        {profileLink}
      </div>
    </div>
  );
}
