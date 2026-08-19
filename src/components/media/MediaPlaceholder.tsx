import styles from "./MediaPlaceholder.module.css";

type Tone =
  | "product" // capturas do ady — escuro + petróleo (IMG-01, 04–12)
  | "cold" // cena do problema — cinza, frio, sem identidade (IMG-02)
  | "portrait"; // foto real de pessoa (IMG-13)

interface MediaPlaceholderProps {
  /** Identificador do briefing, ex. "IMG-07". Vira o rótulo visível e o
   * início do `alt` que deve ser completado quando o asset real entrar. */
  id: string;
  /** Largura e altura reais especificadas na seção 4 — definem o
   * aspect-ratio para não haver deslocamento de layout na troca. */
  width: number;
  height: number;
  description: string;
  tone?: Tone;
  className?: string;
}

/**
 * Slot de imagem ainda não produzida. Mantém o aspect-ratio exato da seção 4
 * do briefing para que a troca pelo WebP real não mova nenhum outro elemento
 * da página. Sem `next/image` de propósito — entra junto com o asset.
 */
export function MediaPlaceholder({
  id,
  width,
  height,
  description,
  tone = "product",
  className,
}: MediaPlaceholderProps) {
  return (
    <figure
      className={[styles.frame, styles[tone], className].filter(Boolean).join(" ")}
      style={{ aspectRatio: `${width} / ${height}` }}
      title={description}
      aria-hidden="true"
    >
      <span className={styles.pattern} />
      <span className={styles.label}>
        {id}
        <span className={styles.dims}>
          {width}×{height}
        </span>
      </span>
    </figure>
  );
}
