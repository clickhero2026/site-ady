import Image from "next/image";
import styles from "./PlatformPreview.module.css";

/**
 * Reforço de credibilidade logo depois de "O que a gente vai fazer no
 * workshop": a mesma screenshot real do produto usada na home
 * (WhatAdyDoes, img-09 — calendário do mês inteiro de conteúdo já
 * planejado), pra deixar claro que a demonstração ao vivo é sobre uma
 * tela que já existe, não uma promessa.
 */
export function PlatformPreview() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">É essa a tela, de verdade</h2>
        <p className="section-lead">
          Nada de mockup. É essa a tela do ady que o Rafael vai usar ao
          vivo pra montar o mês inteiro de conteúdo na sua frente.
        </p>

        <div className={styles.frame}>
          <Image
            src="/images/img-09.webp"
            alt="Tela do calendário do ady mostrando o mês inteiro de conteúdo já planejado, com os posts organizados por dia"
            width={1301}
            height={569}
            className={styles.img}
          />
        </div>
      </div>
    </section>
  );
}
