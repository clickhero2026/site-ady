/**
 * Regras de ambiente do Fluxo B, puras (sem imports): o teste em
 * `regras.test.mjs` roda com `node --test` sem bundler nem alias.
 */

/** Prefixo interno das rotas em `src/app/fluxo-b/` (e da API). */
export const FLUXO_B_PREFIX = "/fluxo-b";

/** URL pública do Fluxo B no domínio principal: useady.com.br/testegratis.
 * O proxy reescreve pra `/fluxo-b/...`; o navegador continua vendo
 * `/testegratis/...`. */
export const PREFIXO_PUBLICO = "/testegratis";

/** Domínio principal. NUNCA é "host do Fluxo B" (o rewrite de `/` desse
 * host trocaria a home do site pela LP clonada). */
export const HOSTS_PRINCIPAIS = ["useady.com.br", "www.useady.com.br"] as const;
const HOSTS_PROIBIDOS_NO_FLUXO_B = [...HOSTS_PRINCIPAIS, "lp.useady.com.br"];

const sobPrefixo = (pathname: string, prefixo: string) => pathname === prefixo || pathname.startsWith(`${prefixo}/`);

/**
 * Hosts que o proxy trata como "host do Fluxo B" (`/` → LP clonada): o
 * host próprio + `FLUXO_B_EXTRA_HOSTS`. Domínio principal e host da LP
 * atual são descartados mesmo se alguém configurar por engano.
 */
export function hostsDoFluxoB(hostProprio: string, extrasEnv?: string): string[] {
  const todos = [hostProprio, ...(extrasEnv?.split(",") ?? [])].map((h) => h.trim().toLowerCase()).filter(Boolean);
  return [...new Set(todos)].filter((h) => !HOSTS_PROIBIDOS_NO_FLUXO_B.includes(h));
}

export function ehHostDoFluxoB(hostHeader: string | null | undefined, hostProprio: string, extrasEnv?: string): boolean {
  const hostname = (hostHeader ?? "").split(":")[0].toLowerCase();
  return Boolean(hostname) && hostsDoFluxoB(hostProprio, extrasEnv).includes(hostname);
}

/** Hosts que podem chamar /api/fluxo-b/signup (checagem de Origin/Host),
 * separados da lista do rewrite: domínio principal (/testegratis) + hosts
 * do Fluxo B. Previews e localhost entram na própria checagem (fora de
 * produção). */
export function hostsDaApi(hostProprio: string, extrasEnv?: string): string[] {
  return [...new Set([...HOSTS_PRINCIPAIS, ...hostsDoFluxoB(hostProprio, extrasEnv)])];
}

export type DecisaoHostPrincipal = { tipo: "reescrever"; destino: string } | { tipo: "bloquear" } | { tipo: "noindex" } | null;

/**
 * Proxy, hosts que NÃO são o da LP atual nem o do Fluxo B (domínio
 * principal e previews):
 * - `/testegratis[/...]` → reescreve pra `/fluxo-b[/...]` (todo ambiente);
 * - `/fluxo-b[/...]` direto → 404 em produção; fora dela segue, com noindex;
 * - o resto → null (o proxy não mexe).
 * A API (`/api/fluxo-b/*`) não passa por aqui: funciona em todo host não-LP
 * e se protege sozinha (Origin/Host, honeypot, limites).
 */
export function decidirHostPrincipal(pathname: string, vercelEnv: string | undefined): DecisaoHostPrincipal {
  if (sobPrefixo(pathname, PREFIXO_PUBLICO)) {
    const resto = pathname.slice(PREFIXO_PUBLICO.length);
    return { tipo: "reescrever", destino: `${FLUXO_B_PREFIX}${resto === "/" ? "" : resto}` };
  }
  if (sobPrefixo(pathname, FLUXO_B_PREFIX)) return vercelEnv === "production" ? { tipo: "bloquear" } : { tipo: "noindex" };
  return null;
}

/** Prefixo das telas na URL em que a pessoa está: `/testegratis` (domínio
 * principal), `/fluxo-b` (preview direto) ou nenhum (host próprio). */
export function prefixoDaUrl(pathname: string): string {
  if (sobPrefixo(pathname, PREFIXO_PUBLICO)) return PREFIXO_PUBLICO;
  if (sobPrefixo(pathname, FLUXO_B_PREFIX)) return FLUXO_B_PREFIX;
  return "";
}

