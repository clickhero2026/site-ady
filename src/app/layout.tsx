import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { gantari } from "@/fonts";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LeadModalProvider } from "@/components/lead-modal/LeadModalContext";
import { LeadModal } from "@/components/lead-modal/LeadModal";
import { AnalyticsRouteTracker } from "@/components/analytics/AnalyticsRouteTracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "ady — seu negócio aparecendo todo dia",
  description:
    "O ady cria os posts, publica no seu Instagram e coloca seus anúncios no ar. Você toca o negócio. Ele cuida de te mostrar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="pt-BR" className={gantari.variable}>
      <body>
        <LeadModalProvider>
          <a href="#conteudo" className="skip-link">
            Pular para o conteúdo
          </a>
          <SiteHeader />
          <main id="conteudo">{children}</main>
          <SiteFooter />
          <LeadModal />
          <AnalyticsRouteTracker />
        </LeadModalProvider>
      </body>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
    </html>
  );
}
