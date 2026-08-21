import type { Metadata } from "next";
import Link from "next/link";
import { whatsappLink } from "@/lib/whatsapp";
import { FireLeadEvent } from "@/components/analytics/FireLeadEvent";
import styles from "./page.module.css";

// Sem noindex: a seção 5 do briefing proíbe noindex em qualquer página da fase 1.
export const metadata: Metadata = {
  title: "Recebemos seus dados — ady",
  description: "Nosso time entra em contato pelo WhatsApp pra conectar seu ady.",
};

const WHATSAPP_MESSAGE =
  "Oi! Acabei de deixar meus dados no site do ady e quero conectar meu negócio.";

/**
 * Página persistente (rota própria, sem redirecionamento posterior) — quem
 * chega aqui veio de uma navegação completa após o envio do formulário
 * (ver LeadModal), justamente pra essa página carregar do zero e o disparo
 * de Meta Pixel / Google Tag Manager funcionar de forma confiável.
 */
export default function ObrigadoPage() {
  const href = whatsappLink(WHATSAPP_MESSAGE);

  return (
    <section className={`section ${styles.section}`}>
      <FireLeadEvent />
      <div className={`container ${styles.inner}`}>
        <p className={styles.eyebrow}>Recebemos seus dados</p>
        <h1 className={styles.title}>Já estamos com suas informações.</h1>
        <p className={styles.body}>
          Nosso time entra em contato pelo WhatsApp pra conectar seu ady. Se
          quiser adiantar, é só chamar agora.
        </p>

        {href ? (
          <a className={styles.whatsapp} href={href} target="_blank" rel="noopener noreferrer">
            Chamar no WhatsApp agora
          </a>
        ) : (
          <p className={styles.body}>
            Fica de olho no WhatsApp — vamos te chamar em breve.
          </p>
        )}

        <Link className={styles.back} href="/">
          Voltar pro site
        </Link>
      </div>
    </section>
  );
}
