import type { ReactNode } from "react";
import { LpLogo } from "../lp/LpLogo";
import styles from "./FluxoBShell.module.css";

/**
 * Casca das telas do Fluxo B depois da LP. Desktop (≥1024px): painel
 * petróleo à esquerda (~35%, 360–520px) e conteúdo à direita com a barra
 * de progresso fina no topo. Celular: o painel vira cabeçalho compacto.
 *
 * A barra não mostra número de passo — só o quanto falta (`progresso`,
 * 0–100), exposto como `role="progressbar"`.
 */
export function FluxoBShell({
  progresso,
  painel,
  children,
}: {
  progresso: number;
  painel?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <aside className={styles.painel}>
        <LpLogo inverse />
        {painel && <div className={styles.painelConteudo}>{painel}</div>}
      </aside>

      <div className={styles.lado}>
        <div
          className={styles.progresso}
          role="progressbar"
          aria-label="Progresso do cadastro"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progresso}
          aria-valuetext={`${progresso}% concluído`}
        >
          <span className={styles.progressoBarra} style={{ width: `${progresso}%` }} />
        </div>

        <main id="conteudo" className={styles.conteudo}>
          <div className={styles.conteudoInner}>{children}</div>
        </main>
      </div>
    </div>
  );
}
