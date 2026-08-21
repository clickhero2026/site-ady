import type { Metadata } from "next";
import Link from "next/link";
import { FireLeadEvent } from "@/components/analytics/FireLeadEvent";
import { WhatsappCta } from "./WhatsappCta";
import styles from "./page.module.css";

// Sem noindex: a seção 5 do briefing proíbe noindex em qualquer página da fase 1.
export const metadata: Metadata = {
  title: "Recebemos seus dados — ady",
  description: "Nosso time entra em contato pelo WhatsApp pra conectar seu ady.",
};

/**
 * Página persistente (rota própria, sem redirecionamento posterior) — quem
 * chega aqui veio de uma navegação completa após o envio do formulário
 * (ver LeadModal), justamente pra essa página carregar do zero e o disparo
 * de Meta Pixel / Google Tag Manager funcionar de forma confiável.
 *
 * `WhatsappCta` mostra o botão e, quando os dados do lead vieram do
 * formulário (não de acesso direto à página), personaliza a mensagem e
 * redireciona automaticamente pra lá — ver esse componente pro porquê.
 */
export default function ObrigadoPage() {
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

        <WhatsappCta />

        <Link className={styles.back} href="/">
          Voltar pro site
        </Link>
      </div>
    </section>
  );
}
