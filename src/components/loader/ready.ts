/**
 * Resolve quando as fontes do documento carregaram e o primeiro quadro pintado está na tela.
 * Na coreografia isso é o "página pronta". A espera da Anybody, que solta o relógio, é outra.
 */
export function waitForFirstPaint(): Promise<void> {
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>(resolve => {
          window.addEventListener("load", () => resolve(), { once: true });
        });
  const painted = loaded.then(nextFrame).then(nextFrame);
  return Promise.all([fonts, painted]).then(() => undefined);
}

function nextFrame(): Promise<void> {
  return new Promise(resolve => {
    window.requestAnimationFrame(() => resolve());
  });
}
