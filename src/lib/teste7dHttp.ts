import { NextResponse } from "next/server";
import type { z } from "zod";
import { DatabaseNotConfiguredError } from "./teste7dDb";

/** Respostas de erro das rotas `/api/teste7d/*` — sempre `{ ok: false,
 * error }` com texto pronto pra mostrar pra quem está preenchendo. */
export function erro(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export const SEM_SESSAO =
  "Não encontramos a sua inscrição neste navegador. Preencha o formulário do teste grátis de novo para continuar.";

/** Lê e valida o JSON do corpo; devolve o dado ou a resposta de erro. */
export async function lerCorpo<S extends z.ZodType>(
  request: Request,
  schema: S,
): Promise<{ data: z.output<S> } | { response: NextResponse }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { response: erro("Não conseguimos ler os dados enviados. Tente de novo.", 400) };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    // `campo` deixa o formulário mostrar o erro embaixo do campo certo.
    return {
      response: NextResponse.json(
        {
          ok: false,
          error: issue?.message ?? "Confira os dados e tente de novo.",
          campo: typeof issue?.path[0] === "string" ? issue.path[0] : undefined,
        },
        { status: 422 },
      ),
    };
  }
  return { data: parsed.data };
}

/** Erro inesperado (banco fora, config faltando): loga e devolve mensagem genérica. */
export function erroInterno(label: string, err: unknown) {
  if (err instanceof DatabaseNotConfiguredError) {
    console.error(`[${label}] DATABASE_URL não configurada.`);
  } else {
    console.error(`[${label}] Erro inesperado:`, err);
  }
  return erro(
    "Não deu para salvar agora. Tente de novo em instantes ou chame a gente no WhatsApp.",
    503,
  );
}
