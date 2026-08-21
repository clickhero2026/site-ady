import { WORKSHOP, workshopDataHorario } from "@/config/workshop";
import { CtaLink } from "./CtaLink";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="hero-workshop" className={styles.hero}>
      <div className={styles.bg} aria-hidden="true">
        <span className={styles.bgPattern} />
        <span className={styles.bgLabel}>IMG-W01 2400×1200</span>
      </div>

      <div className={`container ${styles.inner}`}>
        <p className={styles.eyebrow}>
          WORKSHOP AO VIVO · {WORKSHOP.vagas} VAGAS
        </p>

        <h1 className={styles.title}>{WORKSHOP.nome}</h1>

        <p className={styles.subtitle}>
          Uma hora ao vivo mostrando como um negócio local pode aparecer
          todo dia no Instagram e trazer cliente novo — sem contratar
          ninguém e sem precisar aprender nada técnico.
        </p>

        <ul className={styles.facts}>
          <li>➜ {workshopDataHorario}</li>
          <li>➜ {WORKSHOP.duracaoLabel}</li>
          <li>➜ Ao vivo, pelo Zoom</li>
          <li>➜ Sem gravação</li>
        </ul>

        <CtaLink>Garantir minha vaga</CtaLink>

        <p className={styles.support}>
          São {WORKSHOP.vagas} vagas por turma e não fica gravado. Quem não
          está ao vivo, perde.
        </p>
      </div>
    </section>
  );
}
