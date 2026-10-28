import { sendGTMEvent } from "@next/third-parties/google";
import type { PlanoKey } from "./leadOptions";

/**
 * Ponto único pra jogar eventos no dataLayer do Google Tag Manager (seção 5
 * do briefing + pedido do Rafael). Tudo passa só pelo GTM — sem Meta Pixel
 * instalado direto no app: se um dia precisar do Pixel, ele entra como tag
 * dentro do próprio GTM, disparado por esses mesmos eventos de dataLayer.
 *
 * O container carrega pelo loader do Stape no layout raiz
 * (`conversionapi.useady.com.br`). `sendGTMEvent` não depende daquele
 * loader: só faz `window.dataLayer.push`, então evento disparado antes
 * do GTM subir fica na fila e é consumido quando ele carrega.
 */

/** `page_view` — todas as páginas, disparado a cada troca de rota. */
export function trackPageView() {
  sendGTMEvent({ event: "page_view" });
}

/** `view_item_list` — quando a seção de planos entra no viewport. */
export function trackViewPlans() {
  sendGTMEvent({ event: "view_item_list", item_list_name: "planos" });
}

/** `select_plan` — clique em qualquer botão de plano (Social/Anúncios). */
export function trackSelectPlan(plan: PlanoKey) {
  sendGTMEvent({ event: "select_plan", plan });
}

/** `generate_lead` — só em /obrigado, depois do envio confirmado do formulário. */
export function trackLead() {
  sendGTMEvent({ event: "generate_lead" });
}

/**
 * Teste grátis de 7 dias — etapa 1 confirmada pelo servidor. Mesmo
 * `generate_lead` da home (a tag Lead do Meta no GTM pega os dois),
 * separado por `form`. `event_id` vem da API (`eventId`) e é o que o
 * Stape usa pra deduplicar navegador × Conversions API.
 *
 * `onDone` roda quando o GTM terminar as tags do evento (`eventCallback`)
 * — a LP navega pra próxima página só depois disso. Se o GTM não
 * carregar (bloqueador), o callback nunca vem: quem chama precisa de um
 * tempo-limite próprio.
 */
export function trackTeste7dLead(eventId: string, lpVariant: string | null, onDone?: () => void) {
  sendGTMEvent({
    event: "generate_lead",
    form: "teste7d",
    event_id: eventId,
    lp_variant: lpVariant,
    ...(onDone && { eventCallback: onDone, eventTimeout: 2000 }),
  });
}

/** Teste grátis — conversa marcada no Calendly (evento Schedule do Meta).
 * `onDone`: mesmo contrato do `trackTeste7dLead`. */
export function trackTeste7dSchedule(eventId: string, onDone?: () => void) {
  sendGTMEvent({
    event: "schedule",
    form: "teste7d",
    event_id: eventId,
    ...(onDone && { eventCallback: onDone, eventTimeout: 2000 }),
  });
}
