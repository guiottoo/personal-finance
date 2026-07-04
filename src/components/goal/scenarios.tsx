"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Scenario } from "@/lib/types";
import { Gauge, TrendingUp, Zap } from "lucide-react";

const meta = [
  { name: "conservative", icon: Gauge, color: "#FF9500", label: "Conservador", desc: "Margem para imprevistos" },
  { name: "realistic", icon: TrendingUp, color: "#007AFF", label: "Realista", desc: "Equilíbrio e disciplina" },
  { name: "strong", icon: Zap, color: "#34C759", label: "Forte", desc: "Foco máximo" },
];

export function ScenarioCards({ scenarios }: { scenarios: Scenario[] }) {
  return (
    <div>
      <p className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#8E8E93]">
        Cenarios
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {scenarios.map((s) => {
          const m = meta.find((x) => x.name === s.name)!;
          return (
            <Card key={s.name}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${m.color}15` }}>
                  <m.icon size={18} style={{ color: m.color }} />
                </div>
                <span className="text-[15px] font-semibold text-[#000] dark:text-white">{m.label}</span>
              </div>
              <p className="text-[34px] font-bold tracking-tight text-[#000] dark:text-white leading-none">
                {s.monthsToGoal}
                <span className="ml-1 text-[15px] font-medium text-[#8E8E93]">meses</span>
              </p>
              <p className="mt-1 text-[13px] text-[#8E8E93]">Conclusão em {s.completionDate}</p>
              <div className="mt-4 space-y-1.5 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Com celular</span>
                  <span className="font-semibold text-[#000] dark:text-white">{formatCurrency(s.monthlySavingsPhase1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Sem celular</span>
                  <span className="font-semibold text-[#000] dark:text-white">{formatCurrency(s.monthlySavingsPhase2)}</span>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-[#C7C7CC]">{m.desc}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
