import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type RefObject,
} from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Giro } from "@/components/brand/Giro";
import { Button } from "@/components/giro/Button";
import { ProcessNode } from "@/components/giro/ProcessNode";
import { PROCESS_STEPS } from "@/components/giro/process-data";
import { ToolLogo } from "@/components/giro/ToolLogo";
import { t, type Locale } from "@/lib/i18n";

// Tempo de cada etapa no autoplay. A borda do painel é o cronômetro: quando ela fecha, a próxima abre.
const STEP_MS = 6000;
const LAST = PROCESS_STEPS.length - 1;

type Edge = { left: number; right: number };
type Size = { width: number; height: number };

// Bordas de cada estação dentro do trilho, para os conectores saírem e entrarem nelas. Mede de novo
// quando o trilho ou uma pílula muda de largura (troca de idioma, fonte que termina de carregar).
function useStationEdges(trackRef: RefObject<HTMLDivElement>) {
  const [edges, setEdges] = useState<Edge[]>([]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const stations = Array.from(track.querySelectorAll<HTMLElement>("[data-station]"));
    const measure = () => {
      setEdges(
        stations.map(el => ({ left: el.offsetLeft, right: el.offsetLeft + el.offsetWidth }))
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    for (const station of stations) observer.observe(station);
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) measure();
    });
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [trackRef]);

  return edges;
}

