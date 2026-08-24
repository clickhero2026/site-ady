import { ThemeToggle } from "@/components/theme/ThemeToggle";
import styles from "./WorkshopThemeToggle.module.css";

/**
 * `/workshop` não tem `SiteHeader` de propósito (regra do funil: sem
 * link de navegação pra home — ver `workshop/layout.tsx`), então o
 * toggle flutua fixo no canto, em vez de morar numa barra de header.
 * "floating": o hero por trás pode ser a foto escura do IMG-W01, então
 * precisa de fundo opaco + blur pra ficar legível nos dois temas.
 */
export function WorkshopThemeToggle() {
  return (
    <div className={styles.wrap}>
      <ThemeToggle variant="floating" />
    </div>
  );
}
