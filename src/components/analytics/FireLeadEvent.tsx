"use client";

import { useEffect } from "react";
import { trackLead } from "@/lib/analytics";

/**
 * Empurra `generate_lead` pro dataLayer do GTM uma vez, quando /obrigado
 * carrega. Só existe pra isolar o `useEffect` num componente cliente
 * minúsculo — a página em si continua um Server Component.
 */
export function FireLeadEvent() {
  useEffect(() => {
    trackLead();
  }, []);

  return null;
}
