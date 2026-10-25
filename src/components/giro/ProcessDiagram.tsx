import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { motion, useInView } from "framer-motion";
import { Giro } from "@/components/brand/Giro";
import { ProcessNode } from "@/components/giro/ProcessNode";
import {
  PROCESS_STEPS,
  type ProcessStep,
  type ProcessStepId,
  type ProcessTool,
} from "@/components/giro/process-data";
import { PROCESS_LOGOS, type ProcessLogoSlug } from "@/components/giro/process-logos";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { t, type Locale } from "@/lib/i18n";

// Quadro do diagrama em px. No computador ele é reduzido por transform até caber no contêiner.
const STAGE_W = 1120;
const STAGE_H = 700;
const LINE_Y = 350;
const LINE_START = 40;
const LINE_END = 1100;
const LINE_D = `M${LINE_START} ${LINE_Y} H${LINE_END}`;
const STATION_FIRST_X = 140;
const STATION_GAP = 280;
// Nível das ferramentas em relação à linha, e a coluna esquerda/direita dentro de cada etapa.
const TIER_FIRST = 110;
const TIER_GAP = 95;
const COLUMN = 70;
const DESKTOP_QUERY = "(min-width: 1024px)";
const DRAG_LIMITS = { top: -10, bottom: 10, left: -10, right: 10 };

// Entrada, em ms, a partir de quando o diagrama entra na tela.
const LINE_DRAW = 1300;
const STATION_START = 1300;
const BRANCH_START = 1500;
const BRANCH_GAP = 120;
const BRANCH_DRAW = 520;
const RIDE_DELAY = 300;
const RIDE_MS = 2400;
const MOBILE_ROW = 4;

type CustomProps = CSSProperties & { [name: `--${string}`]: string };

function delayed(ms: number, base: CSSProperties = {}): CustomProps {
  const style: CustomProps = { ...base };
  style["--d"] = `${ms}ms`;
  return style;
}

function timed(duration: number, delay: number): CustomProps {
  const style: CustomProps = {};
  style["--t"] = `${duration}ms`;
  style["--d"] = `${delay}ms`;
  return style;
}

type Side = "up" | "down";

interface Placement {
  step: ProcessStep;
  tool: ProcessTool;
  side: Side;
  x: number;
  y: number;
  d: string;
  branchDelay: number;
}

// Uma posição por ferramenta, calculada uma vez. Ferramentas pares vão para cima e ímpares para
// baixo; dentro de cada lado, cada par de colunas sobe um nível, para os nomes não se encostarem.
function placeTools(): Placement[] {
  const placements: Placement[] = [];
  let order = 0;
  PROCESS_STEPS.forEach((step, stepIndex) => {
    const sx = STATION_FIRST_X + stepIndex * STATION_GAP;
    const sides: [Side, ProcessTool[]][] = [
      ["up", step.tools.filter((_, i) => i % 2 === 0)],
      ["down", step.tools.filter((_, i) => i % 2 === 1)],
    ];
    for (const [side, tools] of sides) {
      tools.forEach((tool, i) => {
        const level = Math.floor(i / 2);
        const tier = TIER_FIRST + level * TIER_GAP;
        let dx = 0;
        if (tools.length > 1) dx = i % 2 === 0 ? -COLUMN : COLUMN;
        const x = sx + dx;
        const y = side === "up" ? LINE_Y - tier : LINE_Y + tier;
        const mid = (LINE_Y + y) / 2;
        placements.push({
          step,
          tool,
          side,
          x,
          y,
          d: `M${sx} ${LINE_Y} C${sx} ${mid} ${x} ${mid} ${x} ${y}`,
          branchDelay: BRANCH_START + order * BRANCH_GAP,
        });
        order += 1;
      });
    }
  });
  return placements;
}

const PLACEMENTS = placeTools();

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

// Escala do quadro: 1 quando cabe, menor quando o contêiner é mais estreito.
function useStageScale(ref: RefObject<HTMLDivElement>): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      if (el.clientWidth > 0) setScale(Math.min(1, el.clientWidth / STAGE_W));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return scale;
}

function ToolLogo({ slug }: { slug: ProcessLogoSlug }) {
  const logo = PROCESS_LOGOS[slug];
  return (
    <svg viewBox={logo.viewBox} aria-hidden="true" focusable="false">
      {logo.shapes.map(shape => (
        <path key={shape.d} d={shape.d} fillRule={shape.fillRule} transform={shape.transform} />
      ))}
    </svg>
  );
}

