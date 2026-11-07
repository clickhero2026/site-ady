import { APP_LOGIN_URL, APP_RESET_URL } from "@/config/fluxoB";
import e from "./etapas.module.css";

/**
 * Botões "Redefinir minha senha" (NEXT_PUBLIC_ADY_APP_RESET_URL) e
 * "Entrar" (NEXT_PUBLIC_ADY_APP_LOGIN_URL); cada um some sem a env.
 * `principal` escolhe qual vem primeiro, no estilo do botão principal.
 * TODO(contrato): URLs de redefinição e de login do app.
 */
export function AcoesContaExistente({ principal = "redefinir" }: { principal?: "redefinir" | "entrar" }) {
  const botoes = [
    APP_RESET_URL && { id: "redefinir", href: APP_RESET_URL, texto: "Redefinir minha senha" },
    APP_LOGIN_URL && { id: "entrar", href: APP_LOGIN_URL, texto: "Entrar" },
  ].filter(Boolean) as { id: string; href: string; texto: string }[];
  if (!botoes.length) return null;
  botoes.sort((a, b) => Number(b.id === principal) - Number(a.id === principal));

  return (
    <div className={e.acoes}>
      {botoes.map((b, i) => (
        <a key={b.id} href={b.href} className={i === 0 ? `lp-cta lp-cta--wide ${e.botao}` : e.secundario}>
          {b.texto}
        </a>
      ))}
    </div>
  );
}
