import { RamoNegocio } from "@/components/fluxo-b/etapas/RamoNegocio";
import { configDoServidor } from "@/config/fluxoB";

/** Fluxo B — ramo do negócio. */
export default function FluxoBRamoPage() {
  return <RamoNegocio cfg={configDoServidor()} />;
}
