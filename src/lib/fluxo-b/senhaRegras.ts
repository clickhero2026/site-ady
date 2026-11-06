/**
 * Regras da senha do Fluxo B — o desenvolvedor do app vai definir as
 * finais. TODO(contrato): confirmar com o app (mesmas regras do backend).
 * Mexer só aqui: a lista da tela e o medidor de força leem deste array.
 */
export const SENHA_MIN = 8;

export const REGRAS_SENHA: readonly { id: string; texto: string; ok: (senha: string) => boolean }[] = [
  { id: "tamanho", texto: `Pelo menos ${SENHA_MIN} caracteres`, ok: (s) => s.length >= SENHA_MIN },
  { id: "caixa", texto: "Letras maiúsculas e minúsculas", ok: (s) => /\p{Lu}/u.test(s) && /\p{Ll}/u.test(s) },
  { id: "numero", texto: "Pelo menos um número", ok: (s) => /\d/.test(s) },
  { id: "simbolo", texto: "Pelo menos um símbolo (ex.: ! @ # $)", ok: (s) => /[^\p{L}\p{N}\s]/u.test(s) },
];

export function senhaValida(senha: string): boolean {
  return REGRAS_SENHA.every((r) => r.ok(senha));
}
