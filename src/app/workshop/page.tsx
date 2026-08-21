import type { Metadata } from "next";
import { Hero } from "@/components/workshop/Hero";
import { ForWho } from "@/components/workshop/ForWho";
import { WhatYoullSee } from "@/components/workshop/WhatYoullSee";
import { Presenters } from "@/components/workshop/Presenters";
import { Honesty } from "@/components/workshop/Honesty";
import { RegistrationForm } from "@/components/workshop/RegistrationForm";
import { StickyMobileCta } from "@/components/workshop/StickyMobileCta";
import { SiteFooter } from "@/components/layout/SiteFooter";

// Sem noindex aqui — só /workshop/obrigado leva noindex (briefing, seção 5).
export const metadata: Metadata = {
  title: "Workshop ao vivo: o Instagram que vende sozinho · ady",
  description:
    "Uma hora ao vivo mostrando como um negócio local pode aparecer todo dia no Instagram e trazer cliente novo, sem contratar ninguém. 30 vagas, sem gravação.",
};

export default function WorkshopPage() {
  return (
    <>
      <Hero />
      <ForWho />
      <WhatYoullSee />
      <Presenters />
      <Honesty />
      <RegistrationForm />
      {/* Seção 7 — "Padrão do site": mesmo rodapé da home. Ele não tem
          link pra "/" em lugar nenhum, só pra /roadmap, /privacidade,
          /termos e Instagram — não viola a regra de "sem navegação pra
          home". */}
      <SiteFooter />
      <StickyMobileCta />
    </>
  );
}
