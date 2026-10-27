import { NextResponse } from "next/server";
import { syncInscricaoBitrix } from "@/lib/bitrix-teste7d";
import { lerParaSync, listarBitrixPendentes } from "@/lib/teste7dDb";
import { erro, erroInterno } from "@/lib/teste7dHttp";
import { safeEqual } from "@/lib/teste7dSession";

/** Lotes pequenos: cada inscrição é 1–2 chamadas ao Bitrix em sequência. */
const LIMITE_POR_CHAMADA = 25;

export const maxDuration = 60;

/**
 * Reprocessa no Bitrix as inscrições em `pendente` ou `erro`. Protegido
 * pelo header `x-teste7d-chave` = `TESTE7D_REENVIO_KEY`. Chamar de novo
 * até `restantes` ser 0.
 *
 *   curl -X POST https://useady.com.br/api/teste7d/reenviar-bitrix \
 *     -H "x-teste7d-chave: $TESTE7D_REENVIO_KEY"
 */
export async function POST(request: Request) {
  const chave = process.env.TESTE7D_REENVIO_KEY;
  const recebida = request.headers.get("x-teste7d-chave");

  if (!chave) return erro("Reenvio desativado: TESTE7D_REENVIO_KEY não configurada.", 503);
  if (!recebida || !safeEqual(recebida, chave)) return erro("Chave inválida.", 401);
  if (!process.env.BITRIX_WEBHOOK_URL) return erro("BITRIX_WEBHOOK_URL não configurada.", 503);

  try {
    const ids = await listarBitrixPendentes(LIMITE_POR_CHAMADA);
    const resultado = { processados: ids.length, ok: 0, erro: 0, pendente: 0 };

    for (const id of ids) {
      await syncInscricaoBitrix(id);
      const status = (await lerParaSync(id))?.bitrix_sync_status ?? "pendente";
      resultado[status] += 1;
    }

    const restantes = (await listarBitrixPendentes(LIMITE_POR_CHAMADA)).length;
    return NextResponse.json({ ok: true, resultado, restantes });
  } catch (err) {
    return erroInterno("teste7d-reenviar-bitrix", err);
  }
}
