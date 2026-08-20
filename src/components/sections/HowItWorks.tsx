import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    n: "1",
    title: "Conectar",
    body: "Você conecta seu Instagram. Leva dois minutos e a gente faz junto com você pelo WhatsApp.",
    img: {
      id: "IMG-04",
      description: "Tela de conexão de conta",
    },
  },
  {
    n: "2",
    title: "Contar o que seu negócio faz",
    body: "Seu nome, o que você vende, quem é seu cliente, sua logo e suas cores. É só uma vez.",
    img: {
      id: "IMG-05",
      description: "Tela de cadastro do negócio: nome, segmento, logo, cores",
    },
  },
  {
    n: "3",
    title: "O ady assume",
    body: "Ele monta o mês inteiro de conteúdo, cria os posts, publica na hora certa e coloca seus anúncios no ar. Você não precisa fazer mais nada.",
    img: {
      id: "IMG-06",
      description: "Calendário de conteúdo montado, mês cheio",
    },
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section">
      <div className="container">
        <h2 className="section-title">Três passos. Depois disso é com ele.</h2>

        <ol className={styles.steps}>
          {steps.map((step) => (
            <li key={step.n} className={styles.step}>
              <MediaPlaceholder
                id={step.img.id}
                width={800}
                height={600}
                description={step.img.description}
              />
              <span className={styles.number} aria-hidden="true">
                {step.n}
              </span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className="body-text">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
