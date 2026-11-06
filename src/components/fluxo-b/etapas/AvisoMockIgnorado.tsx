"use client";

import { useEffect } from "react";
import { AVISO_MOCK_IGNORADO } from "@/lib/fluxo-b/regras";

/** Só renderizado quando NEXT_PUBLIC_FLUXO_B_MOCK=1 chegou num build de
 * produção (e foi ignorado): repete o aviso no console do navegador. */
export function AvisoMockIgnorado() {
  useEffect(() => {
    console.warn(AVISO_MOCK_IGNORADO);
  }, []);
  return null;
}
