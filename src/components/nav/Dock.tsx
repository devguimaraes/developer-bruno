import {
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type MouseEvent,
  type Ref,
  type RefAttributes,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Giro } from "@/components/brand/Giro";
import type { GiroState } from "@/components/brand/giro-states";
import { useNavigating } from "@/components/loader/navigation-state";
import { CogIcon } from "@/components/ui/cog";
import { FolderCodeIcon } from "@/components/ui/folder-code";
import { HomeIcon } from "@/components/ui/home";
import { UserIcon } from "@/components/ui/user";
import { useGiroOnStage } from "@/hooks/useGiroOnStage";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { t } from "@/lib/i18n";
import { getPageGiro, subscribePageGiro } from "@/lib/page-giro";
import { DOCK_ITEMS, type DockItem, type DockTone, dockIndexFor, dockToneFor } from "./dock-map";
import type { DirectedMoment } from "./giro-director";
import { useDirectedMoment } from "./giro-director";
import { islandLabel, SECTION_IDS } from "./sections";
import { resolveNavGiro, useGiroEggs } from "./useGiroEggs";
import { type PeekPose, peekKey, peekStyle, usePeek } from "./usePeek";
import { useScrollState } from "./useScrollState";

const COVER_MS = 420;
const COVER_FADE_MS = 240;
const COVER_FADE_DELAY_MS = 320;
// Logo depois de montar o estado ainda vai da home para a página real: o aviso do capítulo espera.
const SETTLE_MS = 1200;
// O Giro fica no meio e divide o trilho: dois ícones de cada lado.
const GIRO_AFTER = DOCK_ITEMS.length / 2;

interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

type DockIconComponent = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & { size?: number } & RefAttributes<AnimatedIconHandle>
>;

const DOCK_ICONS: Readonly<Record<DockItem["id"], DockIconComponent>> = {
  home: HomeIcon,
  about: UserIcon,
  services: CogIcon,
  projects: FolderCodeIcon,
};

function DockNavItem({
  item,
  active,
  reducedMotion,
  label,
  onItemClick,
}: {
  item: DockItem;
  active: boolean;
  reducedMotion: boolean;
  label: string;
  onItemClick?: (event: MouseEvent<HTMLAnchorElement>, item: DockItem) => void;
}) {
  const iconRef = useRef<AnimatedIconHandle>(null);
  const wasActive = useRef(active);

  useEffect(() => {
    if (reducedMotion) {
      iconRef.current?.stopAnimation();
      wasActive.current = active;
      return;
    }
    if (active && !wasActive.current) {
      iconRef.current?.startAnimation();
    } else if (!active && wasActive.current) {
      iconRef.current?.stopAnimation();
    }
    wasActive.current = active;
  }, [active, reducedMotion]);

  const Icon = DOCK_ICONS[item.id];
  const triggerAnimation = () => {
    if (!reducedMotion) iconRef.current?.startAnimation();
  };
  const resetIfInactive = () => {
    if (!active) iconRef.current?.stopAnimation();
  };

  return (
    <a
      className={["g-dock__item", active && "is-on"].filter(Boolean).join(" ")}
      href={item.href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onMouseEnter={triggerAnimation}
      onMouseLeave={resetIfInactive}
      onFocus={triggerAnimation}
      onBlur={resetIfInactive}
      onClick={
        onItemClick
          ? event => {
              triggerAnimation();
              onItemClick(event, item);
            }
          : triggerAnimation
      }
    >
      <span className="g-dock__plate">
        <Icon ref={iconRef} className="g-dock__ico" size={24} />
      </span>
    </a>
  );
}

export interface DockTag {
  text: string;
  /** Muda a cada aviso, para a animação recomeçar mesmo com o mesmo texto. */
  key: number;
}

export interface DockViewProps {
  /** Destino aceso (índice em DOCK_ITEMS), ou null quando a rota não tem ícone próprio. */
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
  reducedMotion?: boolean;
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
  reducedMotion = false,
  coverRef,
  onItemClick,
}: DockViewProps) {
  const locale = useLocale();
  const giro = resolveNavGiro({ navigating, celebrating, asleep, progress, pageGiro });
  const activeItem = activeIndex === null ? null : DOCK_ITEMS[activeIndex];
  const renderLink = (item: DockItem) => (
    <DockNavItem
      key={item.id}
      item={item}
      active={item === activeItem}
      reducedMotion={reducedMotion}
      label={t(locale, item.labelKey)}
      onItemClick={onItemClick}
    />
  );

  return (
    <>
      <span className="g-dock__cover" ref={coverRef} aria-hidden="true" />
      <nav
        className="g-dock"
        aria-label={t(locale, "tabs.label")}
        data-tone={tone}
        data-stage={onStage ? "true" : "false"}
      >
        {tag && (
          <span key={tag.key} className="g-dock__tag" aria-hidden="true">
            {tag.text}
          </span>
        )}
        <i className="g-dock__rail" aria-hidden="true" />
        <span className="g-dock__ring" aria-hidden="true">
          <span className="g-dock__giro" style={onStage ? undefined : peekStyle(peek)}>
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
        {DOCK_ITEMS.slice(0, GIRO_AFTER).map(renderLink)}
        {/* O lugar do Giro: um disco translúcido que separa as duas metades do trilho. */}
        <span className="g-dock__hub" aria-hidden="true" />
        {DOCK_ITEMS.slice(GIRO_AFTER).map(renderLink)}
      </nav>
    </>
  );
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
      reducedMotion={reducedMotion}
      coverRef={coverRef}
      onItemClick={onItemClick}
    />
  );
}
