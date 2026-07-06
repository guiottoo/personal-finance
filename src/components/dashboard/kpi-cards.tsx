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
  budgetLimits: number;
  unbudgetedExpenses: number;
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
          { label: "Saldo Livre", value: data.freeBalance, color: data.freeBalance >= 0 ? "text-[#34C759]" : "text-[#FF3B30]" },
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

      <Card>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93] mb-3">Como chega no Saldo Livre</p>
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between">
            <span className="text-[#8E8E93]">Receita do mês</span>
            <span className="font-semibold text-[#34C759]">{formatCurrency(data.income)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8E8E93]">Fixas + celular</span>
            <span className="text-[#FF3B30]">-{formatCurrency(data.fixedExpenses)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8E8E93]">Aporte</span>
            <span className="text-[#007AFF]">-{formatCurrency(data.contribution)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8E8E93]">Orçamentos (limites)</span>
            <span className="text-[#FF9500]">-{formatCurrency(data.budgetLimits)}</span>
          </div>
          {data.unbudgetedExpenses > 0 && (
            <div className="flex justify-between">
              <span className="text-[#8E8E93]">Gastos avulsos (dívidas, etc)</span>
              <span className="text-[#FF3B30]">-{formatCurrency(data.unbudgetedExpenses)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-[rgba(60,60,67,0.08)] pt-2 dark:border-[rgba(84,84,88,0.18)]">
            <span className="font-semibold text-[#000] dark:text-white">Saldo Livre</span>
            <span className={`font-bold ${data.freeBalance >= 0 ? "text-[#34C759]" : "text-[#FF3B30]"}`}>{formatCurrency(data.freeBalance)}</span>
          </div>
        </div>
      </Card>

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
