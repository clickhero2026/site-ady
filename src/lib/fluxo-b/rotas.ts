import { FLUXO_B_PREFIX, FLUXO_B_TELAS, type FluxoBTela } from "@/config/fluxoB";

/**
 * Caminho público de uma tela do Fluxo B, só no navegador. No host
 * próprio (teste.useady.com.br) o proxy tira o prefixo, então os
 * caminhos são `/criando`...; no preview da Vercel (ou em
 * localhost) o acesso é por `/fluxo-b/...`. A página atual diz qual dos
 * dois vale: se ela está sob `/fluxo-b`, tudo está.
 */
export function caminho(tela: FluxoBTela, hash = ""): string {
  const comPrefixo =
    typeof window !== "undefined" &&
    (window.location.pathname === FLUXO_B_PREFIX || window.location.pathname.startsWith(`${FLUXO_B_PREFIX}/`));
  const rota = FLUXO_B_TELAS[tela];
  if (!comPrefixo) return `${rota}${hash}`;
  return `${rota === "/" ? FLUXO_B_PREFIX : `${FLUXO_B_PREFIX}${rota}`}${hash}`;
}

/** Navegação full-page (o GTM registra o page_view de cada tela, igual à
 * LP atual). `replace`: telas que não devem voltar pelo "voltar". */
export function irPara(tela: FluxoBTela, { hash = "", replace = false } = {}) {
  const destino = caminho(tela, hash);
  if (replace) window.location.replace(destino);
  else window.location.assign(destino);
}
