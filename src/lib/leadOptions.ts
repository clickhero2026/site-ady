/**
 * Opções do formulário de lead (briefing, seção 5).
 * Únicas fontes de verdade para os `<select>` do modal e para a validação
 * do lado do servidor em `/api/lead` — não duplicar essas listas.
 */

export const SEGMENTOS = [
  "Supermercado",
  "Clínica odontológica",
  "Barbearia ou salão",
  "Revenda de carros",
  "Academia",
  "Restaurante",
  "Pet shop",
  "Outro",
] as const;

export type Segmento = (typeof SEGMENTOS)[number];

/**
 * Plano de interesse: preenchido automaticamente pelo botão clicado
 * (`CtaButton`'s `plan`), mas sempre editável pelo visitante.
 */
export const PLANOS = {
  social: "ady Social",
  completo: "ady Completo",
  indeciso: "Ainda não sei",
} as const;

export type PlanoKey = keyof typeof PLANOS;
