import type { ConfigCliente } from "@/config/fluxoB";
import { trackEntrouNoApp } from "./analytics";
import { destinoPermitido, linkExpirado } from "./regras";
import { sessao, type ContaFluxoB } from "./sessao";

export type ResultadoEntrada = "ok" | "usado" | "expirado" | "sem-destino";

/**
 * Sai pro app pelo link de login (`redirect_url`: da API, uso único, 1h,
 * autentica e leva ao /dashboard).
 * - já usado → "usado" (recarregar/voltar não abre de novo);
 * - sem link ou fora de FLUXO_B_REDIRECT_ORIGINS → "sem-destino";
 * - passou de 55 min desde que chegou → "expirado".
 * No "ok": marca usado ANTES de sair (recarga durante a saída não repete),
 * dispara fluxo_b_entrou_no_app e só então `window.location.assign`.
 * Nunca loga o link (tem token).
 */
export function entrarNoApp(cfg: ConfigCliente, conta: ContaFluxoB): ResultadoEntrada {
  if (conta.usado) return "usado";
  if (!conta.redirectUrl) return "sem-destino";
  if (linkExpirado(conta.recebidoEm, Date.now())) return "expirado";

  const destino = destinoPermitido(conta.redirectUrl, cfg.origensRedirect, cfg.mock.ativo ? { origemMock: window.location.origin } : {});
  if (!destino) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[fluxo-b] redirect_url fora de FLUXO_B_REDIRECT_ORIGINS (ou inseguro).");
    }
    return "sem-destino";
  }
  sessao.marcarUsado();
  trackEntrouNoApp(() => window.location.assign(destino));
  return "ok";
}
