import { redirect } from "next/navigation";
import { TESTE7D } from "@/config/teste7d";
import { AgendarCalendly } from "@/components/lp/etapas/AgendarCalendly";
import { EtapasShell } from "@/components/lp/etapas/EtapasShell";
import { primeiroNome } from "@/lib/teste7dFluxo";
import { inscricaoDaSessaoOuLp } from "@/lib/teste7dPagina";
import styles from "@/components/lp/etapas/Agendar.module.css";

export const metadata = { title: "Escolha o horário — teste grátis do ady" };

/**
 * Agendamento (lp.useady.com.br/agendar) — a "página de obrigado" da
 * seção 9 do briefing. Só depois da etapa 2; quem já agendou também pode
 * voltar aqui e marcar outro horário.
 */
export default async function AgendarPage() {
  const row = await inscricaoDaSessaoOuLp();
  if (!row.etapa2_concluida_em) redirect(TESTE7D.paginas.ativacao);

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  return (
    <EtapasShell passo={3} saudacao={`Oi, ${primeiroNome(row.nome)}!`}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>{TESTE7D.agendar.titulo}</h1>
        <p className={styles.texto}>{TESTE7D.agendar.texto}</p>
        {/* PENDENTE (briefing, seção 9): linha "o que ter à mão na
            conversa" — esperando o Denilson confirmar o conteúdo. Para
            ativar, descomentar e trocar o texto:
        <p className={styles.texto}>[o que ter à mão na conversa]</p>
        */}
      </div>

      <AgendarCalendly
        url={calendlyUrl}
        dev={process.env.NODE_ENV !== "production"}
        prefill={{ nome: row.nome, email: row.email, whatsapp: row.whatsapp }}
      />
    </EtapasShell>
  );
}
