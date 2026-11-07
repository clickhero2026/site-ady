import { isValidPhone, phoneDigits } from "@/lib/phoneMask";

/**
 * WhatsApp da máscara do formulário (`(85) 99999-9999`) ou já em E.164
 * (`+5585999999999`) → E.164 brasileiro: "+55" + DDD + número, só
 * dígitos (10 ou 11 depois do +55). Inválido → null.
 *
 * Mesmo corte do "+55" da validação do formulário da LP.
 */
export function toE164Br(valor: string): string | null {
  const digits = phoneDigits(valor.trim().replace(/^\+55\s*/, ""));
  return isValidPhone(digits) ? `+55${digits}` : null;
}
