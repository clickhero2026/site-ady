"use client";

import { useEffect } from "react";

/**
 * Quem chega pelo link `#<alvo>` (qualquer botão da página que aponta pro
 * bloco) tem o foco levado ao título do bloco — não a um campo: no celular
 * isso abriria o teclado sozinho. O navegador faz a rolagem (suave só com
 * `prefers-reduced-motion: no-preference`, ver lp.css); aqui só o foco,
 * sem rolar de novo. Sem JavaScript, o link continua levando ao bloco.
 */
export function FocoAoChegar({ alvo, titulo }: { alvo: string; titulo: string }) {
  useEffect(() => {
    const focar = () => document.getElementById(titulo)?.focus({ preventScroll: true });
    const aoClicar = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest(`a[href="#${alvo}"]`)) {
        requestAnimationFrame(focar);
      }
    };
    document.addEventListener("click", aoClicar);
    if (window.location.hash === `#${alvo}`) focar();
    return () => document.removeEventListener("click", aoClicar);
  }, [alvo, titulo]);

  return null;
}
