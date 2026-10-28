/**
 * Config central da campanha perpétua do teste grátis de 7 dias
 * (briefing "ady: campanha perpétua do teste grátis"). Rotas e nomes
 * que mais de um arquivo precisa conhecer ficam só aqui.
 */
export const TESTE7D = {
  /**
   * Caminhos PÚBLICOS das páginas no host da LP (lp.useady.com.br). É o
   * que aparece na barra do navegador e o que a API devolve pra navegação.
   * Internamente o `src/proxy.ts` reescreve cada um pra `/lp/...` —
   * ninguém fora do proxy monta caminho `/lp/...`.
   */
  paginas: {
    lp: "/",
    ativacao: "/ativacao",
    agendar: "/agendar",
    obrigado: "/obrigado",
  },

  /** Endereço público da LP — canonical e links absolutos. */
  lpOrigin: "https://lp.useady.com.br",

  /** Site principal: logo, política de privacidade e termos apontam pra lá. */
  siteOrigin: "https://useady.com.br",

  /** Host é da LP quando começa com este prefixo (lp.useady.com.br em
   * produção, lp.localhost em desenvolvimento). Hosts extras (ex. um
   * domínio de preview da Vercel) vão em `LP_EXTRA_HOSTS`. */
  lpHostPrefix: "lp.",

  /** Cookie httpOnly, assinado, que liga o navegador à inscrição da
   * etapa 1 (ver lib/teste7dSession.ts). Sem `Domain`: vale só no host
   * que o criou, o mesmo da LP e das chamadas a /api/teste7d/*. */
  cookieName: "ady_t7d",
  cookieMaxAgeDias: 30,

  /** Rate limit da etapa 1, por ip_hash: no máximo `max` inscrições
   * diferentes criadas/atualizadas na janela. */
  rateLimit: { max: 5, janelaMinutos: 10 },

  /** Página de agendamento (briefing, seção 9). `tituloVariante` fica
   * guardado pra um teste futuro — hoje não é usado em lugar nenhum. */
  agendar: {
    titulo: "Quase lá. Escolha o melhor horário para a sua conversa.",
    tituloVariante: "Falta um passo: marque a conversa que libera os seus 7 dias.",
    texto: "Nessa conversa a gente ativa a sua conta com você, e os 7 dias começam depois da ativação. Não precisa de cartão.",
  },

  /**
   * Parâmetro de pré-preenchimento do telefone no Calendly: `a1` = primeira
   * pergunta personalizada do evento, que é o telefone. (O Calendly também
   * aceitaria `location`, só se o local do evento fosse "ligação: o
   * convidado informa o número" — não é o caso.)
   */
  calendlyTelefoneParam: "a1",

  /** Versões de título da landing page (briefing, seção 8). A é o controle. */
  lpVariants: ["A", "B", "C", "D", "E", "F"] as const,
} as const;

export type LpVariant = (typeof TESTE7D.lpVariants)[number];

/** `?lp=` cru → versão válida; ausente ou inválido cai no controle (A). */
export function normalizeLpVariant(value: string | null | undefined): LpVariant {
  const upper = value?.trim().toUpperCase();
  return (TESTE7D.lpVariants as readonly string[]).includes(upper ?? "")
    ? (upper as LpVariant)
    : "A";
}

/** Prefixo interno das rotas da LP em `src/app/lp/`. Só o proxy usa. */
export const LP_INTERNAL_PREFIX = "/lp";
