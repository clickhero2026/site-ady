import { trackEntrouNoApp } from "./analytics";
import { linkExpirado } from "./regras";
import { sessao, type ContaFluxoB } from "./sessao";

export type ResultadoEntrada = "ok" | "usado" | "expirado" | "sem-destino";

/**
 * Sai pro app pelo link de login (`redirect_url`: da API, uso único, 1h,
 * autentica e leva ao /dashboard). A API é nossa: o link é seguido como veio.
 * - já usado → "usado" (recarregar/voltar não abre de novo);
 * - sem link → "sem-destino";
 * - passou de 55 min desde que chegou → "expirado".
 * No "ok": marca usado ANTES de sair (recarga durante a saída não repete),
 * dispara fluxo_b_entrou_no_app e só então `window.location.assign`.
 * Nunca loga o link (tem token).
 */
export function entrarNoApp(conta: ContaFluxoB): ResultadoEntrada {
  if (conta.usado) return "usado";
  if (!conta.redirectUrl) return "sem-destino";
  if (linkExpirado(conta.recebidoEm, Date.now())) return "expirado";

  const destino = conta.redirectUrl;
  sessao.marcarUsado();
  trackEntrouNoApp(() => window.location.assign(destino));
  return "ok";
}
