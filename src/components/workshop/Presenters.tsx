import Image from "next/image";
import { WORKSHOP } from "@/config/workshop";
import styles from "./Presenters.module.css";

export function Presenters() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Quem apresenta</h2>

        <div className={styles.cards}>
          <article className={styles.card}>
            <Image
              src="/images/img-w02-jean.webp"
              alt="Foto de Jean Dentz, sócio da Click Hero"
              width={800}
              height={795}
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
            <Image
              src="/images/img-w03-rafael.webp"
              alt="Foto de Rafael Cruz, fundador da Click Hero"
              width={800}
              height={781}
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
