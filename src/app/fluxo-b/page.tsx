import { normalizeLpVariant } from "@/config/teste7d";
import { LpAllInOne } from "@/components/fluxo-b/lp/LpAllInOne";
import { LpCadastro } from "@/components/fluxo-b/lp/LpCadastro";
import { LpComparison } from "@/components/fluxo-b/lp/LpComparison";
import { LpFaq } from "@/components/fluxo-b/lp/LpFaq";
import { LpFinalCta } from "@/components/fluxo-b/lp/LpFinalCta";
import { LpHeader } from "@/components/fluxo-b/lp/LpHeader";
import { LpHero } from "@/components/fluxo-b/lp/LpHero";
import { LpHowTrial } from "@/components/fluxo-b/lp/LpHowTrial";
import { LpPain } from "@/components/fluxo-b/lp/LpPain";
import { LpWhatAdyDoes } from "@/components/fluxo-b/lp/LpWhatAdyDoes";
import { StickyCta } from "@/components/fluxo-b/lp/StickyCta";

/**
 * Fluxo B — clone da LP do teste grátis (`src/app/lp/v/[variante]`):
 * mesmas seções, mesma ordem, mesmo conteúdo. A versão do título vem de
 * `?lp=` (A..F, padrão A), lida aqui mesmo — no Fluxo B a página é
 * dinâmica em vez de uma estática por versão.
 */
export default async function FluxoBLpPage({ searchParams }: PageProps<"/fluxo-b">) {
  const { lp } = await searchParams;
  const variant = normalizeLpVariant(Array.isArray(lp) ? lp[0] : lp);

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
