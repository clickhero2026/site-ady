import styles from "./CtaBlock.module.css";

/** CTA repetido no meio da página: leva de volta ao formulário do hero. */
export function CtaBlock({ texto = "QUERO TESTAR GRÁTIS POR 7 DIAS" }: { texto?: string }) {
  return (
    <div className={styles.bloco}>
      <a href="#inscricao" className="lp-cta">
        {texto}
      </a>
      <p className="lp-cta-note">Sem cartão de crédito. Os 7 dias só começam depois da conversa.</p>
    </div>
  );
}
