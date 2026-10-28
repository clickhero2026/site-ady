import { z } from "zod";
import { TESTE7D, type LpVariant } from "@/config/teste7d";
import { isValidPhone } from "./phoneMask";
import {
  ACAO_DESEJADA,
  ACESSO_REDES,
  ARQUIVO_LOGO,
  CARTAO_PAGAMENTO,
  CONTA_ANUNCIOS,
  EXPERIENCIA_ANUNCIOS,
  REUNIAO_COMPUTADOR,
  optionKeys,
} from "./teste7dOptions";

/**
 * Validação das três chamadas do teste grátis de 7 dias. Autoritativa no
 * servidor (`/api/teste7d/*`); o formulário pode reaproveitar pra mostrar
 * erro antes de enviar, mesmo padrão do `workshopLeadSchema`.
 */

/**
 * Normaliza um WhatsApp brasileiro pra só dígitos com o 55 na frente
 * (ex. "(85) 99999-9999" ou "+55 85 99999-9999" → "5585999999999").
 * Devolve null se não for um número válido com DDD.
 */
export function normalizeWhatsappBR(value: string): string | null {
  let digits = value.replace(/\D/g, "");
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) {
    digits = digits.slice(2);
  }
  if (digits.length > 11 || !isValidPhone(digits)) return null;
  return `55${digits}`;
}

/** Campo de rastreio: nunca reprova a inscrição — valor estranho vira null,
 * valor comprido é cortado. Rastreio ruim não pode custar um inscrito. */
const tracking = (max: number) =>
  z
    .unknown()
    .optional()
    .transform((v) => (typeof v === "string" ? v.trim().slice(0, max) || null : null));

const lpVariant = z.unknown().optional().transform((v): LpVariant | null => {
  if (typeof v !== "string") return null;
  const upper = v.trim().toUpperCase();
  return (TESTE7D.lpVariants as readonly string[]).includes(upper)
    ? (upper as LpVariant)
    : null;
});

export const inscricaoSchema = z.object({
  nome: z.string().trim().min(2, "Digite seu nome completo.").max(120, "Nome muito longo."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(180, "E-mail muito longo.")
    .pipe(z.email("Digite um e-mail válido.")),
  whatsapp: z
    .string()
    .transform((v, ctx) => {
      const normalized = normalizeWhatsappBR(v);
      if (!normalized) {
        ctx.addIssue({ code: "custom", message: "Digite um WhatsApp válido, com DDD." });
        return z.NEVER;
      }
      return normalized;
    }),
  consentimento_lgpd: z.literal(true, {
    error: "Para continuar, aceite o uso dos seus dados para o contato do teste.",
  }),

  utm_source: tracking(255),
  utm_medium: tracking(255),
  utm_campaign: tracking(255),
  utm_content: tracking(255),
  utm_term: tracking(255),
  lp_variant: lpVariant,
  fbclid: tracking(500),
  referrer: tracking(2000),
  landing_url: tracking(2000),

  /** Honeypot: campo invisível para humanos. Preenchido = bot — tratado na
   * rota, não aqui, pra não rejeitar com um erro que entregaria o campo. */
  empresa_site: z.string().optional().default(""),
});

export type InscricaoData = z.output<typeof inscricaoSchema>;

/** Texto livre da etapa 2: `undefined` = não veio no bloco (não mexe no
 * banco); "" ou null = a pessoa apagou a resposta. */
const answerText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Resposta muito longa (máximo de ${max} caracteres).`)
    .nullable()
    .optional()
    .transform((v) => (v === undefined ? undefined : v || null));

const answerOption = <T extends Record<string, string>>(options: T) =>
  z.enum(optionKeys(options), { error: "Escolha uma das opções." }).nullable().optional();

/**
 * Etapa 2 — salvamento parcial: cada bloco do formulário manda só os
 * campos dele. `concluir: true` é o envio final, quando a rota exige que
 * todas as perguntas obrigatórias estejam respondidas (ver
 * `etapa2Pendencias` em teste7dDb.ts).
 */
export const ativacaoSchema = z
  .object({
    negocio_nome_oferta: answerText(300),
    cidade_bairro: answerText(200),
    atende_todo_brasil: z.boolean().nullable().optional(),
    acao_desejada: answerOption(ACAO_DESEJADA),
    acao_desejada_outro: answerText(200),
    experiencia_anuncios: answerOption(EXPERIENCIA_ANUNCIOS),
    acesso_redes: answerOption(ACESSO_REDES),
    conta_anuncios: answerOption(CONTA_ANUNCIOS),
    cartao_pagamento: answerOption(CARTAO_PAGAMENTO),
    arquivo_logo: answerOption(ARQUIVO_LOGO),
    reuniao_computador: answerOption(REUNIAO_COMPUTADOR),
    observacoes: answerText(2000),
    concluir: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.acao_desejada === "outro" && !data.acao_desejada_outro) {
      ctx.addIssue({
        code: "custom",
        path: ["acao_desejada_outro"],
        message: "Conte o que você quer que a pessoa faça ao ver o anúncio.",
      });
    }
  })
  .transform((data) =>
    // Trocou "Outro" por uma opção fixa: o texto do "outro" deixa de valer.
    data.acao_desejada && data.acao_desejada !== "outro"
      ? { ...data, acao_desejada_outro: null }
      : data,
  );

export type AtivacaoData = z.output<typeof ativacaoSchema>;

export const agendamentoSchema = z.object({
  /** `payload.event.uri` do postMessage `calendly.event_scheduled`. */
  calendly_evento_uri: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => /^https:\/\/api\.calendly\.com\/scheduled_events\/[\w-]+$/.test(v),
      "Não reconhecemos esse agendamento do Calendly.",
    ),
});

export type AgendamentoData = z.output<typeof agendamentoSchema>;
