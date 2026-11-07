/**
 * Resposta do signup do app → resultado. Sem imports (o teste em
 * `signup.test.mjs` roda com `node --test`). Ver `signup.ts`.
 */

export type SignupCode = "EMAIL_EXISTS" | "INVALID" | "NETWORK" | "UNKNOWN";
/** `redirectUrl: null` = o app aceitou o cadastro mas não devolveu
 * login automático (comportamento atual da API, ver parseSignupResponse). */
export type SignupResult = { ok: true; redirectUrl: string | null } | { ok: false; code: SignupCode };

export class SignupContratoError extends Error {
  constructor(message: string) {
    super(`[fluxo-b/signup] ${message}`);
    this.name = "SignupContratoError";
  }
}

/**
 * Resposta do app → resultado. Contrato combinado com o dev do app
 * (06/11/2026), parte ainda não visível na hmg:
 *
 * - Conta nova: 2xx com `loginUrl` — URL da API que valida o token e
 *   redireciona pro app; vale 1h. TODO(contrato): confirmar o nome do
 *   campo quando a hmg passar a devolver o link (hoje vem só
 *   `{ message }`). `redirectUrl` também é aceito.
 * - E-mail já cadastrado: `error.code === "EMAIL_JA_CADASTRADO"`. Decide
 *   pelo CÓDIGO, não pelo status. TODO(contrato): status HTTP a confirmar.
 * - Body inválido: `error.code === "VALIDATION_ERROR"` (observado: 400).
 *
 * O código do corpo vem antes do status. Sem código conhecido:
 * 2xx → sucesso (sem link → `redirectUrl: null`, o fluxo termina em "conta
 * pronta, mas não conseguimos abrir o ady agora"); 400/422 → INVALID;
 * 409 → EMAIL_EXISTS; 429/5xx → NETWORK; o resto → SignupContratoError
 * (falha clara em desenvolvimento, erro amigável em produção).
 */
export function parseSignupResponse(status: number, json: unknown): SignupResult {
  const corpo = (json && typeof json === "object" ? json : {}) as Record<string, unknown>;
  const erro = corpo.error && typeof corpo.error === "object" ? (corpo.error as Record<string, unknown>) : null;
  const codigo = typeof erro?.code === "string" ? erro.code : undefined;

  if (codigo === "EMAIL_JA_CADASTRADO") return { ok: false, code: "EMAIL_EXISTS" };
  if (codigo === "VALIDATION_ERROR") return { ok: false, code: "INVALID" };

  if (status >= 200 && status < 300) {
    const url = corpo.loginUrl ?? corpo.redirectUrl;
    return { ok: true, redirectUrl: typeof url === "string" && url.trim() ? url.trim() : null };
  }
  if (status === 400 || status === 422) return { ok: false, code: "INVALID" };
  if (status === 409) return { ok: false, code: "EMAIL_EXISTS" };
  if (status === 429 || status >= 500) return { ok: false, code: "NETWORK" };

  throw new SignupContratoError(`status inesperado ${status}${codigo ? ` (error.code=${codigo})` : ""}`);
}
