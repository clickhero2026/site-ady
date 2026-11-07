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
 * Contrato final do dev do app (06/11/2026):
 * - Conta nova: `{ "redirect_url": "<link>" }` — link da API, uso único,
 *   válido 1h, que autentica e leva ao /dashboard do app.
 * - E-mail já cadastrado: `{ "erro": "EMAIL_JA_CADASTRADO" }` (também
 *   aceito em `error.code`). Decide pelo CORPO: o status não foi
 *   confirmado. TODO(contrato): status HTTP.
 * - Validação: `{ error: { code: "VALIDATION_ERROR", ... } }` (observado
 *   na hmg: 400).
 *
 * O código do corpo vem antes do status. Sem código conhecido:
 * 2xx → sucesso (sem `redirect_url` → `redirectUrl: null`); 400/422 →
 * INVALID; 429 → RATE_LIMIT; 5xx → NETWORK; o resto → SignupContratoError
 * (falha clara em desenvolvimento, erro amigável em produção).
 */
export function parseSignupResponse(status: number, json: unknown): SignupResult {
  const corpo = (json && typeof json === "object" ? json : {}) as Record<string, unknown>;
  const error = corpo.error && typeof corpo.error === "object" ? (corpo.error as Record<string, unknown>) : null;
  const codigo = typeof corpo.erro === "string" ? corpo.erro : typeof error?.code === "string" ? error.code : undefined;

  if (codigo === "EMAIL_JA_CADASTRADO") return { ok: false, code: "EMAIL_EXISTS" };
  if (codigo === "VALIDATION_ERROR") return { ok: false, code: "INVALID" };

  if (status >= 200 && status < 300) {
    const url = corpo.redirect_url;
    return { ok: true, redirectUrl: typeof url === "string" && url.trim() ? url.trim() : null };
  }
  if (status === 400 || status === 422) return { ok: false, code: "INVALID" };
  if (status === 429) return { ok: false, code: "RATE_LIMIT" };
  if (status >= 500) return { ok: false, code: "NETWORK" };

  throw new SignupContratoError(`status inesperado ${status}${codigo ? ` (código=${codigo})` : ""}`);
}
