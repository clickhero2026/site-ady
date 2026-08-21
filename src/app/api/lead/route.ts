import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/leadSchema";
import { sendLeadToBitrix } from "@/lib/bitrix";

/**
 * Único ponto de entrada do formulário de lead da home. Roda no servidor
 * de propósito: a chave do Bitrix nunca aparece no bundle do cliente.
 *
 * O Bitrix é só melhor esforço em paralelo — não bloqueia a resposta nem
 * vira erro pro usuário se falhar (hoje ele falha sempre: o webhook está
 * bloqueado até upgrade de plano). Mesmo padrão já usado em
 * `/api/workshop-lead`. O canal efetivo de contato agora é o
 * redirecionamento automático pro WhatsApp em /obrigado (ver
 * `WhatsappCta.tsx`) — diferente do workshop, a home ainda não tem banco
 * de dados próprio; se isso precisar existir, é o mesmo padrão do
 * `workshopDb.ts`.
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

  sendLeadToBitrix(parsed.data).catch((err) => {
    console.error("[lead] Erro inesperado tentando o Bitrix:", err);
  });

  return NextResponse.json({ ok: true });
}
