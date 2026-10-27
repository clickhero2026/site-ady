import {
  ACAO_DESEJADA,
  ACESSO_REDES,
  ARQUIVO_LOGO,
  CARTAO_PAGAMENTO,
  CONTA_ANUNCIOS,
  EXPERIENCIA_ANUNCIOS,
  REUNIAO_COMPUTADOR,
  optionLabel,
} from "./teste7dOptions";
import {
  lerParaSync,
  marcarBitrixErro,
  marcarBitrixOk,
  type InscricaoRow,
} from "./teste7dDb";

/**
 * Bitrix24 do teste grátis de 7 dias. Um lead por inscrição (já
 * qualificado, briefing seção 2), criado na etapa 1 e atualizado na
 * etapa 2 e no agendamento — o id fica em `bitrix_lead_id`.
 *
 * O sync é sempre "manda o estado inteiro da linha": não importa qual
 * etapa disparou, ele lê a linha atual e cria (sem `bitrix_lead_id`) ou
 * atualiza o lead. Por isso o reenvio (`/api/teste7d/reenviar-bitrix`) é
 * só chamar o mesmo `syncInscricaoBitrix` de novo.
 *
 * Nunca lança e nunca bloqueia o usuário: falha vira `bitrix_sync_status
 * = 'erro'` + motivo em `bitrix_erro`. Sem `BITRIX_WEBHOOK_URL` (mesma
 * variável e convenção do `bitrix.ts`), não chama nada e a linha fica
 * `pendente`, esperando o reenvio.
 *
 * Opcionais, mesmo padrão dos `BITRIX_FIELD_*` existentes:
 * - `BITRIX_FIELD_LP_VARIANT`: campo customizado pra versão da landing
 *   page. Sem ele, vai em COMMENTS.
 * - `BITRIX_TESTE7D_STATUS_ID`: etapa do lead na criação (ex. a de
 *   "qualificado" do funil de vocês). Sem ele, o Bitrix usa a padrão.
 */

type BitrixCall = { ok: true; result: unknown } | { ok: false; error: string };

