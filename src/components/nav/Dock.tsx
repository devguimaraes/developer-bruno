import {
  type CSSProperties,
  type MouseEvent,
  type ReactElement,
  type Ref,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Giro } from "@/components/brand/Giro";
import type { GiroState } from "@/components/brand/giro-states";
import { useNavigating } from "@/components/loader/navigation-state";
import { useGiroOnStage } from "@/hooks/useGiroOnStage";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { t } from "@/lib/i18n";
import { getPageGiro, subscribePageGiro } from "@/lib/page-giro";
import { DOCK_ITEMS, type DockItem, type DockTone, dockIndexFor, dockToneFor } from "./dock-map";
import { useDirectedMoment } from "./giro-director";
import type { DirectedMoment } from "./giro-director";
import { SECTION_IDS, islandLabel } from "./sections";
import { resolveNavGiro, useGiroEggs } from "./useGiroEggs";
import { type PeekPose, peekKey, peekStyle, usePeek } from "./usePeek";
import { useScrollState } from "./useScrollState";

const JUMP_MS = 460;
const JUMP_HEIGHT_PX = 30;
const SQUASH_MS = 280;
const COVER_MS = 420;
const COVER_FADE_MS = 240;
const COVER_FADE_DELAY_MS = 320;
// Logo depois de montar o estado ainda vai da home para a página real: esse ajuste não anima.
const SETTLE_MS = 1200;
// Soma do padding horizontal do trilho (CSS), para achar a largura de uma estação.
const RAIL_PADDING_PX = 12;

type DockStyle = CSSProperties & { [name: `--${string}`]: string | number };

const GLYPHS: Readonly<Record<DockItem["id"], ReactElement>> = {
  home: (
    <>
      <path d="M8 19 L16 23 L16 17 L12 10 L8 13 Z" />
      <path d="M16 23 L24 19 L24 13 L16 17 Z" />
      <path className="g-dock__f" d="M16 17 L12 10 L20 6 L24 13 Z" />
    </>
  ),
  services: (
    <>
      <path className="g-dock__f" d="M16 3.75 L25.5 8.5 L16 13.25 L6.5 8.5 Z" />
      <path d="M6.5 13 L16 17.75 L25.5 13" />
      <path d="M6.5 17.5 L16 22.25 L25.5 17.5" />
    </>
  ),
  projects: (
    <>
      <path className="g-dock__f" d="M16 4.8 L21.6 7.6 L16 10.4 L10.4 7.6 Z" />
      <path className="g-dock__f" d="M22.6 8.1 L28.2 10.9 L22.6 13.7 L17 10.9 Z" />
      <path className="g-dock__f" d="M9.4 8.1 L15 10.9 L9.4 13.7 L3.8 10.9 Z" />
      <path className="g-dock__f" d="M16 11.4 L21.6 14.2 L16 17 L10.4 14.2 Z" />
    </>
  ),
  about: (
    <>
      <circle className="g-dock__f" cx="16" cy="8" r="4.4" />
      <path d="M7.2 18.6 C7.8 15 11.5 13.8 16 13.8 C20.5 13.8 24.2 15 24.8 18.6 L16 22.8 Z" />
    </>
  ),
  blog: (
    <>
      <path className="g-dock__f" d="M16 6 L27 11.5 L16 17 L5 11.5 Z" />
      <path d="M5 11.5 L5 14.5 L16 20 L27 14.5 L27 11.5" />
      <path className="g-dock__l" d="M10.5 10.9 L16.5 13.9" />
      <path className="g-dock__l" d="M13.7 9.1 L21.4 12.95" />
    </>
  ),
  contact: (
    <>
      <path
        className="g-dock__f"
        d="M16 4.5 L27 10 L16 15.5 L12.4 13.7 L9.4 18.6 L9.6 12.3 L5 10 Z"
      />
      <path d="M27 10 L27 13 L16 18.5 L13.4 17.2" />
    </>
  ),
};

function DockIcon({ id }: { id: DockItem["id"] }) {
  return (
    <svg className="g-dock__ico" viewBox="0 0 32 32" aria-hidden="true">
      <path className="g-dock__base" d="M16 20 L27 25.5 L16 31 L5 25.5 Z" />
      <g className="g-dock__glyph">{GLYPHS[id]}</g>
    </svg>
  );
}

export interface DockTag {
  text: string;
  /** Muda a cada aviso, para a animação recomeçar mesmo com o mesmo texto. */
  key: number;
}

