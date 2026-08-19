import type { Metadata } from "next";
import { CtaButton } from "@/components/cta/CtaButton";
import { ROADMAP_ITEMS } from "@/lib/roadmapItems";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Roadmap — ady",
  description:
    "O ady já cria, publica e anuncia no Instagram. Veja o que vem a seguir.",
};

export default function RoadmapPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">O ady está só começando.</h1>
        <p className={`section-lead ${styles.intro}`}>
          Ele já cria, publica e anuncia no Instagram. O que vem a seguir:
        </p>

        <ul className={styles.items}>
          {ROADMAP_ITEMS.map((item) => (
            <li key={item.label} className={styles.item}>
              <h2 className={styles.itemLabel}>{item.label}</h2>
              <p className="body-text">{item.body}</p>
            </li>
          ))}
        </ul>

        <div className={styles.cta}>
          <CtaButton>Quero o ady no meu negócio</CtaButton>
        </div>
      </div>
    </section>
  );
}
