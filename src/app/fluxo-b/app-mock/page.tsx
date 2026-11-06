import { notFound } from "next/navigation";
import { FluxoBShell } from "@/components/fluxo-b/etapas/FluxoBShell";
import e from "@/components/fluxo-b/etapas/etapas.module.css";
import { mockDoServidor, PROGRESSO } from "@/config/fluxoB";

/** Só em modo mock (NEXT_PUBLIC_FLUXO_B_MOCK=1): faz o papel do app do
 * ady no fim do fluxo, pra validar as telas sem o backend. */
export default function FluxoBAppMockPage() {
  if (!mockDoServidor().ativo) notFound();
  return (
    <FluxoBShell progresso={PROGRESSO.app} painel={<p className="destaque">Modo de teste</p>}>
      <h1 className={e.titulo}>Aqui você entraria no app do ady.</h1>
      <p className={e.apoio}>
        Página de teste do Fluxo B (modo mock). Em produção, o redirecionamento vai para o endereço do app configurado
        em NEXT_PUBLIC_ADY_APP_ORIGIN.
      </p>
    </FluxoBShell>
  );
}
