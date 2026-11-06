import { FLUXO_B_HOST } from "@/config/fluxoB";

/** O host da requisição é o do Fluxo B (teste.useady.com.br ou um extra
 * de `FLUXO_B_EXTRA_HOSTS`)? Só servidor/proxy. */
export function isFluxoBHost(hostHeader: string | null | undefined): boolean {
  const hostname = (hostHeader ?? "").split(":")[0].toLowerCase();
  if (!hostname) return false;
  if (hostname === FLUXO_B_HOST) return true;
  const extras = process.env.FLUXO_B_EXTRA_HOSTS?.split(",").map((h) => h.trim().toLowerCase());
  return Boolean(extras?.includes(hostname));
}
