import type { Metadata } from "next";
import { TESTE7D } from "@/config/teste7d";
import { LpFooter } from "@/components/lp/LpFooter";
import "./lp.css";

/**
 * Casca das páginas do host lp.useady.com.br (o `src/proxy.ts` reescreve
 * `/`, `/ativacao`, `/agendar` e `/obrigado` pra cá). GTM, fonte e
 * page_view vêm do layout raiz, igual ao site principal.
 *
 * Nada aqui é indexável: são páginas de campanha, com noindex/nofollow,
 * e o canonical aponta pra raiz da LP sem `?lp=` (as versões A–F são a
 * mesma página pra fins de busca).
 */
export const metadata: Metadata = {
  title: "Teste o ady grátis por 7 dias",
  description:
    "O ady cria os posts, publica no seu Instagram e monta anúncios que levam o cliente para o seu WhatsApp. Teste por 7 dias, sem cartão de crédito.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: `${TESTE7D.lpOrigin}/` },
};

export default function LpLayout({ children }: LayoutProps<"/lp">) {
  return (
    <div className="lp-root">
      {children}
      <LpFooter />
    </div>
  );
}
