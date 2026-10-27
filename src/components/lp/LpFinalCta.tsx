import styles from "./LpFinalCta.module.css";

/** Faixa final: botão que volta ao formulário do hero + P.S. */
export function LpFinalCta() {
  return (
    <section className={`lp-section lp-section--dark ${styles.faixa}`} aria-labelledby="lp-final">
      <div className={`lp-container ${styles.inner}`}>
        <h2 id="lp-final" className="lp-h2 lp-h2--center">
          TESTE GRÁTIS POR 7 DIAS, SEM CARTÃO DE CRÉDITO
        </h2>
        <a href="#inscricao" className={`lp-cta ${styles.botao}`}>
          QUERO TESTAR GRÁTIS POR 7 DIAS
        </a>
        <p className="lp-cta-note">Sem cartão de crédito. Os 7 dias só começam depois da conversa.</p>
        <p className={styles.ps}>
          P.S. As vagas do teste são limitadas. Se o seu negócio precisa aparecer, não deixe para a semana que vem.
        </p>
      </div>
    </section>
  );
}
