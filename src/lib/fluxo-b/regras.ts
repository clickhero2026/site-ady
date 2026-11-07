/**
 * Regras de ambiente do Fluxo B, puras (sem imports): o teste em
 * `regras.test.mjs` roda com `node --test` sem bundler nem alias.
 */

/** Prefixo interno das rotas em `src/app/fluxo-b/` (e da API). */
export const FLUXO_B_PREFIX = "/fluxo-b";
const PREFIXOS_BLOQUEADOS = [FLUXO_B_PREFIX, "/api/fluxo-b"];

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

/**
 * No host principal (useady.com.br), o Fluxo B (páginas e API) responde
 * 404 em produção. Em preview/desenvolvimento continua acessível por
 * `/fluxo-b`; no host próprio do Fluxo B esta regra não é consultada.
 */
export function bloqueadoNoHostPrincipal(pathname: string, vercelEnv: string | undefined): boolean {
  if (vercelEnv !== "production") return false;
  return PREFIXOS_BLOQUEADOS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
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
 * (vírgula) sobrescreve; padrão = origem da rota de signup do ambiente
 * (hmg fora de Production). Só entra origem https sem usuário/senha;
 * entrada inválida é descartada (lista vazia = nada permitido).
 */
export function origensDeRedirect(env: { lista?: string; vercelEnv?: string }): string[] {
  const padrao = env.vercelEnv === "production" ? SIGNUP_URL_PRODUCAO : SIGNUP_URL_HMG;
  const bruto = env.lista?.trim() ? env.lista.split(",") : [padrao];
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
 * Destino final validado, ou null. Exige URL absoluta, https, sem
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
