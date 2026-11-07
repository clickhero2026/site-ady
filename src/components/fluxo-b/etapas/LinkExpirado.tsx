import { APP_LOGIN_URL } from "@/config/fluxoB";
import e from "./etapas.module.css";

/** O link de login (vale 1h) passou de 55 min: não redireciona. "Entrar"
 * só com NEXT_PUBLIC_ADY_APP_LOGIN_URL; sem ela, só a mensagem. */
export function LinkExpirado() {
  return (
    <div role="alert" className={e.erro}>
      <h1 className={e.titulo}>O link de acesso expirou.</h1>
      {APP_LOGIN_URL && (
        <div className={e.acoes}>
          <a href={APP_LOGIN_URL} className={`lp-cta lp-cta--wide ${e.botao}`}>
            Entrar
          </a>
        </div>
      )}
    </div>
  );
}
