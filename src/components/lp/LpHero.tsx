import { CreditCard, Handshake, Hourglass } from "lucide-react";
import type { LpVariant } from "@/config/teste7d";
import { LP_TITULOS, faixaDoTitulo } from "@/lib/lp-titulos";
import { HeroVisual } from "./HeroVisual";
import { InscricaoForm } from "./InscricaoForm";
import styles from "./LpHero.module.css";

/** Hero: selo, título da versão (A–F), subtítulo e o formulário — tudo
 * na primeira dobra; a composição visual fica à direita. No celular a
 * ordem é selo, título, formulário, subtítulo e a composição, pra o
 * formulário inteiro caber na primeira tela. Logo embaixo, a faixa de
 * confiança. */
export function LpHero({ variant }: { variant: LpVariant }) {
  return (
    <>
      <section className={styles.hero} aria-labelledby="lp-titulo" data-titulo={faixaDoTitulo(LP_TITULOS[variant])}>
        <div className={`lp-container ${styles.grid}`}>
          <div className={styles.texto}>
            <p className={styles.selo}>
              <span className={styles.seloPonto} aria-hidden="true" />
              TESTE GRÁTIS POR 7 DIAS, SEM CARTÃO DE CRÉDITO
            </p>
            <h1 id="lp-titulo" className={styles.titulo}>
              {LP_TITULOS[variant]}
            </h1>
            <div id="inscricao" className={styles.formCard}>
              <InscricaoForm variant={variant} />
            </div>

            {/* Depois do formulário no HTML (ordem do celular); no desktop o
                CSS sobe o subtítulo pra cima do formulário. */}
            <p className={styles.subtitulo}>
              Vagas limitadas. A gente configura o ady com você numa conversa rápida e os 7 dias começam ali.
            </p>
          </div>

          <div className={styles.visual}>
            <HeroVisual />
          </div>
        </div>
      </section>

      <div className={styles.confianca}>
        <ul className={`lp-container ${styles.confiancaLista}`}>
          <li>
            <CreditCard aria-hidden="true" size={26} strokeWidth={2} />
            Sem cartão de crédito
          </li>
          <li>
            <Handshake aria-hidden="true" size={26} strokeWidth={2} />
            Configurado junto com você
          </li>
          <li>
            <Hourglass aria-hidden="true" size={26} strokeWidth={2} />
            Vagas limitadas
          </li>
        </ul>
      </div>
    </>
  );
}
