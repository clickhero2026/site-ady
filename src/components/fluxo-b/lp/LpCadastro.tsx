import type { LpVariant } from "@/config/teste7d";
import { FocoAoChegar } from "./FocoAoChegar";
import { InscricaoForm } from "./InscricaoForm";
import styles from "./LpCadastro.module.css";

/** Bloco do formulário (#cadastro), logo depois de "O que o ady faz".
 * Todos os botões de CTA da página apontam pra cá. Desktop em duas
 * colunas (texto | cartão do formulário); celular em uma. */
export function LpCadastro({ variant }: { variant: LpVariant }) {
  return (
    <section id="cadastro" className={`lp-section lp-section--alt ${styles.cadastro}`} aria-labelledby="cadastro-titulo">
      <div className={`lp-container ${styles.grid}`}>
        <div className={styles.texto}>
          <h2 id="cadastro-titulo" tabIndex={-1} className={`lp-h2 lp-spark ${styles.titulo}`}>
            Comece agora o seu teste grátis
          </h2>
          <p className={styles.apoio}>
            Preencha abaixo. Depois a gente pergunta um pouco sobre o seu negócio e você escolhe o melhor horário.
          </p>
        </div>

        {/* id="inscricao": a âncora antiga continua chegando ao formulário. */}
        <div id="inscricao" className={styles.cartao}>
          <InscricaoForm variant={variant} />
        </div>
      </div>
      <FocoAoChegar alvo="cadastro" titulo="cadastro-titulo" />
    </section>
  );
}
