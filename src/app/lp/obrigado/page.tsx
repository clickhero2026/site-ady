import { CalendarCheck, MessageCircle, Sparkles } from "lucide-react";
import { EtapasShell } from "@/components/lp/etapas/EtapasShell";
import { HorarioMarcado } from "@/components/lp/etapas/HorarioMarcado";
import { primeiroNome } from "@/lib/teste7dFluxo";
import { inscricaoDaSessaoOuLp } from "@/lib/teste7dPagina";
import styles from "@/components/lp/etapas/Agendar.module.css";

export const metadata = { title: "Conversa marcada — teste grátis do ady" };

/**
 * Confirmação (lp.useady.com.br/obrigado). Sem pedido novo. O horário só
 * aparece se veio no evento do Calendly (ver HorarioMarcado) — nada de
 * consultar banco nem supor horário.
 */
export default async function ObrigadoPage() {
  const row = await inscricaoDaSessaoOuLp();

  return (
    <EtapasShell passo={3} concluido saudacao={`Tudo certo, ${primeiroNome(row.nome)}!`}>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Conversa marcada. Até lá!</h1>
        <HorarioMarcado />
      </div>

      <section aria-labelledby="depois" className={styles.depois}>
        <h2 id="depois" className={styles.depoisTitulo}>
          O que acontece agora
        </h2>
        <ol className={styles.depoisLista}>
          <li>
            <CalendarCheck aria-hidden="true" size={28} strokeWidth={2} />
            No horário marcado, a gente conversa com você.
          </li>
          <li>
            <MessageCircle aria-hidden="true" size={28} strokeWidth={2} />
            Na conversa, a gente configura o ady com você, ao vivo.
          </li>
          <li>
            <Sparkles aria-hidden="true" size={28} strokeWidth={2} />
            Daí começam os seus 7 dias: o ady cria e publica os posts do seu negócio.
          </li>
        </ol>
      </section>
    </EtapasShell>
  );
}
