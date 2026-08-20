import Link from "next/link";
import styles from "./SiteFooter.module.css";

/**
 * Copy literal da seção 11 (Rodapé) do briefing. Instagram e CNPJ/razão
 * social vieram de `paginas-legais-ady.md`.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.tagline}>ady é um produto Click Hero.</p>

        <nav aria-label="Rodapé">
          <ul className={styles.links}>
            <li>
              <Link href="/roadmap">Roadmap</Link>
            </li>
            <li>
              <Link href="/privacidade">Privacidade</Link>
            </li>
            <li>
              <Link href="/termos">Termos</Link>
            </li>
            <li>
              <a
                href="https://instagram.com/useadyapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
          </ul>
        </nav>

        <p>CloserX Ltda — CNPJ 52.243.325/0001-07</p>
      </div>
    </footer>
  );
}
