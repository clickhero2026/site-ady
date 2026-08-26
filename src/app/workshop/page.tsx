import type { Metadata } from "next";
import { Hero } from "@/components/workshop/Hero";
import { ForWho } from "@/components/workshop/ForWho";
import { WhatYoullSee } from "@/components/workshop/WhatYoullSee";
import { PlatformPreview } from "@/components/workshop/PlatformPreview";
import { Presenters } from "@/components/workshop/Presenters";
import { RegistrationForm } from "@/components/workshop/RegistrationForm";
import { StickyMobileCta } from "@/components/workshop/StickyMobileCta";
import { WorkshopFooter } from "@/components/workshop/WorkshopFooter";

// Sem noindex aqui — só /workshop/obrigado leva noindex (briefing, seção 5).
export const metadata: Metadata = {
  title: "Workshop ao vivo: o Instagram que vende sozinho · ady",
  description:
    "Mostrando como um negócio local pode aparecer todo dia no Instagram e trazer cliente novo, sem contratar ninguém. 30 vagas, sem gravação.",
};

export default function WorkshopPage() {
  return (
    <>
      <Hero />
      <ForWho />
      <WhatYoullSee />
      <PlatformPreview />
      <Presenters />
      <RegistrationForm />
      {/* Rodapé mínimo, exclusivo do funil de workshop — só o símbolo do
          ady, sem links pra home nem pras demais páginas (pedido
          explícito do Rafael). */}
      <WorkshopFooter />
      <StickyMobileCta />
    </>
  );
}
