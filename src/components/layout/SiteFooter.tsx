import Link from "next/link";
import styles from "./SiteFooter.module.css";

/**
 * Copy literal da seção 11 (Rodapé) do briefing. O link do Instagram e o
 * CNPJ/razão social ainda não foram informados — ver aviso separado.
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
              {/* TODO: URL real do Instagram do ady — pendente */}
              <a href="#" aria-disabled="true">
                Instagram
              </a>
            </li>
          </ul>
        </nav>

        <p>
          CNPJ e razão social conforme dados legais.
        </p>
      </div>
    </footer>
  );
}
