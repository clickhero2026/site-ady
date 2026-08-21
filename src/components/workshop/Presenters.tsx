import { WORKSHOP } from "@/config/workshop";
import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
import styles from "./Presenters.module.css";

export function Presenters() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Quem apresenta</h2>

        <div className={styles.cards}>
          <article className={styles.card}>
            <MediaPlaceholder
              id="IMG-W02"
              width={800}
              height={800}
              description="Foto do Jean, enquadramento peito acima, fundo neutro escuro"
              tone="portrait"
              className={styles.photo}
            />
            <h3 className={styles.name}>
              {WORKSHOP.apresentadores.jean.nomeCompleto}
            </h3>
            <p className={styles.role}>{WORKSHOP.apresentadores.jean.cargo}</p>
            <p className="body-text">
              Passa o dia conversando com dono de negócio. Conduz o
              workshop e vai fazer, na hora da demonstração, as perguntas
              que você faria.
            </p>
          </article>

          <article className={styles.card}>
            <MediaPlaceholder
              id="IMG-W03"
              width={800}
              height={800}
              description="Foto do Rafael, mesmo tratamento do IMG-W02"
              tone="portrait"
              className={styles.photo}
            />
            <h3 className={styles.name}>
              {WORKSHOP.apresentadores.rafael.nomeCompleto}
            </h3>
            <p className={styles.role}>
              {WORKSHOP.apresentadores.rafael.cargo}
            </p>
            <p className="body-text">
              Operou marketing pra dezenas de negócios locais durante anos,
              viu por dentro por que o modelo não funciona pro pequeno, e
              construiu o ady pra resolver isso. É ele quem vai mostrar a
              tela.
            </p>
          </article>
        </div>
      </div>

    </section>
  );
}
