import { MediaPlaceholder } from "@/components/media/MediaPlaceholder";
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

        <div className={styles.compare}>
          <MediaPlaceholder
            id="IMG-02"
            width={800}
            height={600}
            description="Cena do problema: mensagem de WhatsApp sem resposta / fatura, tom cinza e frio"
            tone="cold"
          />
          <MediaPlaceholder
            id="IMG-03"
            width={800}
            height={600}
            description="Mesmo enquadramento com a tela do ady — escura e limpa, contraste com a imagem anterior"
          />
        </div>
      </div>
    </section>
  );
}
