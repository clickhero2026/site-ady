import { CriandoConta } from "@/components/fluxo-b/etapas/CriandoConta";
import { mockDoServidor } from "@/config/fluxoB";

/** Fluxo B — "Sua conta foi criada!" (o POST do signup sai daqui). */
export default function FluxoBCriandoPage() {
  return <CriandoConta mock={mockDoServidor()} />;
}
