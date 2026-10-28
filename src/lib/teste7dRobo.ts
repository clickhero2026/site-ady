import "server-only";
import { ROBOS_USER_AGENT } from "@/config/robos";

const ROBOS = ROBOS_USER_AGENT.map((trecho) => trecho.toLowerCase());

/** HEAD, User-Agent ausente ou de robô (`src/config/robos.ts`): não é a
 * pessoa abrindo o link — não conta como retomada. */
export function ehRobo(request: Request): boolean {
  if (request.method === "HEAD") return true;
  const ua = request.headers.get("user-agent")?.toLowerCase().trim();
  return !ua || ROBOS.some((trecho) => ua.includes(trecho));
}

const DESCRICAO = "Continue a ativação da sua conta";

/** O que o robô vê (e o que vira a prévia no WhatsApp): página mínima,
 * 200, sem indexar e sem nenhum dado da pessoa nem o token. */
export function paginaParaRobo(cabecalhos: Record<string, string>): Response {
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ady</title>
<meta name="description" content="${DESCRICAO}">
<meta property="og:title" content="ady">
<meta property="og:description" content="${DESCRICAO}">
<meta property="og:type" content="website">
<meta name="robots" content="noindex, nofollow">
</head>
<body>
<p>${DESCRICAO}</p>
</body>
</html>
`;
  return new Response(html, {
    status: 200,
    headers: { ...cabecalhos, "Content-Type": "text/html; charset=utf-8" },
  });
}
