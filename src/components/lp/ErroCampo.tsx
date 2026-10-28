import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./ErroCampo.module.css";

/** Mensagem de erro logo abaixo de um campo: ícone + texto, nunca só cor.
 * O `id` vai no `aria-describedby` do campo. */
export function ErroCampo({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className={styles.erro}>
      <CircleAlert aria-hidden="true" size={20} strokeWidth={2.5} className={styles.icone} />
      <span>{children}</span>
    </p>
  );
}
