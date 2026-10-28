"use client";

import { useEffect, type RefObject } from "react";

/**
 * Celular com o teclado aberto: mantém o campo em foco e o botão de enviar
 * dentro da parte visível da tela (`visualViewport`). Se os dois não cabem
 * juntos, o campo tem prioridade. Só em tela de toque — no desktop o foco
 * num campo não mexe na rolagem.
 *
 * Roda quando um campo ganha foco e quando a área visível muda de tamanho
 * (o teclado abrindo ou fechando). Elementos com `data-topo-fixo` (a barra
 * do topo) contam como área coberta.
 */
export function useVisivelComTeclado(
  raizRef: RefObject<HTMLElement | null>,
  botaoRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const vv = window.visualViewport;
    const raiz = raizRef.current;
    if (!vv || !raiz || !window.matchMedia("(pointer: coarse)").matches) return;
    const viewport = vv;

    let quadro = 0;
    function ajustar() {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const ativo = document.activeElement;
        const botao = botaoRef.current;
        if (!(ativo instanceof HTMLElement) || !raiz!.contains(ativo) || !botao) return;
        if (!ativo.matches("input:not([type=checkbox]):not([type=radio]), textarea")) return;

        // Coordenadas da janela de layout; a área visível começa em offsetTop.
        const barra = document.querySelector("[data-topo-fixo]")?.getBoundingClientRect().bottom ?? 0;
        const topo = Math.max(viewport.offsetTop, barra) + 8;
        const base = viewport.offsetTop + viewport.height - 12;
        const rotulo = (ativo.closest("[data-campo]") ?? ativo).getBoundingClientRect();
        const campo = ativo.getBoundingClientRect();
        const fim = botao.getBoundingClientRect();

        // Prioridade: o campo; depois o botão; por último o rótulo do campo.
        let delta = 0;
        if (campo.top < topo) delta = rotulo.top - topo;
        else if (fim.bottom > base) delta = Math.min(fim.bottom - base, campo.top - topo);
        if (campo.bottom - delta > base) delta = campo.bottom - base;
        if (Math.abs(delta) > 2) window.scrollBy({ top: delta, behavior: "instant" });
      });
    }

    // O navegador também rola até o campo no foco; o ajuste vem depois.
    const aoFocar = () => window.setTimeout(ajustar, 60);
    raiz.addEventListener("focusin", aoFocar);
    viewport.addEventListener("resize", ajustar);
    return () => {
      cancelAnimationFrame(quadro);
      raiz.removeEventListener("focusin", aoFocar);
      viewport.removeEventListener("resize", ajustar);
    };
  }, [raizRef, botaoRef]);
}
