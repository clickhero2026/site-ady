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
          WORKSHOP EXCLUSIVO PARA MEMBROS BNI · GRÁTIS · {WORKSHOP.vagas} VAGAS
        </p>

        <h1 className={styles.title}>{WORKSHOP.nome}</h1>

        <p className={styles.subtitle}>
          Uma hora ao vivo mostrando como atrair mais clientes todo dia
          pro seu negócio através da internet — com uma ferramenta que
          custa muito menos do que contratar uma agência, e sem precisar
          aprender nada técnico.
        </p>

        <ul className={styles.facts}>
          <li>➜ {workshopDataHorario}</li>
          <li>➜ {WORKSHOP.duracaoLabel}</li>
          <li>➜ Ao vivo, pelo Zoom</li>
          <li>➜ Grátis, exclusivo para membros BNI</li>
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
