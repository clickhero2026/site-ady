import Image from "next/image";
import { WORKSHOP, workshopDataHorario } from "@/config/workshop";
import { CtaLink } from "./CtaLink";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    // on-dark: IMG-W01 (traço de luz sobre preto) só funciona em fundo
    // escuro — a seção mantém fundo escuro fixo mesmo com o tema claro
    // ativo (briefing do toggle, seção 3, opção 1).
    <section id="hero-workshop" className={`${styles.hero} on-dark`}>
      <div className={styles.bg} aria-hidden="true">
        <Image
          src="/images/img-w01-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.bgImage}
        />
        <span className={styles.bgScrim} />
      </div>

      <div className={`container ${styles.inner}`}>
        <p className={styles.eyebrow}>
          WORKSHOP AO VIVO · GRÁTIS · {WORKSHOP.vagas} VAGAS
        </p>

        <h1 className={styles.title}>{WORKSHOP.nome}</h1>

        <p className={styles.subtitle}>
          Ao vivo, mostrando como atrair mais clientes todo dia pro seu
          negócio através da internet — com uma ferramenta que custa muito
          menos do que contratar uma agência, e sem precisar aprender nada
          técnico.
        </p>

        <ul className={styles.facts}>
          <li>➜ {workshopDataHorario}</li>
          <li>➜ Ao vivo, pelo Google Meet</li>
          <li>➜ Grátis</li>
        </ul>

        <CtaLink>Garantir minha vaga</CtaLink>

        <p className={styles.support}>
          São {WORKSHOP.vagas} vagas por turma, gratuitas, e não fica
          gravado. Quem não está ao vivo, perde.
        </p>
      </div>
    </section>
  );
}
