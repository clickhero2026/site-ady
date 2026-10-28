import { notFound } from "next/navigation";
import { TESTE7D, type LpVariant } from "@/config/teste7d";
import { LpAllInOne } from "@/components/lp/LpAllInOne";
import { LpCadastro } from "@/components/lp/LpCadastro";
import { LpComparison } from "@/components/lp/LpComparison";
import { LpFaq } from "@/components/lp/LpFaq";
import { LpFinalCta } from "@/components/lp/LpFinalCta";
import { LpHeader } from "@/components/lp/LpHeader";
import { LpHero } from "@/components/lp/LpHero";
import { LpHowTrial } from "@/components/lp/LpHowTrial";
import { LpPain } from "@/components/lp/LpPain";
import { LpWhatAdyDoes } from "@/components/lp/LpWhatAdyDoes";
import { StickyCta } from "@/components/lp/StickyCta";

/**
 * LP do teste grátis de 7 dias — servida em `lp.useady.com.br/`. O proxy
 * lê `?lp=` e reescreve pra `/lp/v/<A..F>`: cada versão do título é uma
 * página estática própria, sem trocar título no navegador (sem "pulo" e
 * sem depender de JS). Só o H1 muda entre versões.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return TESTE7D.lpVariants.map((variante) => ({ variante }));
}

export default async function LpPage({ params }: PageProps<"/lp/v/[variante]">) {
  const { variante } = await params;
  if (!(TESTE7D.lpVariants as readonly string[]).includes(variante)) notFound();
  const variant = variante as LpVariant;

  return (
    <>
      <LpHeader />
      <main id="conteudo">
        <LpHero variant={variant} />
        <LpPain />
        <LpWhatAdyDoes />
        <LpCadastro variant={variant} />
        <LpComparison />
        <LpAllInOne />
        <LpHowTrial />
        <LpFaq />
        <LpFinalCta />
      </main>
      <StickyCta />
    </>
  );
}
