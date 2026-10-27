import { neon } from "@neondatabase/serverless";
import { TESTE7D } from "@/config/teste7d";
import type { AtivacaoData, InscricaoData } from "./teste7dSchema";

/**
 * Acesso à tabela `teste7d_inscricoes` (Neon) — só no servidor. Schema em
 * `db/migrations/20261027_teste7d_inscricoes.sql`.
 *
 * Diferente do workshop, aqui o banco é obrigatório: é ele que gera o id
 * que o cookie da etapa 2 carrega. Sem `DATABASE_URL`, as rotas devolvem
 * erro em vez de fingir sucesso.
 *
 * Toda escrita que muda dado do lead marca `bitrix_sync_status =
 * 'pendente'`; quem tira de pendente é o sync do Bitrix (ver
 * `marcarBitrixOk`), comparando o `updated_at` que ele leu com o atual.
 */

export type StatusInscricao =
  | "inscrito"
  | "ativacao_preenchida"
  | "agendado"
  | "realizado"
  | "nao_compareceu";

export interface InscricaoRow {
  id: string;
  created_at: Date;
  updated_at: Date;
  nome: string;
  email: string;
  whatsapp: string;
  consentimento_lgpd: boolean;
  consentimento_em: Date | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  lp_variant: string | null;
  fbclid: string | null;
  referrer: string | null;
  landing_url: string | null;
  user_agent: string | null;
  ip_hash: string | null;
  negocio_nome_oferta: string | null;
  cidade_bairro: string | null;
  atende_todo_brasil: boolean | null;
  acao_desejada: string | null;
  acao_desejada_outro: string | null;
  experiencia_anuncios: string | null;
  acesso_redes: string | null;
  conta_anuncios: string | null;
  cartao_pagamento: string | null;
  arquivo_logo: string | null;
  reuniao_computador: string | null;
  observacoes: string | null;
  etapa2_concluida_em: Date | null;
  calendly_evento_uri: string | null;
  agendado_em: Date | null;
  reuniao_em: Date | null;
  realizada_em: Date | null;
  status: StatusInscricao;
  bitrix_lead_id: string | null;
  bitrix_sync_status: "pendente" | "ok" | "erro";
  bitrix_sync_em: Date | null;
  bitrix_erro: string | null;
}

/** Linha + `updated_at` em texto, com precisão de microssegundo (o `Date`
 * do JS perde isso) — usado pra saber se algo mudou durante o sync. */
export type InscricaoSnapshot = InscricaoRow & { snapshot: string };

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL não configurada.");
  }
}

function db() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new DatabaseNotConfiguredError();
  return neon(connectionString);
}

/** Quantas inscrições deste IP foram criadas/atualizadas na janela do rate limit. */
export async function contarRecentesPorIp(ipHash: string): Promise<number> {
  const sql = db();
  const rows = await sql`
    SELECT count(*)::int AS total
    FROM teste7d_inscricoes
    WHERE ip_hash = ${ipHash}
      AND updated_at > now() - make_interval(mins => ${TESTE7D.rateLimit.janelaMinutos})
  `;
  return (rows[0]?.total as number) ?? 0;
}

/**
 * Etapa 1. Upsert por `lower(email)`: quem se inscreve de novo mantém o
 * mesmo id (e o mesmo lead no Bitrix) e o status que já tinha — uma nova
 * inscrição nunca rebaixa alguém que já agendou.
 *
 * UTMs: último toque, como um bloco — se a nova visita veio com UTM, as
 * cinco são trocadas juntas; se veio sem, as antigas ficam.
 */
