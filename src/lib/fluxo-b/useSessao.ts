"use client";

import { useMemo, useSyncExternalStore } from "react";
import { CHAVES, type ContaFluxoB, type LeadFluxoB } from "./sessao";

const nada = () => () => {};

/** Texto cru de uma chave do sessionStorage: `undefined` antes da
 * hidratação (servidor), `null` se não existir. A string é estável entre
 * renders (o `useSyncExternalStore` exige isso). */
function useItem(chave: string): string | null | undefined {
  return useSyncExternalStore(
    nada,
    () => {
      try {
        return sessionStorage.getItem(chave);
      } catch {
        return null;
      }
    },
    () => undefined,
  );
}

function parse<T>(bruto: string | null | undefined): T | null | undefined {
  if (bruto === undefined) return undefined;
  if (bruto === null) return null;
  try {
    return JSON.parse(bruto) as T;
  } catch {
    return null;
  }
}

/** Lead (etapa 1) e conta criada, lidos da sessão. `undefined` = ainda
 * não hidratou (não decidir nada nesse estado). */
export function useSessaoFluxoB() {
  const leadRaw = useItem(CHAVES.lead);
  const contaRaw = useItem(CHAVES.conta);
  return useMemo(
    () => ({
      lead: parse<LeadFluxoB>(leadRaw),
      conta: parse<ContaFluxoB>(contaRaw),
    }),
    [leadRaw, contaRaw],
  );
}
