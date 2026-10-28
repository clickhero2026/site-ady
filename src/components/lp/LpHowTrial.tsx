import { CalendarCheck, Settings2, Sparkles } from "lucide-react";
import { CtaBlock } from "./CtaBlock";
import styles from "./LpHowTrial.module.css";

const ETAPAS = [
  { Icone: CalendarCheck, texto: "Você marca uma conversa rápida com a gente" },
  { Icone: Settings2, texto: "A gente configura o ady com você, ao vivo" },
  { Icone: Sparkles, texto: "Por 7 dias, o ady cria e publica os posts do seu negócio" },
];

export function LpHowTrial() {
  return (
    <section className="lp-section" aria-labelledby="lp-como">
      <div className="lp-container">
        <h2 id="lp-como" className="lp-h2 lp-h2--center lp-spark">
          Como funciona o teste
        </h2>
        <ol className={styles.grade}>
          {ETAPAS.map(({ Icone, texto }, i) => (
            <li key={texto} className={`${styles.cartao} lp-reveal`}>
              <span className={styles.numero} aria-hidden="true">
                {i + 1}
              </span>
              <Icone aria-hidden="true" size={36} strokeWidth={2} className={styles.icone} />
              <p>{texto}</p>
            </li>
          ))}
        </ol>
        <p className={styles.nota}>Os 7 dias só começam depois da ativação da sua conta, que a gente faz junto com você na conversa.</p>
        <CtaBlock />
      </div>
    </section>
  );
}
