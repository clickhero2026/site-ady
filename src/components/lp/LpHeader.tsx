import { LpLogo } from "./LpLogo";
import styles from "./LpHeader.module.css";

/** Barra fixa: logo + CTA. No celular o CTA sai daqui e vai pro rodapé da
 * tela (`StickyCta`). */
export function LpHeader() {
  return (
    <header className={styles.header} data-topo-fixo>
      <div className={`lp-container ${styles.inner}`}>
        <LpLogo />
        <a href="#cadastro" className={`lp-cta ${styles.cta}`}>
          QUERO TESTAR GRÁTIS
        </a>
      </div>
    </header>
  );
}
