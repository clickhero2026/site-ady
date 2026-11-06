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
 * Resposta do app → resultado. Mapeamento a partir das respostas reais
 * da rota de homologação (06/11/2026):
 *
 * - 202 `{ "message": "Se for possível, enviaremos um link de acesso." }`
 *   — sem token, sem URL, sem Set-Cookie/Location. A MESMA resposta vem
 *   para e-mail novo e para e-mail já cadastrado (anti-enumeração): o app
 *   manda um link de acesso por fora, e não dá pra saber aqui se a conta
 *   foi criada agora ou já existia.
 * - 400 `{ success: false, error: { code: "VALIDATION_ERROR", message,
 *   details: { errors: [{ path, message, code }] } } }` → INVALID.
 *
 * TODO(contrato):
 * - Login automático: a resposta não traz URL nem token. `redirectUrl`
 *   (ou `loginUrl`) só é lido se o app passar a mandar; sem ele o fluxo
 *   termina sem entrar no app.
 * - EMAIL_EXISTS: não observado (e-mail repetido → 202). O 409 segue
 *   mapeado só se o app passar a usá-lo.
 * - Por onde o link de acesso é enviado (e-mail? WhatsApp?) e quanto
 *   tempo vale.
 *
 * 5xx e 429 (limite: `x-ratelimit-*`) → NETWORK ("tente de novo").
 * Qualquer outro status → SignupContratoError (quem chama decide: falha
 * clara em desenvolvimento, erro amigável em produção).
 */
export function parseSignupResponse(status: number, json: unknown): SignupResult {
  const corpo = (json && typeof json === "object" ? json : {}) as Record<string, unknown>;

  if (status >= 200 && status < 300) {
    const url = corpo.redirectUrl ?? corpo.loginUrl;
    return { ok: true, redirectUrl: typeof url === "string" && url.trim() ? url.trim() : null };
  }
  if (status === 400 || status === 422) return { ok: false, code: "INVALID" };
  if (status === 409) return { ok: false, code: "EMAIL_EXISTS" };
  if (status === 429 || status >= 500) return { ok: false, code: "NETWORK" };

  const codigo = corpo.error && typeof corpo.error === "object" ? (corpo.error as Record<string, unknown>).code : undefined;
  throw new SignupContratoError(`status inesperado ${status}${typeof codigo === "string" ? ` (error.code=${codigo})` : ""}`);
}
