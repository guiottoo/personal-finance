"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

interface KPIData {
  income: number;
  fixedExpenses: number;
  contribution: number;
  freeBalance: number;
  goalProgress: number;
  goalAmount: number;
  accumulated: number;
}

export function KPICards({ data }: { data: KPIData }) {
  return (
    <div className="space-y-4">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Receita Util", value: data.income, color: "text-[#34C759]" },
          { label: "Despesas Fixas", value: data.fixedExpenses, color: "text-[#FF3B30]" },
          { label: "Aporte do Mês", value: data.contribution, color: "text-[#007AFF]" },
          { label: "Saldo Livre", value: data.freeBalance, color: "text-[#000] dark:text-white" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">
              {kpi.label}
            </p>
            <p className={`mt-2 text-[28px] font-bold tracking-tight ${kpi.color}`}>
              {formatCurrency(kpi.value)}
            </p>
          </Card>
        ))}
      </div>

      {/* Goal Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#007AFF]">
              <Target size={22} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">
                Meta do Carro
              </p>
              <p className="text-[34px] font-bold tracking-tight text-[#000] dark:text-white leading-none mt-1">
                {formatCurrency(data.accumulated)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[34px] font-bold text-[#007AFF] tracking-tight leading-none">
              {(data.goalProgress * 100).toFixed(1)}%
            </p>
            <p className="text-[13px] text-[#8E8E93] mt-1">
              de {formatCurrency(data.goalAmount)}
            </p>
          </div>
        </div>
        <Progress value={data.goalProgress} size="lg" className="mt-5" />
        <p className="mt-2 text-[13px] text-[#8E8E93]">
          Faltam {formatCurrency(data.goalAmount - data.accumulated)}
        </p>
      </Card>
    </div>
  );
}
