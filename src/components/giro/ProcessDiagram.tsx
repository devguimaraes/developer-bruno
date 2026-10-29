import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { ProcessNode } from "@/components/giro/ProcessNode";
import { ProcessTrack } from "@/components/giro/ProcessTrack";
import {
  PROCESS_STEPS,
  stepTools,
  type ProcessStep,
  type ProcessStepId,
} from "@/components/giro/process-data";
import { ToolLogo } from "@/components/giro/ToolLogo";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { t, type Locale } from "@/lib/i18n";

const DESKTOP_QUERY = "(min-width: 1024px)";

// Entrada no celular, em ms, a partir de quando o diagrama entra na tela.
const STATION_START = 1300;
const STATION_GAP = 120;
const MOBILE_ROW = 4;

type CustomProps = CSSProperties & { [name: `--${string}`]: string };

function delayed(ms: number): CustomProps {
  const style: CustomProps = {};
  style["--d"] = `${ms}ms`;
  return style;
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    setMatches(list.matches);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

interface MobileMetroProps {
  locale: Locale;
  label: string;
  baseId: string;
  openId: ProcessStepId | null;
  onToggle: (id: ProcessStepId) => void;
  motionOn: boolean;
  play: boolean;
}

// Botão de etapa com o detalhe ligado por aria-controls. Os IDs dos painéis vêm de baseId.
function StepNode({
  locale,
  step,
  open,
  controlsId,
  onToggle,
}: {
  locale: Locale;
  step: ProcessStep;
  open: boolean;
  controlsId: string;
  onToggle: (id: ProcessStepId) => void;
}) {
  const Icon = step.icon;
  return (
    <ProcessNode
      icon={<Icon className="g-icon" aria-hidden="true" />}
      step={`${t(locale, "process.step_label")} 0${step.number}`}
      name={t(locale, step.nameKey)}
      expanded={open}
      onToggle={() => onToggle(step.id)}
      controls={controlsId}
    />
  );
}

function MobileMetro({
  locale,
  label,
  baseId,
  openId,
  onToggle,
  motionOn,
  play,
}: MobileMetroProps) {
  return (
    <section
      aria-label={label}
      className={`g-metro g-stack${play ? " is-play" : ""}`}
      data-motion={motionOn ? "on" : undefined}
    >
      {PROCESS_STEPS.map((step, index) => {
        const open = openId === step.id;
        return (
          <div
            key={step.id}
            data-step={step.id}
            className={`g-stack__step${open ? " is-open" : ""}`}
          >
            <div className="g-pop" style={delayed(STATION_START + index * STATION_GAP)}>
              <StepNode
                locale={locale}
                step={step}
                open={open}
                controlsId={`${baseId}-${step.id}`}
                onToggle={onToggle}
              />
            </div>
            <ul className="g-stack__rows">
              {chunk(stepTools(step), MOBILE_ROW).map(row => (
                <li key={row[0]?.slug} className="g-stack__row">
                  <ul className="g-stack__tools">
                    {row.map(tool => (
                      <li key={tool.slug} className="g-metro__tool g-metro__tool--sm">
                        <span className="g-metro__disc">
                          <ToolLogo slug={tool.slug} />
                        </span>
                        <span className="g-metro__name">{tool.name}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}

// Detalhe de cada etapa no celular. Os quatro painéis ficam no DOM; só o aberto aparece.
function StepDetails({
  locale,
  baseId,
  openId,
}: {
  locale: Locale;
  baseId: string;
  openId: ProcessStepId | null;
}) {
  return (
    <div className="g-step-panels">
      {PROCESS_STEPS.map(step => {
        const open = openId === step.id;
        const panelId = `${baseId}-${step.id}`;
        return (
          <section
            key={step.id}
            id={panelId}
            className={`g-step${open ? " g-step--open" : ""}`}
            hidden={!open}
            aria-labelledby={`${panelId}-title`}
          >
            <div className="g-step__head">
              <p className="g-eyebrow">{`${t(locale, "process.step_label")} 0${step.number}`}</p>
              <h3 id={`${panelId}-title`} className="g-step__title">
                {t(locale, step.nameKey)}
              </h3>
            </div>
            <p className="g-step__text">{t(locale, step.bodyKey)}</p>
            <p className="g-step__deliverable">
              <span>{t(locale, "process.deliverable_label")}</span>
              {t(locale, step.deliverableKey)}
            </p>
          </section>
        );
      })}
    </div>
  );
}

export function ProcessDiagram() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const rootRef = useRef<HTMLDivElement>(null);
  // Entrada única: quando o diagrama entra na tela, liga a entrada no celular e o autoplay no computador.
  const inView = useInView(rootRef, { once: true, amount: 0.3 });
  const baseId = useId();
  const [openId, setOpenId] = useState<ProcessStepId | null>(null);

  const motionOn = !reducedMotion;
  const label = t(locale, "process.diagram_label");

  if (isDesktop) {
    return (
      <div ref={rootRef}>
        <ProcessTrack locale={locale} label={label} motionOn={motionOn} inView={inView} />
      </div>
    );
  }

  return (
    <div ref={rootRef}>
      <MobileMetro
        locale={locale}
        label={label}
        baseId={baseId}
        openId={openId}
        onToggle={id => setOpenId(current => (current === id ? null : id))}
        motionOn={motionOn}
        play={motionOn && inView}
      />
      <StepDetails locale={locale} baseId={baseId} openId={openId} />
      <p className="g-metro__hint">{t(locale, "process.hint")}</p>
    </div>
  );
}
