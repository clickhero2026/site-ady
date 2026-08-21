import { PLANOS } from "./leadOptions";
import type { LeadData } from "./leadSchema";
import type { WorkshopLeadData } from "./workshopLeadSchema";
import { workshopOrigem } from "@/config/workshop";

type BitrixResult = { ok: true; skipped?: true } | { ok: false; error: string };

/**
 * Envia campos já montados pro Bitrix24 via webhook de entrada (REST
 * simples, sem OAuth). Compartilhada pelo lead da home e pelo do workshop
 * — cada um monta seu próprio `fields`/`comments`, a chamada de rede e o
 * tratamento de erro são os mesmos.
 *
 * Credencial esperada em `BITRIX_WEBHOOK_URL` — a URL completa do webhook de
 * entrada, terminando em `/`, algo como:
 *   https://SEUDOMINIO.bitrix24.com.br/rest/1/xxxxxxxxxxxxxxxx/
 *
 * Enquanto `BITRIX_WEBHOOK_URL` não estiver configurada, não faz nenhuma
 * chamada de rede — só registra no log do servidor e retorna sucesso, pra
 * dar pra testar o funil sem credencial real.
 */
async function postLeadToBitrix(
  fields: Record<string, unknown>,
  logLabel: string,
): Promise<BitrixResult> {
  const webhookUrl = process.env.BITRIX_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      `[${logLabel}] BITRIX_WEBHOOK_URL não configurada — lead não foi enviado ao Bitrix24:`,
      fields,
    );
    return { ok: true, skipped: true };
  }

  try {
    const res = await fetch(`${webhookUrl}crm.lead.add.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields, params: { REGISTER_SONET_EVENT: "Y" } }),
    });

    const json = await res.json();

    if (!res.ok || json.error) {
      const message = json.error_description || json.error || res.statusText;
      console.error(`[${logLabel}] Bitrix24 recusou o lead:`, message, fields);
      return { ok: false, error: message };
    }

    return { ok: true };
  } catch (err) {
    console.error(`[${logLabel}] Falha de rede ao enviar pro Bitrix24:`, err);
    return { ok: false, error: "network_error" };
  }
}

/**
 * `BITRIX_FIELD_SEGMENTO` e `BITRIX_FIELD_PLANO` são opcionais: códigos de
 * campo customizado (ex. `UF_CRM_1234567890`) caso você crie campos
 * dedicados pra Segmento e Plano de interesse no CRM. Sem eles, os dois
 * valores vão dentro de COMMENTS, então nada trava enquanto os campos não
 * existem.
 */
export async function sendLeadToBitrix(lead: LeadData): Promise<BitrixResult> {
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

  return postLeadToBitrix(fields, "lead");
}

/**
 * `BITRIX_FIELD_SEGMENTO_WORKSHOP` e `BITRIX_FIELD_INDICADO_POR` são
 * opcionais, mesmo padrão do lead da home — campo customizado se existir,
 * senão vai em COMMENTS. A origem (`workshop-[DATA]`, briefing seção 6)
 * sempre vai em COMMENTS, é o que mede a performance de cada convite do
 * BNI — não deve depender de campo customizado existir ou não.
 */
export async function sendWorkshopLeadToBitrix(
  lead: WorkshopLeadData,
): Promise<BitrixResult> {
  const fieldSegmento = process.env.BITRIX_FIELD_SEGMENTO_WORKSHOP;
  const fieldIndicadoPor = process.env.BITRIX_FIELD_INDICADO_POR;

  const comments = [
    !fieldSegmento && `Segmento: ${lead.segmento}`,
    lead.indicadoPor && !fieldIndicadoPor && `Indicado por: ${lead.indicadoPor}`,
    `Origem: ${workshopOrigem}`,
  ]
    .filter(Boolean)
    .join("\n");

  const fields: Record<string, unknown> = {
    TITLE: `Lead workshop — ${lead.negocio}`,
    NAME: lead.nome,
    COMPANY_TITLE: lead.negocio,
    SOURCE_ID: "WEB",
    PHONE: [{ VALUE: lead.whatsapp, VALUE_TYPE: "WORK" }],
    EMAIL: [{ VALUE: lead.email, VALUE_TYPE: "WORK" }],
    COMMENTS: comments,
  };

  if (fieldSegmento) fields[fieldSegmento] = lead.segmento;
  if (lead.indicadoPor && fieldIndicadoPor) fields[fieldIndicadoPor] = lead.indicadoPor;

  return postLeadToBitrix(fields, "workshop-lead");
}
