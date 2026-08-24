import { WorkshopThemeToggle } from "./WorkshopThemeToggle";

/**
 * Casca do /workshop — de propósito SEM `SiteHeader` (o logo lá vira link
 * pra home) e SEM `LeadModalProvider`/`LeadModal` (o formulário aqui é
 * embutido na própria página, âncora `#inscricao`, não modal). Regra do
 * briefing: nenhum link de navegação pra home em nenhuma das duas páginas
 * do workshop. O toggle de tema flutua fixo (sem header pra morar) — ver
 * `WorkshopThemeToggle`.
 */
export default function WorkshopLayout({ children }: LayoutProps<"/workshop">) {
  return (
    <>
      <WorkshopThemeToggle />
      <main id="conteudo">{children}</main>
    </>
  );
}
