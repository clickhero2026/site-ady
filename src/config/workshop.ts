/**
 * Config central do workshop (briefing-workshop-ady.md, seção 5 —
 * "Reaproveitamento entre turmas"). Data, vagas, duração e link do Zoom
 * ficam só aqui — trocar de turma é trocar este arquivo, não procurar
 * texto espalhado pelas 7 seções da página.
 *
 * `data` é um placeholder PENDENTE (seção 6, item 1 do briefing — trava a
 * página inteira, aparece em ~7 lugares). Enquanto não vier a data real de
 * Rafael, a página inteira mostra literalmente "[DATA]" em todo canto que
 * deveria ter a data — de propósito, pra ficar impossível publicar sem
 * notar.
 */
export const WORKSHOP = {
  nome: "O Instagram que vende sozinho",
  subtitulo: "Workshop ao vivo para donos de negócio local",

  /** PENDENTE — Rafael. Formato livre (ex. "12 de março"), já que vai
   * direto pro texto da página. */
  data: "[DATA]",

  /** Mesma data de cima, mas em formato ISO (`"2026-03-12"`) — precisa
   * disso pra calcular o DTSTART do .ics. `null` enquanto `data` for só o
   * placeholder de texto; o gerador do .ics recusa gerar arquivo sem isso
   * em vez de produzir um evento de calendário com data errada. */
  dataISO: null as string | null,

  horario: "20h",
  /** Mesmo horário de cima, em 24h, pro cálculo do .ics. */
  horarioHora: 20,
  /** Brasília não tem mais horário de verão desde 2019 — UTC-3 o ano
   * inteiro. Se isso mudar, ajustar aqui. */
  fusoOffsetUTC: -3,
  fusoHorario: "Brasília",
  duracaoMinutos: 60,
  duracaoLabel: "60 minutos",
  vagas: 30,
  plataforma: "Zoom",
  temGravacao: false,

  apresentadores: {
    jean: {
      // PENDENTE — Rafael.
      nomeCompleto: "Jean [SOBRENOME]",
      cargo: "Sócio da Click Hero, responsável comercial",
    },
    rafael: {
      nomeCompleto: "Rafael Cruz",
      cargo: "Fundador da Click Hero",
    },
  },
} as const;

/** "[DATA] às 20h" — repetido em vários pontos da página. */
export const workshopDataHorario = `${WORKSHOP.data} às ${WORKSHOP.horario}`;

/** Origem enviada pro Bitrix24 (seção 6: "workshop-[DATA]"). */
export const workshopOrigem = `workshop-${WORKSHOP.data}`;

/**
 * Link do Zoom — PENDENTE (seção 6, item 4). Vai só no .ics, nunca
 * exposto solto na página antes da inscrição (o briefing não pede isso).
 * `null` até a env var existir.
 */
export const WORKSHOP_ZOOM_LINK: string | null =
  process.env.NEXT_PUBLIC_WORKSHOP_ZOOM_LINK || null;

/**
 * WhatsApp que recebe as mensagens da página de obrigado — PENDENTE
 * (seção 6, item 3). `null` até a env var existir.
 */
export const WORKSHOP_WHATSAPP: string | null =
  process.env.NEXT_PUBLIC_WORKSHOP_WHATSAPP || null;
