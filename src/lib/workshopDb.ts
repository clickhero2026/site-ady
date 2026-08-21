import { neon } from "@neondatabase/serverless";
import type { WorkshopLeadData } from "./workshopLeadSchema";
import { workshopOrigem } from "@/config/workshop";

/**
 * Armazena a inscrição do workshop no Postgres (Neon) — a fonte de verdade
 * pra follow-up de lembrete depois (API oficial do WhatsApp), diferente do
 * Bitrix, que aqui é só um "melhor esforço" em paralelo (ver bitrix.ts).
 *
 * Schema em `db/workshop_leads.sql` — rodar uma vez no editor SQL do Neon,
 * num banco dedicado a este projeto (não o do clickhero-site).
 *
 * Enquanto `WORKSHOP_DATABASE_URL` não existir, não tenta conectar — só
 * loga um erro (mais grave que o aviso do Bitrix: aqui é a única gravação
 * durável do lead nesta fase) e deixa a inscrição seguir em frente, pra
 * não travar o funil por causa de infraestrutura que ainda não existe.
 */
export async function saveWorkshopLead(
  lead: WorkshopLeadData,
): Promise<{ ok: true; skipped?: true } | { ok: false; error: string }> {
  const connectionString = process.env.WORKSHOP_DATABASE_URL;

  if (!connectionString) {
    console.error(
      "[workshop-lead] WORKSHOP_DATABASE_URL não configurada — lead NÃO foi salvo em banco nenhum:",
      lead,
    );
    return { ok: true, skipped: true };
  }

  try {
    const sql = neon(connectionString);

    await sql`
      INSERT INTO workshop_leads
        (nome, whatsapp, email, negocio, segmento, indicado_por, origem)
      VALUES
        (${lead.nome}, ${lead.whatsapp}, ${lead.email}, ${lead.negocio},
         ${lead.segmento}, ${lead.indicadoPor || null}, ${workshopOrigem})
    `;

    return { ok: true };
  } catch (err) {
    console.error("[workshop-lead] Falha ao gravar no Postgres:", err);
    return { ok: false, error: "database_error" };
  }
}
