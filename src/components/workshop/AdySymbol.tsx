/**
 * Símbolo do ady — "faísca solta" (briefing: tamanho ≥32px, separada do
 * resto do símbolo). Placeholder até o SVG oficial do guia de marca
 * existir neste projeto; mesma linguagem visual do favicon (`icon.svg`).
 */
export function AdySymbol({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      role="img"
    >
      <circle cx="32" cy="38" r="16" fill="#1E88A8" />
      <circle cx="32" cy="12" r="5" fill="#CF6F03" />
    </svg>
  );
}
