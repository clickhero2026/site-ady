import { FLUXO_B_TELAS, type FluxoBTela } from "@/config/fluxoB";
import { montarCaminho, prefixoDaUrl } from "./regras";

/**
 * Caminho público de uma tela do Fluxo B, só no navegador, com o prefixo
 * da URL em que a pessoa entrou:
 * - useady.com.br/testegratis/... → `/testegratis/criando`;
 * - preview direto /fluxo-b/... → `/fluxo-b/criando`;
 * - host próprio (teste.useady.com.br) → `/criando`.
 */
export function caminho(tela: FluxoBTela, hash = ""): string {
  const prefixo = typeof window === "undefined" ? "" : prefixoDaUrl(window.location.pathname);
  return montarCaminho(prefixo, FLUXO_B_TELAS[tela], hash);
}

/** Navegação full-page (o GTM registra o page_view de cada tela, igual à
 * LP atual). `replace`: telas que não devem voltar pelo "voltar". */
export function irPara(tela: FluxoBTela, { hash = "", replace = false } = {}) {
  const destino = caminho(tela, hash);
  if (replace) window.location.replace(destino);
  else window.location.assign(destino);
}
