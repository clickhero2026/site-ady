import { randomUUID } from "node:crypto";
import { after, NextResponse } from "next/server";
import { TESTE7D } from "@/config/teste7d";
import { syncInscricaoBitrix } from "@/lib/bitrix-teste7d";
import { contarRecentesPorIp, upsertInscricao } from "@/lib/teste7dDb";
import { erro, erroInterno, lerCorpo } from "@/lib/teste7dHttp";
import { inscricaoSchema } from "@/lib/teste7dSchema";
import { hashRequestIp, setInscricaoCookie } from "@/lib/teste7dSession";

/**
 * Etapa 1 do teste grátis de 7 dias (landing page): nome, e-mail,
 * WhatsApp e consentimento, mais o rastreio (UTMs, lp, fbclid).
 *
 * O Neon decide sucesso/erro — é ele que gera o id do cookie da etapa 2.
 * O Bitrix roda depois da resposta (`after`) e nunca vira erro pro
 * usuário (ver bitrix-teste7d.ts).
 *
 * Resposta: `{ ok, id, eventId, proximaUrl }`. O cliente dispara o evento
 * Lead (`trackTeste7dLead(eventId, ...)`) e segue pra `proximaUrl`.
 */
export async function POST(request: Request) {
  const body = await lerCorpo(request, inscricaoSchema);
  if ("response" in body) return body.response;
  const { empresa_site, ...data } = body.data;

  // Honeypot preenchido: finge sucesso, não grava nem seta cookie (bot).
  if (empresa_site) {
    return NextResponse.json({ ok: true, id: randomUUID(), eventId: randomUUID(), proximaUrl: TESTE7D.paginas.ativacao });
  }

  try {
    const ipHash = hashRequestIp(request);

    if (ipHash && (await contarRecentesPorIp(ipHash)) >= TESTE7D.rateLimit.max) {
      return erro("Recebemos muitas inscrições daqui em pouco tempo. Espere alguns minutos e tente de novo.", 429);
    }

    const { id } = await upsertInscricao(data, {
      userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      ipHash,
    });

    await setInscricaoCookie(id);
    after(() => syncInscricaoBitrix(id));

    // Server-side não manda nada pro Meta direto: o projeto não tem
    // Conversions API própria — o CAPI sai do GTM server-side (Stape) a
    // partir do evento do navegador, deduplicado por este event_id.
    return NextResponse.json({
      ok: true,
      id,
      eventId: `${id}:lead`,
      proximaUrl: TESTE7D.paginas.ativacao,
    });
  } catch (err) {
    return erroInterno("teste7d-inscricao", err);
  }
}
