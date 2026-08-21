import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { gantari } from "@/fonts";
import { AnalyticsRouteTracker } from "@/components/analytics/AnalyticsRouteTracker";
import "./globals.css";

export const metadata: Metadata = {
  // Sem isso, imagens de OG relativas (ex. a de /workshop) resolvem pra
  // localhost em vez do domínio real — Next avisa no build sem essa linha.
  metadataBase: new URL("https://useady.com.br"),
  title: "ady — seu negócio aparecendo todo dia",
  description:
    "O ady cria os posts, publica no seu Instagram e coloca seus anúncios no ar. Você toca o negócio. Ele cuida de te mostrar.",
};

/**
 * Layout raiz — só o que é de verdade global (fonte, GTM, tracking de
 * rota). Header, rodapé e o modal do formulário da home ficam no layout
 * do grupo `(site)`: o `/workshop` precisa de uma casca diferente (sem
 * link de navegação pra home, sem o modal — usa formulário embutido).
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="pt-BR" className={gantari.variable}>
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        {children}
        <AnalyticsRouteTracker />
      </body>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
    </html>
  );
}
