/**
 * Casca do /workshop — de propósito SEM `SiteHeader` (o logo lá vira link
 * pra home) e SEM `LeadModalProvider`/`LeadModal` (o formulário aqui é
 * embutido na própria página, âncora `#inscricao`, não modal). Regra do
 * briefing: nenhum link de navegação pra home em nenhuma das duas páginas
 * do workshop.
 */
export default function WorkshopLayout({ children }: LayoutProps<"/workshop">) {
  return <main id="conteudo">{children}</main>;
}
