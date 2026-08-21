import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LeadModalProvider } from "@/components/lead-modal/LeadModalContext";
import { LeadModal } from "@/components/lead-modal/LeadModal";

/**
 * Casca do site de produto (home, /roadmap, /privacidade, /termos,
 * /obrigado): cabeçalho com logo (link pra home), rodapé completo e o
 * modal do formulário único. `/workshop` fica fora deste grupo de
 * propósito — não pode ter link de volta pra home.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <LeadModalProvider>
      <SiteHeader />
      <main id="conteudo">{children}</main>
      <SiteFooter />
      <LeadModal />
    </LeadModalProvider>
  );
}
