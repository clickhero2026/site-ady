import { CtaButton } from "@/components/cta/CtaButton";
import styles from "./FinalCta.module.css";

export function FinalCta() {
  return (
    <section id="cta-final" className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        <h2 className={styles.title}>
          Seu concorrente aparece todo dia. Você também pode.
        </h2>
        <p className={styles.subtitle}>
          Deixe seus dados e a gente conecta seu ady hoje mesmo.
        </p>
        <CtaButton>Quero o ady no meu negócio</CtaButton>
      </div>
    </section>
  );
}
