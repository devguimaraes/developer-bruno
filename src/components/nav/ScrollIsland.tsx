import { type Ref, useCallback, useRef, useState, useSyncExternalStore } from "react";
import { Menu, X } from "lucide-react";
import { Giro } from "@/components/brand/Giro";
import type { GiroState } from "@/components/brand/giro-states";
import { IconButton } from "@/components/giro/Button";
import { useNavigating } from "@/components/loader/navigation-state";
import { useLocale } from "@/hooks/useLocale";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { t } from "@/lib/i18n";
import { getPageGiro, subscribePageGiro } from "@/lib/page-giro";
import { SectionMenu } from "./SectionMenu";
import { useMenuDismiss } from "./useMenuDismiss";
import { resolveNavGiro, useGiroEggs } from "./useGiroEggs";
import { type DockTone, dockToneFor } from "./dock-map";
import { HOME_SECTIONS, SECTION_IDS, islandLabel, routeSectionId } from "./sections";
import { type DirectedMoment, useDirectedMoment } from "./giro-director";
import { useCursorLook } from "./useCursorLook";
import { type PeekPose, peekKey, peekStyle, usePeek } from "./usePeek";
import { LOOK_PX, useScrollState } from "./useScrollState";

const TOGGLE_ID = "scroll-island-toggle";
const MENU_ID = "scroll-island-menu";
const ISLAND_MENU = HOME_SECTIONS.filter(section => section.inMenu);

export interface ScrollIslandViewProps {
  progress: number;
  label: string;
  direction: 1 | -1 | 0;
  /** Rolagem rápida: liga o giro extra. */
  fast?: boolean;
  /** Momento escolhido pelo diretor (giro-director): tonto, piscadela ou oi. */
  moment?: DirectedMoment;
  /** Superfície da ilha, igual à do trilho: papel sobre azul e tinta, tinta sobre o papel. */
  tone?: DockTone;
  /** Se a ilha aparece (depois do hero). */
  visible?: boolean;
  menuOpen?: boolean;
  activeId?: string | null;
  /** Troca de página em curso: o Giro gira em carregando. */
  navigating?: boolean;
  /** Aba do navegador escondida: o Giro dorme. */
  asleep?: boolean;
  /** Atalho escondido: festa que roda uma vez. */
  celebrating?: boolean;
  /** Giro pedido pela página do case, quando houver. */
  pageGiro?: GiroState | null;
  /** Olhar na direção do mouse, quando ele está perto do Giro. Vence a direção da rolagem. */
  cursorLook?: { x: number; y: number } | null;
  /** Espiando: o passo da leitura em curso. Vence o mouse e a direção da rolagem. */
  peek?: PeekPose | null;
  /** Caixa do Giro, medida para saber onde está o mouse. */
  giroRef?: Ref<HTMLSpanElement>;
  onToggleMenu?: () => void;
  onNavigate?: () => void;
}

/** Ilha de rolagem sem estado próprio. Recebe tudo pronto, então dá para ver cada estado. */
export function ScrollIslandView({
  progress,
  label,
  direction,
  fast = false,
  moment,
  tone = "dark",
  visible = true,
  menuOpen = false,
  activeId = null,
  navigating = false,
  asleep = false,
  celebrating = false,
  pageGiro = null,
  cursorLook = null,
  peek = null,
  giroRef,
  onToggleMenu,
  onNavigate,
}: ScrollIslandViewProps) {
  const locale = useLocale();
  // Menu aberto: olha para o menu. Senão, o mouse perto vence a direção da rolagem.
  const look = menuOpen
    ? { x: 0, y: LOOK_PX }
    : (peek?.look ?? cursorLook ?? { x: 0, y: direction * LOOK_PX });
  const giro = resolveNavGiro({ navigating, celebrating, asleep, progress, pageGiro });

  return (
    <div className="g-island-dock" data-visible={visible ? "true" : "false"}>
      <nav
        className="g-island"
        aria-label={t(locale, "tabs.label")}
        data-fast={fast ? "true" : undefined}
        data-tone={tone}
      >
        <span className="g-island__giro" ref={giroRef} style={peekStyle(peek)}>
          <Giro
            size={40}
            progress={progress}
            look={look}
            state={giro.state}
            hop={giro.hop}
            // Só em repouso: no pronto, na festa, no sono ou carregando, o corpo já tem animação.
            moment={giro.state === "idle" ? moment : undefined}
            className={giro.party ? "is-party" : undefined}
          />
        </span>
        <span className="g-island__label">{label}</span>
        <IconButton
          id={TOGGLE_ID}
          aria-expanded={menuOpen}
          aria-controls={MENU_ID}
          aria-label={menuOpen ? t(locale, "menu.close") : t(locale, "menu.open")}
          onClick={onToggleMenu}
        >
          {menuOpen ? (
            <X className="g-icon" aria-hidden="true" />
          ) : (
            <Menu className="g-icon" aria-hidden="true" />
          )}
        </IconButton>
      </nav>
      {menuOpen && (
        <SectionMenu
          id={MENU_ID}
          sections={ISLAND_MENU}
          activeId={activeId}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

/** Ilha de rolagem ligada à página: progresso, seção atual, menu e giro extra na rolagem rápida. */
export function ScrollIsland() {
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const scroll = useScrollState(SECTION_IDS);
  const navigating = useNavigating();
  const { asleep, celebrating } = useGiroEggs();
  const pageGiro = useSyncExternalStore(subscribePageGiro, getPageGiro, () => null);
  const moment = useDirectedMoment();
  const giroRef = useRef<HTMLSpanElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useMenuDismiss(menuOpen, closeMenu, TOGGLE_ID, MENU_ID);

  // Movimento reduzido: sem giro extra (decisão 20).
  const fast = scroll.fast && !reducedMotion;
  // Ilha escondida no hero ou menu aberto: não há o que seguir.
  const cursorLook = useCursorLook(giroRef, scroll.pastHero && !menuOpen);
  // Espiando só com o Giro à vista e em repouso: sem menu, momento, troca de página ou fim de leitura.
  const peek = usePeek(
    peekKey(scroll.pathname, scroll.activeId),
    scroll.pastHero &&
      !menuOpen &&
      !reducedMotion &&
      moment === undefined &&
      !navigating &&
      !asleep &&
      !celebrating &&
      pageGiro === null &&
      scroll.progress < 100
  );

  return (
    <ScrollIslandView
      progress={scroll.progress}
      label={islandLabel(locale, scroll.activeId, scroll.pathname)}
      direction={scroll.direction}
      fast={fast}
      moment={moment}
      tone={dockToneFor(scroll.pathname, scroll.activeId)}
      visible={scroll.pastHero}
      menuOpen={menuOpen}
      activeId={scroll.activeId ?? routeSectionId(scroll.pathname)}
      navigating={navigating}
      asleep={asleep}
      celebrating={celebrating}
      pageGiro={pageGiro}
      cursorLook={cursorLook}
      peek={peek}
      giroRef={giroRef}
      onToggleMenu={() => setMenuOpen(open => !open)}
      onNavigate={closeMenu}
    />
  );
}