export async function upsertInscricao(
  data: Omit<InscricaoData, "empresa_site">,
  meta: { userAgent: string | null; ipHash: string | null },
): Promise<{ id: string }> {
  const sql = db();
  const temUtm = Boolean(data.utm_source || data.utm_medium || data.utm_campaign || data.utm_content || data.utm_term);

  const rows = await sql`
    INSERT INTO teste7d_inscricoes (
      nome, email, whatsapp, consentimento_lgpd, consentimento_em,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      lp_variant, fbclid, referrer, landing_url, user_agent, ip_hash
    ) VALUES (
      ${data.nome}, ${data.email}, ${data.whatsapp}, true, now(),
      ${data.utm_source}, ${data.utm_medium}, ${data.utm_campaign}, ${data.utm_content}, ${data.utm_term},
      ${data.lp_variant}, ${data.fbclid}, ${data.referrer}, ${data.landing_url}, ${meta.userAgent}, ${meta.ipHash}
    )
    ON CONFLICT ((lower(email))) DO UPDATE SET
      nome = EXCLUDED.nome,
      whatsapp = EXCLUDED.whatsapp,
      consentimento_lgpd = true,
      consentimento_em = now(),
      utm_source   = CASE WHEN ${temUtm} THEN EXCLUDED.utm_source   ELSE teste7d_inscricoes.utm_source   END,
      utm_medium   = CASE WHEN ${temUtm} THEN EXCLUDED.utm_medium   ELSE teste7d_inscricoes.utm_medium   END,
      utm_campaign = CASE WHEN ${temUtm} THEN EXCLUDED.utm_campaign ELSE teste7d_inscricoes.utm_campaign END,
      utm_content  = CASE WHEN ${temUtm} THEN EXCLUDED.utm_content  ELSE teste7d_inscricoes.utm_content  END,
      utm_term     = CASE WHEN ${temUtm} THEN EXCLUDED.utm_term     ELSE teste7d_inscricoes.utm_term     END,
      lp_variant  = COALESCE(EXCLUDED.lp_variant,  teste7d_inscricoes.lp_variant),
      fbclid      = COALESCE(EXCLUDED.fbclid,      teste7d_inscricoes.fbclid),
      referrer    = COALESCE(EXCLUDED.referrer,    teste7d_inscricoes.referrer),
      landing_url = COALESCE(EXCLUDED.landing_url, teste7d_inscricoes.landing_url),
      user_agent  = COALESCE(EXCLUDED.user_agent,  teste7d_inscricoes.user_agent),
      ip_hash     = COALESCE(EXCLUDED.ip_hash,     teste7d_inscricoes.ip_hash),
      bitrix_sync_status = 'pendente'
    RETURNING id
  `;
  return { id: rows[0].id as string };
}

/** Colunas que a etapa 2 pode escrever — a lista é a única fonte dos nomes
 * de coluna no UPDATE dinâmico abaixo (nada vem do corpo da requisição). */
const ETAPA2_COLUMNS = [
  "negocio_nome_oferta",
  "cidade_bairro",
  "atende_todo_brasil",
  "acao_desejada",
  "acao_desejada_outro",
  "experiencia_anuncios",
  "acesso_redes",
  "conta_anuncios",
  "cartao_pagamento",
  "arquivo_logo",
  "reuniao_computador",
  "observacoes",
] as const satisfies readonly (keyof AtivacaoData & keyof InscricaoRow)[];

/** Salva um bloco da etapa 2. Só mexe nos campos que vieram. Null = id não existe. */
export async function salvarAtivacao(
  id: string,
  data: AtivacaoData,
): Promise<InscricaoRow | null> {
  const sql = db();
  const columns = ETAPA2_COLUMNS.filter((col) => data[col] !== undefined);

  if (columns.length === 0) {
    const rows = await sql`SELECT * FROM teste7d_inscricoes WHERE id = ${id}`;
    return (rows[0] as InscricaoRow | undefined) ?? null;
  }

  const sets = columns.map((col, i) => `${col} = $${i + 1}`).join(", ");
  const rows = await sql.query(
    `UPDATE teste7d_inscricoes
     SET ${sets}, bitrix_sync_status = 'pendente'
     WHERE id = $${columns.length + 1}
     RETURNING *`,
    [...columns.map((col) => data[col]), id],
  );
  return (rows[0] as InscricaoRow | undefined) ?? null;
}

/** Perguntas obrigatórias da etapa 2 que ainda estão sem resposta (texto
 * da pergunta, pra mensagem de erro). Vazio = pode concluir. */
export function etapa2Pendencias(row: InscricaoRow): string[] {
  const faltando: string[] = [];
  if (!row.negocio_nome_oferta) faltando.push("Qual o nome do seu negócio e o que você vende?");
  if (!row.cidade_bairro && !row.atende_todo_brasil) faltando.push("Você atende clientes de qual cidade e bairro?");
  if (!row.acao_desejada || (row.acao_desejada === "outro" && !row.acao_desejada_outro)) {
    faltando.push("Quando a pessoa vir o seu anúncio, o que você quer que ela faça?");
  }
  if (!row.experiencia_anuncios) faltando.push("Você já pagou para divulgar seu negócio no Instagram ou no Facebook?");
  if (!row.acesso_redes) faltando.push("Seu negócio tem perfil no Instagram e página no Facebook?");
  if (!row.conta_anuncios) faltando.push("Você já tem uma conta de anúncios criada?");
  if (!row.cartao_pagamento) faltando.push("Você tem um cartão de crédito para os anúncios?");
  if (!row.arquivo_logo) faltando.push("Você tem o arquivo da logo do seu negócio?");
  if (!row.reuniao_computador) faltando.push("Você consegue participar da reunião pelo computador?");
  return faltando;
}

