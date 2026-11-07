/**
 * Resposta do signup do app → resultado. Sem imports (o teste em
 * `signup.test.mjs` roda com `node --test`). Ver `signup.ts`.
 */

export type SignupCode = "EMAIL_EXISTS" | "INVALID" | "RATE_LIMIT" | "NETWORK" | "UNKNOWN";
/** `redirectUrl: null` = conta criada, mas sem link de login na resposta
 * (o app manda o acesso por e-mail). */
export type SignupResult = { ok: true; redirectUrl: string | null } | { ok: false; code: SignupCode };

export class SignupContratoError extends Error {
  constructor(message: string) {
    super(`[fluxo-b/signup] ${message}`);
    this.name = "SignupContratoError";
  }
}

/**
 * Contrato do dev do app (atualizado em 07/11/2026; sem HMAC em produção):
 * - Conta nova: 201 `{ created: true, redirect_url, message }` — o link é
 *   do FRONTEND do app (https://app.useady.com.br/trial/acesso#token=...),
 *   com o token no fragmento; ele segue intacto até o navegador.
 * - E-mail já cadastrado: 409 `{ "erro": "EMAIL_JA_CADASTRADO" }` — vale o
 *   status OU o código no corpo (também em `error.code`).
 * - Validação: `{ error: { code: "VALIDATION_ERROR", ... } }` (observado
 *   na hmg: 400).
 *
 * O código do corpo vem antes do status. Sem código conhecido:
 * 2xx → sucesso, com o link em `redirect_url` ou, se ausente, em
 * `redirectUrl` (hotfix: o app pode mandar em camelCase); sem nenhum dos
 * dois → `redirectUrl: null`; 400/422 → INVALID; 429 → RATE_LIMIT;
 * 5xx → NETWORK; 401/403 e o resto → SignupContratoError com status e
 * nomes de chave (falha clara no log, erro amigável na tela). O link vale
 * 1h e é de uso único (ver linkExpirado / entrarNoApp).
 */
const textoNaoVazio = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

/** Só os NOMES das chaves do corpo, pra diagnóstico em log (nunca valores). */
export function chavesDoCorpo(json: unknown): string {
  if (Array.isArray(json)) return "(array)";
  if (!json || typeof json !== "object") return json === null || json === undefined ? "(vazio)" : `(${typeof json})`;
  const chaves = Object.keys(json);
  return chaves.length ? chaves.join(", ") : "(nenhuma)";
}

export function parseSignupResponse(status: number, json: unknown): SignupResult {
  const corpo = (json && typeof json === "object" ? json : {}) as Record<string, unknown>;
  const error = corpo.error && typeof corpo.error === "object" ? (corpo.error as Record<string, unknown>) : null;
  const codigo = typeof corpo.erro === "string" ? corpo.erro : typeof error?.code === "string" ? error.code : undefined;

  // Código conhecido no corpo vence o status (é mais específico).
  if (codigo === "EMAIL_JA_CADASTRADO") return { ok: false, code: "EMAIL_EXISTS" };
  if (codigo === "VALIDATION_ERROR") return { ok: false, code: "INVALID" };
  // E-mail já cadastrado pelo status (contrato: 409), mesmo sem corpo.
  if (status === 409) return { ok: false, code: "EMAIL_EXISTS" };

  // 201 (contrato: { created: true, redirect_url, message }) e demais 2xx.
  // Sem link (ex.: `created: true` sem `redirect_url`) → redirectUrl null:
  // a tela mostra "Sua conta está pronta. Enviamos um e-mail com o seu acesso."
  if (status === 201 || (status >= 200 && status < 300)) {
    return { ok: true, redirectUrl: textoNaoVazio(corpo.redirect_url) ?? textoNaoVazio(corpo.redirectUrl) };
  }
  if (status === 400 || status === 422) return { ok: false, code: "INVALID" };
  if (status === 429) return { ok: false, code: "RATE_LIMIT" };
  if (status >= 500) return { ok: false, code: "NETWORK" };

  // 401/403: a API recusou a nossa chamada (credencial/configuração). Erro
  // claro no log — só status e NOMES das chaves, nunca valores.
  if (status === 401 || status === 403) {
    throw new SignupContratoError(`API recusou a chamada (${status}); chaves: ${chavesDoCorpo(json)}`);
  }
  throw new SignupContratoError(`status inesperado ${status}; chaves: ${chavesDoCorpo(json)}`);
}