interface MetroProps {
  locale: Locale;
  label: string;
  baseId: string;
  openId: ProcessStepId | null;
  onToggle: (id: ProcessStepId) => void;
  hovered: ProcessLogoSlug | null;
  onHover: (slug: ProcessLogoSlug | null) => void;
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

// Estação arrastável em pouco espaço: os ramais não seguem o nó, então o arrasto fica
// limitado a 10 px e volta com elasticidade. Um arrasto não abre o detalhe.
function DraggableStation({
  x,
  delay,
  children,
}: {
  x: number;
  delay: number;
  children: ReactNode;
}) {
  const [dragging, setDragging] = useState(false);
  const moved = useRef(false);

  return (
    <motion.div
      className={`g-metro__station g-pop${dragging ? " is-dragging" : ""}`}
      style={delayed(delay, { left: x, top: LINE_Y })}
      drag
      dragConstraints={DRAG_LIMITS}
      dragElastic={0.2}
      dragSnapToOrigin
      onDragStart={() => {
        moved.current = false;
        setDragging(true);
      }}
      onDrag={() => {
        moved.current = true;
      }}
      onDragEnd={() => setDragging(false)}
      onClickCapture={event => {
        if (!moved.current) return;
        moved.current = false;
        event.stopPropagation();
        event.preventDefault();
      }}
    >
      {children}
    </motion.div>
  );
}

function DesktopMetro({
  locale,
  label,
  baseId,
  openId,
  onToggle,
  hovered,
  onHover,
  motionOn,
  play,
}: MetroProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const scale = useStageScale(frameRef);
  const lit = (placement: Placement) =>
    hovered ? hovered === placement.tool.slug : openId === placement.step.id;

  return (
    <section
      aria-label={label}
      className={`g-metro${play ? " is-play" : ""}`}
      data-motion={motionOn ? "on" : undefined}
    >
      <div ref={frameRef} className="g-metro__frame" style={{ height: STAGE_H * scale }}>
        <div className="g-metro__stage" style={{ transform: `scale(${scale})` }}>
          <svg
            className="g-metro__lines"
            viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            aria-hidden="true"
            focusable="false"
          >
            <path
              className="g-metro__main g-draw"
              d={LINE_D}
              pathLength={1}
              style={timed(LINE_DRAW, 0)}
            />
            {PLACEMENTS.map(p => (
              <path
                key={p.tool.slug}
                className={`g-metro__branch g-draw${lit(p) ? " is-lit" : ""}`}
                d={p.d}
                pathLength={1}
                style={timed(BRANCH_DRAW, p.branchDelay)}
              />
            ))}
            {motionOn && <path className="g-metro__pulse" d={LINE_D} pathLength={1} />}
          </svg>

          {PROCESS_STEPS.map((step, index) => (
            <DraggableStation
              key={step.id}
              x={STATION_FIRST_X + index * STATION_GAP}
              delay={STATION_START + index * BRANCH_GAP}
            >
              <div data-step={step.id}>
                <StepNode
                  locale={locale}
                  step={step}
                  open={openId === step.id}
                  controlsId={`${baseId}-${step.id}`}
                  onToggle={onToggle}
                />
              </div>
            </DraggableStation>
          ))}

          <ul className="g-metro__tools">
            {PLACEMENTS.map(p => (
              <li
                key={p.tool.slug}
                data-step={p.step.id}
                className={`g-pop g-metro__tool${p.side === "up" ? " g-metro__tool--up" : ""}${
                  lit(p) ? " is-lit" : ""
                }`}
                style={delayed(p.branchDelay + BRANCH_DRAW, { left: p.x, top: p.y })}
                onPointerEnter={() => onHover(p.tool.slug)}
                onPointerLeave={() => onHover(null)}
              >
                <span className="g-metro__disc">
                  <ToolLogo slug={p.tool.slug} />
                </span>
                <span className="g-metro__name">{p.tool.name}</span>
              </li>
            ))}
          </ul>

          {motionOn ? (
            <motion.div
              className="g-metro__rider"
              aria-hidden="true"
              style={delayed(RIDE_DELAY + RIDE_MS, { left: 0, top: LINE_Y })}
              initial={{ x: LINE_START }}
              animate={{ x: play ? LINE_END : LINE_START }}
              transition={{ duration: RIDE_MS / 1000, ease: "easeInOut", delay: RIDE_DELAY / 1000 }}
            >
              <Giro className="g-metro__rider-loading" state="loading" size={30} />
              <Giro className="g-metro__rider-done" state="done" size={30} />
            </motion.div>
          ) : (
            <div
              className="g-metro__rider"
              aria-hidden="true"
              style={{ left: LINE_END, top: LINE_Y }}
            >
              <Giro state="done" size={30} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MobileMetro({ locale, label, baseId, openId, onToggle, motionOn, play }: MetroProps) {
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
            <div className="g-pop" style={delayed(STATION_START + index * BRANCH_GAP)}>
              <StepNode
                locale={locale}
                step={step}
                open={open}
                controlsId={`${baseId}-${step.id}`}
                onToggle={onToggle}
              />
            </div>
            <ul className="g-stack__rows">
              {chunk(step.tools, MOBILE_ROW).map(row => (
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

// Detalhe de cada etapa. Os quatro painéis ficam no DOM; só o aberto aparece.
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
  // Entrada única: quando o diagrama entra na tela, a classe is-play liga as animações.
  const inView = useInView(rootRef, { once: true, amount: 0.3 });
  const baseId = useId();
  const [openId, setOpenId] = useState<ProcessStepId | null>(null);
  const [hovered, setHovered] = useState<ProcessLogoSlug | null>(null);

  const motionOn = !reducedMotion;
  const play = motionOn && inView;

  const metroProps: MetroProps = {
    locale,
    label: t(locale, "process.diagram_label"),
    baseId,
    openId,
    onToggle: id => setOpenId(current => (current === id ? null : id)),
    hovered,
    onHover: setHovered,
    motionOn,
    play,
  };

  return (
    <div ref={rootRef}>
      {isDesktop ? <DesktopMetro {...metroProps} /> : <MobileMetro {...metroProps} />}
      <StepDetails locale={locale} baseId={baseId} openId={openId} />
      <p className="g-metro__hint">{t(locale, "process.hint")}</p>
    </div>
  );
}
