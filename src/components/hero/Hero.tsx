import { useEffect, useRef } from "react";
import { Giro } from "@/components/brand/Giro";
import { ButtonLink } from "@/components/giro/Button";
import { LanguageSwitch } from "@/components/giro/LanguageSwitch";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { StackLabels } from "./StackScene";
import { StackScene } from "./StackScene";
import type { HudLabels } from "./useHeroStack";
import { useHeroStack } from "./useHeroStack";

function layerNames(locale: Locale): StackLabels["layers"] {
  return [
    t(locale, "hero.layer.tokens"),
    t(locale, "hero.layer.components"),
    t(locale, "hero.layer.screen"),
    t(locale, "hero.layer.state"),
  ];
}

function stackLabelsFor(locale: Locale): StackLabels {
  return {
    layers: layerNames(locale),
    colors: [
      t(locale, "hero.color.blue"),
      t(locale, "hero.color.lime"),
      t(locale, "hero.color.paper"),
      t(locale, "hero.color.ink"),
      t(locale, "hero.color.coral"),
    ],
    ctaProjects: t(locale, "hero.cta_projects"),
    ctaContact: t(locale, "hero.cta_contact"),
    ready: t(locale, "hero.stack.ready"),
    loading: t(locale, "hero.stack.loading"),
    greeting: t(locale, "hero.stack.greeting"),
    error: t(locale, "hero.stack.error"),
    miniTitle: t(locale, "hero.stack.mini_title"),
  };
}

function hudLabelsFor(locale: Locale): HudLabels {
  return {
    states: {
      idle: t(locale, "giro.state.idle"),
      loading: t(locale, "giro.state.loading"),
      done: t(locale, "giro.state.done"),
      error: t(locale, "giro.state.error"),
      curious: t(locale, "giro.state.curious"),
      air: t(locale, "giro.state.air"),
    },
    layers: layerNames(locale),
    floor: t(locale, "hero.layer.floor"),
  };
}

/** Hero "vista explodida": uma interface aberta em quatro camadas e o Giro numa linha ao lado. */
export function Hero() {
  const locale = useLocale();
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  const riderRef = useRef<HTMLButtonElement>(null);
  const seatRef = useRef<SVGSVGElement>(null);

  const title = t(locale, "hero.title");
  const words = title.split(" ");
  const line1 = words[0] ?? title;
  const line2 = words.slice(1).join(" ");

  const labelsRef = useRef<HudLabels>(hudLabelsFor(locale));
  useEffect(() => {
    labelsRef.current = hudLabelsFor(locale);
  });

  useHeroStack({ stageRef, riderRef, seatRef, labelsRef, reduced, locale });

  return (
    <section ref={stageRef} className="g-azul hb">
      {/* Celular: nome em mono e troca de idioma no topo do hero. No computador ficam no header. */}
      <div className="hb-top">
        <a className="hb-name" href="/" aria-label={t(locale, "global.signature_label")}>
          bruno guimarães
        </a>
        <LanguageSwitch groupLabel={t(locale, "language.group_label")} />
      </div>

      <StackScene labels={stackLabelsFor(locale)} />

      <div className="hb-copy">
        <span className="g-eyebrow">{t(locale, "hero.label")}</span>
        <h1 className="hb-title">
          <span className="g-sr">{title}</span>
          <span className="hb-title__line" aria-hidden="true">
            {line1}
          </span>
          <span className="hb-title__line" aria-hidden="true">
            {line2}
          </span>
        </h1>
      </div>

      <div className="hb-foot">
        <p className="hb-lede">{t(locale, "hero.intro")}</p>
        <div className="hb-ctas">
          <ButtonLink href="#projetos" arrow>
            {t(locale, "hero.cta_projects")}
          </ButtonLink>
          <ButtonLink href="#contato" variant="secondary">
            {t(locale, "hero.cta_contact")}
          </ButtonLink>
        </div>
      </div>

      <svg ref={seatRef} className="hb-seat" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="44" />
      </svg>

      <button
        ref={riderRef}
        type="button"
        className="hb-rider"
        aria-label={t(locale, "giro.jump_button")}
        disabled={reduced}
      >
        <span className="hb-rider__in">
          <Giro />
        </span>
      </button>

      <div className="hb-hud" aria-hidden="true">
        <dl>
          <dt>{t(locale, "giro.label_state")}</dt>
          <dd data-hud="state" />
          <dt>{t(locale, "hero.hud.layer")}</dt>
          <dd data-hud="layer" />
          <dt>{t(locale, "hero.hud.open")}</dt>
          <dd data-hud="open" />
        </dl>
      </div>
    </section>
  );
}
