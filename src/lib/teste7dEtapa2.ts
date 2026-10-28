import type { InscricaoRow } from "./teste7dDb";

/**
 * Ordem das telas da etapa 2 (briefing de ativação) — mesma ordem do
 * Google Forms "Briefing para o Onboarding do ADY". Uma pergunta por
 * tela; cada tela pertence a um bloco, e o salvamento (PATCH) manda os
 * campos do bloco inteiro. Compartilhado entre a página (servidor, pra
 * retomar de onde a pessoa parou) e o formulário (cliente).
 */

export const BLOCOS = {
  1: "Sobre o seu negócio",
  2: "Sua experiência com anúncios",
  3: "O que precisa estar pronto antes da conversa",
  4: "Nossa conversa",
} as const;

export type Bloco = keyof typeof BLOCOS;

export type CampoEtapa2 =
  | "negocio_nome_oferta"
  | "cidade_bairro"
  | "atende_todo_brasil"
  | "acao_desejada"
  | "acao_desejada_outro"
  | "experiencia_anuncios"
  | "acesso_redes"
  | "conta_anuncios"
  | "cartao_pagamento"
  | "arquivo_logo"
  | "reuniao_computador"
  | "observacoes";

export type TelaId =
  | "negocio"
  | "cidade"
  | "acao"
  | "experiencia"
  | "acesso"
  | "conta"
  | "cartao"
  | "logo"
  | "reuniao"
  | "observacoes";

export const TELAS: readonly { id: TelaId; bloco: Bloco; campos: readonly CampoEtapa2[] }[] = [
  { id: "negocio", bloco: 1, campos: ["negocio_nome_oferta"] },
  { id: "cidade", bloco: 1, campos: ["cidade_bairro", "atende_todo_brasil"] },
  { id: "acao", bloco: 1, campos: ["acao_desejada", "acao_desejada_outro"] },
  { id: "experiencia", bloco: 2, campos: ["experiencia_anuncios"] },
  { id: "acesso", bloco: 2, campos: ["acesso_redes"] },
  { id: "conta", bloco: 3, campos: ["conta_anuncios"] },
  { id: "cartao", bloco: 3, campos: ["cartao_pagamento"] },
  { id: "logo", bloco: 3, campos: ["arquivo_logo"] },
  { id: "reuniao", bloco: 4, campos: ["reuniao_computador"] },
  { id: "observacoes", bloco: 4, campos: ["observacoes"] },
];

export type Respostas = {
  negocio_nome_oferta?: string;
  cidade_bairro?: string;
  atende_todo_brasil?: boolean;
  acao_desejada?: string;
  acao_desejada_outro?: string;
  experiencia_anuncios?: string;
  acesso_redes?: string;
  conta_anuncios?: string;
  cartao_pagamento?: string;
  arquivo_logo?: string;
  reuniao_computador?: string;
  observacoes?: string;
};

/** Respostas já salvas, no formato do formulário (null do banco vira ausente). */
export function respostasDaLinha(row: InscricaoRow): Respostas {
  const r: Respostas = {};
  for (const tela of TELAS) {
    for (const campo of tela.campos) {
      const valor = row[campo];
      if (valor !== null && valor !== undefined) (r as Record<string, unknown>)[campo] = valor;
    }
  }
  return r;
}

/** A tela tem resposta suficiente pra seguir? A última (observações) é opcional. */
export function telaRespondida(id: TelaId, r: Respostas): boolean {
  switch (id) {
    case "negocio":
      return Boolean(r.negocio_nome_oferta?.trim());
    case "cidade":
      return Boolean(r.cidade_bairro?.trim()) || r.atende_todo_brasil === true;
    case "acao":
      return Boolean(r.acao_desejada) && (r.acao_desejada !== "outro" || Boolean(r.acao_desejada_outro?.trim()));
    case "experiencia":
      return Boolean(r.experiencia_anuncios);
    case "acesso":
      return Boolean(r.acesso_redes);
    case "conta":
      return Boolean(r.conta_anuncios);
    case "cartao":
      return Boolean(r.cartao_pagamento);
    case "logo":
      return Boolean(r.arquivo_logo);
    case "reuniao":
      return Boolean(r.reuniao_computador);
    case "observacoes":
      return true;
  }
}

/** Primeira tela sem resposta — onde a pessoa retoma. */
export function telaParaRetomar(r: Respostas): number {
  const i = TELAS.findIndex((t) => !telaRespondida(t.id, r));
  return i === -1 ? TELAS.length - 1 : i;
}

/** Tela onde mora um campo (pra levar a pessoa até a pergunta que falta). */
export function telaDoCampo(campo: string): number {
  return TELAS.findIndex((t) => (t.campos as readonly string[]).includes(campo));
}
