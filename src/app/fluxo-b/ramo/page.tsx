import { RamoNegocio } from "@/components/fluxo-b/etapas/RamoNegocio";
import { mockDoServidor } from "@/config/fluxoB";

/** Fluxo B — ramo do negócio. */
export default function FluxoBRamoPage() {
  return <RamoNegocio mock={mockDoServidor()} />;
}
