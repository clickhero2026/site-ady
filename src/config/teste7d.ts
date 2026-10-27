/**
 * Config central da campanha perpétua do teste grátis de 7 dias
 * (briefing "ady: campanha perpétua do teste grátis"). Rotas e nomes
 * que mais de um arquivo precisa conhecer ficam só aqui.
 */
export const TESTE7D = {
  /** Página da etapa 2 (briefing de ativação + Calendly). As páginas
   * ainda não existem — entram nos próximos prompts. TODO: confirmar a
   * rota final. */
  etapa2Path: "/teste-gratis/ativacao",

  /** Cookie httpOnly, assinado, que liga o navegador à inscrição da
   * etapa 1 (ver lib/teste7dSession.ts). */
  cookieName: "ady_t7d",
  cookieMaxAgeDias: 30,

  /** Rate limit da etapa 1, por ip_hash: no máximo `max` inscrições
   * diferentes criadas/atualizadas na janela. */
  rateLimit: { max: 5, janelaMinutos: 10 },

  /** Versões de título da landing page (briefing, seção 8). A é o controle. */
  lpVariants: ["A", "B", "C", "D", "E", "F"] as const,
} as const;

export type LpVariant = (typeof TESTE7D.lpVariants)[number];
