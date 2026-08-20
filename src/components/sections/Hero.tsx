import { CtaButton } from "@/components/cta/CtaButton";
import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="hero" className={`section ${styles.hero}`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <h1 className={styles.title}>
            Seja Visto Todos os Dias pelos Seus Clientes Sem Depender de
            Agências
          </h1>

          <p className={styles.subtitle}>
            Mesmo que Você não Entenda de Anúncios, o ady cria os posts,
            publica no seu Instagram e coloca seus anúncios no ar
            automaticamente. Você toca o negócio. Ele cuida do marketing.
          </p>

          <div className={styles.ctaBlock}>
            <CtaButton className={styles.ctaUppercase}>
              Quero testar o ady no meu negócio
            </CtaButton>
            <p className={styles.support}>
              A partir de R$ 69 por mês. Sem fidelidade, sem contrato.
            </p>
          </div>
        </div>

        <MediaPlaceholder
          id="IMG-01"
          width={1600}
          height={1000}
          description="Celular com notificação do WhatsApp de um cliente novo chamando depois de ver um post no Instagram, fundo escuro, leve perspectiva"
          className={styles.media}
        />
      </div>
    </section>
  );
}
