import { randomUUID } from "node:crypto";
import { after, NextResponse } from "next/server";
import { TESTE7D } from "@/config/teste7d";
import { bitrixTeste7dAtivo, syncInscricaoBitrix } from "@/lib/bitrix-teste7d";
import { contarRecentesPorIp, upsertInscricao } from "@/lib/teste7dDb";
import { proximaPagina } from "@/lib/teste7dFluxo";
import { erro, erroInterno, lerCorpo } from "@/lib/teste7dHttp";
import { inscricaoSchema } from "@/lib/teste7dSchema";
import { hashRequestIp, setInscricaoCookie } from "@/lib/teste7dSession";

/**
 * Etapa 1 do teste grátis de 7 dias (landing page): nome, e-mail,
 * WhatsApp e consentimento, mais o rastreio (UTMs, lp, fbclid).
 *
 * O Neon decide sucesso/erro — é ele que gera o id do cookie da etapa 2.
 * O Bitrix (só com `TESTE7D_BITRIX_ATIVO=true`) roda depois da resposta
 * (`after`) e nunca vira erro pro usuário (ver bitrix-teste7d.ts).
 *
 * E-mail que já existe com outro WhatsApp: 409 `{ ok: false, error,
 * ativarUrl }`, sem alterar a linha e sem cookie.
 *
 * Resposta: `{ ok, id, novo, eventId?, proximaUrl }`. `novo` só é true
 * quando a linha foi criada agora; aí vem o `eventId` e o cliente dispara
 * o Lead (`trackTeste7dLead(eventId, ...)`) antes de seguir pra
 * `proximaUrl`. Inscrição repetida segue direto, sem evento.
 */
const EMAIL_COM_OUTRO_WHATSAPP =
  "Este e-mail já tem um cadastro com outro WhatsApp. Para continuar, use o link de ativação da conta.";

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

    const inscricao = await upsertInscricao(data, {
      userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      ipHash,
    });

    // E-mail já cadastrado com outro WhatsApp: nada muda e nada de cookie;
    // quem é dono do cadastro continua pelo /ativar-conta.
    if (!inscricao) {
      return NextResponse.json(
        { ok: false, error: EMAIL_COM_OUTRO_WHATSAPP, ativarUrl: TESTE7D.paginas.ativarConta },
        { status: 409 },
      );
    }

    const { id } = inscricao;
    await setInscricaoCookie(id);
    if (bitrixTeste7dAtivo()) after(() => syncInscricaoBitrix(id));

    // Server-side não manda nada pro Meta direto: o projeto não tem
    // Conversions API própria — o CAPI sai do GTM server-side (Stape) a
    // partir do evento do navegador, deduplicado por este event_id.
    return NextResponse.json({
      ok: true,
      id,
      // Lead só em cadastro novo: quem se inscreve de novo (mesmo e-mail e
      // mesmo WhatsApp) não conta outra vez.
      novo: inscricao.novo,
      ...(inscricao.novo && { eventId: `${id}:lead` }),
      // Quem já tinha se inscrito retoma de onde parou (ver teste7dFluxo).
      proximaUrl: proximaPagina(inscricao),
    });
  } catch (err) {
    return erroInterno("teste7d-inscricao", err);
  }
}
