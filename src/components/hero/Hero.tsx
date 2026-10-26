import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Giro } from "@/components/brand/Giro";
import { ButtonLink } from "@/components/giro/Button";
import { LanguageSwitch } from "@/components/giro/LanguageSwitch";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { LetterLine } from "./heroEngine";
import { splitTitle } from "./heroEngine";
import { SpinnerField } from "./SpinnerField";
import type { HudLabels } from "./useHeroEngine";
import { useHeroEngine } from "./useHeroEngine";

// Cada letra vira um span para a mola de wdth. Espaços continuam texto para quebrar a linha.
function letterNodes(text: string, line: LetterLine): ReactNode[] {
  const seen = new Map<string, number>();
  return Array.from(text, char => {
    if (char === " ") return " ";
    const n = (seen.get(char) ?? 0) + 1;
    seen.set(char, n);
    return (
      <span key={`${char}${n}`} className="hr-c" data-line={line}>
        {char}
      </span>
    );
  });
}

function hudLabelsFor(locale: Locale): HudLabels {
  return {
    states: {
      signature: t(locale, "giro.state.signature"),
      air: t(locale, "giro.state.air"),
      bounce: t(locale, "giro.state.bounce"),
      roll: t(locale, "giro.state.roll"),
      done: t(locale, "giro.state.done"),
      jump: t(locale, "giro.state.jump"),
      idle: t(locale, "giro.state.idle"),
    },
    numberLocale: locale === "pt" ? "pt-BR" : "en-US",
  };
}

/** Hero "O Giro roda": título com a Anybody esticando, Giro que pula e campo de spinners. */
export function Hero() {
  const locale = useLocale();
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const giroRef = useRef<HTMLButtonElement>(null);
  const seatRef = useRef<SVGSVGElement>(null);

  const title = t(locale, "hero.title");
  const [line1, line2] = splitTitle(title);

  const labelsRef = useRef<HudLabels>(hudLabelsFor(locale));
  useEffect(() => {
    labelsRef.current = hudLabelsFor(locale);
  });

  useHeroEngine({ stageRef, canvasRef, giroRef, seatRef, labelsRef, reduced, titleKey: title });

  return (
    <section ref={stageRef} className="g-azul hr-stage">
      <SpinnerField ref={canvasRef} />

      {/* Celular: nome em mono e troca de idioma no topo do hero. No computador ficam no header. */}
      <div className="hr-top">
        <a className="hr-name" href="/" aria-label={t(locale, "global.signature_label")}>
          bruno guimarães
        </a>
        <LanguageSwitch groupLabel={t(locale, "language.group_label")} />
      </div>

      <div className="hr-copy">
        <span className="g-eyebrow">{t(locale, "hero.label")}</span>
        <h1 className="hr-title">
          <span className="g-sr">{title}</span>
          <span className="hr-l1" aria-hidden="true">
            {letterNodes(line1, 1)}
          </span>
          <span className="hr-l2" aria-hidden="true">
            {letterNodes(line2, 2)}
            <i className="hr-base" />
          </span>
        </h1>
      </div>

      <svg ref={seatRef} className="hr-seat" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="44" />
      </svg>

      <button
        ref={giroRef}
        type="button"
        className="hr-giro"
        aria-label={t(locale, "giro.jump_button")}
        disabled={reduced}
      >
        <span className="hr-giro-in">
          <Giro />
        </span>
      </button>

      <div className="hr-foot">
        <p className="hr-lede">{t(locale, "hero.intro")}</p>
        <div className="hr-ctas">
          <ButtonLink href="#projetos" arrow>
            {t(locale, "hero.cta_projects")}
          </ButtonLink>
          <ButtonLink href="#contato" variant="secondary">
            {t(locale, "hero.cta_contact")}
          </ButtonLink>
        </div>
      </div>

      <div className="hr-hud" aria-hidden="true">
        <dl>
          <dt>{t(locale, "giro.label_state")}</dt>
          <dd className="hr-hud-st" />
          <dt>{t(locale, "giro.label_position")}</dt>
          <dd className="hr-hud-x" />
          <dt>{t(locale, "giro.label_spin")}</dt>
          <dd className="hr-hud-rot" />
        </dl>
      </div>
    </section>
  );
}
