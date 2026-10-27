import { ChevronDown } from "lucide-react";
import styles from "./LpFaq.module.css";

const PERGUNTAS = [
  { p: "Precisa de cartão de crédito?", r: "Não." },
  { p: "Quando começam os 7 dias?", r: "Depois da conversa de configuração." },
  { p: "Preciso entender de marketing?", r: "Não. O ady é feito para quem não entende." },
];

/** Acordeão com <details>/<summary>: acessível por teclado e leitor de
 * tela sem nenhum JavaScript. */
export function LpFaq() {
  return (
    <section className="lp-section lp-section--alt" aria-labelledby="lp-faq">
      <div className={`lp-container ${styles.estreito}`}>
        <h2 id="lp-faq" className="lp-h2 lp-h2--center lp-spark">
          Perguntas rápidas
        </h2>
        <div className={styles.lista}>
          {PERGUNTAS.map(({ p, r }) => (
            <details key={p} className={styles.item}>
              <summary className={styles.pergunta}>
                {p}
                <ChevronDown aria-hidden="true" size={28} strokeWidth={2.25} className={styles.seta} />
              </summary>
              <p className={styles.resposta}>{r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
