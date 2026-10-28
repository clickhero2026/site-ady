import { TESTE7D } from "@/config/teste7d";
import { LpHeader } from "@/components/lp/LpHeader";

export default function LpNotFound() {
  return (
    <>
      <LpHeader />
      <main id="conteudo" className="lp-section">
        <div className="lp-container" style={{ display: "grid", gap: "1.25rem", justifyItems: "center", textAlign: "center" }}>
          <h1 className="lp-h2">Essa página não existe.</h1>
          <p>Mas o teste grátis de 7 dias continua aqui.</p>
          <a href={TESTE7D.paginas.lp} className="lp-cta">
            QUERO TESTAR GRÁTIS POR 7 DIAS
          </a>
        </div>
      </main>
    </>
  );
}
