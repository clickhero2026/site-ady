import Image from "next/image";
import styles from "./Problem.module.css";

export function Problem() {
  return (
    <section id="problema" className={`section ${styles.problem}`}>
      <div className="container">
        <h2 className="section-title">Você já pagou alguém pra cuidar disso.</h2>

        <div className={styles.body}>
          <p className="body-text">
            E aí veio a fatura no fim do mês. Veio o print de um post que
            você não pediu. Veio &ldquo;esse mês o alcance caiu um
            pouco&rdquo;.
          </p>
          <p className="body-text">
            Você pediu pra trocar uma foto numa segunda. Ela foi trocada na
            quinta.
          </p>
          <p className="body-text">
            No fim do ano você olhou pra trás e não soube dizer o que aquele
            dinheiro fez pelo seu negócio. Não porque a pessoa era ruim.
            Porque você nunca teve como saber.
          </p>
        </div>

        <p className={styles.fecho}>
          O ady não some, não atrasa e não te manda relatório que você
          precisa decifrar. Ele trabalha todo dia e te mostra o que
          aconteceu em português.
        </p>

        {/*
          IMG-03 (contraste lado a lado) removida por enquanto — o layout
          desta seção com uma imagem só vai ser revisado numa próxima etapa.
        */}
        <div className={styles.media}>
          <Image
            src="/images/img-02-vilao.webp"
            alt="Recepção de academia vazia, sem clientes, com a atendente sozinha esperando"
            width={800}
            height={537}
            className={styles.mediaImg}
          />
        </div>
      </div>
    </section>
  );
}
