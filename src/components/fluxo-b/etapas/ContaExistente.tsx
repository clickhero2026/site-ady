import { APP_LOGIN_URL, APP_RESET_URL } from "@/config/fluxoB";
import e from "./etapas.module.css";

/**
 * Ações para e-mail já cadastrado (tela "criando" e formulário da LP):
 * "Redefinir minha senha" (NEXT_PUBLIC_ADY_APP_RESET_URL) e, secundário,
 * "Entrar" (NEXT_PUBLIC_ADY_APP_LOGIN_URL). Sem a env, o botão some.
 * TODO(contrato): URLs de redefinição e de login do app.
 */
export function AcoesContaExistente() {
  if (!APP_RESET_URL && !APP_LOGIN_URL) return null;
  return (
    <div className={e.acoes}>
      {APP_RESET_URL && (
        <a href={APP_RESET_URL} className={`lp-cta lp-cta--wide ${e.botao}`}>
          Redefinir minha senha
        </a>
      )}
      {APP_LOGIN_URL && (
        <a href={APP_LOGIN_URL} className={e.secundario}>
          Entrar
        </a>
      )}
    </div>
  );
}
