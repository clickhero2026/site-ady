import type { ConfigCliente } from "@/config/fluxoB";
import { trackEntrouNoApp } from "./analytics";
import { destinoPermitido, linkExpirado } from "./regras";
import { sessao } from "./sessao";

export type ResultadoEntrada = "ok" | "expirado" | "sem-destino";

/**
 * Fim do Fluxo B: pega o link de login do signup (uso único) e sai com
 * `window.location.assign`. O link é da API (valida o token e manda pro
 * app) e vale 1h:
 * - passou de 55 min desde que chegou → "expirado" (não redireciona);
 * - ausente ou fora de FLUXO_B_REDIRECT_ORIGINS → "sem-destino".
 * Nunca loga o link (tem token).
 */
export function entrarNoApp(cfg: ConfigCliente): ResultadoEntrada {
  const conta = sessao.consumirRedirect();
  if (!conta) return "sem-destino";
  if (linkExpirado(conta.recebidoEm, Date.now())) return "expirado";

  const destino = destinoPermitido(conta.url, cfg.origensRedirect, cfg.mock.ativo ? { origemMock: window.location.origin } : {});
  if (!destino) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[fluxo-b] link de login fora de FLUXO_B_REDIRECT_ORIGINS (ou inseguro).");
    }
    return "sem-destino";
  }
  trackEntrouNoApp(() => window.location.assign(destino));
  return "ok";
}