async function callBitrix(
  webhookUrl: string,
  method: string,
  payload: Record<string, unknown>,
): Promise<BitrixCall> {
  try {
    const res = await fetch(`${webhookUrl}${method}.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    const json = await res.json().catch(() => ({}));

    if (!res.ok || json.error) {
      return {
        ok: false,
        error: `${method}: ${json.error_description || json.error || `HTTP ${res.status}`}`,
      };
    }
    return { ok: true, result: json.result };
  } catch (err) {
    return { ok: false, error: `${method}: falha de rede (${(err as Error).message})` };
  }
}

function dataBR(date: Date | null): string | null {
  return date
    ? date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" })
    : null;
}

/** COMMENTS do lead — reescrito a cada sync com o estado atual do site. */
function montarComentarios(row: InscricaoRow, lpNoComentario: boolean): string {
  const simNao = (v: boolean | null) => (v == null ? null : v ? "Sim" : "Não");
  const linhas: [string, string | null][] = [
    ["Origem", "Teste grátis 7 dias (useady.com.br)"],
    ["Status no site", row.status],
    ["Versão da landing page", lpNoComentario ? row.lp_variant : null],
    ["Inscrito em", dataBR(row.created_at)],
    ["Negócio e o que vende", row.negocio_nome_oferta],
    ["Cidade e bairro", row.cidade_bairro],
    ["Atende todo o Brasil", simNao(row.atende_todo_brasil)],
    ["Quer que a pessoa", row.acao_desejada === "outro" ? row.acao_desejada_outro : optionLabel(ACAO_DESEJADA, row.acao_desejada)],
    ["Experiência com anúncios", optionLabel(EXPERIENCIA_ANUNCIOS, row.experiencia_anuncios)],
    ["Instagram/Facebook", optionLabel(ACESSO_REDES, row.acesso_redes)],
    ["Conta de anúncios", optionLabel(CONTA_ANUNCIOS, row.conta_anuncios)],
    ["Cartão para anúncios", optionLabel(CARTAO_PAGAMENTO, row.cartao_pagamento)],
    ["Arquivo da logo", optionLabel(ARQUIVO_LOGO, row.arquivo_logo)],
    ["Reunião pelo computador", optionLabel(REUNIAO_COMPUTADOR, row.reuniao_computador)],
    ["Observações", row.observacoes],
    ["Briefing concluído em", dataBR(row.etapa2_concluida_em)],
    ["Conversa agendada em", dataBR(row.agendado_em)],
    ["Data da conversa", dataBR(row.reuniao_em)],
    ["Evento no Calendly", row.calendly_evento_uri],
    ["Conversa realizada em", dataBR(row.realizada_em)],
  ];

  return linhas
    .filter((linha): linha is [string, string] => Boolean(linha[1]))
    .map(([rotulo, valor]) => `${rotulo}: ${valor}`)
    .join("\n");
}

function montarCampos(row: InscricaoRow, criando: boolean): Record<string, unknown> {
  const fieldLp = process.env.BITRIX_FIELD_LP_VARIANT;
  const statusId = process.env.BITRIX_TESTE7D_STATUS_ID;

  const fields: Record<string, unknown> = {
    TITLE: `Teste 7 dias — ${row.nome}`,
    NAME: row.nome,
    SOURCE_ID: "WEB",
    UTM_SOURCE: row.utm_source ?? "",
    UTM_MEDIUM: row.utm_medium ?? "",
    UTM_CAMPAIGN: row.utm_campaign ?? "",
    UTM_CONTENT: row.utm_content ?? "",
    UTM_TERM: row.utm_term ?? "",
    COMMENTS: montarComentarios(row, !fieldLp),
  };

  if (fieldLp) fields[fieldLp] = row.lp_variant ?? "";

  // Telefone e e-mail são multicampos no Bitrix: mandar de novo no update
  // ADICIONA outro valor em vez de trocar. Só vão na criação. A etapa
  // também: depois de criado, quem move o lead é o time de vendas.
  if (criando) {
    fields.PHONE = [{ VALUE: `+${row.whatsapp}`, VALUE_TYPE: "WORK" }];
    fields.EMAIL = [{ VALUE: row.email, VALUE_TYPE: "WORK" }];
    if (statusId) fields.STATUS_ID = statusId;
  }

  return fields;
}

/** Uma passada: lê a linha, cria/atualiza o lead, grava o resultado.
 * Devolve true só se terminou `ok` sem nada novo chegando no meio. */
async function syncUmaVez(id: string, webhookUrl: string): Promise<boolean> {
  const row = await lerParaSync(id);
  if (!row) return true;

  const criando = !row.bitrix_lead_id;
  const fields = montarCampos(row, criando);

  const call = criando
    ? await callBitrix(webhookUrl, "crm.lead.add", { fields, params: { REGISTER_SONET_EVENT: "Y" } })
    : await callBitrix(webhookUrl, "crm.lead.update", { id: row.bitrix_lead_id, fields });

  if (!call.ok) {
    console.error(`[teste7d-bitrix] ${id}:`, call.error);
    await marcarBitrixErro(id, call.error);
    return true; // erro registrado; quem tenta de novo é o reenvio
  }

  const leadId = criando ? String(call.result) : row.bitrix_lead_id!;
  return marcarBitrixOk(id, leadId, row.snapshot);
}

/**
 * Sincroniza uma inscrição com o Bitrix. Se a linha mudou durante a
 * criação do lead (ex. etapa 2 salva no meio), faz uma segunda passada
 * — agora como update — pra o dado novo não ficar esperando o reenvio.
 */
export async function syncInscricaoBitrix(id: string): Promise<void> {
  const webhookUrl = process.env.BITRIX_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn(`[teste7d-bitrix] BITRIX_WEBHOOK_URL não configurada — ${id} fica pendente.`);
    return;
  }

  try {
    if (!(await syncUmaVez(id, webhookUrl))) await syncUmaVez(id, webhookUrl);
  } catch (err) {
    // Erro de banco no meio do sync: não há onde registrar com
    // segurança; a linha segue `pendente` e o reenvio pega depois.
    console.error(`[teste7d-bitrix] ${id}: falha inesperada no sync:`, err);
  }
}

/**
 * Chamado depois que a etapa 2 ou o agendamento gravaram. Se o lead ainda
 * não existe no Bitrix, não cria aqui: quem cria é o sync da etapa 1 (ou
 * o reenvio) — dois `crm.lead.add` concorrentes duplicariam o lead.
 */
export async function syncAtualizacaoBitrix(row: InscricaoRow): Promise<void> {
  if (!row.bitrix_lead_id) return;
  await syncInscricaoBitrix(row.id);
}