export interface DockViewProps {
  /** Ícone aceso, ou null quando a rota não tem ícone próprio. */
  activeIndex: number | null;
  tone: DockTone;
  /** 0 a 100, lido da página inteira ou do artigo. */
  progress: number;
  /** Nome do capítulo que aparece acima do arco por um instante. */
  tag?: DockTag | null;
  /** O HomeGiro está em cena: o trilho mostra só o arco, sem rosto. */
  onStage?: boolean;
  /** Troca de página em curso: o Giro gira em carregando. */
  navigating?: boolean;
  /** Aba do navegador escondida: o Giro dorme. */
  asleep?: boolean;
  /** Atalho escondido: festa que roda uma vez. */
  celebrating?: boolean;
  /** Momento escolhido pelo diretor (giro-director): tonto, piscadela ou oi. */
  moment?: DirectedMoment;
  /** Giro pedido pela página do case, quando houver. */
  pageGiro?: GiroState | null;
  /** Espiando: o passo da leitura em curso. */
  peek?: PeekPose | null;
  ringRef?: Ref<HTMLSpanElement>;
  giroRef?: Ref<HTMLSpanElement>;
  coverRef?: Ref<HTMLSpanElement>;
  onItemClick?: (event: MouseEvent<HTMLAnchorElement>, item: DockItem) => void;
}

/** Trilho de ícones sem estado próprio. Só aparece no celular (some a partir de 768 px, no CSS). */
export function DockView({
  activeIndex,
  tone,
  progress,
  tag = null,
  onStage = false,
  navigating = false,
  asleep = false,
  celebrating = false,
  moment,
  pageGiro = null,
  peek = null,
  ringRef,
  giroRef,
  coverRef,
  onItemClick,
}: DockViewProps) {
  const locale = useLocale();
  const giro = resolveNavGiro({ navigating, celebrating, asleep, progress, pageGiro });
  // O arco fica sobre o ícone aceso; sem ícone aceso (404) ele espera em Início.
  const ringIndex = activeIndex ?? 0;
  const edge = ringIndex === 0 ? "start" : ringIndex === DOCK_ITEMS.length - 1 ? "end" : undefined;
  const style: DockStyle = { "--dock-i": ringIndex };

  return (
    <>
      <span className="g-dock__cover" ref={coverRef} aria-hidden="true" />
      <nav
        className="g-dock"
        aria-label={t(locale, "tabs.label")}
        data-tone={tone}
        data-stage={onStage ? "true" : "false"}
        style={style}
      >
        {tag && (
          <span key={tag.key} className="g-dock__tag" data-edge={edge} aria-hidden="true">
            {tag.text}
          </span>
        )}
        <i className="g-dock__rail" aria-hidden="true" />
        <span className="g-dock__ring" ref={ringRef} aria-hidden="true">
          <span
            className="g-dock__giro"
            ref={giroRef}
            style={onStage ? undefined : peekStyle(peek)}
          >
            <Giro
              size={54}
              progress={progress}
              look={onStage ? undefined : (peek?.look ?? { x: 0, y: 0 })}
              state={giro.state}
              hop={giro.hop && !onStage}
              // Só em repouso e com o rosto à vista: no pronto, na festa, no sono ou carregando,
              // o corpo já tem animação.
              moment={giro.state === "idle" && !onStage ? moment : undefined}
              className={giro.party ? "is-party" : undefined}
            />
          </span>
        </span>
        {DOCK_ITEMS.map((item, index) => (
          <a
            key={item.id}
            className={[
              "g-dock__item",
              index === activeIndex && "is-on",
              index === ringIndex && "is-ring",
            ]
              .filter(Boolean)
              .join(" ")}
            href={item.href}
            aria-label={t(locale, item.labelKey)}
            aria-current={index === activeIndex ? "page" : undefined}
            onClick={onItemClick ? event => onItemClick(event, item) : undefined}
          >
            <span className="g-dock__plate">
              <DockIcon id={item.id} />
            </span>
            {/* O arco marca a estação: o nome fica só nas outras. O link já tem aria-label. */}
            {index !== ringIndex && (
              <span className="g-dock__name" aria-hidden="true">
                {t(locale, item.labelKey)}
              </span>
            )}
          </a>
        ))}
      </nav>
    </>
  );
}

/** Salto do arco entre estações: x linear, subida de 30 px, uma volta e amasso ao pousar. */
function playJump(ring: HTMLElement, giro: HTMLElement, stationsApart: number): void {
  if (typeof ring.animate !== "function" || typeof giro.animate !== "function") return;
  const rail = ring.parentElement;
  if (!rail) return;
  const dx = (stationsApart * (rail.clientWidth - RAIL_PADDING_PX)) / DOCK_ITEMS.length;
  ring.animate([{ translate: `${dx}px 0` }, { translate: "0 0" }], {
    duration: JUMP_MS,
    easing: "linear",
  });
  giro.animate(
    [
      { translate: "0 0", easing: "cubic-bezier(0.39, 0.575, 0.565, 1)" },
      {
        translate: `0 -${JUMP_HEIGHT_PX}px`,
        offset: 0.5,
        easing: "cubic-bezier(0.47, 0, 0.745, 0.715)",
      },
      { translate: "0 0" },
    ],
    { duration: JUMP_MS }
  );
  giro.animate([{ rotate: "0deg" }, { rotate: "360deg" }], { duration: JUMP_MS, easing: "linear" });
  giro.animate([{ scale: "1.22 0.78" }, { scale: "1 1" }], {
    duration: SQUASH_MS,
    delay: JUMP_MS,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  });
}

