import styles from "./CtaLink.module.css";

/**
 * CTA único da página: rola até o formulário (`#inscricao`). Sem modal,
 * sem plano — o workshop não vende nada nesta página.
 */
export function CtaLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a href="#inscricao" className={[styles.link, className].filter(Boolean).join(" ")}>
      {children}
    </a>
  );
}
