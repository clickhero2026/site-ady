import { NextResponse } from "next/server";
import { SIGNUP_TIMEOUT_MS } from "@/config/fluxoB";
import { destinoPermitido, origensDeRedirect, urlDoSignup } from "@/lib/fluxo-b/regras";
import { normalizarSignup, parseSignupResponse, SignupContratoError, type SignupResult } from "@/lib/fluxo-b/signup";

/**
 * Fluxo B — cria a conta de teste no app do ady. Repassa pro endpoint
 * público do app (sem CORS no navegador e sem expor a URL) e devolve
 * sempre um `SignupResult` (200), com o mapeamento de
 * `lib/fluxo-b/signup.ts`.
 *
 * Corpo enviado ao app: EXATAMENTE `{ name, email, phone }` (phone em
 * E.164). Nada de dado pessoal no log.
 */
const DEV = process.env.NODE_ENV !== "production";

function resultado(r: SignupResult, debug?: string) {
  return NextResponse.json(DEV && debug ? { ...r, debug } : r, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  // Só o próprio site chama esta rota (não é proxy aberto pro app).
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ ok: false, code: "INVALID" }, { status: 403 });
  }

  let entrada: unknown;
  try {
    entrada = await request.json();
  } catch {
    return resultado({ ok: false, code: "INVALID" });
  }
  const body = normalizarSignup((entrada ?? {}) as Record<string, unknown>);
  if (!body) return resultado({ ok: false, code: "INVALID" });

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
    const tipo = err instanceof Error ? err.name : "erro";
    console.error(`[fluxo-b-signup] Falha de rede/timeout (${tipo}).`);
    return resultado({ ok: false, code: "NETWORK" });
  }

  const json = await res.json().catch(() => null);
  try {
    const r = parseSignupResponse(res.status, json);
    // O link de login (com token) só segue se for de uma origem permitida.
    if (r.ok && r.redirectUrl) {
      const origens = origensDeRedirect({ lista: process.env.FLUXO_B_REDIRECT_ORIGINS, vercelEnv: process.env.VERCEL_ENV });
      if (!destinoPermitido(r.redirectUrl, origens)) {
        let origem = "(inválida)";
        try {
          origem = new URL(r.redirectUrl).origin; // só a origem; o token nunca vai pro log
        } catch {}
        console.error(`[fluxo-b-signup] loginUrl fora de FLUXO_B_REDIRECT_ORIGINS: ${origem}`);
        return resultado({ ok: true, redirectUrl: null });
      }
    }
    return resultado(r);
  } catch (err) {
    if (err instanceof SignupContratoError) {
      // Só status e nomes de chave (ver SignupContratoError) — sem valores.
      console.error(err.message);
      return resultado({ ok: false, code: "UNKNOWN" }, err.message);
    }
    throw err;
  }
}
