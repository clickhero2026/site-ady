import { APP_LOGIN_URL } from "@/config/fluxoB";
import e from "./etapas.module.css";

/** O redirecionamento final não tem destino válido (redirectUrl ausente,
 * já usado ou fora da origem do app). A conta existe: o caminho é entrar
 * pelo login. TODO(contrato): validade do login automático. */
export function FalhaAoEntrar() {
  return (
    <div role="alert" className={e.erro}>
      <h1 className={e.titulo}>Sua conta está pronta, mas não conseguimos abrir o ady agora.</h1>
      <p className={e.apoio}>Entre no ady com o e-mail que você cadastrou.</p>
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
