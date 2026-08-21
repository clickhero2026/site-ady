import { buildWorkshopIcs } from "@/lib/workshopIcs";

/**
 * Serve o .ics do workshop pra download (botão "Adicionar na minha
 * agenda" da página /workshop/obrigado — Etapa 4). 404 enquanto
 * `WORKSHOP.dataISO` não estiver configurado, em vez de servir um evento
 * de calendário com data inventada.
 */
export async function GET() {
  const ics = buildWorkshopIcs();

  if (!ics) {
    return new Response("Data do workshop ainda não configurada.", {
      status: 404,
    });
  }

  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="workshop-ady.ics"',
    },
  });
}
