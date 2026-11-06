import type { Metadata } from "next";
import { TESTE7D } from "@/config/teste7d";
import { LpFooter } from "@/components/fluxo-b/lp/LpFooter";
import "./lp.css";

/**
 * Casca do Fluxo B (LP clonada + telas novas). Mesma estrutura da casca
 * da LP atual (`src/app/lp/layout.tsx`), com componentes duplicados.
 *
 * Nada aqui é indexável: é duplicata da LP. O canonical aponta pra LP
 * original.
 */
export const metadata: Metadata = {
  title: "Teste o ady grátis por 7 dias",
  description:
    "O ady cria os posts, publica no seu Instagram e monta anúncios que levam o cliente para o seu WhatsApp. Teste por 7 dias, sem cartão de crédito.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: `${TESTE7D.lpOrigin}/` },
};

export default function FluxoBLayout({ children }: LayoutProps<"/fluxo-b">) {
  return (
    <div className="lp-root">
      {children}
      <LpFooter />
    </div>
  );
}
