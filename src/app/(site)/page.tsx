import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhatAdyDoes } from "@/components/sections/WhatAdyDoes";
import { SeeItWorking } from "@/components/sections/SeeItWorking";
import { Founder } from "@/components/sections/Founder";
import { Comparison } from "@/components/sections/Comparison";
import { Plans } from "@/components/sections/Plans";
import { Faq } from "@/components/sections/Faq";
import { RoadmapTeaser } from "@/components/sections/RoadmapTeaser";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <WhatAdyDoes />
      <SeeItWorking />
      <Founder />
      <Comparison />
      <Plans />
      <Faq />
      <RoadmapTeaser />
      <FinalCta />
    </>
  );
}