/** Rola até o capítulo de uma vez: o disco de cor cobre o salto. */
function jumpToSection(sectionId: string): void {
  const target = document.getElementById(sectionId);
  const top =
    sectionId === "hero" || !target ? 0 : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "instant" });
}

/** A cor do destino abre como disco a partir do ícone, cobre o salto e some. */
function playCover(
  cover: HTMLElement,
  origin: Element,
  color: DockItem["cover"],
  then: () => void
): void {
  for (const animation of cover.getAnimations()) animation.cancel();
  const box = origin.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const radius =
    Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 30;
  cover.style.background = color === "azul" ? "var(--azul-sinal)" : "var(--papel)";
  cover.style.visibility = "visible";
  const open = cover.animate(
    [
      { clipPath: `circle(0px at ${x}px ${y}px)` },
      { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
    ],
    { duration: COVER_MS, easing: "cubic-bezier(0.55, 0.085, 0.68, 0.53)", fill: "forwards" }
  );
  open.onfinish = () => {
    then();
    const fade = cover.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: COVER_FADE_MS,
      delay: COVER_FADE_DELAY_MS,
      fill: "forwards",
    });
    fade.onfinish = () => {
      for (const animation of cover.getAnimations()) animation.cancel();
      cover.style.visibility = "hidden";
    };
  };
}

/** Trilho ligado à página: ícone pelo capítulo ou rota, arco com a leitura, Giro fora da home. */
export function Dock() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const scroll = useScrollState(SECTION_IDS);
  const navigating = useNavigating();
  const { asleep, celebrating } = useGiroEggs();
  const pageGiro = useSyncExternalStore(subscribePageGiro, getPageGiro, () => null);
  const moment = useDirectedMoment();
  const onStage = useGiroOnStage();
  const ringRef = useRef<HTMLSpanElement>(null);
  const giroRef = useRef<HTMLSpanElement>(null);
  const coverRef = useRef<HTMLSpanElement>(null);
  const mountedAt = useRef(performance.now());
  const [tag, setTag] = useState<DockTag | null>(null);

  const activeIndex = dockIndexFor(scroll.pathname, scroll.activeId);
  const tone = dockToneFor(scroll.pathname, scroll.activeId);
  const label = islandLabel(locale, scroll.activeId, scroll.pathname);

  // Espiando só em repouso e com o rosto à vista.
  const peek = usePeek(
    peekKey(scroll.pathname, scroll.activeId),
    !onStage &&
      !reducedMotion &&
      moment === undefined &&
      !navigating &&
      !asleep &&
      !celebrating &&
      pageGiro === null &&
      scroll.progress < 100
  );

  const lastIndex = useRef(activeIndex);
  useEffect(() => {
    const from = lastIndex.current;
    lastIndex.current = activeIndex;
    if (from === null || activeIndex === null || from === activeIndex) return;
    if (reducedMotion || performance.now() - mountedAt.current < SETTLE_MS) return;
    if (ringRef.current && giroRef.current) {
      playJump(ringRef.current, giroRef.current, from - activeIndex);
    }
  }, [activeIndex, reducedMotion]);

  const lastLabel = useRef(label);
  useEffect(() => {
    if (lastLabel.current === label) return;
    lastLabel.current = label;
    if (label === "" || performance.now() - mountedAt.current < SETTLE_MS) return;
    setTag(previous => ({ text: label, key: (previous?.key ?? 0) + 1 }));
  }, [label]);

  const onItemClick = (event: MouseEvent<HTMLAnchorElement>, item: DockItem) => {
    // Fora da home é navegação normal, a cargo do ClientRouter.
    if (scroll.pathname !== "/" || item.opensPage) return;
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const cover = coverRef.current;
    if (reducedMotion || !cover || typeof cover.animate !== "function") {
      jumpToSection(item.sectionId);
      return;
    }
    // Se o ClientRouter trocar de página durante o disco, o salto não rola a página nova.
    playCover(cover, event.currentTarget, item.cover, () => {
      if (window.location.pathname === "/") jumpToSection(item.sectionId);
    });
  };

  return (
    <DockView
      activeIndex={activeIndex}
      tone={tone}
      progress={scroll.progress}
      tag={tag}
      onStage={onStage}
      navigating={navigating}
      asleep={asleep}
      celebrating={celebrating}
      moment={moment}
      pageGiro={pageGiro}
      peek={peek}
      ringRef={ringRef}
      giroRef={giroRef}
      coverRef={coverRef}
      onItemClick={onItemClick}
    />
  );
}
