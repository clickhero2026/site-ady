import { CtaButton } from "@/components/cta/CtaButton";
import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="hero" className={`section ${styles.hero}`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <h1 className={styles.title}>
            Seu negócio aparecendo todo dia.
            <br />
            Sem depender de ninguém pra isso.
          </h1>

          <p className={styles.subtitle}>
            O ady cria os posts, publica no seu Instagram e coloca seus
            anúncios no ar. Você toca o negócio. Ele cuida de te mostrar.
          </p>

          <div className={styles.ctaBlock}>
            <CtaButton>Quero o ady no meu negócio</CtaButton>
            <p className={styles.support}>
              A partir de R$ 69 por mês. Sem fidelidade, sem contrato.
            </p>
          </div>
        </div>

        <MediaPlaceholder
          id="IMG-01"
          width={1600}
          height={1000}
          description="Painel do ady em notebook e celular, fundo escuro, leve perspectiva"
          className={styles.media}
        />
      </div>
    </section>
  );
}
