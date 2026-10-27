import { TESTE7D } from "@/config/teste7d";
import { LpLogo } from "./LpLogo";
import styles from "./LpFooter.module.css";

/** Rodapé limpo. Razão social e CNPJ são os mesmos do rodapé do site
 * (vindos de paginas-legais-ady.md); privacidade e termos são as páginas
 * do site principal. */
export function LpFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`lp-container ${styles.inner}`}>
        <LpLogo />
        <nav aria-label="Rodapé">
          <ul className={styles.links}>
            <li>
              <a href={`${TESTE7D.siteOrigin}/privacidade`}>Política de privacidade</a>
            </li>
            <li>
              <a href={`${TESTE7D.siteOrigin}/termos`}>Termos de uso</a>
            </li>
          </ul>
        </nav>
        <div className={styles.legal}>
          <p>ady é um produto da CloserX Ltda</p>
          <p>CNPJ 52.243.325/0001-07</p>
        </div>
      </div>
    </footer>
  );
}
