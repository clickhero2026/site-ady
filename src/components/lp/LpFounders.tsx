import styles from "./LpFounders.module.css";

/**
 * "Quem está por trás": PLACEHOLDER. Os nomes, as fotos e a linha de cada
 * fundador ainda não chegaram — os textos entre colchetes e os arquivos
 * em public/fundadores/ são marcadores visíveis de propósito, pra não
 * irem ao ar por engano. Trocar cada item quando o material vier.
 */
const FUNDADORES = [
  { foto: "/fundadores/fundador-1.svg", nome: "[Nome do fundador 1]", linha: "[Uma linha de apresentação]" },
  { foto: "/fundadores/fundador-2.svg", nome: "[Nome do fundador 2]", linha: "[Uma linha de apresentação]" },
  { foto: "/fundadores/fundador-3.svg", nome: "[Nome do fundador 3]", linha: "[Uma linha de apresentação]" },
];

export function LpFounders() {
  return (
    <section className="lp-section lp-section--alt" aria-labelledby="lp-fundadores">
      <div className="lp-container">
        <h2 id="lp-fundadores" className="lp-h2 lp-h2--center lp-spark">
          Os três fundadores do ady.
        </h2>
        <ul className={styles.grade}>
          {FUNDADORES.map(({ foto, nome, linha }) => (
            <li key={foto} className={`${styles.cartao} lp-reveal`}>
              {/* <img> simples: placeholder SVG, sem otimização a fazer.
                  Com as fotos reais (webp/jpg), trocar por next/image. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto} alt="" width={240} height={240} className={styles.foto} loading="lazy" />
              <h3 className={styles.nome}>{nome}</h3>
              <p>{linha}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
