/**
 * Config central do workshop (briefing-workshop-ady.md, seção 5 —
 * "Reaproveitamento entre turmas"). Data, vagas, duração e link do Google
 * Meet ficam só aqui — trocar de turma é trocar este arquivo, não
 * procurar texto espalhado pelas 7 seções da página.
 *
 * Turma 1: 1 de setembro de 2026, 20h — confirmada por Rafael.
 */
export const WORKSHOP = {
  nome: "O Instagram que vende sozinho",
  subtitulo: "Workshop ao vivo para donos de negócio local",

  /** Formato livre (ex. "1 de setembro"), já que vai direto pro texto da
   * página. */
  data: "1 de setembro",

  /** Mesma data de cima, em formato ISO — usada pro cálculo do DTSTART
   * do .ics (ver workshopIcs.ts). */
  dataISO: "2026-09-01" as string | null,

  horario: "20h",
  /** Mesmo horário de cima, em 24h, pro cálculo do .ics. */
  horarioHora: 20,
  /** Brasília não tem mais horário de verão desde 2019 — UTC-3 o ano
   * inteiro. Se isso mudar, ajustar aqui. */
  fusoOffsetUTC: -3,
  fusoHorario: "Brasília",
  /** Não aparece em texto visível da página (removido a pedido) — só
   * segue usado pro cálculo interno do DTEND do .ics. */
  duracaoMinutos: 60,
  vagas: 30,
  plataforma: "Google Meet",
  temGravacao: false,

  apresentadores: {
    rafael: {
      nomeCompleto: "Rafael Cruz",
      cargo: "Fundador da Click Hero",
    },
  },
} as const;

/** "1 de setembro às 20h" — repetido em vários pontos da página. */
export const workshopDataHorario = `${WORKSHOP.data} às ${WORKSHOP.horario}`;

/** Origem enviada pro Bitrix24 (seção 6: "workshop-[DATA]"). */
export const workshopOrigem = `workshop-${WORKSHOP.data}`;

/**
 * Link do Google Meet — PENDENTE (seção 6, item 4 do briefing original,
 * só que a plataforma mudou de Zoom pra Google Meet). Vai só no .ics,
 * nunca exposto solto na página antes da inscrição. `null` até a env var
 * existir.
 */
export const WORKSHOP_MEET_LINK: string | null =
  process.env.NEXT_PUBLIC_WORKSHOP_MEET_LINK || null;

/**
 * WhatsApp que recebe as mensagens da página de obrigado — PENDENTE
 * (seção 6, item 3). `null` até a env var existir.
 */
export const WORKSHOP_WHATSAPP: string | null =
  process.env.NEXT_PUBLIC_WORKSHOP_WHATSAPP || null;
