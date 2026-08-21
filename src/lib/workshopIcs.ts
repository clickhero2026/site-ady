import { WORKSHOP, WORKSHOP_ZOOM_LINK } from "@/config/workshop";

/**
 * Gera o conteúdo de um arquivo .ics estático pro workshop (briefing,
 * seção 3: "gerar estático, não precisa de integração com Google
 * Calendar"). Título, data, hora, duração de 1h e o link do Zoom na
 * descrição.
 *
 * Retorna `null` se `WORKSHOP.dataISO` ainda não estiver configurado —
 * gerar um .ics com uma data inventada seria pior do que não oferecer o
 * botão (ver `WORKSHOP.dataISO` em `src/config/workshop.ts`).
 *
 * Simplificação deliberada: não faz "line folding" (RFC 5545, linhas de
 * até 75 octetos) — todo calendário moderno (Google, Apple, Outlook) lê
 * linhas mais longas sem problema, e a lista de leitores aqui é curta.
 */
export function buildWorkshopIcs(): string | null {
  const { dataISO, horarioHora, fusoOffsetUTC, duracaoMinutos, nome } = WORKSHOP;
  if (!dataISO) return null;

  const [year, month, day] = dataISO.split("-").map(Number);
  if (!year || !month || !day) return null;

  // Horário local (Brasília) → UTC: o offset já é negativo (-3), então
  // subtrair ele é somar 3h.
  const startUtc = new Date(
    Date.UTC(year, month - 1, day, horarioHora - fusoOffsetUTC, 0, 0),
  );
  const endUtc = new Date(startUtc.getTime() + duracaoMinutos * 60 * 1000);

  const descricao = [
    "Workshop ao vivo — vagas limitadas, sem gravação.",
    WORKSHOP_ZOOM_LINK
      ? `Link do Zoom: ${WORKSHOP_ZOOM_LINK}`
      : "Link do Zoom: você vai receber pelo WhatsApp antes do evento.",
  ].join("\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ady//workshop//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:workshop-ady-${dataISO}@useady.com.br`,
    `DTSTAMP:${toIcsUtcStamp(new Date())}`,
    `DTSTART:${toIcsUtcStamp(startUtc)}`,
    `DTEND:${toIcsUtcStamp(endUtc)}`,
    `SUMMARY:${escapeIcsText(`${nome} — workshop ao vivo`)}`,
    `DESCRIPTION:${escapeIcsText(descricao)}`,
    "LOCATION:Zoom",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  // RFC 5545 exige quebra de linha CRLF.
  return lines.join("\r\n") + "\r\n";
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toIcsUtcStamp(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}
