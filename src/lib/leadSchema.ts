import { z } from "zod";
import { SEGMENTOS } from "./leadOptions";
import { isValidPhone, phoneDigits } from "./phoneMask";

/**
 * Validação do lead — usada em `/api/lead` (autoritativa) e reaproveitada
 * no modal pra mostrar erro antes de enviar. Nunca confiar só na validação
 * do cliente: o servidor valida de novo.
 */
export const leadSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Digite seu nome completo.")
    .max(120),
  whatsapp: z
    .string()
    .trim()
    .refine(isValidPhone, "Digite um WhatsApp válido, com DDD.")
    .transform(phoneDigits),
  negocio: z
    .string()
    .trim()
    .min(2, "Digite o nome do seu negócio.")
    .max(120),
  segmento: z.enum(SEGMENTOS, { error: "Escolha um segmento." }),
  plano: z.enum(["social", "completo", "indeciso"], {
    error: "Escolha um plano.",
  }),
  /** Honeypot: campo invisível para humanos. Preenchido = bot — tratado na
   * rota, não aqui, pra não rejeitar com um erro que entregaria o campo. */
  empresa_site: z.string().optional().default(""),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;
