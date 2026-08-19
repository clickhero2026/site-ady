/**
 * Máscara de WhatsApp brasileiro (DDD + 8 ou 9 dígitos), sem dependência
 * externa. `formatPhone` roda a cada tecla no input; `phoneDigits` extrai só
 * os números pra validar e enviar.
 */

export function phoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

export function formatPhone(value: string): string {
  const digits = phoneDigits(value);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);

  if (rest.length <= 4) return `(${ddd}) ${rest}`;

  // 8 dígitos (fixo) até completar 10 no total; 9 dígitos (celular) depois.
  const splitAt = digits.length > 10 ? 5 : 4;
  const first = rest.slice(0, splitAt);
  const last = rest.slice(splitAt);

  return last ? `(${ddd}) ${first}-${last}` : `(${ddd}) ${first}`;
}

/** DDD válido (11–99) + 8 dígitos (fixo) ou 9 dígitos começando em 9 (celular). */
export function isValidPhone(value: string): boolean {
  const digits = phoneDigits(value);
  return /^[1-9]{2}(?:9\d{8}|\d{8})$/.test(digits);
}
