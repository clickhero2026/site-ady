import { z } from "zod";
import { WORKSHOP_SEGMENTOS } from "./workshopLeadOptions";
import { isValidPhone, phoneDigits } from "./phoneMask";

/**
 * Validação da inscrição do workshop — usada em `/api/workshop-lead`
 * (autoritativa) e reaproveitada no formulário pra mostrar erro antes de
 * enviar. Campos conforme a seção 6 do briefing-workshop-ady.md.
 */
export const workshopLeadSchema = z
  .object({
    nome: z.string().trim().min(2, "Digite seu nome completo.").max(120),
    whatsapp: z
      .string()
      .trim()
      .refine(isValidPhone, "Digite um WhatsApp válido, com DDD.")
      .transform(phoneDigits),
    email: z.string().trim().min(1, "Digite um e-mail válido.").email("Digite um e-mail válido.").max(180),
    negocio: z.string().trim().min(2, "Digite o nome do seu negócio.").max(120),
    segmento: z.enum(WORKSHOP_SEGMENTOS, { error: "Escolha uma opção." }),
    /** Só obrigatório quando `segmento` é "Outro" — ver superRefine abaixo. */
    negocioOutro: z.string().trim().max(120).optional().default(""),
    /** Honeypot: campo invisível para humanos. Preenchido = bot — tratado na
     * rota, não aqui, pra não rejeitar com um erro que entregaria o campo. */
    empresa_site: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.segmento === "Outro" && data.negocioOutro.trim().length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["negocioOutro"],
        message: "Conta pra gente o que seu negócio faz.",
      });
    }
  });

export type WorkshopLeadInput = z.input<typeof workshopLeadSchema>;
export type WorkshopLeadData = z.output<typeof workshopLeadSchema>;
