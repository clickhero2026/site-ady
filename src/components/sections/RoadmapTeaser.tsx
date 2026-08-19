import Link from "next/link";
import { ROADMAP_ITEMS } from "@/lib/roadmapItems";
import styles from "./RoadmapTeaser.module.css";

export function RoadmapTeaser() {
  return (
    <section id="roadmap" className="section">
      <div className="container">
        <h2 className="section-title">O ady está só começando.</h2>
        <p className={`section-lead ${styles.intro}`}>
          Ele já cria, publica e anuncia no Instagram. O que vem a seguir:
        </p>

        <ul className={styles.items}>
          {ROADMAP_ITEMS.map((item) => (
            <li key={item.label} className={styles.item}>
              <h3 className={styles.itemLabel}>{item.label}</h3>
              <p className="body-text">{item.body}</p>
            </li>
          ))}
        </ul>

        <Link href="/roadmap" className={styles.link}>
          Ver o roadmap completo <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
