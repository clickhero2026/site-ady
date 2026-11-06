import { sendGTMEvent } from "@next/third-parties/google";
import type { Ramo } from "@/config/fluxoB";
import type { SignupCode } from "./signup";

/**
 * Eventos do Fluxo B no dataLayer — todos com `flow: "b"`. Mesmo canal
 * da LP atual (`sendGTMEvent` = `dataLayer.push`, consumido pelo GTM via
 * Stape); sem Meta Pixel direto. As tags ficam no container do GTM.
 *
 * `onDone`: roda quando o GTM terminar as tags (`eventCallback`) ou em
 * 2,5s se ele não carregou (bloqueador) — o que vier primeiro, uma vez.
 */
function push(dados: Record<string, unknown>, onDone?: () => void) {
  if (!onDone) {
    sendGTMEvent({ ...dados, flow: "b" });
    return;
  }
  let foi = false;
  const uma = () => {
    if (foi) return;
    foi = true;
    onDone();
  };
  sendGTMEvent({ ...dados, flow: "b", eventCallback: uma, eventTimeout: 2000 });
  window.setTimeout(uma, 2500);
}

/** Etapa 1 confirmada pelo servidor: MESMO evento e campos da LP atual
 * (`trackTeste7dLead`), só com `flow: "b"` a mais. */
export function trackLeadFluxoB(eventId: string, lpVariant: string | null, onDone?: () => void) {
  push({ event: "generate_lead", form: "teste7d", event_id: eventId, lp_variant: lpVariant }, onDone);
}

export const trackContaCriada = () => push({ event: "fluxo_b_conta_criada" });

export const trackErroCriacao = (code: SignupCode) => push({ event: "fluxo_b_erro_criacao", code });

export const trackRamoConcluido = (segmentos: Ramo[], onDone?: () => void) =>
  push({ event: "fluxo_b_ramo_concluido", segmentos }, onDone);

export const trackSenhaCriada = (onDone?: () => void) => push({ event: "fluxo_b_senha_criada" }, onDone);

export const trackEntrouNoApp = (onDone: () => void) => push({ event: "fluxo_b_entrou_no_app" }, onDone);
