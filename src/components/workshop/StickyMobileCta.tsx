"use client";

import { useEffect, useState } from "react";
import { CtaLink } from "./CtaLink";
import styles from "./StickyMobileCta.module.css";

/**
 * Botão fixo no rodapé, só em mobile — escondido via CSS em telas maiores
 * (briefing, seção 5: "a partir do momento em que o hero sai da tela").
 * Observa a seção `#hero-workshop`; aparece quando ela sai do viewport,
 * some de novo se o usuário rolar de volta pra ela.
 */
export function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-workshop");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.bar} data-visible={visible} aria-hidden={!visible}>
      <CtaLink className={styles.link}>Garantir minha vaga</CtaLink>
    </div>
  );
}
