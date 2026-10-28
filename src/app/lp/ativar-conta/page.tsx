import type { Metadata } from "next";
import { CircleAlert } from "lucide-react";
import { AtivarContaForm } from "@/components/lp/etapas/AtivarContaForm";
import { EtapasShell } from "@/components/lp/etapas/EtapasShell";
import styles from "@/components/lp/etapas/AtivarConta.module.css";

export const metadata: Metadata = {
  title: "Continue a ativação da sua conta — teste grátis do ady",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

/** Número do time no WhatsApp: só dígitos, com o 55. Sem variável (ou
 * com valor fora do formato), o link simplesmente não aparece. */
function linkSuporte(): string | null {
  const numero = process.env.NEXT_PUBLIC_SUPORTE_WHATSAPP?.trim();
  return numero && /^55\d{10,11}$/.test(numero) ? `https://wa.me/${numero}` : null;
}

/**
 * Retomada do teste grátis (lp.useady.com.br/ativar-conta), pra quem
 * parou depois do cadastro e não está no mesmo navegador. O link com
 * `?t=<token>` não chega aqui: o proxy manda pro route handler `link/`,
 * que redireciona pra onde a pessoa parou ou de volta pra cá com
 * `?link=invalido`. Cache, indexação e referência: ver `src/proxy.ts`.
 */
export default async function AtivarContaPage({ searchParams }: PageProps<"/lp/ativar-conta">) {
  const { link } = await searchParams;
  const suporte = linkSuporte();

  return (
    <EtapasShell>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Continue a ativação da sua conta</h1>
        <p className={styles.texto}>
          Informe o WhatsApp e o e-mail que você usou ao se cadastrar. A gente continua de onde você parou.
        </p>
        {link === "invalido" && (
          <p className={styles.aviso}>
            <CircleAlert aria-hidden="true" size={24} strokeWidth={2.25} />
            Esse link expirou ou não é válido. Informe seus dados abaixo.
          </p>
        )}
      </div>

      <AtivarContaForm />

      {suporte && (
        <p className={styles.suporte}>
          Precisa de ajuda?{" "}
          <a href={suporte} target="_blank" rel="noopener noreferrer">
            Fale com a nossa equipe no WhatsApp
          </a>
        </p>
      )}
    </EtapasShell>
  );
}
