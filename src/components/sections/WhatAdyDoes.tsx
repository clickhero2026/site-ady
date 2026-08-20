import Image from "next/image";
import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
import styles from "./WhatAdyDoes.module.css";

type BlockMedia =
  | { type: "placeholder"; id: string; description: string }
  | { type: "image"; src: string; width: number; height: number; alt: string };

const blocks: { title: string; body: string; media: BlockMedia }[] = [
  {
    title: "Escreve seus posts",
    body: "Ele sabe o que seu negócio vende e escreve na sua voz. Nada de texto genérico que serve pra qualquer um.",
    media: {
      type: "placeholder",
      id: "IMG-07",
      description: "Texto de post gerado pela IA",
    },
  },
  {
    title: "Cria as imagens",
    body: "Com a sua logo, as suas cores e a sua cara. Sem designer, sem banco de imagem, sem Canva às onze da noite.",
    media: {
      type: "image",
      src: "/images/img-08.webp",
      width: 1296,
      height: 646,
      alt: "Tela do ady mostrando a criação de um anúncio, com a prévia do criativo e o botão para publicar direto no Meta",
    },
  },
  {
    title: "Monta Todos os Posts do Mês no Instagram pra Você",
    body: "Ele planeja o calendário completo de conteúdo. Você abre e já está tudo lá, pronto.",
    media: {
      type: "image",
      src: "/images/img-09.webp",
      width: 1301,
      height: 569,
      alt: "Tela do calendário do ady mostrando o mês inteiro de conteúdo já planejado, com os posts organizados por dia",
    },
  },
  {
    title: "Publica sozinho",
    body: "No dia certo, no horário certo, no seu Instagram. Você não precisa lembrar de nada.",
    media: {
      type: "placeholder",
      id: "IMG-10",
      description: "Agendamento e publicação no Instagram",
    },
  },
  {
    title: "Coloca seus anúncios no ar",
    body: "Ele cria o anúncio, escolhe quem vai ver e acompanha se está dando gente. Se não estiver, ele mexe.",
    media: {
      type: "placeholder",
      id: "IMG-11",
      description: "Criação de anúncio",
    },
  },
  {
    title: "Te mostra o que deu certo",
    body: "Quanta gente viu, quanta gente chamou, quanto custou cada cliente novo. Em números que fazem sentido.",
    media: {
      type: "placeholder",
      id: "IMG-12",
      description: "Painel de resultados com números",
    },
  },
];

export function WhatAdyDoes() {
  return (
    <section id="o-que-o-ady-faz" className="section">
      <div className="container">
        <h2 className="section-title">
          O que ele faz enquanto você atende seu cliente.
        </h2>

        <div className={styles.blocks}>
          {blocks.map((block, i) => (
            <div
              key={block.title}
              className={styles.block}
              data-reverse={i % 2 === 1 ? "" : undefined}
            >
              {block.media.type === "image" ? (
                <div className={styles.media}>
                  <Image
                    src={block.media.src}
                    alt={block.media.alt}
                    width={block.media.width}
                    height={block.media.height}
                    className={styles.mediaImg}
                  />
                </div>
              ) : (
                <MediaPlaceholder
                  id={block.media.id}
                  width={1000}
                  height={750}
                  description={block.media.description}
                />
              )}
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
