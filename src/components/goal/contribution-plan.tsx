"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { ContributionPhase } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock } from "lucide-react";

function getCurrentPhase(): number {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  if (month <= "2026-10") return 1;
  if (month <= "2027-02") return 2;
  return 3;
}

export function ContributionPlan({ phases }: { phases: ContributionPhase[] }) {
  const currentPhase = getCurrentPhase();

  return (
    <Card>
      <CardTitle>Plano de Aportes</CardTitle>
      <p className="mt-1 mb-5 text-[13px] text-[#8E8E93]">
        Graduação mensal até a meta
      </p>

      <div className="space-y-3">
        {phases.map((phase) => {
          const isCurrent = phase.phase === currentPhase;
          const isPast = phase.phase < currentPhase;

          return (
            <div
              key={phase.phase}
              className={cn(
                "rounded-2xl p-5 transition-all",
                isCurrent
                  ? "bg-[#007AFF]/5 ring-1 ring-[#007AFF]/20"
                  : "bg-[#F2F2F7] dark:bg-[#2C2C2E]"
              )}
            >
              {isCurrent && (
                <Badge variant="info" className="mb-3">FASE ATUAL</Badge>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold",
                      isCurrent ? "bg-[#007AFF] text-white"
                        : isPast ? "bg-[#34C759] text-white"
                        : "bg-[#E5E5EA] text-[#8E8E93] dark:bg-[#3A3A3C]"
                    )}
                  >
                    {isPast ? <CheckCircle size={18} /> : isCurrent ? <Clock size={18} /> : phase.phase}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-[#000] dark:text-white">
                      {phase.name}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[#8E8E93]">{phase.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {phase.months.map((m) => (
                        <span key={m} className="rounded-md bg-white px-1.5 py-0.5 text-[11px] font-medium text-[#8E8E93] dark:bg-[#1C1C1E]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[22px] font-bold text-[#000] dark:text-white">
                    {formatCurrency(phase.suggestedContribution)}
                  </p>
                  <p className="text-[11px] text-[#8E8E93]">por mês</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-[13px] text-[#8E8E93] leading-relaxed">
        O objetivo não precisa ser cumprido em data exata. Mantenha consistência e ajuste conforme cada mês.
      </p>
    </Card>
  );
}
