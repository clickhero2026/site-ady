/**
 * Estado do Fluxo B entre as telas, só em `sessionStorage` (morre com a
 * aba; nunca vai na URL). A senha NUNCA passa por aqui.
 */

export const CHAVES = {
  lead: "ady:fb:lead",
  conta: "ady:fb:conta",
  mock: "ady:fb:mock",
} as const;

/** `empresa_site`: honeypot do formulário (mesmo da LP atual). Humano
 * deixa vazio; vai pra nossa rota, que finge sucesso se vier preenchido. */
export type LeadFluxoB = { name: string; email: string; phone: string; empresa_site?: string };
/** Conta criada no app (POST confirmado).
 * - `redirectUrl`: link de login (uso único, 1h); apagado quando usado.
 * - `recebidoEm`: quando o link chegou (regra dos 55 min).
 * - `usado`: o link já foi aberto — recarregar/voltar não redireciona de novo. */
export type ContaFluxoB = { criada: true; redirectUrl: string | null; recebidoEm: number | null; usado: boolean };

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
  gravarConta: (redirectUrl: string | null, recebidoEm: number = Date.now()) =>
    gravar(CHAVES.conta, {
      criada: true,
      redirectUrl,
      recebidoEm: redirectUrl ? recebidoEm : null,
      usado: false,
    } satisfies ContaFluxoB),
  /** Link aberto: apaga o link (uso único) e marca `usado`. */
  marcarUsado: () => gravar(CHAVES.conta, { criada: true, redirectUrl: null, recebidoEm: null, usado: true } satisfies ContaFluxoB),

  lerMock: () => ler<string>(CHAVES.mock),
  gravarMock: (valor: string) => gravar(CHAVES.mock, valor),
};

export function primeiroNome(nome: string | undefined | null): string {
  return (nome ?? "").trim().split(/\s+/)[0] ?? "";
}
