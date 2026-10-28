import localFont from "next/font/local";

/**
 * Gantari — fonte oficial do guia de marca ady v1.0.
 * Carregada localmente (next/font/local), nunca via CDN do Google.
 *
 * Fonte variável (weight axis 100–900). Restringimos o range declarado aos
 * pesos usados pela marca: Light 300, Regular 400, Medium 500, SemiBold 600
 * — mais o Bold 700, usado só na LP do teste grátis (botão e títulos: o
 * botão laranja precisa de 700 pra contar como "texto grande" na WCAG).
 *
 * Arquivo fonte: `Gantari-Variable.ttf` (SIL Open Font License 1.1 — ver
 * `OFL.txt` nesta mesma pasta), obtido do repositório oficial google/fonts.
 */
export const gantari = localFont({
  src: "./Gantari-Variable.ttf",
  weight: "300 700",
  style: "normal",
  display: "swap",
  variable: "--font-gantari",
  fallback: [
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});
