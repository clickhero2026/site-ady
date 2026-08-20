import Image from "next/image";
import { CtaButton } from "@/components/cta/CtaButton";
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

        <div className={styles.media}>
          <Image
            src="/images/hero/img-01-hero.webp"
            alt="Dono de negócio recebendo, no WhatsApp, a mensagem de uma cliente nova depois de ver uma publicação feita pelo ady no Instagram"
            width={1600}
            height={996}
            priority
            sizes="(min-width: 64rem) 50vw, 100vw"
            className={styles.mediaImg}
          />
        </div>
      </div>
    </section>
  );
}
