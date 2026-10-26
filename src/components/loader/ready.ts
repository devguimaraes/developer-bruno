/**
 * Resolve quando as fontes carregaram e o primeiro quadro com a tela já pintada está na tela.
 * A tela de carregamento espera por isso, e não por um tempo fixo (decisão 29).
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
