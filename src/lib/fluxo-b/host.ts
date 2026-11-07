import { FLUXO_B_HOST } from "@/config/fluxoB";
import { ehHostDoFluxoB } from "./regras";

/** O host da requisição é o do Fluxo B (teste.useady.com.br ou um extra
 * de `FLUXO_B_EXTRA_HOSTS`)? O domínio principal e o host da LP atual
 * nunca entram (ver `hostsDoFluxoB`). Só servidor/proxy. */
export function isFluxoBHost(hostHeader: string | null | undefined): boolean {
  return ehHostDoFluxoB(hostHeader, FLUXO_B_HOST, process.env.FLUXO_B_EXTRA_HOSTS);
}
