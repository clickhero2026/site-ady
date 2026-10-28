"use client";

import { useEffect, useState } from "react";
import styles from "./StickyCta.module.css";

/** O que, estando na tela, torna a barra desnecessária: o botão do hero e
 * o bloco do formulário. */
const ALVOS = ["hero-cta", "cadastro"];

/**
 * CTA fixo no rodapé da tela, só no celular (CSS esconde no desktop).
 * Some enquanto o botão do hero ou o bloco do formulário (#cadastro) estão
 * visíveis — não faz sentido repetir o botão ali — e enquanto qualquer
 * campo está em foco, pra nunca ficar por cima do teclado nem do formulário.
 */
export function StickyCta() {
  const [algoNaTela, setAlgoNaTela] = useState(true);
  const [digitando, setDigitando] = useState(false);

  useEffect(() => {
    const elementos = ALVOS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const naTela = new Set<Element>();
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) naTela.add(entrada.target);
          else naTela.delete(entrada.target);
        }
        setAlgoNaTela(naTela.size > 0);
      },
      { threshold: 0 },
    );
    elementos.forEach((el) => observer.observe(el));

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

  const visivel = !algoNaTela && !digitando;

  return (
    <div className={styles.barra} data-visivel={visivel} inert={!visivel}>
      <a href="#cadastro" className="lp-cta lp-cta--wide">
        QUERO TESTAR GRÁTIS
      </a>
    </div>
  );
}
