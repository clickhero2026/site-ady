import styles from "./ForWho.module.css";

const ITEMS = [
  "Você tem um negócio que atende gente da sua cidade — loja, clínica, salão, academia, revenda",
  "Seu Instagram fica semanas parado porque você não tem tempo de pensar no que postar",
  "Você já pagou alguém pra cuidar disso e não entendeu direito o que recebeu em troca",
  "Você já tentou fazer sozinho e não conseguiu manter",
];

export function ForWho() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Esse workshop é pra você se:</h2>

        <ul className={styles.list}>
          {ITEMS.map((item) => (
            <li key={item}>
              <span className={styles.marker} aria-hidden="true">
                ➜
              </span>
              {item}
            </li>
          ))}
        </ul>

        <p className={styles.fecho}>
          Se você é agência, social media ou gestor de marketing, esse
          workshop não vai te servir. Ele foi feito pra quem tem o negócio.
        </p>
      </div>
    </section>
  );
}
