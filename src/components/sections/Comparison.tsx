import { Check } from "lucide-react";
import styles from "./Comparison.module.css";

interface ComparisonRow {
  label: string;
  competitor: string;
  ady: string;
}

interface ComparisonTableData {
  title: string;
  competitorLabel: string;
  rows: ComparisonRow[];
}

const TABLE_SOCIAL_MEDIA: ComparisonTableData = {
  title: "Se você contrata alguém só pro Instagram",
  competitorLabel: "Social Media",
  rows: [
    {
      label: "Quanto custa por mês",
      competitor: "R$ 300 a R$ 800",
      ady: "R$ 69",
    },
    {
      label: "Publica todo dia, mesmo numa semana corrida",
      competitor: "Depende se ele lembrar",
      ady: "Sempre",
    },
    {
      label: "Você sabe o que foi postado",
      competitor: "Confia",
      ady: "Vê tudo, com data e horário",
    },
    {
      label: "Quanto tempo até começar",
      competitor: "Combinar agenda, alinhar briefing",
      ady: "Mesmo dia",
    },
  ],
};

const TABLE_AGENCIA: ComparisonTableData = {
  title: "Se você contrata uma agência de anúncios",
  competitorLabel: "Agência",
  rows: [
    {
      label: "Quanto custa por mês",
      competitor: "R$ 1500 a R$ 5000+",
      ady: "R$ 297",
    },
    {
      label: "Fidelidade",
      competitor: "Geralmente 6 a 12 meses",
      ady: "Não tem",
    },
    {
      label: "Você entende o relatório",
      competitor: "Termos técnicos",
      ady: "Resultados do seu negócio, de forma clara e fácil de entender",
    },
    {
      label: "Quem decide o anúncio antes de ir no ar",
      competitor: "O time da agência",
      ady: "Você acompanha e aprova",
    },
    {
      label: "Tempo até o primeiro anúncio no ar",
      competitor: "Semanas de reunião",
      ady: "Mesmo dia",
    },
  ],
};

export function Comparison() {
  return (
    <section id="comparativo" className="section">
      <div className="container">
        <h2 className="section-title">Compare com o que você faz hoje.</h2>

        <div className={styles.tablesGrid}>
          <ComparisonTable data={TABLE_SOCIAL_MEDIA} />
          <ComparisonTable data={TABLE_AGENCIA} />
        </div>
      </div>
    </section>
  );
}

function ComparisonTable({ data }: { data: ComparisonTableData }) {
  return (
    <div className={styles.tableBlock}>
      <h3 className={styles.tableTitle}>{data.title}</h3>

      {/* Desktop: tabela de verdade. Escondida abaixo do breakpoint. */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">
              <span className="visually-hidden">Critério</span>
            </th>
            <th scope="col">{data.competitorLabel}</th>
            <th scope="col" className={styles.adyHeader}>
              ady
            </th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.competitor}</td>
              <td className={styles.adyCell}>
                <span className={styles.adyValue}>
                  <Check aria-hidden="true" size={16} className={styles.checkIcon} />
                  {row.ady}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: um card compacto por linha, sem tabela achatada. */}
      <ul className={styles.cards}>
        {data.rows.map((row) => (
          <li key={row.label} className={styles.card}>
            <p className={styles.cardLabel}>{row.label}</p>
            <div className={styles.cardRow}>
              <span className={styles.cardRowLabel}>{data.competitorLabel}</span>
              <span>{row.competitor}</span>
            </div>
            <div className={`${styles.cardRow} ${styles.cardRowAdy}`}>
              <span className={styles.cardRowLabel}>ady</span>
              <span className={styles.cardAdyValue}>
                <Check aria-hidden="true" size={16} className={styles.checkIcon} />
                {row.ady}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
