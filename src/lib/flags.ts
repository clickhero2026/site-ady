/**
 * Flags de conteúdo. Ponto único: nenhum componente lê `process.env`
 * direto pra decidir o que mostrar.
 *
 * `NEXT_PUBLIC_GOOGLE_ADS_LIVE` — o Google pode ser citado na LP do teste
 * grátis (decisão do Rafael, 27/10/2026), só na seção "O que o ady faz"
 * (terceiro bloco) e no segundo cartão de "Tudo num lugar só". Padrão
 * ligado; "false" volta tudo pro texto só com Instagram e Facebook.
 * Como é NEXT_PUBLIC, o valor entra no build: trocar exige novo deploy.
 */
export const GOOGLE_ADS_LIVE = process.env.NEXT_PUBLIC_GOOGLE_ADS_LIVE !== "false";

/** Onde os anúncios rodam, na ordem em que aparecem no texto e nos mockups. */
export const AD_CHANNELS: readonly string[] = GOOGLE_ADS_LIVE
  ? ["Instagram", "Facebook", "Google"]
  : ["Instagram", "Facebook"];

/** "no Instagram, no Facebook e no Google" / "no Instagram e no Facebook". */
export function adChannelsText(): string {
  const parts = AD_CHANNELS.map((canal) => `no ${canal}`);
  return parts.length > 1
    ? `${parts.slice(0, -1).join(", ")} e ${parts[parts.length - 1]}`
    : parts[0];
}
