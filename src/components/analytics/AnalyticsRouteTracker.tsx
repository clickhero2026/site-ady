"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

/**
 * Empurra `page_view` pro dataLayer do GTM no carregamento inicial e em
 * toda navegação client-side entre páginas do site (ex.: clicar em
 * "Roadmap" no rodapé). A navegação pro /obrigado depois do formulário é
 * full-page de propósito (ver LeadModal) e não passa por aqui — o page_view
 * dela vem do carregamento novo da própria página, direto do GTM.
 */
export function AnalyticsRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView();
  }, [pathname]);

  return null;
}
