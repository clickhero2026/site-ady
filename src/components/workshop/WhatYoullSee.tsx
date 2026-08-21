import { WORKSHOP } from "@/config/workshop";
import styles from "./WhatYoullSee.module.css";

const BLOCKS = [
  {
    n: "01",
    title: "Por que o Instagram do seu negócio não traz cliente",
    body: "As três coisas que quase todo negócio local faz errado, e por que nenhuma delas tem a ver com você não ser bom em marketing.",
  },
  {
    n: "02",
    title: "A conta real de ter alguém cuidando disso",
    body: "O que uma pessoa contratada de fato faz por mês, quanto isso custa e por que essa conta raramente fecha pra um negócio local.",
  },
  {
    n: "03",
    title: "Uma demonstração do zero, na tela",
    body: "O Rafael vai montar ao vivo o mês inteiro de conteúdo de uma barbearia: conectar a conta, criar os posts, colocar um anúncio no ar e mostrar o resultado. Do começo ao fim, sem corte.",
  },
  {
    n: "04",
    title: "Suas perguntas",
    body: "Os últimos minutos são seus. Pergunte o que quiser, inclusive o que a gente ainda não resolveu.",
  },
];

export function WhatYoullSee() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">
          O que a gente vai fazer nesses {WORKSHOP.duracaoLabel}
        </h2>

        <ol className={styles.blocks}>
          {BLOCKS.map((block) => (
            <li key={block.n} className={styles.block}>
              <span className={styles.number} aria-hidden="true">
                {block.n}
              </span>
              <h3 className={styles.blockTitle}>{block.title}</h3>
              <p className="body-text">{block.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
