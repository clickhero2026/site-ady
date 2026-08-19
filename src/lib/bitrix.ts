import { PLANOS } from "./leadOptions";
import type { LeadData } from "./leadSchema";

/**
 * Envia o lead pro Bitrix24 via webhook de entrada (REST simples, sem OAuth).
 *
 * Credencial esperada em `BITRIX_WEBHOOK_URL` — a URL completa do webhook de
 * entrada, terminando em `/`, algo como:
 *   https://SEUDOMINIO.bitrix24.com.br/rest/1/xxxxxxxxxxxxxxxx/
 *
 * `BITRIX_FIELD_SEGMENTO` e `BITRIX_FIELD_PLANO` são opcionais: códigos de
 * campo customizado (ex. `UF_CRM_1234567890`) caso você crie campos
 * dedicados pra Segmento e Plano de interesse no CRM. Sem eles, os dois
 * valores vão dentro de COMMENTS, então nada trava enquanto os campos não
 * existem.
 *
 * Enquanto `BITRIX_WEBHOOK_URL` não estiver configurada, a função não faz
 * nenhuma chamada de rede — só registra o lead no log do servidor e retorna
 * sucesso, pra dar pra testar o funil (modal → /obrigado → pixel) sem
 * credencial real.
 */
export async function sendLeadToBitrix(lead: LeadData): Promise<
  { ok: true; skipped?: true } | { ok: false; error: string }
> {
  const webhookUrl = process.env.BITRIX_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "[lead] BITRIX_WEBHOOK_URL não configurada — lead não foi enviado ao Bitrix24:",
      lead,
    );
    return { ok: true, skipped: true };
  }

  const fieldSegmento = process.env.BITRIX_FIELD_SEGMENTO;
  const fieldPlano = process.env.BITRIX_FIELD_PLANO;

  const comments = [
    !fieldSegmento && `Segmento: ${lead.segmento}`,
    !fieldPlano && `Plano de interesse: ${PLANOS[lead.plano]}`,
    "Origem: formulário do site useady.com.br",
  ]
    .filter(Boolean)
    .join("\n");

  const fields: Record<string, unknown> = {
    TITLE: `Lead site ady — ${lead.negocio}`,
    NAME: lead.nome,
    COMPANY_TITLE: lead.negocio,
    SOURCE_ID: "WEB",
    PHONE: [{ VALUE: lead.whatsapp, VALUE_TYPE: "WORK" }],
    COMMENTS: comments,
  };

  if (fieldSegmento) fields[fieldSegmento] = lead.segmento;
  if (fieldPlano) fields[fieldPlano] = PLANOS[lead.plano];

  try {
    const res = await fetch(`${webhookUrl}crm.lead.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields, params: { REGISTER_SONET_EVENT: "Y" } }),
    });

    const json = await res.json();

    if (!res.ok || json.error) {
      const message = json.error_description || json.error || res.statusText;
      console.error("[lead] Bitrix24 recusou o lead:", message, lead);
      return { ok: false, error: message };
    }

    return { ok: true };
  } catch (err) {
    console.error("[lead] Falha de rede ao enviar pro Bitrix24:", err);
    return { ok: false, error: "network_error" };
  }
}
