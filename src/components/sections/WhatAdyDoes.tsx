import Image from "next/image";
import styles from "./WhatAdyDoes.module.css";

interface BlockMedia {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Captura de app mobile: moldura estreita e centralizada em vez da
   * largura cheia da coluna (ver `.screenshot-frame.is-portrait`). */
  portrait?: boolean;
}

const blocks: { title: string; body: string; media: BlockMedia }[] = [
  {
    title: "Escreve seus posts",
    body: "Ele sabe o que seu negócio vende e escreve na sua voz. Nada de texto genérico que serve pra qualquer um.",
    media: {
      src: "/images/img-013.webp",
      width: 1000,
      height: 803,
      alt: "Tela de criação de post do ady mostrando a legenda gerada e a imagem pronta para publicação no Instagram",
    },
  },
  {
    title: "Cria as imagens",
    body: "Com a sua logo, as suas cores e a sua cara. Sem designer, sem banco de imagem, sem Canva às onze da noite.",
    media: {
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
      src: "/images/img-10.webp",
      width: 700,
      height: 1514,
      alt: "Tela do Instagram no celular mostrando o perfil com os posts publicados automaticamente pelo ady",
      portrait: true,
    },
  },
  {
    title: "Coloca seus anúncios no ar",
    body: "Ele cria o anúncio, escolhe quem vai ver e acompanha se está dando gente. Se não estiver, ele mexe.",
    media: {
      src: "/images/img-11.webp",
      width: 1000,
      height: 536,
      alt: "Tela de campanhas do ady mostrando anúncios ativos e pausados, com investimento e ações de ativar ou pausar",
    },
  },
  {
    title: "Te mostra o que deu certo",
    body: "Quanta gente viu, quanta gente chamou, quanto custou cada cliente novo. Em números que fazem sentido.",
    media: {
      src: "/images/img-12.webp",
      width: 1400,
      height: 781,
      alt: "Painel do ady mostrando clientes alcançados, investimento total, custo por cliente e gráfico de desempenho da semana",
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
              <div
                className={[
                  "screenshot-frame",
                  block.media.portrait ? "is-portrait" : null,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Image
                  src={block.media.src}
                  alt={block.media.alt}
                  width={block.media.width}
                  height={block.media.height}
                />
              </div>
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
