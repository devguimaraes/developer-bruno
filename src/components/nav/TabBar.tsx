import { useCallback, useState } from "react";
import { BookText, House, LayoutGrid, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Giro } from "@/components/brand/Giro";
import { useNavigating } from "@/components/loader/navigation-state";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/lib/i18n";
import { SectionMenu } from "./SectionMenu";
import { useEscapeToClose } from "./useEscapeToClose";
import { HOME_SECTIONS, SECTION_IDS, TABS, tabForLocation } from "./sections";
import type { TabId, TabItem } from "./sections";
import { LOOK_PX, useScrollState } from "./useScrollState";

const TAB_ICONS: Readonly<Record<TabId, LucideIcon>> = {
  home: House,
  projects: LayoutGrid,
  blog: BookText,
  contact: MessageCircle,
};

const TOGGLE_ID = "tab-bar-toggle";
const MENU_ID = "tab-bar-menu";
// A aba Projetos já está na barra, então o menu do Giro traz só Processo e Sobre.
const TAB_MENU = HOME_SECTIONS.filter(section => section.inMenu && section.id !== "projetos");

export interface TabBarViewProps {
  /** 0 a 100, lido do artigo ou da página. */
  progress: number;
  activeTab: TabId | null;
  activeId?: string | null;
  menuOpen?: boolean;
  /** Troca de página em curso: o Giro gira em carregando. */
  navigating?: boolean;
  onToggleMenu?: () => void;
  onNavigate?: () => void;
}

/** Barra de abas sem estado próprio. Só aparece no celular (md:hidden). */
export function TabBarView({
  progress,
  activeTab,
  activeId = null,
  menuOpen = false,
  navigating = false,
  onToggleMenu,
  onNavigate,
}: TabBarViewProps) {
  const locale = useLocale();
  const atEnd = progress >= 100;

  const renderTab = (tab: TabItem) => {
    const Icon = TAB_ICONS[tab.id];
    return (
      <a
        key={tab.id}
        className="g-tab"
        href={tab.href}
        aria-current={tab.id === activeTab ? "page" : undefined}
      >
        <span className="g-tab__pill">
          <Icon className="g-icon g-icon--24" aria-hidden="true" />
        </span>
        {t(locale, tab.labelKey)}
      </a>
    );
  };

  return (
    <div className="g-tabbar-dock md:hidden">
      {menuOpen && (
        <SectionMenu
          id={MENU_ID}
          className="g-tabbar-menu"
          sections={TAB_MENU}
          activeId={activeId}
          onNavigate={onNavigate}
        />
      )}
      <nav className="g-tabbar" aria-label={t(locale, "tabs.label")}>
        <div className="g-tabbar__bg" aria-hidden="true" />
        <div className="g-tabbar__tabs">
          {TABS.slice(0, 2).map(renderTab)}
          <span aria-hidden="true" />
          {TABS.slice(2).map(renderTab)}
        </div>
        <button
          type="button"
          id={TOGGLE_ID}
          className="g-tabbar__giro"
          aria-label={t(locale, "giro.menu_progress", { n: progress })}
          aria-expanded={menuOpen}
          aria-controls={MENU_ID}
          onClick={onToggleMenu}
        >
          <Giro
            size={40}
            progress={progress}
            look={{ x: 0, y: menuOpen ? LOOK_PX : 0 }}
            state={navigating ? "loading" : atEnd ? "done" : "idle"}
            hop={atEnd && !navigating}
          />
        </button>
      </nav>
    </div>
  );
}

/** Barra de abas ligada à página: aba ativa pela rota e pela seção, Giro com a leitura. */
export function TabBar() {
  const { progress, activeId, pathname } = useScrollState(SECTION_IDS);
  const navigating = useNavigating();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useEscapeToClose(menuOpen, closeMenu, TOGGLE_ID);

  return (
    <TabBarView
      progress={progress}
      activeTab={tabForLocation(pathname, activeId)}
      activeId={activeId}
      menuOpen={menuOpen}
      navigating={navigating}
      onToggleMenu={() => setMenuOpen(open => !open)}
      onNavigate={closeMenu}
    />
  );
}
