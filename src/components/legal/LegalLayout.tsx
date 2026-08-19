import { CtaButton } from "@/components/cta/CtaButton";
import styles from "./LegalLayout.module.css";

interface LegalLayoutProps {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
  /** Mostra o CTA único do site no fim da página. Padrão: true. */
  showCta?: boolean;
}

export function LegalLayout({
  title,
  updatedAt,
  children,
  showCta = true,
}: LegalLayoutProps) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.updated}>Última atualização: {updatedAt}</p>
        </header>

        <div className={styles.prose}>{children}</div>

        {showCta && (
          <div className={styles.ctaBlock}>
            <CtaButton>Quero o ady no meu negócio</CtaButton>
          </div>
        )}
      </div>
    </section>
  );
}
