import { Check, X } from "lucide-react";
import styles from "./LpComparison.module.css";

const OUTROS = [
  { quem: "Agência tradicional", como: "Cara, cheia de reunião, resultado só depois de meses." },
  { quem: "Parente ou freelancer", como: "Bom enquanto dura." },
  { quem: "Você mesmo", como: "Quando sobra tempo (nunca sobra)." },
];

export function LpComparison() {
  return (
    <section className="lp-section lp-section--alt" aria-labelledby="lp-comparacao">
      <div className="lp-container">
        <h2 id="lp-comparacao" className="lp-h2 lp-h2--center lp-spark">
          QUANTAS AGÊNCIAS VOCÊ JÁ TROCOU?
        </h2>

        <ul className={styles.grade}>
          {OUTROS.map(({ quem, como }) => (
            <li key={quem} className={`${styles.cartao} lp-reveal`}>
              <span className={styles.marcaX}>
                <X aria-hidden="true" size={26} strokeWidth={2.75} />
              </span>
              <h3 className={styles.quem}>{quem}</h3>
              <p>{como}</p>
            </li>
          ))}
          <li className={`${styles.cartao} ${styles.ady} lp-reveal`}>
            <span className={styles.marcaCheck}>
              <Check aria-hidden="true" size={26} strokeWidth={3} />
            </span>
            <h3 className={`${styles.quem} ${styles.adyNome}`}>
              ady<span className={styles.faisca} aria-hidden="true" />
            </h3>
            <p>Cria, publica e anuncia para você, todo mês.</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
