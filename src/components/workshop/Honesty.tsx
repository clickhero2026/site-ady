import styles from "./Honesty.module.css";

/**
 * Seção obrigatória do briefing — não remover, não suavizar. Existe
 * porque o ady ainda não tem case nem prova social; dizer isso na frente
 * vira credibilidade em vez de desconfiança.
 */
export function Honesty() {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.box}>
          <h2 className={styles.title}>Uma coisa que a gente prefere dizer antes</h2>

          <p className="body-text">
            O ady é novo. Está funcionando, mas ainda não tem centenas de
            clientes nem depoimento em vídeo pra te mostrar.
          </p>
          <p className="body-text">
            Essas primeiras turmas são as primeiras pessoas a usar. É
            exatamente por isso que quem entra agora entra em condição
            diferente de quem vai entrar daqui a seis meses — e é por isso
            que a gente prefere fazer isso ao vivo, respondendo pergunta,
            em vez de mandar um vídeo pronto.
          </p>
        </div>
      </div>
    </section>
  );
}
