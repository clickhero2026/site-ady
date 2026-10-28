import { NextResponse, type NextRequest } from "next/server";
import { LP_INTERNAL_PREFIX, normalizeLpVariant, TESTE7D, TOKEN_HEADER } from "@/config/teste7d";

/**
 * Roteamento por host. Mesmo projeto e mesmo build servem dois sites:
 *
 * - lp.useady.com.br (e lp.localhost em dev): só a LP do teste grátis.
 *   `/` vira `/lp/v/<A..F>` (a versão do título sai de `?lp=`, então cada
 *   versão é uma página estática pré-renderizada), `/ativacao`,
 *   `/agendar`, `/obrigado` e `/ativar-conta` viram `/lp/<página>`
 *   (`/ativar-conta?t=<token>` vai pro route handler do link de
 *   retomada, que nunca mostra o token numa página), e `/api/teste7d/*`
 *   passa direto (mesma origem → o cookie da inscrição funciona sem
 *   Domain e sem CORS). Qualquer outro caminho é 404.
 * - Qualquer outro host (useady.com.br): o site de sempre; `/lp/*` não
 *   existe (404), pra LP não vazar no domínio principal.
 *
 * Arquivos estáticos (`/_next/*`, `/images/*`, `/teste7d/*.webp`...) ficam fora
 * do matcher e são servidos nos dois hosts.
 */

/** Caminho que não existe em lugar nenhum → página 404 padrão. */
const NAO_EXISTE = "/__nao-existe";

function isLpHost(request: NextRequest): boolean {
  const hostname = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (hostname.startsWith(TESTE7D.lpHostPrefix)) return true;

  const extras = process.env.LP_EXTRA_HOSTS?.split(",").map((h) => h.trim().toLowerCase());
  return Boolean(extras?.includes(hostname));
}

function rewrite(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.rewrite(url);
}

const PAGINAS_LP: readonly string[] = [
  TESTE7D.paginas.ativacao,
  TESTE7D.paginas.agendar,
  TESTE7D.paginas.obrigado,
  TESTE7D.paginas.ativarConta,
];

/** /ativar-conta: dado pessoal na tela e, no link, um token na URL — sem
 * cache, sem indexar e sem mandar a URL como referência pra ninguém. */
function semRastroNaUrl(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (isLpHost(request)) {
    if (pathname.startsWith("/api/teste7d/")) return NextResponse.next();

    if (pathname === TESTE7D.paginas.lp) {
      return rewrite(request, `${LP_INTERNAL_PREFIX}/v/${normalizeLpVariant(searchParams.get("lp"))}`);
    }

    if (pathname === TESTE7D.paginas.ativarConta) {
      if (!searchParams.has("t")) return semRastroNaUrl(rewrite(request, `${LP_INTERNAL_PREFIX}${pathname}`));

      // Link de retomada: o token segue num cabeçalho da requisição, não
      // na URL reescrita — o Next devolve a URL reescrita ao navegador
      // (`x-middleware-rewrite`), e o token não pode aparecer em resposta.
      const url = request.nextUrl.clone();
      url.pathname = `${LP_INTERNAL_PREFIX}${pathname}/link`;
      url.search = "";
      const headers = new Headers(request.headers);
      headers.set(TOKEN_HEADER, searchParams.get("t") ?? "");
      return semRastroNaUrl(NextResponse.rewrite(url, { request: { headers } }));
    }

    if (PAGINAS_LP.includes(pathname)) {
      return rewrite(request, `${LP_INTERNAL_PREFIX}${pathname}`);
    }

    // Página 404 com a cara da LP (ver src/app/lp/[...resto]).
    return rewrite(request, `${LP_INTERNAL_PREFIX}/nao-encontrado`);
  }

  if (pathname === LP_INTERNAL_PREFIX || pathname.startsWith(`${LP_INTERNAL_PREFIX}/`)) {
    return rewrite(request, NAO_EXISTE);
  }

  return NextResponse.next();
}

export const config = {
  // Tudo, menos assets do Next e arquivos com extensão (public/).
  matcher: ["/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)"],
};
