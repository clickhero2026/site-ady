import { Clock, UserRoundX, Wallet } from "lucide-react";
import styles from "./LpPain.module.css";

const DORES = [
  { Icone: Clock, texto: "Não sobra tempo. Você abriu uma empresa para atender cliente." },
  { Icone: UserRoundX, texto: "O sobrinho sumiu. E o Instagram parou de novo." },
  { Icone: Wallet, texto: "Agência tradicional é cara e demora." },
];

export function LpPain() {
  return (
    <section className="lp-section lp-section--alt" aria-labelledby="lp-dor">
      <div className="lp-container">
        <h2 id="lp-dor" className="lp-h2 lp-h2--center lp-spark">
          Você sabe que seu negócio precisa aparecer.
        </h2>
        <ul className={styles.grade}>
          {DORES.map(({ Icone, texto }) => (
            <li key={texto} className={`${styles.cartao} lp-lift lp-reveal`}>
              <span className={styles.icone}>
                <Icone aria-hidden="true" size={34} strokeWidth={2} />
              </span>
              <p>{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
