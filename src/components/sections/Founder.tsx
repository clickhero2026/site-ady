import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
import styles from "./Founder.module.css";

export function Founder() {
  return (
    <section id="quem-esta-por-tras" className="section">
      <div className={`container ${styles.grid}`}>
        <MediaPlaceholder
          id="IMG-13"
          width={900}
          height={1100}
          description="Foto real do Rafael, ambiente escuro, olhando pra câmera"
          tone="portrait"
          className={styles.media}
        />

        <div className={styles.copy}>
          <h2 className="section-title">Eu passei anos do outro lado.</h2>

          <div className={styles.body}>
            <p className="body-text">
              Sou o Rafael, fundador da Click Hero. Durante anos eu operei
              marketing pra dezenas de negócios como o seu, e vi de perto
              por que esse modelo não funciona pro pequeno: custa caro
              demais pra ser justo com quem está começando, e depende de
              gente demais pra ser constante.
            </p>
            <p className="body-text">
              Não dava pra consertar isso contratando mais pessoas. Então a
              gente construiu o ady.
            </p>
            <p className="body-text">
              Ele não é um assistente que te dá dicas. É quem faz. E custa
              uma fração do que você pagaria pra alguém fazer pior.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
