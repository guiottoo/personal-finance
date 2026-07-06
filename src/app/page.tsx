"use client";

import { useFinancialData } from "@/hooks/use-financial-data";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { MonthlyOverviewChart } from "@/components/dashboard/monthly-overview";
import { GoalProgressChart } from "@/components/dashboard/goal-progress";
import { BudgetTracker } from "@/components/dashboard/budget-tracker";
import { MonthSelector } from "@/components/ui/month-selector";

export default function DashboardPage() {
  const {
    settings, currentExpenses, currentContribution, currentSurplus,
    goalAmount, currentAccumulated, goalProgress, projection,
    categoryBudgets, selectedMonth, setSelectedMonth, availableMonths,
    actualIncome, actualExpenses, monthTransactions,
  } = useFinancialData();

  const budgetCats = new Set(settings.categoryBudgets.map((b) => b.category));
  const unbudgetedExpenses = monthTransactions
    .filter((t) => t.type === "expense" && !budgetCats.has(t.category))
    .reduce((s, t) => s + t.amount, 0);

  // Para cada categoria: desconta o maior entre limite e gasto real
  const budgetImpact = categoryBudgets.reduce((s, b) => s + Math.max(b.limit, b.spent), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-[#000] dark:text-white">Resumo</h2>
        <MonthSelector value={selectedMonth} onChange={setSelectedMonth} options={availableMonths} />
      </div>

      <KPICards
        data={{
          income: actualIncome > 0 ? actualIncome : settings.monthlyIncome,
          fixedExpenses: currentExpenses.fixed + currentExpenses.phone,
          contribution: currentContribution,
          budgetLimits: budgetImpact,
          unbudgetedExpenses,
          freeBalance: (actualIncome > 0 ? actualIncome : settings.monthlyIncome) - (currentExpenses.fixed + currentExpenses.phone) - currentContribution - budgetImpact - unbudgetedExpenses,
          goalProgress, goalAmount,
          accumulated: currentAccumulated,
        }}
      />

      <BudgetTracker budgets={categoryBudgets} />

      <div className="grid gap-4 lg:grid-cols-2">
        <MonthlyOverviewChart projection={projection} />
        <GoalProgressChart projection={projection} goalAmount={goalAmount} />
      </div>
    </div>
  );
}
