"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";
import { readAndClearLastLead } from "@/lib/lastLeadStorage";
import styles from "./page.module.css";

const GENERIC_MESSAGE =
  "Oi! Acabei de deixar meus dados no site do ady e quero conectar meu negócio.";

/**
 * Mostra o botão de WhatsApp e, quando os dados do lead estão disponíveis
 * (veio de verdade do formulário, não de um acesso direto à página),
 * personaliza a mensagem e redireciona automaticamente pra lá depois de
 * um instante — o WhatsApp é o canal efetivo de contato agora que o
 * Bitrix está fora do ar, não um extra.
 *
 * Renderiza com a mensagem genérica no primeiro render (igual no servidor
 * e no cliente, sem isso o React acusaria mismatch de hidratação) e só
 * troca pra personalizada depois de montar, quando já dá pra ler o
 * sessionStorage.
 */
export function WhatsappCta() {
  const [message, setMessage] = useState(GENERIC_MESSAGE);

  useEffect(() => {
    const lead = readAndClearLastLead();
    if (!lead) return;

    const personalized =
      `Oi! Me chamo ${lead.nome}, meu negócio é ${lead.negocio} ` +
      `(${lead.segmento}) e tenho interesse no plano ${lead.planoLabel}.`;
    // sessionStorage é um sistema externo só alcançável depois de montar
    // (não existe durante SSR) — é exatamente o caso que useEffect existe
    // pra resolver, diferente do ajuste de estado por prop no LeadModal.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessage(personalized);

    const href = whatsappLink(personalized);
    if (!href) return;

    // Atraso de propósito: dá tempo da pessoa ver a confirmação na tela e
    // do evento Lead (FireLeadEvent, nesta mesma página) terminar de sair
    // pro GTM — navegar embora no mesmo instante do disparo arrisca
    // cortar o beacon no meio do caminho.
    const timer = setTimeout(() => {
      window.location.href = href;
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const href = whatsappLink(message);

  if (!href) {
    return (
      <p className={styles.body}>
        Fica de olho no WhatsApp — vamos te chamar em breve.
      </p>
    );
  }

  return (
    <a className={styles.whatsapp} href={href} target="_blank" rel="noopener noreferrer">
      Chamar no WhatsApp agora
    </a>
  );
}
