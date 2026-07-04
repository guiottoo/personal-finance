"use client";

import { useFinancialData } from "@/hooks/use-financial-data";
import { MonthlyTable } from "@/components/planning/monthly-table";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function PlanejamentoPage() {
  const { projection, settings, currentExpenses, currentSurplus, scenarios } = useFinancialData();

  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-bold text-[#000] dark:text-white">Planejamento</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Sobra Atual", value: currentSurplus, sub: "Com celular", color: "text-[#000] dark:text-white" },
          { label: "Sobra Futura", value: currentSurplus + settings.phoneInstallmentAmount, sub: "Sem celular", color: "text-[#34C759]" },
          { label: "Total Despesas", value: currentExpenses.total, sub: "Fixas + variaveis", color: "text-[#FF3B30]" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">{kpi.label}</p>
            <p className={`mt-2 text-[28px] font-bold tracking-tight ${kpi.color}`}>{formatCurrency(kpi.value)}</p>
            <p className="text-[11px] text-[#C7C7CC] mt-1">{kpi.sub}</p>
          </Card>
        ))}
      </div>

      <MonthlyTable projection={projection} goalAmount={settings.goalAmount} scenarios={scenarios} />
    </div>
  );
}