/** `rota` sem prefixo ("/", "/criando") → caminho público com o prefixo. */
export function montarCaminho(prefixo: string, rota: string, hash = ""): string {
  if (rota === "/") return `${prefixo || "/"}${hash}`;
  return `${prefixo}${rota}${hash}`;
}

export type EstadoMock = { ativo: boolean; ignorado: boolean };

export const AVISO_MOCK_IGNORADO =
  "[fluxo-b] NEXT_PUBLIC_FLUXO_B_MOCK=1 ignorado: VERCEL_ENV=production. O signup real está ativo.";

/**
 * NEXT_PUBLIC_FLUXO_B_MOCK só vale fora de produção. Em produção
 * (`VERCEL_ENV === "production"`) é ignorado — `ignorado: true` pra quem
 * chama avisar no console.
 */
export function resolverMock(env: { mock?: string; vercelEnv?: string }): EstadoMock {
  const pedido = env.mock === "1";
  const producao = env.vercelEnv === "production";
  return { ativo: pedido && !producao, ignorado: pedido && producao };
}

/** Signup do trial no app: produção só em Production; homologação em
 * Preview e em desenvolvimento local. `TRIAL_SIGNUP_URL` sobrescreve. */
export const SIGNUP_URL_PRODUCAO = "https://clickhero-fury-api.u7pe19.easypanel.host/api/public/trial/signup";
export const SIGNUP_URL_HMG = "https://clickhero-hmg-fury-api.u7pe19.easypanel.host/api/public/trial/signup";

export function urlDoSignup(env: { trialSignupUrl?: string; vercelEnv?: string }): string {
  if (env.trialSignupUrl?.trim()) return env.trialSignupUrl.trim();
  return env.vercelEnv === "production" ? SIGNUP_URL_PRODUCAO : SIGNUP_URL_HMG;
}

/* ---- Link de login (contrato do app, 06/11/2026) ---------------------- */

/** O link de login do app vale 1h. Tratamos como vencido aos 55 min, com
 * margem para relógio e rede. */
export const LINK_VALIDADE_UTIL_MS = 55 * 60 * 1000;

/** `recebidoEm` = quando o link chegou (ms). Sem horário → vencido. */
export function linkExpirado(recebidoEm: number | null | undefined, agora: number): boolean {
  if (typeof recebidoEm !== "number" || !Number.isFinite(recebidoEm)) return true;
  return agora - recebidoEm > LINK_VALIDADE_UTIL_MS;
}

/**
 * Origens permitidas para o redirecionamento final (o link de login é da
 * API, que valida o token e manda pro app). `FLUXO_B_REDIRECT_ORIGINS`
 * (vírgula) sobrescreve; padrão em Production = origem da API de produção
 * + https://app.useady.com.br; fora dela = origem da rota hmg. Só entra origem https sem usuário/senha;
 * entrada inválida é descartada (lista vazia = nada permitido).
 */
/** Frontend do app: o `redirect_url` de produção aponta pra cá
 * (`/trial/acesso#token=...`). */
export const APP_FRONTEND_ORIGIN = "https://app.useady.com.br";

export function origensDeRedirect(env: { lista?: string; vercelEnv?: string }): string[] {
  // Produção: origem da API e do frontend do app. Fora dela: só a hmg (a
  // rota de homologação nunca entra na lista de produção).
  const padrao = env.vercelEnv === "production" ? [SIGNUP_URL_PRODUCAO, APP_FRONTEND_ORIGIN] : [SIGNUP_URL_HMG];
  const bruto = env.lista?.trim() ? env.lista.split(",") : padrao;
  const origens = new Set<string>();
  for (const item of bruto) {
    try {
      const u = new URL(item.trim());
      if (u.protocol === "https:" && !u.username && !u.password) origens.add(u.origin);
    } catch {
      // entrada inválida: ignorada
    }
  }
  return [...origens];
}

/**
 * Destino final validado, ou null. Devolve `URL.href`, que preserva o
 * fragmento (`#token=...`) intacto. Exige URL absoluta, https, sem
 * usuário/senha e origem EXATA da lista. `origemMock` (só com o mock
 * ligado, fora de produção) libera a própria origem do site — inclusive
 * http local — pra página de teste /fluxo-b/app-mock.
 */
export function destinoPermitido(url: string, origens: readonly string[], opcoes: { origemMock?: string } = {}): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (u.username || u.password) return null;
  if (opcoes.origemMock && u.origin === opcoes.origemMock) return u.href;
  if (u.protocol !== "https:") return null;
  return origens.includes(u.origin) ? u.href : null;
}
