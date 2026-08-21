/**
 * Link de WhatsApp com mensagem pré-preenchida. Número em formato E.164
 * sem "+", ex. `5511999999999`. Sem número configurado, retorna `null` —
 * quem chama trata a ausência sem mostrar um botão quebrado.
 */
export function buildWhatsappLink(
  number: string | null,
  message: string,
): string | null {
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Número da home (`NEXT_PUBLIC_WHATSAPP_NUMBER`) — página /obrigado. */
export function whatsappLink(message: string): string | null {
  return buildWhatsappLink(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null, message);
}
