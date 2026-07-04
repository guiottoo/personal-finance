"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { MonthlyBudget, Scenario } from "@/lib/types";
import { MONTHS_PT } from "@/lib/constants";

function monthLabel(monthStr: string): string {
  const [year, m] = monthStr.split("-").map(Number);
  return `${MONTHS_PT[m - 1]} ${year}`;
}

// Determina a cor da linha baseado em qual cenario atingiria a meta naquele mes
function getScenarioColor(accumulated: number, scenarios: Scenario[]): string | null {
  const conservative = scenarios.find((s) => s.name === "conservative");
  const realistic = scenarios.find((s) => s.name === "realistic");
  const strong = scenarios.find((s) => s.name === "strong");

  if (strong && accumulated >= 20000) return "bg-[#34C759]/5"; // verde = forte
  if (realistic && accumulated >= 16000) return "bg-[#007AFF]/5"; // azul = realista
  if (conservative && accumulated >= 12000) return "bg-[#FF9500]/5"; // laranja = conservador
  return null;
}

export function MonthlyTable({
  projection,
  goalAmount,
  scenarios,
}: {
  projection: MonthlyBudget[];
  goalAmount: number;
  scenarios: Scenario[];
}) {
  return (
    <Card variant="grouped">
      <div className="p-5 sm:p-6">
        <CardTitle>Planejamento Mensal</CardTitle>
        <p className="mt-1 text-[13px] text-[#8E8E93]">
          Já descontando besteiras, alimentação, transporte e lazer
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#FF9500]" />
            <span className="text-[#8E8E93]">Conservador</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#007AFF]" />
            <span className="text-[#8E8E93]">Realista</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#34C759]" />
            <span className="text-[#8E8E93]">Forte</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-t border-[rgba(60,60,67,0.12)] dark:border-[rgba(84,84,88,0.36)]">
              {["Mês", "Receita", "Fixas", "Variáveis", "Aporte", "Folga", "Acumulado"].map((col) => (
                <th key={col} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider ${col === "Mês" ? "text-left" : "text-right"} ${col === "Aporte" ? "text-[#007AFF]" : "text-[#8E8E93]"}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projection.map((row, i) => {
              const isGoalReached = row.accumulated >= goalAmount && (i === 0 || projection[i - 1].accumulated < goalAmount);
              const pct = row.accumulated / goalAmount;
              // Color based on progress toward goal
              let rowColor = "";
              if (pct >= 1) rowColor = "bg-[#34C759]/8";
              else if (pct >= 0.8) rowColor = "bg-[#34C759]/4";
              else if (pct >= 0.6) rowColor = "bg-[#007AFF]/4";
              else if (pct >= 0.4) rowColor = "bg-[#FF9500]/4";

              return (
                <tr key={row.month} className={`border-t border-[rgba(60,60,67,0.08)] dark:border-[rgba(84,84,88,0.18)] ${rowColor} ${i === 0 ? "!bg-[#007AFF]/8" : ""}`}>
                  <td className="px-5 py-3 text-[15px] font-medium text-[#000] dark:text-white">
                    <div className="flex items-center gap-2">
                      {monthLabel(row.month)}
                      {i === 0 && <Badge variant="info">Atual</Badge>}
                      {isGoalReached && <Badge variant="success">Meta!</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right text-[15px] text-[#3C3C43] dark:text-[#EBEBF5]">{formatCurrency(row.income)}</td>
                  <td className="px-5 py-3 text-right text-[15px] text-[#FF3B30]">-{formatCurrency(row.fixedExpenses)}</td>
                  <td className="px-5 py-3 text-right text-[15px] text-[#FF9500]">-{formatCurrency(row.variableExpenses)}</td>
                  <td className="px-5 py-3 text-right text-[15px] font-semibold text-[#007AFF]">{formatCurrency(row.contribution)}</td>
                  <td className="px-5 py-3 text-right text-[15px] text-[#8E8E93]">{formatCurrency(row.finalBalance)}</td>
                  <td className="px-5 py-3 text-right text-[15px] font-semibold text-[#000] dark:text-white">{formatCurrency(row.accumulated)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
