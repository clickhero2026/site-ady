import "server-only";
import { TESTE7D } from "@/config/teste7d";

/**
 * Limite de tentativas de retomada por IP (`ip_hash`, o mesmo HMAC do
 * cadastro). Em memória, por instância do servidor: tentativa que não
 * bate com cadastro nenhum não tem linha onde ser contada, e tabela nova
 * ficou fora de questão. É a primeira barreira; a que vale sempre é o
 * contador por cadastro no banco (`retomada_falhas`, ver retomarPorDados).
 */
const tentativas = new Map<string, number[]>();

/** Registra a tentativa; true se este IP passou do limite na janela. */
export function retomadaExcedida(ipHash: string): boolean {
  const { maxPorIp, janelaMinutos } = TESTE7D.retomadaLimite;
  const agora = Date.now();
  const desde = agora - janelaMinutos * 60_000;

  const recentes = (tentativas.get(ipHash) ?? []).filter((t) => t > desde);
  recentes.push(agora);
  tentativas.set(ipHash, recentes);

  // Sem crescer pra sempre: de vez em quando, joga fora IPs parados.
  if (tentativas.size > 5000) {
    for (const [ip, ts] of tentativas) if (!ts.some((t) => t > desde)) tentativas.delete(ip);
  }
  return recentes.length > maxPorIp;
}
