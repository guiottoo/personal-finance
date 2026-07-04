"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { CategoryBudget } from "@/lib/types";

export function BudgetTracker({ budgets }: { budgets: CategoryBudget[] }) {
  if (budgets.length === 0) return null;

  return (
    <Card>
      <CardTitle>Orçamentos do Mês</CardTitle>
      <div className="mt-4 space-y-5">
        {budgets.map((b) => {
          const pct = Math.min(b.spent / b.limit, 1);
          const isOver = b.spent > b.limit;
          const isWarn = pct >= 0.8 && !isOver;
          const barColor = isOver
            ? "bg-[#FF3B30]"
            : isWarn
              ? "bg-[#FF9500]"
              : "bg-[#007AFF]";

          return (
            <div key={b.category}>
              <div className="flex items-end justify-between mb-1.5">
                <p className="text-[15px] font-medium text-[#000] dark:text-white">
                  {b.category}
                </p>
                <p className="text-[13px] text-[#8E8E93]">
                  {formatCurrency(b.spent)}
                  <span className="text-[#C7C7CC]"> / {formatCurrency(b.limit)}</span>
                </p>
              </div>
              <div className="h-2 w-full rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E]">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${pct * 100}%` }}
                />
              </div>
              <p className="mt-1 text-right text-[11px] text-[#8E8E93]">
                {isOver
                  ? `+${formatCurrency(b.spent - b.limit)} acima`
                  : `${formatCurrency(b.remaining)} restam`}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
