import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CriarSenha } from "@/components/fluxo-b/etapas/CriarSenha";
import { FLUXO_B_PREFIX, FLUXO_B_TELAS, mockDoServidor, SENHA_ATIVA } from "@/config/fluxoB";
import { isFluxoBHost } from "@/lib/fluxo-b/host";

/**
 * Fluxo B — criar senha. Com NEXT_PUBLIC_FLUXO_B_SENHA desligada (padrão)
 * a tela não existe: volta pro fluxo normal (ramo → app) sem renderizar
 * nem carregar nada dela.
 */
export default async function FluxoBSenhaPage() {
  if (!SENHA_ATIVA) {
    const host = (await headers()).get("host");
    redirect(isFluxoBHost(host) ? FLUXO_B_TELAS.ramo : `${FLUXO_B_PREFIX}${FLUXO_B_TELAS.ramo}`);
  }
  return <CriarSenha mock={mockDoServidor()} />;
}
