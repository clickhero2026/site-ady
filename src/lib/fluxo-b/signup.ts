import { z } from "zod";
import { toE164Br } from "./phone";

export { chavesDoCorpo, parseSignupResponse, SignupContratoError } from "./signupResposta";
export type { SignupCode, SignupResult } from "./signupResposta";

/**
 * Contrato do signup do trial no app do ady (POST
 * /api/public/trial/signup). O corpo é fechado: EXATAMENTE name, email e
 * phone (E.164). A leitura da resposta fica em `signupResposta.ts`
 * (pendências marcadas com TODO(contrato)).
 */

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
