import styles from "./CtaBlock.module.css";

/** CTA repetido no meio da página: leva ao bloco do formulário (#cadastro). */
export function CtaBlock({ texto = "QUERO TESTAR GRÁTIS" }: { texto?: string }) {
  return (
    <div className={styles.bloco}>
      <a href="#cadastro" className="lp-cta">
        {texto}
      </a>
      <p className="lp-cta-note">Sem cartão de crédito. Os 7 dias só começam depois da ativação da sua conta.</p>
    </div>
  );
}
