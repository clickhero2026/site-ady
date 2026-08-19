import styles from "./Comparison.module.css";

const rows: Array<[string, string, string, string]> = [
  [
    "Quanto custa por mês",
    "R$ 500 a R$ 2000",
    "Seu tempo",
    "A partir de R$ 69",
  ],
  [
    "Quanto do seu tempo consome",
    "Reuniões, cobranças, aprovações",
    "Toda noite depois que fecha",
    "Praticamente zero",
  ],
  [
    "Quando você viaja uma semana",
    "Depende se a pessoa lembrar",
    "Não sai nada",
    "Continua publicando",
  ],
  [
    "Você entende o resultado",
    "Relatório que precisa ser explicado",
    "Você chuta",
    "Em números do seu negócio",
  ],
  ["Quanto tempo pra começar", "Semanas", "Nunca é hoje", "Mesmo dia"],
];

export function Comparison() {
  return (
    <section id="comparativo" className="section">
      <div className="container">
        <h2 className="section-title">Compare com o que você faz hoje.</h2>
        <p className={styles.hint} aria-hidden="true">
          Arraste pra ver a tabela inteira →
        </p>

        <div
          className={styles.tableWrap}
          tabIndex={0}
          role="region"
          aria-label="Tabela comparativa: contratar alguém, fazer sozinho ou ady"
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">
                  <span className="visually-hidden">Critério</span>
                </th>
                <th scope="col">Contratar alguém</th>
                <th scope="col">Fazer sozinho</th>
                <th scope="col" className={styles.adyCol}>
                  ady
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, hire, alone, ady]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{hire}</td>
                  <td>{alone}</td>
                  <td className={styles.adyCol}>{ady}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
