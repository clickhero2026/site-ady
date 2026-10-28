import { TESTE7D } from "@/config/teste7d";
import type { InscricaoRow } from "./teste7dDb";

/**
 * Onde cada pessoa está no fluxo do teste grátis — uma regra só, usada
 * pela API de inscrição (pra onde mandar quem se inscreve de novo) e
 * pelas páginas (pra retomar de onde a pessoa parou).
 */
export function proximaPagina(
  row: Pick<InscricaoRow, "status" | "etapa2_concluida_em">,
): string {
  if (row.status === "agendado" || row.status === "realizado") return TESTE7D.paginas.obrigado;
  if (row.etapa2_concluida_em) return TESTE7D.paginas.agendar;
  return TESTE7D.paginas.ativacao;
}

/** "Maria da Silva" → "Maria". */
export function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? nome;
}
