import { APP_ORIGIN } from "@/config/fluxoB";

/**
 * Valida o destino final antes de sair do site: só a origem do app
 * (`NEXT_PUBLIC_ADY_APP_ORIGIN`), pra o `redirectUrl` da API nunca virar
 * open redirect. Caminho relativo é resolvido contra a origem do app.
 * Em modo mock, a origem do próprio site também vale (página de teste).
 *
 * TODO(contrato): o destino ideal é a tela de configuração do negócio e
 * metas no app (logo, sobre a empresa) — a rota exata vem do app.
 */
export function destinoSeguro(url: string | null, mock: boolean): string | null {
  if (!url) return null;
  const permitidas = new Set<string>();
  try {
    if (APP_ORIGIN) permitidas.add(new URL(APP_ORIGIN).origin);
  } catch {
    // APP_ORIGIN mal configurado: nada é permitido (cai no erro amigável).
  }
  if (mock) permitidas.add(window.location.origin);

  try {
    const base = APP_ORIGIN || window.location.origin;
    const destino = new URL(url, base);
    const protocoloOk =
      destino.protocol === "https:" ||
      (destino.protocol === "http:" && (process.env.NODE_ENV !== "production" || mock));
    return protocoloOk && permitidas.has(destino.origin) ? destino.href : null;
  } catch {
    return null;
  }
}
