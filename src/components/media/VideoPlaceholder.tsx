import styles from "./VideoPlaceholder.module.css";

interface VideoPlaceholderProps {
  id: string;
  width: number;
  height: number;
  description: string;
}

/**
 * Slot do VIDEO-01. Quando o material real entrar: `<video>` com `poster`
 * estático, `preload="none"`, sem autoplay e com legendas — exatamente como
 * pede a seção 4. Por enquanto só reserva o espaço 16:9 e mostra o ícone de
 * play para deixar claro que é vídeo, não imagem.
 */
export function VideoPlaceholder({
  id,
  width,
  height,
  description,
}: VideoPlaceholderProps) {
  return (
    <div
      className={styles.frame}
      style={{ aspectRatio: `${width} / ${height}` }}
      title={description}
      aria-hidden="true"
    >
      <span className={styles.pattern} />
      <span className={styles.play}>
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
        </svg>
      </span>
      <span className={styles.meta}>
        <span className={styles.label}>{id}</span>
        <span className={styles.duration}>60–90s · legendado</span>
      </span>
    </div>
  );
}
