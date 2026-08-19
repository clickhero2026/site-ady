import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/leadSchema";
import { sendLeadToBitrix } from "@/lib/bitrix";

/**
 * Único ponto de entrada do formulário de lead. Roda no servidor de
 * propósito: a chave do Bitrix nunca aparece no bundle do cliente.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Corpo da requisição inválido." },
      { status: 400 },
    );
  }

  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: firstIssue?.message ?? "Dados inválidos." },
      { status: 422 },
    );
  }

  // Honeypot preenchido: finge sucesso, não processa (bot).
  if (parsed.data.empresa_site) {
    return NextResponse.json({ ok: true });
  }

  const result = await sendLeadToBitrix(parsed.data);

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Não deu pra enviar agora. Tenta de novo em instantes ou chama no WhatsApp.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
