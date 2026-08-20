import Image from "next/image";
import styles from "./Problem.module.css";

export function Problem() {
  return (
    <section id="problema" className={`section ${styles.problem}`}>
      <div className="container">
        <h2 className="section-title">Você já pagou alguém pra cuidar disso.</h2>

        <div className={styles.body}>
          <p className="body-text">
            Todo mês você pagava ele, mas os clientes que você queria nunca
            chegavam.
          </p>
          <p className="body-text">
            De vez em quando você via um post que você não pediu.
          </p>
          <p className="body-text">
            Ou então ouvia &ldquo;esse mês o Instagram não estava
            bom&rdquo;.
          </p>
          <p className="body-text">
            Você pediu pra trocar uma foto numa segunda. Ela foi trocada na
            sexta.
          </p>
          <p className="body-text">
            No fim do ano você olhou pra trás e não soube dizer o que
            aquele dinheiro gasto fez pelo seu negócio.
          </p>
        </div>

        <div className={styles.media}>
          <Image
            src="/images/img-02-vilao.webp"
            alt="Recepção de academia vazia, sem clientes, com a atendente sozinha esperando"
            width={800}
            height={537}
            className={styles.mediaImg}
          />
        </div>

        <p className={styles.fecho}>
          O ady não some, não atrasa, não publica post ou anúncio que você
          não concorda e não torna esse processo de buscar cliente na
          internet um bicho de 7 cabeças. Ele trabalha todo dia pra você e
          te mostra tudo de forma clara e didática pra você entender.
        </p>
      </div>
    </section>
  );
}
