"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { PlanoKey } from "@/lib/leadOptions";

interface LeadModalState {
  isOpen: boolean;
  plan: PlanoKey | undefined;
  open: (plan?: PlanoKey) => void;
  close: () => void;
}

const LeadModalContext = createContext<LeadModalState | null>(null);

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState<PlanoKey | undefined>(undefined);

  const value = useMemo<LeadModalState>(
    () => ({
      isOpen,
      plan,
      open: (nextPlan) => {
        setPlan(nextPlan);
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
    }),
    [isOpen, plan],
  );

  return (
    <LeadModalContext.Provider value={value}>
      {children}
    </LeadModalContext.Provider>
  );
}

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) {
    throw new Error("useLeadModal precisa estar dentro de LeadModalProvider");
  }
  return ctx;
}
