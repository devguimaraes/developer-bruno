import { type DependencyList, type RefObject, useEffect, useState } from "react";
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

export type GSAP = typeof GsapType;
export type ScrollTriggerPlugin = typeof ScrollTriggerType;
export type ScrollTrigger = ScrollTriggerPlugin;

let gsapPromise: Promise<{ gsap: GSAP; ScrollTrigger: ScrollTriggerPlugin }> | null = null;

/**
 * Import dinâmico de gsap e ScrollTrigger.
 * Garante que o GSAP seja empacotado em um chunk isolado, baixado apenas na home.
 */
export function loadGsap(): Promise<{ gsap: GSAP; ScrollTrigger: ScrollTriggerPlugin }> {
  if (!gsapPromise) {
    gsapPromise = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapMod, triggerMod]) => {
        const gsapInstance = (gsapMod.default || gsapMod) as GSAP;
        const triggerPlugin: ScrollTriggerPlugin = (triggerMod.ScrollTrigger ||
          triggerMod.default ||
          triggerMod) as ScrollTriggerPlugin;
        gsapInstance.registerPlugin(triggerPlugin);
        return { gsap: gsapInstance, ScrollTrigger: triggerPlugin };
      }
    );
  }
  return gsapPromise;
}

export interface ChapterSceneContext {
  gsap: GSAP;
  ScrollTrigger: ScrollTriggerPlugin;
  /**
   * Cria uma timeline de rolagem na janela com scrub suave (0.35), sem pin.
   * start padrão: "top top", end padrão: "bottom bottom".
   */
  scene: (trigger: string | Element, extra?: Record<string, unknown>) => gsap.core.Timeline;
  /**
   * Previne a armadilha do GSAP em que variáveis CSS sem valor inicial partem de zero.
   * Sempre chame setVars antes de aplicar tweens de variáveis CSS.
   */
  setVars: (target: gsap.TweenTarget, vars: Record<string, string | number>) => void;
  ctx: gsap.Context;
}

export type SceneCleanup = (() => void) | undefined;
export type SceneBuilder = (ctx: ChapterSceneContext) => SceneCleanup;

export interface UseChapterScenesOptions {
  /** Escopo DOM para limitar os seletores usados no contexto do GSAP */
  scope?: RefObject<HTMLElement | null>;
  /** Ativação condicional (ex: desligado quando prefers-reduced-motion) */
  enabled?: boolean;
}

/**
 * Hook para coreografar cenas de rolagem dos capítulos da home via GSAP + ScrollTrigger.
 * Cria gsap.context, vincula ao scroll da janela sem pin, e reconstrói com debounce de 200 ms
 * em redimensionamentos e após document.fonts.ready.
 */
export function useChapterScenes(
  buildScenes?: SceneBuilder,
  deps: DependencyList = [],
  options: UseChapterScenesOptions = {}
): {
  isReady: boolean;
  gsap: GSAP | null;
  ScrollTrigger: ScrollTriggerPlugin | null;
} {
  const [instances, setInstances] = useState<{
    gsap: GSAP | null;
    ScrollTrigger: ScrollTriggerPlugin | null;
  }>({
    gsap: null,
    ScrollTrigger: null,
  });
  const [isReady, setIsReady] = useState(false);
  const scopeRef = options.scope;
  const enabled = options.enabled;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Se explicitly desabilitado ou se as cenas interativas não estiverem ativas, não inicializa.
    if (enabled === false) return;
    const isScenesOn = document.documentElement.getAttribute("data-scenes") === "on";
    if (!isScenesOn && enabled === undefined) return;

    let cancelled = false;
    let ctx: gsap.Context | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let onResizeHandler: (() => void) | null = null;
    let cleanupFn: SceneCleanup;

    loadGsap().then(async ({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      setInstances({ gsap, ScrollTrigger });

      // Aguarda o carregamento das fontes para medições exatas de dimensões
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch (_) {
          // Continua mesmo se a Promise de fontes falhar
        }
      }

      if (cancelled) return;

      const runBuild = () => {
        if (cleanupFn) {
          cleanupFn();
          cleanupFn = undefined;
        }
        if (ctx) {
          ctx.revert();
        }

        const scopeEl = scopeRef?.current ?? undefined;
        ctx = gsap.context(context => {
          const scene = (trigger: string | Element, extra: Record<string, unknown> = {}) => {
            return gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: Object.assign(
                {
                  trigger,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.35,
                },
                extra
              ),
            });
          };

          const setVars = (target: gsap.TweenTarget, vars: Record<string, string | number>) => {
            gsap.set(target, vars);
          };

          if (buildScenes) {
            cleanupFn = buildScenes({ gsap, ScrollTrigger, scene, setVars, ctx: context });
          }
        }, scopeEl);
      };

      runBuild();
      setIsReady(true);

      onResizeHandler = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (!cancelled) {
            runBuild();
            ScrollTrigger.refresh();
          }
        }, 200);
      };

      window.addEventListener("resize", onResizeHandler);
    });

    return () => {
      cancelled = true;
      if (onResizeHandler) {
        window.removeEventListener("resize", onResizeHandler);
      }
      if (resizeTimer) clearTimeout(resizeTimer);
      if (cleanupFn) cleanupFn();
      if (ctx) ctx.revert();
    };
  }, [enabled, scopeRef, buildScenes, ...deps]);

  return { isReady, ...instances };
}
