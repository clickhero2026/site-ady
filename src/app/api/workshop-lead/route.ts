import { NextResponse } from "next/server";
import { workshopLeadSchema } from "@/lib/workshopLeadSchema";
import { sendWorkshopLeadToBitrix } from "@/lib/bitrix";

/**
 * Ponto de entrada da inscrição do workshop. Mesma lógica do `/api/lead`
 * da home (validação no servidor, honeypot, Bitrix24), campos adaptados
 * conforme a seção 6 do briefing-workshop-ady.md.
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

  const result = await sendWorkshopLeadToBitrix(parsed.data);

  if (!result.ok) {
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
