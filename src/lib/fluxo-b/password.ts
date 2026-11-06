/**
 * Gravação da senha no app. A rota AINDA NÃO EXISTE.
 *
 * TODO(contrato): rota, autenticação (token do signup? cookie do app?),
 * corpo e respostas — o desenvolvedor do app define. Enquanto isso,
 * em modo mock simula sucesso; fora dele, falha:
 * - em desenvolvimento, com erro explícito (pra ninguém ligar a flag
 *   NEXT_PUBLIC_FLUXO_B_SENHA achando que funciona);
 * - em produção, com erro que a tela mostra como mensagem amigável.
 *
 * Nunca logar a senha, nunca guardar em storage nem mandar pro dataLayer.
 */
export class SenhaNaoImplementadaError extends Error {
  constructor() {
    super(
      "[fluxo-b/password] setPassword ainda não foi implementada (TODO(contrato)). " +
        "Desligue NEXT_PUBLIC_FLUXO_B_SENHA ou ligue NEXT_PUBLIC_FLUXO_B_MOCK=1 para testar a tela.",
    );
    this.name = "SenhaNaoImplementadaError";
  }
}

export async function setPassword(input: { password: string; email: string }, opcoes: { mock: boolean }): Promise<void> {
  void input; // TODO(contrato): enviar ao app quando a rota existir.
  if (opcoes.mock) {
    await new Promise((r) => setTimeout(r, 800));
    return;
  }
  const erro = new SenhaNaoImplementadaError();
  if (process.env.NODE_ENV !== "production") console.error(erro);
  throw erro;
}
