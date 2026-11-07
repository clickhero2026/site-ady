import { TESTE7D } from "@/config/teste7d";
import styles from "./LpLogo.module.css";

/**
 * Logo da LP: símbolo + "ady", linkando pro site principal (pedido do
 * prompt). Mesmo placeholder do site e do workshop — o
 * `ady-lockup-horizontal.svg` do guia de marca ainda não está no repo.
 */
export function LpLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <a
      href={TESTE7D.siteOrigin}
      className={styles.logo}
      data-inverse={inverse || undefined}
      aria-label="ady — ir para o site"
    >
      <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="38" r="16" fill="currentColor" className={styles.mark} />
        <circle cx="32" cy="12" r="6" fill="#CF6F03" />
      </svg>
      <span>ady</span>
    </a>
  );
}
