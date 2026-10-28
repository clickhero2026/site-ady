/**
 * Rastreio da chegada na LP do teste grátis — só no navegador.
 *
 * Na chegada, guarda UTMs, fbclid, lp e referrer em `sessionStorage`; no
 * envio do formulário, devolve tudo pro POST /api/teste7d/inscricao. Assim
 * o rastreio sobrevive se a pessoa navegar ou recarregar sem os parâmetros
 * na URL. Visita nova com parâmetros substitui o que estava guardado.
 */

const STORAGE_KEY = "ady:t7d:rastreio";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "lp"] as const;

export type Rastreio = Partial<Record<(typeof PARAMS)[number] | "referrer" | "landing_url", string>>;

export function captureArrival() {
  try {
    const url = new URL(window.location.href);
    const fromUrl: Rastreio = {};
    for (const key of PARAMS) {
      const value = url.searchParams.get(key);
      if (value) fromUrl[key] = value;
    }

    const hasParams = Object.keys(fromUrl).length > 0;
    if (!hasParams && sessionStorage.getItem(STORAGE_KEY)) return;

    // Referrer só quando veio de fora (navegação interna não é origem).
    const referrer = document.referrer && new URL(document.referrer).host !== url.host ? document.referrer : undefined;

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...fromUrl, referrer, landing_url: url.href } satisfies Rastreio),
    );
  } catch {
    // sessionStorage indisponível: o envio cai pro que estiver na URL atual.
  }
}

export function readTracking(): Rastreio {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Rastreio;
  } catch {
    // idem acima
  }
  const url = new URL(window.location.href);
  const fallback: Rastreio = { landing_url: url.href };
  for (const key of PARAMS) {
    const value = url.searchParams.get(key);
    if (value) fallback[key] = value;
  }
  return fallback;
}
