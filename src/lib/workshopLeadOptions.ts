/**
 * Opções do formulário de inscrição do workshop (briefing-workshop-ady.md,
 * seção 6). Segmentos diferentes dos da home — negócio local em geral,
 * não só os nichos do ady.
 */
export const WORKSHOP_SEGMENTOS = [
  "Alimentação/restaurante",
  "Beleza e estética",
  "Saúde e clínicas",
  "Academia e esporte",
  "Comércio e varejo",
  "Automotivo",
  "Serviços",
  "Outro",
] as const;

export type WorkshopSegmento = (typeof WORKSHOP_SEGMENTOS)[number];
