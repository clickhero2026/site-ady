import { trackEntrouNoApp } from "./analytics";
import { destinoSeguro } from "./redirect";
import { sessao } from "./sessao";

/**
 * Fim do Fluxo B: pega o `redirectUrl` do signup (uso único), valida a
 * origem e sai pro app com `window.location.assign`. Devolve false se não
 * houver destino válido (expirado/ausente/origem errada) — a tela mostra
 * o erro. TODO(contrato): se o login automático expirar rápido, é o app
 * que precisa resolver (não renovamos aqui).
 */
export function entrarNoApp(mock: boolean): boolean {
  const destino = destinoSeguro(sessao.consumirRedirect(), mock);
  if (!destino) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[fluxo-b] redirectUrl ausente ou fora de NEXT_PUBLIC_ADY_APP_ORIGIN.");
    }
    return false;
  }
  trackEntrouNoApp(() => window.location.assign(destino));
  return true;
}
