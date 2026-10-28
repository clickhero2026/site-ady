import Image from "next/image";
import type { ReactNode } from "react";
import { AD_CHANNELS, adChannelsText } from "@/lib/flags";
import styles from "./LpAllInOne.module.css";

/**
 * "Tudo num lugar só": seis cartões com mini-tela e uma frase. Onde há
 * print real do app, usa recorte dele; onde não há (lista de interessados,
 * identidade do negócio, anúncio indo pro WhatsApp), é mockup em HTML —
 * ver pendências da LP. O segundo cartão segue a flag do Google.
 */
export function LpAllInOne() {
  const cartoes: { frase: string; tela: ReactNode }[] = [
    {
      frase: "Posts e vídeos prontos em segundos",
      tela: <Print src="/teste7d/estudio.webp" w={592} h={446} alt="Posts prontos no Estúdio do ady" />,
    },
    {
      frase: `Anúncios ${adChannelsText()}, com o cliente chamando no seu WhatsApp`,
      tela: <MockAnuncio />,
    },
    {
      frase: "Todo mundo que se interessou, num lugar só: novo, negociando ou vendido",
      tela: <MockClientes />,
    },
    {
      frase: "Posts agendados num calendário só",
      tela: <Print src="/teste7d/calendario.webp" w={1028} h={569} alt="Calendário do ady com os posts do mês" />,
    },
    {
      frase: "Veja quanto você gastou e quantos clientes chegaram, num gráfico simples",
      tela: <Print src="/teste7d/painel.webp" w={990} h={196} alt="Painel do ady com clientes alcançados e quanto foi investido" />,
    },
    {
      frase: "Tudo com a cara do seu negócio: logo, cores e jeito de falar",
      tela: <MockMarca />,
    },
  ];

  return (
    <section className="lp-section lp-section--dark" aria-labelledby="lp-tudo">
      <div className="lp-container">
        <h2 id="lp-tudo" className="lp-h2 lp-h2--center lp-spark">
          Tudo num lugar só.
        </h2>
        <ul className={styles.grade}>
          {cartoes.map(({ frase, tela }) => (
            <li key={frase} className={`${styles.cartao} lp-lift lp-reveal`}>
              <div className={styles.tela}>{tela}</div>
              <p className={styles.frase}>{frase}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Print({ src, w, h, alt }: { src: string; w: number; h: number; alt: string }) {
  return (
    <Image
      src={src}
      width={w}
      height={h}
      alt={alt}
      sizes="(min-width: 64rem) 360px, (min-width: 40rem) 45vw, 90vw"
      className={styles.print}
    />
  );
}

function MockAnuncio() {
  return (
    <div className={styles.mock} aria-hidden="true">
      <div className={styles.mockCanais}>
        {AD_CHANNELS.map((canal) => (
          <span key={canal} className={styles.chip}>
            {canal}
          </span>
        ))}
      </div>
      <div className={styles.mockSeta}>↓</div>
      <div className={styles.mockBalao}>Oi, vi o post de vocês, quanto custa?</div>
    </div>
  );
}

function MockClientes() {
  const colunas = [
    { nome: "Novo", itens: 3 },
    { nome: "Negociando", itens: 2 },
    { nome: "Vendido", itens: 2 },
  ];
  return (
    <div className={`${styles.mock} ${styles.mockQuadro}`} aria-hidden="true">
      {colunas.map(({ nome, itens }) => (
        <div key={nome} className={styles.coluna}>
          <span className={styles.colunaNome}>{nome}</span>
          {Array.from({ length: itens }, (_, i) => (
            <span key={i} className={styles.ficha}>
              <span className={styles.fichaAvatar} />
              <span className={styles.fichaLinha} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function MockMarca() {
  return (
    <div className={`${styles.mock} ${styles.mockMarca}`} aria-hidden="true">
      <span className={styles.marcaLogo}>Sua logo</span>
      <div className={styles.marcaCores}>
        <span style={{ background: "#17708a" }} />
        <span style={{ background: "#0c0d0a" }} />
        <span style={{ background: "#f4c25b" }} />
        <span style={{ background: "#f4f9fb" }} />
      </div>
      <span className={styles.marcaTom}>Jeito de falar: próximo e direto</span>
    </div>
  );
}
