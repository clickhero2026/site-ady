import { VideoPlaceholder } from "@/components/media/VideoPlaceholder";
import styles from "./SeeItWorking.module.css";

export function SeeItWorking() {
  return (
    <section id="ver-funcionando" className="section">
      <div className="container">
        <h2 className="section-title">É mais fácil ver do que explicar.</h2>
        <p className={`section-lead ${styles.subtitle}`}>
          Um minuto e meio mostrando o ady montando o mês de conteúdo de uma
          barbearia.
        </p>

        <div className={styles.videoWrap}>
          <VideoPlaceholder
            id="VIDEO-01"
            width={1920}
            height={1080}
            description="Gravação de tela, 60 a 90s, sem locução, legendado, exemplo de barbearia"
          />
        </div>
      </div>
    </section>
  );
}
