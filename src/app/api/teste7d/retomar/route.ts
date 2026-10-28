import { NextResponse } from "next/server";
import { z } from "zod";
import { retomarPorDados } from "@/lib/teste7dDb";
import { proximaPagina } from "@/lib/teste7dFluxo";
import { erro, erroInterno, lerCorpo } from "@/lib/teste7dHttp";
import { retomadaExcedida } from "@/lib/teste7dLimite";
import { normalizeWhatsappBR } from "@/lib/teste7dSchema";
import { hashRequestIp, setInscricaoCookie } from "@/lib/teste7dSession";

/** Mesma resposta pra qualquer falha: não diz qual dos dois não bateu. */
const NAO_ENCONTRADO =
  "Não encontramos um cadastro com esse WhatsApp e esse e-mail. Confira os dois e tente de novo.";
const MUITAS_TENTATIVAS = "Foram muitas tentativas em pouco tempo. Espere alguns minutos e tente de novo.";

const retomarSchema = z.object({
  whatsapp: z.string().transform((v, ctx) => {
    const normalizado = normalizeWhatsappBR(v);
    if (!normalizado) {
      ctx.addIssue({ code: "custom", message: "Digite um WhatsApp válido, com DDD." });
      return z.NEVER;
    }
    return normalizado;
  }),
  email: z.string().trim().toLowerCase().max(180, "E-mail muito longo.").pipe(z.email("Digite um e-mail válido.")),
});

/**
 * Retomada do teste grátis por WhatsApp + e-mail (/ativar-conta), pra
 * quem não está no navegador do cadastro. Os dois precisam bater com o
 * mesmo cadastro; aí grava `ultima_retomada_em`, define o mesmo cookie
 * assinado do cadastro e devolve o próximo passo.
 *
 * Não dispara evento de rastreio: retomar não é um cadastro novo.
 *
 * Resposta: `{ ok: true, proximaUrl }`, ou `{ ok: false, error }` (404 neutro,
 * 429 no limite de tentativas).
 */
export async function POST(request: Request) {
  const ipHash = hashRequestIp(request);
  if (ipHash && retomadaExcedida(ipHash)) return erro(MUITAS_TENTATIVAS, 429);

  const body = await lerCorpo(request, retomarSchema);
  if ("response" in body) return body.response;

  try {
    const resultado = await retomarPorDados(body.data.email, body.data.whatsapp);
    if (resultado.tipo === "bloqueado") return erro(MUITAS_TENTATIVAS, 429);
    if (resultado.tipo === "nao_encontrado") return erro(NAO_ENCONTRADO, 404);

    await setInscricaoCookie(resultado.inscricao.id);
    return NextResponse.json({ ok: true, proximaUrl: proximaPagina(resultado.inscricao) });
  } catch (err) {
    return erroInterno("teste7d-retomar", err);
  }
}
