import { ArrowUpRight } from "lucide-react";
import { ResultStat } from "@/components/giro/ResultStat";
import { outcomeSites } from "@/data/projects";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/lib/i18n";
import { splitOutcome } from "./copy";

/** Três sites com número medido. Os números contam ao entrar na tela (ResultStat). */
export function HomeOtherSites() {
  const locale = useLocale();

  return (
    <div className="home-others">
      <div className="home-others__head">
        <p className="g-eyebrow">{t(locale, "outcomes.label")}</p>
        <span className="home-others__note">{t(locale, "outcomes.measured")}</span>
      </div>
      <div className="home-others__stats">
        {outcomeSites.map(site => {
          const parts = splitOutcome(site.summary[locale]);
          return (
            <a
              key={site.id}
              className="g-azul home-stat"
              href={site.live}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="home-stat__top">
                <span className="g-eyebrow">{`// ${site.title.toLowerCase()}`}</span>
                <ArrowUpRight className="g-icon" aria-hidden="true" />
              </span>
              <ResultStat value={parts.value} label={parts.label} source={parts.source} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
