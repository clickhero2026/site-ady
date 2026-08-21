import { NextResponse } from "next/server";
import { workshopLeadSchema } from "@/lib/workshopLeadSchema";
import { sendWorkshopLeadToBitrix } from "@/lib/bitrix";
import { saveWorkshopLead } from "@/lib/workshopDb";

/**
 * Ponto de entrada da inscrição do workshop.
 *
 * O Postgres (Neon) é a gravação que decide sucesso/erro pra quem
 * preencheu o formulário — é a fonte de verdade pro follow-up depois. O
 * Bitrix é só um melhor esforço em paralelo: se falhar (hoje ele falha
 * sempre, o webhook está bloqueado até upgrade de plano), não trava o
 * cadastro nem aparece como erro pro usuário — só fica no log do
 * servidor.
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

  const parsed = workshopLeadSchema.safeParse(body);

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

  const dbResult = await saveWorkshopLead(parsed.data);

  // Bitrix não bloqueia a resposta — só loga se der errado (ver bitrix.ts).
  sendWorkshopLeadToBitrix(parsed.data).catch((err) => {
    console.error("[workshop-lead] Erro inesperado tentando o Bitrix:", err);
  });

  if (!dbResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Não deu pra enviar agora. Tenta de novo em instantes ou chama o Jean no WhatsApp.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
