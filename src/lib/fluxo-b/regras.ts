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
