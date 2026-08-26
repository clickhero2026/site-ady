import Image from "next/image";
import styles from "./PlatformPreview.module.css";

/**
 * Reforço de credibilidade logo depois de "O que a gente vai fazer no
 * workshop": screenshot real do produto (img-w04 — tela "Seu anúncio" do
 * Estúdio Criativo, com um anúncio já gerado pelo ady e os botões de
 * salvar/publicar), pra deixar claro que a demonstração ao vivo é sobre
 * uma tela que já existe, não uma promessa.
 */
export function PlatformPreview() {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.intro}>
          <h2 className={styles.title}>Você vai conhecer o ady</h2>
          <p className={styles.lead}>
            Pela primeira vez vamos apresentar a ferramenta que vai fazer
            seu marketing operar no piloto automático na criação de uma
            máquina de atração de novos clientes todos os dias.
          </p>
        </div>

        <div className={styles.frame}>
          <Image
            src="/images/img-w04-estudio.webp"
            alt="Tela 'Seu anúncio' do Estúdio Criativo do ady mostrando um anúncio de hambúrguer gerado pela IA, com os botões Salvar na Biblioteca e Publicar no Meta"
            width={1296}
            height={646}
            className={styles.img}
          />
        </div>
      </div>
    </section>
  );
}
