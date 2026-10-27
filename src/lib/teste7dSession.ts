import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { TESTE7D } from "@/config/teste7d";

/**
 * Liga o navegador à inscrição da etapa 1 sem expor nada além do id: um
 * cookie httpOnly com `<uuid>.<assinatura>`, assinado com HMAC-SHA256 e
 * `TESTE7D_COOKIE_SECRET`. A etapa 2 e o agendamento só aceitam chamada
 * com esse cookie válido — ninguém edita a inscrição de outra pessoa
 * chutando um uuid.
 *
 * O mesmo segredo, com outro rótulo, gera o `ip_hash` (rate limit e
 * auditoria sem guardar o IP puro).
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function secret(): string {
  const value = process.env.TESTE7D_COOKIE_SECRET;
  if (!value || value.length < 32) {
    throw new Error("TESTE7D_COOKIE_SECRET ausente ou curta demais (mínimo 32 caracteres).");
  }
  return value;
}

function hmac(label: string, value: string): string {
  return createHmac("sha256", secret()).update(`${label}:${value}`).digest("base64url");
}

export async function setInscricaoCookie(id: string) {
  const cookieStore = await cookies();
  cookieStore.set(TESTE7D.cookieName, `${id}.${hmac("cookie", id)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TESTE7D.cookieMaxAgeDias * 24 * 60 * 60,
  });
}

/** Id da inscrição do cookie, ou null se ausente/adulterado. */
export async function readInscricaoId(): Promise<string | null> {
  const raw = (await cookies()).get(TESTE7D.cookieName)?.value;
  if (!raw) return null;

  const [id, signature] = raw.split(".");
  if (!id || !signature || !UUID_RE.test(id)) return null;

  const expected = Buffer.from(hmac("cookie", id));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }
  return id;
}

/** IP do visitante atrás do proxy da Vercel, já em hash. */
export function hashRequestIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip")?.trim();
  return ip ? hmac("ip", ip) : null;
}

/** Comparação de chave em tempo constante (header do reenvio ao Bitrix). */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
