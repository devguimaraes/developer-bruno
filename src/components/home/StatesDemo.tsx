import { Button } from "@/components/giro/Button";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { DemoState } from "./states-stage";

type MessageState = Exclude<DemoState, "done">;

const MESSAGES: readonly MessageState[] = ["empty", "loading", "error"];

interface StatesDemoProps {
  locale: Locale;
  state: DemoState;
  /** Com onPress a tela é a de exemplo, com botão e paradas do Giro. Sem, é uma cópia só de leitura. */
  onPress?: () => void;
}

/**
 * Tela de exemplo do capítulo Estados: um navegador de mentira que mostra vazio, carregando,
 * erro e pronto. Simulada, sem rede. A página azul só pinta em pronto (clip-path em 10 passos).
 */
export function StatesDemo({ locale, state, onPress }: StatesDemoProps) {
  const live = onPress !== undefined;
  return (
    <div className="dm g-papel" data-st={state}>
      <div className="dm-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span className="dm-url">{t(locale, "story.states.demo.url")}</span>
      </div>
      <div className="dm-body">
        {live && (
          <i className="hs-stop dm-stop" data-stop="card" data-size="112" data-size-m="84" />
        )}
        <div className="dm-page g-azul" aria-hidden="true">
          <span className="dm-page__sig">{t(locale, "story.states.demo.sig")}</span>
          <strong className="dm-page__title">{t(locale, "story.states.demo.title")}</strong>
          <span className="dm-page__bar" />
          <span className="dm-page__bar dm-page__bar--2" />
          <span className="dm-page__cta" />
          {live && (
            <i
              className="hs-stop dm-stop--done"
              data-stop="card-done"
              data-size="88"
              data-size-m="60"
            />
          )}
        </div>
        {MESSAGES.filter(name => name === state).map(name => (
          <div key={name} className="dm-msg">
            <strong>{t(locale, `story.states.msg.${name}.title`)}</strong>
            <span>{t(locale, `story.states.msg.${name}.body`)}</span>
          </div>
        ))}
        <div className="dm-prog" aria-hidden="true">
          <b />
        </div>
      </div>
      <div className="dm-foot">
        <span className="dm-status" role={live ? "status" : undefined}>
          {t(locale, `story.states.status.${state}`)}
        </span>
        {live && (
          <Button className="dm-act" onClick={onPress} disabled={state === "loading"}>
            {t(locale, `story.states.act.${state}`)}
          </Button>
        )}
      </div>
    </div>
  );
}
