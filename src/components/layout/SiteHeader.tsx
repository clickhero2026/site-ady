import Link from "next/link";
import styles from "./SiteHeader.module.css";

/**
 * Logótipo: `ady-lockup-horizontal.svg` ainda não está disponível (pasta
 * `assets/` do guia de marca não foi entregue neste repositório). Uso a
 * wordmark em Gantari como placeholder — trocar pelo SVG real quando chegar,
 * mantendo a mesma altura/área de toque.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="ady — página inicial">
          ady
        </Link>
      </div>
    </header>
  );
}
