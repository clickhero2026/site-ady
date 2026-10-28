import { after, NextResponse } from "next/server";
import { bitrixTeste7dAtivo, syncAtualizacaoBitrix } from "@/lib/bitrix-teste7d";
import { concluirAtivacao, etapa2Pendencias, salvarAtivacao } from "@/lib/teste7dDb";
import { erro, erroInterno, lerCorpo, SEM_SESSAO } from "@/lib/teste7dHttp";
import { ativacaoSchema } from "@/lib/teste7dSchema";
import { readInscricaoId } from "@/lib/teste7dSession";

/**
 * Etapa 2 (briefing de ativação). Aceita salvamento parcial: cada bloco
 * do formulário manda só os seus campos, pra não perder resposta se a
 * pessoa sair no meio. O envio final vem com `concluir: true` — aí todas
 * as perguntas obrigatórias precisam estar respondidas (as deste envio
 * somadas às já salvas) e o status vira `ativacao_preenchida`.
 *
 * Exige o cookie assinado da etapa 1.
 */
export async function PATCH(request: Request) {
  const id = await readInscricaoId();
  if (!id) return erro(SEM_SESSAO, 401);

  const body = await lerCorpo(request, ativacaoSchema);
  if ("response" in body) return body.response;

  try {
    let row = await salvarAtivacao(id, body.data);
    if (!row) return erro(SEM_SESSAO, 404);

    if (body.data.concluir) {
      const pendencias = etapa2Pendencias(row);
      if (pendencias.length > 0) {
        if (bitrixTeste7dAtivo()) after(() => syncAtualizacaoBitrix(row!));
        return NextResponse.json(
          {
            ok: false,
            error: `Falta responder: ${pendencias.map((p) => p.pergunta).join(" ")}`,
            pendencias,
          },
          { status: 422 },
        );
      }
      row = await concluirAtivacao(id);
    }

    const saved = row;
    if (bitrixTeste7dAtivo()) after(() => syncAtualizacaoBitrix(saved));

    return NextResponse.json({
      ok: true,
      status: saved.status,
      concluida: Boolean(saved.etapa2_concluida_em),
    });
  } catch (err) {
    return erroInterno("teste7d-ativacao", err);
  }
}
