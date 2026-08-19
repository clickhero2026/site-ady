/**
 * Link de WhatsApp com mensagem pré-preenchida (página /obrigado, seção 5).
 * Número em `NEXT_PUBLIC_WHATSAPP_NUMBER` — formato E.164 sem "+",
 * ex. `5511999999999`. Enquanto não estiver configurado, `whatsappLink`
 * retorna `null` e a página trata a ausência sem mostrar um botão quebrado.
 */
export function whatsappLink(message: string): string | null {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
