import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { FLUXO_B_HOST, SIGNUP_TIMEOUT_MS } from "@/config/fluxoB";
import { criarLimitador, LIMITE_EMAIL, LIMITE_IP, origemPermitidaNaRota } from "@/lib/fluxo-b/protecao";
import { destinoPermitido, origensDeRedirect, urlDoSignup } from "@/lib/fluxo-b/regras";
import { normalizarSignup, parseSignupResponse, SignupContratoError, type SignupResult } from "@/lib/fluxo-b/signup";

/**
 * Fluxo B — cria a conta de teste no app do ady. Repassa pro endpoint
 * público do app (sem CORS no navegador e sem expor a URL) e devolve
 * sempre um `SignupResult` (ver `lib/fluxo-b/signupResposta.ts`).
 *
 * Corpo enviado ao app: EXATAMENTE `{ name, email, phone }` (E.164).
 *
 * Proteção (a API do app não tem):
 * - só POST (o Next responde 405 pros outros métodos), com `Origin` do
 *   mesmo host e host permitido (host próprio, preview, localhost);
 * - honeypot `empresa_site` (o mesmo do formulário da LP atual):
 *   preenchido → finge sucesso sem chamar o app;
 * - limite por IP (5 / 10 min) e por e-mail (1 / min) → 429. Em memória,
 *   MELHOR ESFORÇO: em serverless cada instância tem a sua (ver
 *   lib/fluxo-b/protecao.ts).
 * Nunca loga e-mail, telefone ou token; IP e e-mail viram hash.
 */
const DEV = process.env.NODE_ENV !== "production";
const limiteIp = criarLimitador(LIMITE_IP);
const limiteEmail = criarLimitador(LIMITE_EMAIL);

const hash = (valor: string) => createHash("sha256").update(valor).digest("base64url");

function resposta(r: SignupResult, init: { status?: number; debug?: string; retryAfter?: number } = {}) {
  const headers: Record<string, string> = { "Cache-Control": "no-store" };
  if (init.retryAfter) headers["Retry-After"] = String(init.retryAfter);
  const status = init.status ?? (!r.ok && r.code === "RATE_LIMIT" ? 429 : 200);
  return NextResponse.json(DEV && init.debug ? { ...r, debug: init.debug } : r, { status, headers });
}

function ipDa(request: Request): string {
  const encaminhado = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return encaminhado || request.headers.get("x-real-ip")?.trim() || "desconhecido";
}

export async function POST(request: Request) {
  const extras = process.env.FLUXO_B_EXTRA_HOSTS?.split(",").map((h) => h.trim()).filter(Boolean) ?? [];
  const permitida = origemPermitidaNaRota({
    origin: request.headers.get("origin"),
    host: request.headers.get("host"),
    vercelEnv: process.env.VERCEL_ENV,
    hostsFluxoB: [FLUXO_B_HOST, ...extras],
    hostsPreview: [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL],
  });
  if (!permitida) return resposta({ ok: false, code: "INVALID" }, { status: 403 });

  const chaveIp = hash(ipDa(request));
  if (!limiteIp.tentar(chaveIp)) {
    return resposta({ ok: false, code: "RATE_LIMIT" }, { retryAfter: limiteIp.esperaSegundos(chaveIp) });
  }

  let entrada: Record<string, unknown>;
  try {
    const json = await request.json();
    entrada = json && typeof json === "object" ? (json as Record<string, unknown>) : {};
  } catch {
    return resposta({ ok: false, code: "INVALID" });
  }

  // Honeypot preenchido (bot): finge sucesso, sem chamar o app.
  if (typeof entrada.empresa_site === "string" && entrada.empresa_site.trim()) {
    return resposta({ ok: true, redirectUrl: null });
  }

  const body = normalizarSignup(entrada);
  if (!body) return resposta({ ok: false, code: "INVALID" });

  const chaveEmail = hash(body.email);
  if (!limiteEmail.tentar(chaveEmail)) {
    return resposta({ ok: false, code: "RATE_LIMIT" }, { retryAfter: limiteEmail.esperaSegundos(chaveEmail) });
  }

  let res: Response;
  try {
    res = await fetch(urlDoSignup({ trialSignupUrl: process.env.TRIAL_SIGNUP_URL, vercelEnv: process.env.VERCEL_ENV }), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name: body.name, email: body.email, phone: body.phone }),
      signal: AbortSignal.timeout(SIGNUP_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (err) {
    limiteEmail.liberar(chaveEmail); // falha nossa/da rede: não gasta a tentativa
    console.error(`[fluxo-b-signup] Falha de rede/timeout (${err instanceof Error ? err.name : "erro"}).`);
    return resposta({ ok: false, code: "NETWORK" });
  }

  const json = await res.json().catch(() => null);
  let r: SignupResult;
  try {
    r = parseSignupResponse(res.status, json);
  } catch (err) {
    if (err instanceof SignupContratoError) {
      console.error(err.message); // só status e código, sem valores
      return resposta({ ok: false, code: "UNKNOWN" }, { debug: err.message });
    }
    throw err;
  }
  if (!r.ok && (r.code === "NETWORK" || r.code === "RATE_LIMIT")) limiteEmail.liberar(chaveEmail);

  // O link de login (com token) só segue se for de uma origem permitida.
  if (r.ok && r.redirectUrl) {
    const origens = origensDeRedirect({ lista: process.env.FLUXO_B_REDIRECT_ORIGINS, vercelEnv: process.env.VERCEL_ENV });
    if (!destinoPermitido(r.redirectUrl, origens)) {
      let origem = "(inválida)";
      try {
        origem = new URL(r.redirectUrl).origin; // só a origem; o token nunca vai pro log
      } catch {}
      console.error(`[fluxo-b-signup] redirect_url fora de FLUXO_B_REDIRECT_ORIGINS: ${origem}`);
      return resposta({ ok: true, redirectUrl: null });
    }
  }
  return resposta(r);
}