/** Fecha a etapa 2. Só promove quem ainda está em `inscrito` — quem já
 * agendou não volta pra `ativacao_preenchida`. */
export async function concluirAtivacao(id: string): Promise<InscricaoRow> {
  const sql = db();
  const rows = await sql`
    UPDATE teste7d_inscricoes
    SET etapa2_concluida_em = COALESCE(etapa2_concluida_em, now()),
        status = CASE WHEN status = 'inscrito' THEN 'ativacao_preenchida' ELSE status END,
        bitrix_sync_status = 'pendente'
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] as InscricaoRow;
}

/**
 * Agendamento vindo do Calendly. `agendado_em` só muda se o evento for
 * outro (reagendamento), não a cada reenvio do mesmo evento. Quem já teve
 * a conversa realizada mantém `realizado`.
 *
 * `reuniao_em` fica nulo: o postMessage do Calendly não traz a data da
 * conversa (ver TODO no resumo — precisa da API ou de webhook do Calendly).
 */
export async function registrarAgendamento(
  id: string,
  calendlyEventoUri: string,
): Promise<InscricaoRow | null> {
  const sql = db();
  const rows = await sql`
    UPDATE teste7d_inscricoes
    SET agendado_em = CASE
          WHEN calendly_evento_uri IS DISTINCT FROM ${calendlyEventoUri} THEN now()
          ELSE agendado_em
        END,
        calendly_evento_uri = ${calendlyEventoUri},
        status = CASE WHEN status = 'realizado' THEN status ELSE 'agendado' END,
        bitrix_sync_status = 'pendente'
    WHERE id = ${id}
    RETURNING *
  `;
  return (rows[0] as InscricaoRow | undefined) ?? null;
}

// ── Bitrix ──

export async function lerParaSync(id: string): Promise<InscricaoSnapshot | null> {
  const sql = db();
  const rows = await sql`
    SELECT *, updated_at::text AS snapshot FROM teste7d_inscricoes WHERE id = ${id}
  `;
  return (rows[0] as InscricaoSnapshot | undefined) ?? null;
}

/** Sync deu certo. Se a linha mudou enquanto o Bitrix respondia (ex. a
 * etapa 2 chegou no meio), continua `pendente` pro próximo reenvio levar
 * o dado novo. Devolve se ficou `ok`. */
export async function marcarBitrixOk(
  id: string,
  leadId: string,
  snapshot: string,
): Promise<boolean> {
  const sql = db();
  const rows = await sql`
    UPDATE teste7d_inscricoes
    SET bitrix_lead_id = COALESCE(bitrix_lead_id, ${leadId}),
        bitrix_sync_em = now(),
        bitrix_erro = NULL,
        bitrix_sync_status = CASE
          WHEN updated_at = ${snapshot}::timestamptz THEN 'ok'
          ELSE 'pendente'
        END
    WHERE id = ${id}
    RETURNING bitrix_sync_status
  `;
  return rows[0]?.bitrix_sync_status === "ok";
}

export async function marcarBitrixErro(id: string, erro: string) {
  const sql = db();
  await sql`
    UPDATE teste7d_inscricoes
    SET bitrix_sync_status = 'erro',
        bitrix_sync_em = now(),
        bitrix_erro = ${erro.slice(0, 1000)}
    WHERE id = ${id}
  `;
}

/**
 * Ids pra reenviar ao Bitrix: `pendente` ou `erro`, parados há pelo menos
 * 2 minutos — margem pro sync disparado pela própria rota terminar, pra
 * o reenvio não correr em paralelo com ele e criar lead duplicado.
 */
export async function listarBitrixPendentes(limite: number): Promise<string[]> {
  const sql = db();
  const rows = await sql`
    SELECT id FROM teste7d_inscricoes
    WHERE bitrix_sync_status <> 'ok'
      AND updated_at < now() - interval '2 minutes'
    ORDER BY updated_at
    LIMIT ${limite}
  `;
  return rows.map((r) => r.id as string);
}
