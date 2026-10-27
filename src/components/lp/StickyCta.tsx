"use client";

import { useEffect, useState } from "react";
import styles from "./StickyCta.module.css";

/**
 * CTA fixo no rodapé da tela, só no celular (CSS esconde no desktop).
 * Some enquanto o formulário do hero está visível — não faz sentido
 * apontar pra ele quando ele já está na tela. Mesmo padrão do
 * StickyMobileCta do workshop.
 */
export function StickyCta() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const form = document.getElementById("inscricao");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setVisivel(!entry.isIntersecting), { threshold: 0 });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.barra} data-visivel={visivel} inert={!visivel}>
      <a href="#inscricao" className="lp-cta lp-cta--wide">
        QUERO TESTAR GRÁTIS
      </a>
    </div>
  );
}
