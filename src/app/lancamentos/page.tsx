"use client";

import { useFinancialData } from "@/hooks/use-financial-data";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
import { MonthSelector } from "@/components/ui/month-selector";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function LancamentosPage() {
  const { monthTransactions, addTransaction, removeTransaction, actualIncome, actualExpenses, currentContribution, selectedMonth, setSelectedMonth, availableMonths, settings } = useFinancialData();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-[#000] dark:text-white">Lancamentos</h2>
        <MonthSelector value={selectedMonth} onChange={setSelectedMonth} options={availableMonths} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Entradas", value: actualIncome, color: "text-[#34C759]" },
          { label: "Saidas", value: actualExpenses, color: "text-[#FF3B30]" },
          { label: "Aportes", value: currentContribution, color: "text-[#007AFF]" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">{kpi.label}</p>
            <p className={`mt-1 text-[28px] font-bold tracking-tight ${kpi.color}`}>{formatCurrency(kpi.value)}</p>
          </Card>
        ))}
      </div>

      <TransactionForm onAdd={addTransaction} budgetCategories={settings.categoryBudgets.map((b) => b.category)} />
      <TransactionList transactions={monthTransactions} onRemove={removeTransaction} />
    </div>
  );
}
