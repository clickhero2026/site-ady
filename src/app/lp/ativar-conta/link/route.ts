import { TESTE7D, TOKEN_HEADER } from "@/config/teste7d";
import { retomarPorToken } from "@/lib/teste7dDb";
import { proximaPagina } from "@/lib/teste7dFluxo";
import { setInscricaoCookie } from "@/lib/teste7dSession";

/** 32 caracteres hexadecimais (uuid sem hífens). */
const TOKEN_RE = /^[0-9a-f]{32}$/;

/** Sem cache, sem indexar e sem mandar a URL (com o token) adiante. */
const CABECALHOS = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};

function ir(destino: string) {
  return new Response(null, { status: 302, headers: { ...CABECALHOS, Location: destino } });
}

/**
 * Link de retomada: `lp.useady.com.br/ativar-conta?t=<token>`. O proxy
 * manda pra cá só quando há `?t=`, com o token no cabeçalho `TOKEN_HEADER`
 * (fora da URL reescrita) — a página /ativar-conta nunca recebe o token. Válido: grava a retomada, define o mesmo cookie assinado do
 * cadastro e redireciona (302) pra onde a pessoa parou. Inválido, vencido
 * ou com formato errado: volta pra /ativar-conta sem o token, com o aviso
 * e o formulário manual. O token nunca é logado nem devolvido.
 */
export async function GET(request: Request) {
  const token = request.headers.get(TOKEN_HEADER)?.trim().toLowerCase() ?? "";
  const invalido = `${TESTE7D.paginas.ativarConta}?link=invalido`;
  if (!TOKEN_RE.test(token)) return ir(invalido);

  try {
    const inscricao = await retomarPorToken(token);
    if (!inscricao) return ir(invalido);

    await setInscricaoCookie(inscricao.id);
    return ir(proximaPagina(inscricao));
  } catch (err) {
    // Só o tipo do erro: a mensagem do driver poderia trazer a consulta.
    console.error("[teste7d-link-retomada] Erro inesperado:", (err as Error)?.name ?? "desconhecido");
    return ir(invalido);
  }
}
