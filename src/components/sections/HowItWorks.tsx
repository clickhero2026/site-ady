import Image from "next/image";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    n: "1",
    title: "Conectar",
    body: "Você conecta seu Instagram. Leva dois minutos e a gente faz junto com você pelo WhatsApp.",
    img: {
      src: "/images/img-04.webp",
      width: 800,
      height: 600,
      alt: "Tela de integrações do ady mostrando a conta do Meta conectada e ativa",
    },
  },
  {
    n: "2",
    title: "Contar o que seu negócio faz",
    body: "Seu nome, o que você vende, quem é seu cliente, sua logo e suas cores. É só uma vez.",
    img: {
      src: "/images/img-05.webp",
      width: 800,
      height: 525,
      alt: "Tela do ady pedindo o objetivo da campanha, o nicho do negócio e o produto principal para configurar as metas",
    },
  },
  {
    n: "3",
    title: "O ady assume",
    body: "Ele monta o mês inteiro de conteúdo, cria os posts, publica na hora certa e coloca seus anúncios no ar. Você não precisa fazer mais nada.",
    img: {
      src: "/images/img-06.webp",
      width: 800,
      height: 446,
      alt: "Tela do Estúdio do ady mostrando vários anúncios já criados e aprovados, prontos para uso",
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
              <div className="screenshot-frame">
                <Image
                  src={step.img.src}
                  alt={step.img.alt}
                  width={step.img.width}
                  height={step.img.height}
                />
              </div>
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
