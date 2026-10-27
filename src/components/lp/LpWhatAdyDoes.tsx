import Image from "next/image";
import { AD_CHANNELS, adChannelsText } from "@/lib/flags";
import { CtaBlock } from "./CtaBlock";
import styles from "./LpWhatAdyDoes.module.css";

/**
 * "O que o ady faz": três blocos com uma tela do app ao lado, alternando
 * lados. Sem número e sem "passo" (pedido do prompt). O terceiro bloco
 * cita o Google só se `NEXT_PUBLIC_GOOGLE_ADS_LIVE` estiver ligada (via
 * lib/flags.ts) — texto e mockup.
 */
export function LpWhatAdyDoes() {
  return (
    <section className="lp-section" aria-labelledby="lp-o-que-faz">
      <div className="lp-container">
        <h2 id="lp-o-que-faz" className="lp-h2 lp-h2--center lp-spark">
          O ady é uma agência de marketing de bolso.
        </h2>

        <div className={styles.blocos}>
          <article className={`${styles.bloco} lp-reveal`}>
            <div className={styles.texto}>
              <h3 className="lp-h3">Cria os posts do seu negócio</h3>
              <p>Texto e imagem prontos, com a cara da sua marca.</p>
            </div>
            <div className={`lp-shot ${styles.midia}`}>
              <Image
                src="/images/img-013.webp"
                width={1000}
                height={803}
                sizes="(min-width: 64rem) 560px, 100vw"
                alt="Tela do ady criando um post: a imagem pronta ao lado da legenda e da data de publicação"
              />
            </div>
          </article>

          <article className={`${styles.bloco} ${styles.invertido} lp-reveal`}>
            <div className={styles.texto}>
              <h3 className="lp-h3">Publica no seu Instagram</h3>
              <p>No dia e no horário certos. Se quiser, você vê cada post antes de ir ao ar.</p>
            </div>
            <div className={`${styles.midia} ${styles.midiaRetrato}`}>
              <div className="lp-shot">
                <Image
                  src="/images/img-10.webp"
                  width={700}
                  height={1514}
                  sizes="(min-width: 64rem) 280px, 60vw"
                  alt="Perfil de um negócio no Instagram, no celular, com os posts publicados pelo ady"
                />
              </div>
            </div>
          </article>

          <article className={`${styles.bloco} lp-reveal`}>
            <div className={styles.texto}>
              <h3 className="lp-h3">Monta os anúncios que levam o cliente para o seu WhatsApp</h3>
              <p>{`${capitalize(adChannelsText())}. Você escolhe a cidade e pausa quando quiser.`}</p>
            </div>
            <div className={styles.midia}>
              <div className="lp-shot">
                <Image
                  src="/teste7d/estudio.webp"
                  width={592}
                  height={446}
                  sizes="(min-width: 64rem) 560px, 100vw"
                  alt="Tela do ady com anúncios prontos e aprovados para um negócio"
                />
              </div>
              <div className={styles.canais} aria-hidden="true">
                {AD_CHANNELS.map((canal) => (
                  <span key={canal} className={styles.canal}>
                    {canal}
                  </span>
                ))}
                <span className={styles.seta}>→</span>
                <span className={`${styles.canal} ${styles.canalWhats}`}>WhatsApp</span>
              </div>
            </div>
          </article>
        </div>

        <CtaBlock />
      </div>
    </section>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
