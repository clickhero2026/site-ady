import { redirect } from "next/navigation";
import { TESTE7D } from "@/config/teste7d";
import { AtivacaoForm } from "@/components/lp/etapas/AtivacaoForm";
import { EtapasShell } from "@/components/lp/etapas/EtapasShell";
import { respostasDaLinha, telaParaRetomar } from "@/lib/teste7dEtapa2";
import { primeiroNome, proximaPagina } from "@/lib/teste7dFluxo";
import { inscricaoDaSessaoOuLp } from "@/lib/teste7dPagina";

export const metadata = { title: "Sobre o seu negócio — teste grátis do ady" };

/**
 * Etapa 2 (lp.useady.com.br/ativacao). Nome, WhatsApp e e-mail já vieram
 * da etapa 1 pelo cookie — não se pergunta de novo. Quem volta retoma na
 * primeira pergunta sem resposta; quem já terminou segue pro horário.
 */
export default async function AtivacaoPage() {
  const row = await inscricaoDaSessaoOuLp();
  const destino = proximaPagina(row);
  if (destino !== TESTE7D.paginas.ativacao) redirect(destino);

  const respostas = respostasDaLinha(row);

  return (
    <EtapasShell passo={2} saudacao={`Oi, ${primeiroNome(row.nome)}!`} saudacaoTitulo>
      <AtivacaoForm inicial={respostas} telaInicial={telaParaRetomar(respostas)} />
    </EtapasShell>
  );
}
