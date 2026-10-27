import { notFound } from "next/navigation";

/**
 * Qualquer caminho desconhecido no host da LP cai aqui (o proxy reescreve
 * pra `/lp/nao-encontrado`) e vira o 404 com a cara da LP
 * (`src/app/lp/not-found.tsx`), não o do site principal.
 */
export default function LpNaoEncontrado() {
  notFound();
}
