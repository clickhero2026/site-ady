import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
import styles from "./WhatAdyDoes.module.css";

const blocks = [
  {
    title: "Escreve seus posts",
    body: "Ele sabe o que seu negócio vende e escreve na sua voz. Nada de texto genérico que serve pra qualquer um.",
    img: { id: "IMG-07", description: "Texto de post gerado pela IA" },
  },
  {
    title: "Cria as imagens",
    body: "Com a sua logo, as suas cores e a sua cara. Sem designer, sem banco de imagem, sem Canva às onze da noite.",
    img: {
      id: "IMG-08",
      description: "Imagem gerada com a identidade do cliente aplicada",
    },
  },
  {
    title: "Monta o mês inteiro",
    body: "Ele planeja o calendário completo de conteúdo. Você abre e já está tudo lá, pronto.",
    img: { id: "IMG-09", description: "Planejador mensal" },
  },
  {
    title: "Publica sozinho",
    body: "No dia certo, no horário certo, no seu Instagram. Você não precisa lembrar de nada.",
    img: {
      id: "IMG-10",
      description: "Agendamento e publicação no Instagram",
    },
  },
  {
    title: "Coloca seus anúncios no ar",
    body: "Ele cria o anúncio, escolhe quem vai ver e acompanha se está dando gente. Se não estiver, ele mexe.",
    img: { id: "IMG-11", description: "Criação de anúncio" },
  },
  {
    title: "Te mostra o que deu certo",
    body: "Quanta gente viu, quanta gente chamou, quanto custou cada cliente novo. Em números que fazem sentido.",
    img: { id: "IMG-12", description: "Painel de resultados com números" },
  },
];

export function WhatAdyDoes() {
  return (
    <section id="o-que-o-ady-faz" className="section">
      <div className="container">
        <h2 className="section-title">O que ele faz enquanto você atende.</h2>

        <div className={styles.blocks}>
          {blocks.map((block, i) => (
            <div
              key={block.title}
              className={styles.block}
              data-reverse={i % 2 === 1 ? "" : undefined}
            >
              <MediaPlaceholder
                id={block.img.id}
                width={1000}
                height={750}
                description={block.img.description}
              />
              <div className={styles.blockCopy}>
                <h3 className={styles.blockTitle}>{block.title}</h3>
                <p className="body-text">{block.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