function useElementSize(ref: RefObject<HTMLElement>): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize({ width: el.offsetWidth, height: el.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

interface ProcessTrackProps {
  locale: Locale;
  label: string;
  /** Movimento permitido (sem prefers-reduced-motion). Sem ele não há autoplay. */
  motionOn: boolean;
  /** O diagrama entrou na tela: o autoplay começa aqui, uma vez. */
  inView: boolean;
}

// Computador: trilho com as quatro etapas e um painel com a etapa aberta. Com movimento permitido,
// percorre as etapas sozinho uma vez: a borda do painel se desenha, o conector da etapa enche e o
// Giro vai na ponta. Pausa com o ponteiro em cima, para de vez quando o visitante escolhe uma etapa.
export function ProcessTrack({ locale, label, motionOn, inView }: ProcessTrackProps) {
  const panelId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const edges = useStationEdges(trackRef);
  const panelSize = useElementSize(panelRef);

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const started = useRef(false);
  // Botão de navegação que recebe o foco na etapa nova: o da etapa anterior fica escondido.
  const pendingFocus = useRef<"prev" | "next" | null>(null);
  const progress = useMotionValue(0);
  const fillWidth = useTransform(progress, value => `${value * 100}%`);
  const paused = hover || focused;

  useEffect(() => {
    if (!motionOn || !inView || started.current) return;
    started.current = true;
    setPlaying(true);
  }, [motionOn, inView]);

  useEffect(() => {
    if (!motionOn || !playing || paused) return;
    const controls = animate(progress, 1, {
      duration: ((1 - progress.get()) * STEP_MS) / 1000,
      ease: "linear",
      onComplete: () => {
        if (active < LAST) {
          progress.set(0);
          setActive(active + 1);
        } else {
          setPlaying(false);
          setDone(true);
        }
      },
    });
    return () => controls.stop();
  }, [motionOn, playing, paused, active, progress]);

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    const slide = panelRef.current?.querySelector(`[data-slide="${active}"]`);
    const wanted = slide?.querySelector<HTMLButtonElement>(`[data-nav="${target}"]`);
    const other = slide?.querySelector<HTMLButtonElement>(
      `[data-nav="${target === "next" ? "prev" : "next"}"]`
    );
    (wanted && !wanted.disabled ? wanted : other)?.focus();
  }, [active]);

  // Escolher uma etapa tira o autoplay de cena, inclusive o que ainda não tinha começado.
  const select = (index: number, focusNav?: "prev" | "next") => {
    started.current = true;
    pendingFocus.current = focusNav ?? null;
    progress.set(0);
    setActive(Math.max(0, Math.min(LAST, index)));
    setPlaying(false);
    setDone(false);
  };

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };

  const toggle = () => {
    if (done) {
      progress.set(0);
      setActive(0);
      setDone(false);
      setPlaying(true);
      return;
    }
    setPlaying(current => !current);
  };

  const lastEdge = edges[LAST];
  const riderOnSegment = !done && active < LAST;

  let toggleLabel = t(locale, "process.autoplay.play");
  let ToggleIcon = Play;
  if (done) {
    toggleLabel = t(locale, "process.autoplay.replay");
    ToggleIcon = RotateCcw;
  } else if (playing) {
    toggleLabel = t(locale, "process.autoplay.pause");
    ToggleIcon = Pause;
  }

  return (
    <section
      aria-label={label}
      className="g-track"
      data-motion={motionOn ? "on" : undefined}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
    >
      <div ref={trackRef} className="g-track__rail">
        {edges.length === PROCESS_STEPS.length &&
          PROCESS_STEPS.slice(0, LAST).map((item, index) => {
            const from = edges[index];
            const to = edges[index + 1];
            const passed = done || index < active;
            const live = !done && index === active;
            let state = "next";
            if (passed) state = "passed";
            else if (live) state = "live";
            return (
              <div
                key={item.id}
                className={`g-track__link is-${state}${live && playing && !paused ? " is-flowing" : ""}`}
                style={{ left: from.right, width: Math.max(0, to.left - from.right) }}
                aria-hidden="true"
              >
                <span className="g-track__dash" />
                {live ? (
                  <motion.span className="g-track__fill" style={{ width: fillWidth }} />
                ) : (
                  <span className="g-track__fill" style={{ width: passed ? "100%" : 0 }} />
                )}
                <span className="g-track__chevron">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </span>
                <span className="g-track__port g-track__port--from" />
                <span className="g-track__port g-track__port--to" />
                {live && riderOnSegment && (
                  <motion.span className="g-track__rider g-azul" style={{ left: fillWidth }}>
                    <Giro state={playing ? "loading" : "idle"} size={26} />
                  </motion.span>
                )}
              </div>
            );
          })}

        {PROCESS_STEPS.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === active;
          const passed = done || index < active;
          return (
            <div
              key={item.id}
              data-station={item.id}
              className={`g-track__station${isActive ? " is-active" : ""}${passed ? " is-passed" : ""}`}
            >
              <ProcessNode
                icon={<Icon className="g-icon" aria-hidden="true" />}
                step={`${t(locale, "process.step_label")} 0${item.number}`}
                name={t(locale, item.nameKey)}
                expanded={isActive}
                onToggle={() => select(index)}
                controls={`${panelId}-${item.id}`}
              />
            </div>
          );
        })}

        {!riderOnSegment && lastEdge && (
          <span
            className="g-track__rider g-track__rider--end g-azul"
            style={{ left: lastEdge.right + 28 }}
            aria-hidden="true"
          >
            <Giro state={done ? "done" : "idle"} size={26} />
          </span>
        )}
      </div>

      <div ref={panelRef} className="g-track__panel">
        {panelSize.width > 0 && (
          <svg
            className="g-track__trace"
            width={panelSize.width}
            height={panelSize.height}
            aria-hidden="true"
            focusable="false"
          >
            <motion.rect
              x={1.5}
              y={1.5}
              width={Math.max(0, panelSize.width - 3)}
              height={Math.max(0, panelSize.height - 3)}
              rx={26.5}
              style={{ pathLength: progress }}
            />
          </svg>
        )}

        {motionOn && (
          <button type="button" className="g-track__toggle" onClick={toggle}>
            <ToggleIcon className="g-icon" aria-hidden="true" />
            {toggleLabel}
          </button>
        )}

        {/* As quatro etapas ficam na mesma célula: o painel tem sempre a altura da maior e a
            página não pula a cada troca do autoplay. Só a ativa aparece, é lida e recebe foco
            (visibility: hidden tira as outras da ordem de tab). */}
        <div className="g-track__slides">
          {PROCESS_STEPS.map((item, index) => {
            const isActive = index === active;
            const slideId = `${panelId}-${item.id}`;
            return (
              <section
                key={item.id}
                id={slideId}
                className={`g-track__slide${isActive ? " is-active" : ""}`}
                data-slide={index}
                aria-labelledby={`${slideId}-title`}
                aria-hidden={!isActive}
              >
                <div className="g-track__detail">
                  <p className="g-eyebrow">
                    {t(locale, "process.counter", { n: item.number, total: PROCESS_STEPS.length })}
                  </p>
                  <h3 id={`${slideId}-title`} className="g-track__title">
                    {t(locale, item.nameKey)}
                  </h3>
                  <p className="g-track__text">{t(locale, item.bodyKey)}</p>
                  <p className="g-step__deliverable">
                    <span>{t(locale, "process.deliverable_label")}</span>
                    {t(locale, item.deliverableKey)}
                  </p>
                  <div className="g-track__nav">
                    <Button
                      variant="secondary"
                      size="sm"
                      data-nav="prev"
                      onClick={() => select(index - 1, "prev")}
                      disabled={index === 0}
                    >
                      {t(locale, "process.prev")}
                    </Button>
                    <Button
                      size="sm"
                      arrow
                      data-nav="next"
                      onClick={() => select(index + 1, "next")}
                      disabled={index === LAST}
                    >
                      {t(locale, "process.next")}
                    </Button>
                  </div>
                </div>

                <div className="g-track__groups" data-step={item.id}>
                  {item.groups.map(group => (
                    <div key={group.labelKey} className="g-track__group">
                      <p className="g-track__group-label">{t(locale, group.labelKey)}</p>
                      <ul className="g-step__tools">
                        {group.tools.map(tool => (
                          <li key={tool.slug} className="g-tool">
                            <ToolLogo slug={tool.slug} className="g-tool__logo" />
                            <span className="g-tool__name">{tool.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
