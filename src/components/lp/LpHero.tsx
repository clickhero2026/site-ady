import { CreditCard, Handshake, Hourglass } from "lucide-react";
import type { LpVariant } from "@/config/teste7d";
import { LP_TITULOS, faixaDoTitulo } from "@/lib/lp-titulos";
import { HeroVisual } from "./HeroVisual";
import styles from "./LpHero.module.css";

/** Hero: selo, título da versão (A–F), subtítulo e o botão que leva ao
 * formulário (#cadastro, mais abaixo) — tudo na primeira dobra; o celular
 * fica à direita no desktop e abaixo do botão no celular. O botão é um
 * link comum: funciona mesmo sem JavaScript. Logo embaixo, a faixa de
 * confiança. */
export function LpHero({ variant }: { variant: LpVariant }) {
  return (
    <>
      <section className={styles.hero} aria-labelledby="lp-titulo" data-titulo={faixaDoTitulo(LP_TITULOS[variant])}>
        <div className={`lp-container ${styles.grid}`}>
          <div className={styles.texto}>
            <p className={styles.selo}>
              <span className={styles.seloPonto} aria-hidden="true" />
              TESTE O ady GRÁTIS
            </p>
            <h1 id="lp-titulo" className={styles.titulo}>
              {LP_TITULOS[variant]}
            </h1>
            <p className={styles.subtitulo}>
              Veja seu WhatsApp bombar de clientes todos os dias sem precisar entender de anúncio na internet, sem
              depender do sobrinho ou de especialistas que cobram caro
            </p>
            <div className={styles.acao}>
              <a id="hero-cta" href="#cadastro" className={`lp-cta ${styles.botao}`}>
                QUERO TESTAR GRÁTIS
              </a>
              <p className={styles.nota}>Sem cartão de crédito. Os 7 dias só começam depois da ativação da sua conta.</p>
            </div>
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
