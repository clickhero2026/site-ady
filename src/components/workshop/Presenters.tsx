import Image from "next/image";
import { WORKSHOP } from "@/config/workshop";
import styles from "./Presenters.module.css";

/**
 * Apresentador único (a seção já teve dois cards lado a lado). Em vez de
 * manter uma grid de duas colunas com uma vazia, usa o mesmo arranjo
 * foto + texto da seção do fundador na home (`sections/Founder`).
 */
export function Presenters() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Quem apresenta</h2>

        <article className={styles.card}>
          <div className={styles.media}>
            <Image
              src="/images/img-w03-rafael.webp"
              alt="Foto de Rafael Cruz, fundador da Click Hero"
              width={800}
              height={781}
              className={styles.photo}
            />
          </div>

          <div className={styles.copy}>
            <h3 className={styles.name}>
              {WORKSHOP.apresentadores.rafael.nomeCompleto}
            </h3>
            <p className={styles.role}>
              {WORKSHOP.apresentadores.rafael.cargo}
            </p>
            <p className="body-text">
              Operou marketing pra dezenas de negócios locais durante anos,
              viu por dentro por que o modelo não funciona pro pequeno, e
              construiu o ady pra resolver isso.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
