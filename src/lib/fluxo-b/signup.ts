import { z } from "zod";
import { toE164Br } from "./phone";

/**
 * Contrato do signup do trial no app do ady (POST
 * /api/public/trial/signup). O corpo é fechado: EXATAMENTE name, email e
 * phone. A RESPOSTA AINDA NÃO TEM CONTRATO — tudo que depende dela está
 * aqui, marcado com TODO(contrato).
 */

export type SignupCode = "EMAIL_EXISTS" | "INVALID" | "NETWORK" | "UNKNOWN";
export type SignupResult = { ok: true; redirectUrl: string } | { ok: false; code: SignupCode };

export type SignupBody = { name: string; email: string; phone: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** name/email com trim, e-mail minúsculo, phone em E.164. Inválido → null. */
export function normalizarSignup(entrada: { name?: unknown; email?: unknown; phone?: unknown }): SignupBody | null {
  const parsed = z
    .object({ name: z.string(), email: z.string(), phone: z.string() })
    .safeParse(entrada);
  if (!parsed.success) return null;

  const name = parsed.data.name.trim();
  const email = parsed.data.email.trim().toLowerCase();
  const phone = toE164Br(parsed.data.phone);
  if (name.length < 2 || name.length > 120 || !EMAIL_RE.test(email) || email.length > 180 || !phone) return null;
  return { name, email, phone };
}

export class SignupContratoError extends Error {
  constructor(message: string) {
    super(`[fluxo-b/signup] ${message}`);
    this.name = "SignupContratoError";
  }
}

/**
 * Resposta do app → resultado. TODO(contrato): o formato ainda não foi
 * definido pelo desenvolvedor do app. Por ora:
 * - 2xx com `redirectUrl` ou `loginUrl` (string) → sucesso;
 * - 409 → EMAIL_EXISTS; 400/422 → INVALID; 5xx → NETWORK;
 * - qualquer outra coisa → SignupContratoError (quem chama decide: falha
 *   clara em desenvolvimento, erro amigável em produção).
 *
 * TODO(contrato): códigos de erro no corpo (ex. `code: "EMAIL_EXISTS"`)
 * e por quanto tempo o `redirectUrl` (login automático) continua válido —
 * ele só é usado no fim do fluxo, depois do ramo (e da senha).
 */
export function parseSignupResponse(status: number, json: unknown): SignupResult {
  const corpo = (json && typeof json === "object" ? json : {}) as Record<string, unknown>;

  if (status >= 200 && status < 300) {
    const url = corpo.redirectUrl ?? corpo.loginUrl;
    if (typeof url === "string" && url.trim()) return { ok: true, redirectUrl: url.trim() };
    throw new SignupContratoError(
      `status ${status} sem redirectUrl/loginUrl. Chaves recebidas: ${Object.keys(corpo).join(", ") || "(nenhuma)"}`,
    );
  }
  if (status === 409) return { ok: false, code: "EMAIL_EXISTS" };
  if (status === 400 || status === 422) return { ok: false, code: "INVALID" };
  if (status >= 500) return { ok: false, code: "NETWORK" };
  throw new SignupContratoError(`status inesperado ${status}`);
}
