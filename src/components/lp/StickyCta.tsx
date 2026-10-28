"use client";

import { useEffect, useState } from "react";
import styles from "./StickyCta.module.css";

/**
 * CTA fixo no rodapé da tela, só no celular (CSS esconde no desktop).
 * Some enquanto o formulário do hero está visível — não faz sentido
 * apontar pra ele quando ele já está na tela — e enquanto qualquer campo
 * está em foco, pra nunca ficar por cima do teclado nem do formulário.
 */
export function StickyCta() {
  const [formNaTela, setFormNaTela] = useState(true);
  const [digitando, setDigitando] = useState(false);

  useEffect(() => {
    const form = document.getElementById("inscricao");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setFormNaTela(entry.isIntersecting), { threshold: 0 });
    observer.observe(form);

    const ehCampo = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.matches("input:not([type=checkbox]):not([type=radio]), textarea, select");
    const aoFocar = (e: FocusEvent) => setDigitando(ehCampo(e.target));
    const aoSair = (e: FocusEvent) => {
      if (!ehCampo(e.relatedTarget)) setDigitando(false);
    };
    document.addEventListener("focusin", aoFocar);
    document.addEventListener("focusout", aoSair);
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", aoFocar);
      document.removeEventListener("focusout", aoSair);
    };
  }, []);

  const visivel = !formNaTela && !digitando;

  return (
    <div className={styles.barra} data-visivel={visivel} inert={!visivel}>
      <a href="#inscricao" className="lp-cta lp-cta--wide">
        QUERO TESTAR GRÁTIS
      </a>
    </div>
  );
}
