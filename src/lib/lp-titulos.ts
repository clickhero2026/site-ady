import type { LpVariant } from "@/config/teste7d";

/**
 * Títulos da landing page do teste grátis — briefing, seção 8, tabela
 * "Títulos para teste", copiados literalmente (inclusive a caixa alta e
 * o "ady" minúsculo). A página troca só o H1 conforme `?lp=`; nada mais
 * muda entre versões.
 */
export const LP_TITULOS: Record<LpVariant, string> = {
  A: "TESTE POR 7 DIAS O APP QUE SIMPLIFICA E AUTOMATIZA A SUA GERAÇÃO DE CLIENTES VIA WHATSAPP",
  B: "VOCÊ ABRIU UMA EMPRESA PARA ATENDER CLIENTE, NÃO PARA VIRAR DESIGNER. DEIXE O INSTAGRAM E OS ANÚNCIOS COM O ady POR 7 DIAS",
  C: "AGÊNCIA DE MARKETING DE BOLSO: SEU INSTAGRAM E SEUS ANÚNCIOS CUIDADOS TODO MÊS. TESTE POR 7 DIAS, SEM CARTÃO",
  D: "COLOQUE SEU NEGÓCIO NA FRENTE DE QUEM ESTÁ PROCURANDO E LEVE A CONVERSA DIRETO PARA O SEU WHATSAPP. TESTE 7 DIAS GRÁTIS",
  E: "7 DIAS GRÁTIS. SEM CARTÃO DE CRÉDITO. SEU INSTAGRAM E SEUS ANÚNCIOS FUNCIONANDO COM A GENTE",
  F: "POST SEM ANÚNCIO SÓ FALA COM QUEM JÁ TE CONHECE. EXPERIMENTE TER OS DOIS EM DIA, POR 7 DIAS",
};
