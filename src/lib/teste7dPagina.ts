import "server-only";
import { redirect } from "next/navigation";
import { TESTE7D } from "@/config/teste7d";
import { buscarInscricao, type InscricaoRow } from "./teste7dDb";
import { readInscricaoId } from "./teste7dSession";

/**
 * Inscrição do cookie assinado, para as páginas /ativacao, /agendar e
 * /obrigado. Sem cookie válido (ou com id que não existe mais), volta pra
 * LP — é lá que a etapa 1 recria o cookie.
 */
export async function inscricaoDaSessaoOuLp(): Promise<InscricaoRow> {
  const id = await readInscricaoId();
  const row = id ? await buscarInscricao(id) : null;
  if (!row) redirect(TESTE7D.paginas.lp);
  return row;
}
