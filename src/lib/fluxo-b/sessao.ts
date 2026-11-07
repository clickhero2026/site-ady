import type { Ramo } from "@/config/fluxoB";

/**
 * Estado do Fluxo B entre as telas, só em `sessionStorage` (morre com a
 * aba; nunca vai na URL). A senha NUNCA passa por aqui.
 */

export const CHAVES = {
  lead: "ady:fb:lead",
  conta: "ady:fb:conta",
  ramos: "ady:fb:ramos",
  mock: "ady:fb:mock",
} as const;

export type LeadFluxoB = { name: string; email: string; phone: string };
/** Conta criada no app (POST confirmado). `redirectUrl` é apagado assim
 * que for usado; `criada` fica, pra não refazer o POST. */
export type ContaFluxoB = { criada: true; redirectUrl: string | null; recebidoEm: number | null };

function ler<T>(chave: string): T | null {
  try {
    const bruto = sessionStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : null;
  } catch {
    return null;
  }
}

function gravar(chave: string, valor: unknown) {
  try {
    sessionStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // sessionStorage indisponível (aba privada antiga): o fluxo segue só
    // na memória da página atual.
  }
}

export const sessao = {
  lerLead: () => ler<LeadFluxoB>(CHAVES.lead),
  gravarLead: (lead: LeadFluxoB) => gravar(CHAVES.lead, lead),

  lerConta: () => ler<ContaFluxoB>(CHAVES.conta),
  /** `recebidoEm`: quando o link de login chegou (vale 1h — ver
   * linkExpirado). */
  gravarConta: (redirectUrl: string | null, recebidoEm: number = Date.now()) =>
    gravar(CHAVES.conta, { criada: true, redirectUrl, recebidoEm: redirectUrl ? recebidoEm : null } satisfies ContaFluxoB),
  /** Pega o link e o horário de chegada e apaga da sessão (uso único). */
  consumirRedirect(): { url: string; recebidoEm: number | null } | null {
    const conta = ler<ContaFluxoB>(CHAVES.conta);
    if (!conta?.redirectUrl) return null;
    gravar(CHAVES.conta, { criada: true, redirectUrl: null, recebidoEm: null } satisfies ContaFluxoB);
    return { url: conta.redirectUrl, recebidoEm: conta.recebidoEm ?? null };
  },

  lerRamos: () => ler<Ramo[]>(CHAVES.ramos) ?? [],
  gravarRamos: (ramos: Ramo[]) => gravar(CHAVES.ramos, ramos),

  lerMock: () => ler<string>(CHAVES.mock),
  gravarMock: (valor: string) => gravar(CHAVES.mock, valor),
};

export function primeiroNome(nome: string | undefined | null): string {
  return (nome ?? "").trim().split(/\s+/)[0] ?? "";
}
