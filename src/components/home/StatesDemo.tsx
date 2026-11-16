import { type CSSProperties, useState } from "react";
import { Button } from "@/components/giro/Button";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import type { DemoState } from "./states-stage";

type MessageState = Exclude<DemoState, "done">;
type DemoStyle = CSSProperties & { [name: `--${string}`]: number };

const MESSAGES: readonly MessageState[] = ["empty", "loading", "error"];

function stateWord(locale: Locale, state: DemoState): string {
  if (state === "done") return t(locale, "story.states.demo.title");
  return t(locale, `story.states.chip.${state}`);
}

interface LetterItem {
  key: string;
  ch: string;
  index: number;
}

/**
 * Separa a palavra letra a letra para a onda a partir do Giro. A chave é o prefixo até a letra
 * (única, independente de índice).
 */
function wordLetters(word: string): LetterItem[] {
  const out: LetterItem[] = [];
  let prefix = "";
  let index = 0;
  for (const ch of word) {
    prefix += ch;
    out.push({ key: prefix, ch, index });
    index += 1;
  }
  return out;
}

interface StatesDemoProps {
  locale: Locale;
  state: DemoState;
  /** Com onPress a tela é a de exemplo, com botão e assento do Giro. Sem, é uma cópia só de leitura. */
  onPress?: () => void;
}

/**
 * Tela de exemplo do capítulo Estados: um navegador de mentira que mostra vazio, carregando,
 * erro e pronto. Simulada, sem rede. A página azul só pinta em pronto (clip-path em 10 passos).
 */
export function StatesDemo({ locale, state, onPress }: StatesDemoProps) {
  const live = onPress !== undefined;
  const [trail, setTrail] = useState<{ state: DemoState; from?: DemoState }>({ state });
  if (trail.state !== state) setTrail({ state, from: trail.state });
  const from = trail.state === state ? trail.from : trail.state;
  const word = stateWord(locale, state);
  const letters = wordLetters(word);

  return (
    <div className="dm g-papel" data-st={state} data-from={from}>
      <div className="dm-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span className="dm-url">{t(locale, "story.states.demo.url")}</span>
      </div>
      <div className="dm-body">
        <div className="dm-page g-azul" aria-hidden="true">
          <span className="dm-page__sig">{t(locale, "story.states.demo.sig")}</span>
          <span className="dm-page__bar" />
          <span className="dm-page__bar dm-page__bar--2" />
          <span className="dm-page__cta" />
        </div>
        <div className={live ? "dm-stage dm-stage--live" : "dm-stage"}>
          {live && (
            <span className="dm-slot" aria-hidden="true">
              <i className="hs-stop dm-seat" data-stop="card" data-size="64" data-size-m="44" />
            </span>
          )}
          <div key={`${state}-${locale}`} className="dm-word-wrap">
            <span className="g-sr">{word}</span>
            <strong className="dm-word" aria-hidden="true">
              {letters.map(({ key, ch, index }) => (
                <span key={key} className="dm-ch" style={{ "--i": index } as DemoStyle}>
                  {ch}
                </span>
              ))}
            </strong>
            {state === "loading" && (
              <span className="dm-word dm-word--fill" aria-hidden="true">
                {letters.map(({ key, ch, index }) => (
                  <span
                    key={key}
                    className="dm-ch"
                    data-ch={ch}
                    style={{ "--i": index } as DemoStyle}
                  />
                ))}
              </span>
            )}
          </div>
          {MESSAGES.filter(name => name === state).map(name => (
            <div key={name} className="dm-msg">
              <strong>{t(locale, `story.states.msg.${name}.title`)}</strong>
              <span>{t(locale, `story.states.msg.${name}.body`)}</span>
            </div>
          ))}
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
