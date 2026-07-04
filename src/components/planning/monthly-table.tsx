"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { MonthlyBudget } from "@/lib/types";
import { MONTHS_PT } from "@/lib/constants";

function monthLabel(monthStr: string): string {
  const [year, m] = monthStr.split("-").map(Number);
  return `${MONTHS_PT[m - 1]} ${year}`;
}

export function MonthlyTable({ projection, goalAmount }: { projection: MonthlyBudget[]; goalAmount: number }) {
  return (
    <Card variant="grouped">
      <div className="p-5 sm:p-6">
        <CardTitle>Planejamento Mensal</CardTitle>
        <p className="mt-1 text-[13px] text-[#8E8E93]">
          Já descontando besteiras, alimentação, transporte e lazer
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-t border-[rgba(60,60,67,0.12)] dark:border-[rgba(84,84,88,0.36)]">
              {["Mes", "Receita", "Fixas", "Variaveis", "Aporte", "Folga", "Acumulado"].map((col) => (
                <th key={col} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider ${col === "Mes" ? "text-left" : "text-right"} ${col === "Aporte" ? "text-[#007AFF]" : "text-[#8E8E93]"}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projection.map((row, i) => {
              const isGoalReached = row.accumulated >= goalAmount && (i === 0 || projection[i - 1].accumulated < goalAmount);
              return (
                <tr key={row.month} className="border-t border-[rgba(60,60,67,0.08)] dark:border-[rgba(84,84,88,0.18)]">
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
