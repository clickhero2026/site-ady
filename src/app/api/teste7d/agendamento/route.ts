import { after, NextResponse } from "next/server";
import { syncAtualizacaoBitrix } from "@/lib/bitrix-teste7d";
import { registrarAgendamento } from "@/lib/teste7dDb";
import { erro, erroInterno, lerCorpo, SEM_SESSAO } from "@/lib/teste7dHttp";
import { agendamentoSchema } from "@/lib/teste7dSchema";
import { readInscricaoId } from "@/lib/teste7dSession";

/**
 * Chamado pelo cliente quando o Calendly embutido dispara o postMessage
 * `calendly.event_scheduled` — o corpo leva `payload.event.uri` como
 * `calendly_evento_uri`. Exige o cookie assinado da etapa 1.
 *
 * Resposta: `{ ok, eventId }` — o cliente dispara o Schedule
 * (`trackTeste7dSchedule(eventId)`).
 */
export async function POST(request: Request) {
  const id = await readInscricaoId();
  if (!id) return erro(SEM_SESSAO, 401);

  const body = await lerCorpo(request, agendamentoSchema);
  if ("response" in body) return body.response;

  try {
    const row = await registrarAgendamento(id, body.data.calendly_evento_uri);
    if (!row) return erro(SEM_SESSAO, 404);

    after(() => syncAtualizacaoBitrix(row));

    // event_id por evento do Calendly: reagendar gera um Schedule novo,
    // reenviar o mesmo evento é deduplicado.
    const eventoId = body.data.calendly_evento_uri.split("/").pop();
    return NextResponse.json({ ok: true, eventId: `${id}:schedule:${eventoId}` });
  } catch (err) {
    return erroInterno("teste7d-agendamento", err);
  }
}
