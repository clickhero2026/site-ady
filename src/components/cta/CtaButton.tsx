"use client";

import { useLeadModal } from "@/components/lead-modal/LeadModalContext";
import type { PlanoKey } from "@/lib/leadOptions";
import { trackSelectPlan } from "@/lib/analytics";
import styles from "./CtaButton.module.css";

interface CtaButtonProps {
  children: React.ReactNode;
  /** Plano de interesse a pré-preencher no formulário (seção 5). */
  plan?: PlanoKey;
  variant?: "solid" | "outline";
  className?: string;
}

/** CTA único do site: abre o formulário de lead em modal. */
export function CtaButton({
  children,
  plan,
  variant = "solid",
  className,
}: CtaButtonProps) {
  const { open } = useLeadModal();

  return (
    <button
      type="button"
      data-plan={plan}
      onClick={() => {
        // select_plan só nos botões de plano de verdade (Social/Completo)
        // — o CTA genérico do hero/CTA final não conta como isso.
        if (plan) trackSelectPlan(plan);
        open(plan);
      }}
      className={[styles.button, styles[variant], className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
