"use client";

import { useState } from "react";
import { useFinancialData } from "@/hooks/use-financial-data";
import { Card, CardTitle } from "@/components/ui/card";
import { MonthSelector } from "@/components/ui/month-selector";
import { formatCurrency, categoryLabel } from "@/lib/utils";
import type { Transaction, CategoryBudget } from "@/lib/types";
import { ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Pencil, Check, Plus, Trash2 } from "lucide-react";

const PAGE_SIZE = 8;

function CategoryCard({ budget, transactions, onEditLimit }: { budget: CategoryBudget; transactions: Transaction[]; onEditLimit: (newLimit: number) => void }) {
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(budget.limit));
  const pct = Math.min(budget.spent / budget.limit, 1);
  const isOver = budget.spent > budget.limit;
  const isWarn = pct >= 0.8 && !isOver;
  const barColor = isOver ? "bg-[#FF3B30]" : isWarn ? "bg-[#FF9500]" : "bg-[#007AFF]";
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const paginated = transactions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const saveEdit = () => {
    const val = parseFloat(editValue);
    if (val > 0) onEditLimit(val);
    setEditing(false);
  };

  return (
    <Card variant="grouped">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <p className="text-[17px] font-semibold text-[#000] dark:text-white">{categoryLabel(budget.category)}</p>
            <button onClick={() => { setEditing(!editing); setEditValue(String(budget.limit)); }} className="p-1 text-[#007AFF]"><Pencil size={14} /></button>
          </div>
          {editing ? (
            <div className="flex items-center gap-1">
              <span className="text-[13px] text-[#8E8E93]">R$</span>
              <input value={editValue} onChange={(e) => setEditValue(e.target.value)} type="number" className="w-20 rounded-lg bg-[#F2F2F7] px-2 py-1 text-right text-[15px] font-semibold text-[#000] outline-none dark:bg-[#2C2C2E] dark:text-white" autoFocus />
              <button onClick={saveEdit} className="p-1 text-[#34C759]"><Check size={16} /></button>
            </div>
          ) : (
            <p className="text-[15px] text-[#8E8E93]">
              <span className={isOver ? "text-[#FF3B30] font-semibold" : "font-semibold text-[#000] dark:text-white"}>{formatCurrency(budget.spent)}</span>
              <span className="text-[#C7C7CC]"> / {formatCurrency(budget.limit)}</span>
            </p>
          )}
        </div>
        <div className="h-2 w-full rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] mb-1">
          <div className={`h-2 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct * 100}%` }} />
        </div>
        <p className="text-right text-[11px] text-[#8E8E93]">
          {isOver ? `+${formatCurrency(budget.spent - budget.limit)} acima` : `${formatCurrency(budget.remaining)} restam`}
        </p>
      </div>
      {paginated.length > 0 && (
        <div className="divide-y divide-[rgba(60,60,67,0.08)] border-t border-[rgba(60,60,67,0.08)] dark:divide-[rgba(84,84,88,0.18)] dark:border-[rgba(84,84,88,0.18)]">
          {paginated.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-5 py-2.5 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#C7C7CC] w-10">{t.date.substring(8)}/{t.date.substring(5, 7)}</span>
                <span className="text-[15px] text-[#000] dark:text-white">{t.description}</span>
              </div>
              <span className="text-[15px] font-semibold text-[#000] dark:text-white">{formatCurrency(t.amount)}</span>
            </div>
          ))}
        </div>
      )}
      {transactions.length === 0 && (
        <div className="px-5 pb-5 sm:px-6"><p className="text-[13px] text-[#C7C7CC]">Sem gastos nesta categoria</p></div>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 border-t border-[rgba(60,60,67,0.08)] px-5 py-2.5 dark:border-[rgba(84,84,88,0.18)]">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="rounded-full p-1 text-[#007AFF] disabled:text-[#C7C7CC]"><ChevronLeft size={16} /></button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`h-1.5 rounded-full transition-all ${i === page ? "w-4 bg-[#007AFF]" : "w-1.5 bg-[#C7C7CC] dark:bg-[#48484A]"}`} />
            ))}
          </div>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="rounded-full p-1 text-[#007AFF] disabled:text-[#C7C7CC]"><ChevronRight size={16} /></button>
        </div>
      )}
    </Card>
  );
}

export default function OrcamentosPage() {
  const { categoryBudgets, settings, setSettings, monthTransactions, selectedMonth, setSelectedMonth, availableMonths, currentExpenses, actualIncome } = useFinancialData();
  const [newCat, setNewCat] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const totalBudgeted = settings.categoryBudgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = categoryBudgets.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalBudgeted - totalSpent;
  const fixedTotal = currentExpenses.fixed + currentExpenses.phone;
  const worstCase = fixedTotal + totalBudgeted;
  const receitaMes = actualIncome > 0 ? actualIncome : settings.monthlyIncome;
  const sobraMinima = receitaMes - worstCase;
  const aporteViavel = sobraMinima > 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-[#000] dark:text-white">Orçamentos</h2>
        <MonthSelector value={selectedMonth} onChange={setSelectedMonth} options={availableMonths} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">Total orçado</p>
          <p className="mt-2 text-[28px] font-bold tracking-tight text-[#000] dark:text-white">{formatCurrency(totalBudgeted)}</p>
          <p className="text-[11px] text-[#C7C7CC] mt-1">{settings.categoryBudgets.length} categorias</p>
        </Card>
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">Já gasto</p>
          <p className="mt-2 text-[28px] font-bold tracking-tight text-[#FF9500]">{formatCurrency(totalSpent)}</p>
          <p className="text-[11px] text-[#C7C7CC] mt-1">{totalBudgeted > 0 ? ((totalSpent / totalBudgeted) * 100).toFixed(0) : 0}% do total</p>
        </Card>
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">Disponível</p>
          <p className={`mt-2 text-[28px] font-bold tracking-tight ${totalRemaining >= 0 ? "text-[#34C759]" : "text-[#FF3B30]"}`}>{formatCurrency(totalRemaining)}</p>
          <p className="text-[11px] text-[#C7C7CC] mt-1">restante</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          {aporteViavel ? <CheckCircle size={18} className="text-[#34C759] shrink-0" /> : <AlertTriangle size={18} className="text-[#FF3B30] shrink-0" />}
          <p className="text-[15px] font-semibold text-[#000] dark:text-white">
            {aporteViavel ? "Aporte viável mesmo estourando tudo" : "Aporte comprometido"}
          </p>
        </div>
        <p className="text-[13px] text-[#8E8E93] leading-relaxed mb-3">
          Se pagar todas as fixas e usar 100% dos orçamentos, ainda sobram{" "}
          <span className={`font-semibold ${aporteViavel ? "text-[#34C759]" : "text-[#FF3B30]"}`}>{formatCurrency(sobraMinima)}</span> para aporte.
        </p>
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between">
            <span className="text-[#8E8E93]">Receita do mês</span>
            <span className="font-semibold text-[#000] dark:text-white">{formatCurrency(receitaMes)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8E8E93]">Fixas + celular</span>
            <span className="text-[#FF3B30]">-{formatCurrency(fixedTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8E8E93]">Orçamentos (máx)</span>
            <span className="text-[#FF9500]">-{formatCurrency(totalBudgeted)}</span>
          </div>
          <div className="flex justify-between border-t border-[rgba(60,60,67,0.08)] pt-2 dark:border-[rgba(84,84,88,0.18)]">
            <span className="font-semibold text-[#000] dark:text-white">Sobra p/ aporte</span>
            <span className={`font-bold ${aporteViavel ? "text-[#34C759]" : "text-[#FF3B30]"}`}>{formatCurrency(sobraMinima)}</span>
          </div>
        </div>
      </Card>

      <Card variant="grouped">
        <div className="p-5 sm:p-6"><CardTitle>Despesas Fixas</CardTitle></div>
        <div className="divide-y divide-[rgba(60,60,67,0.08)] dark:divide-[rgba(84,84,88,0.18)]">
          {[
            { name: "Aluguel", amount: 950 },
            { name: "\u00c1gua e Luz", amount: 150 },
            { name: "Imposto CNPJ", amount: 90 },
            ...(settings.phoneInstallmentActive ? [{ name: "Parcela Celular", amount: settings.phoneInstallmentAmount }] : []),
          ].map((e) => (
            <div key={e.name} className="flex items-center justify-between px-5 py-3 sm:px-6">
              <span className="text-[15px] text-[#000] dark:text-white">{e.name}</span>
              <span className="text-[15px] font-semibold text-[#000] dark:text-white">{formatCurrency(e.amount)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-5 py-3 sm:px-6 bg-[#FF3B30]/5">
            <span className="text-[13px] font-semibold text-[#FF3B30]">Total</span>
            <span className="text-[17px] font-bold text-[#FF3B30]">{formatCurrency(fixedTotal)}</span>
          </div>
        </div>
      </Card>

      {categoryBudgets.map((b) => (
        <CategoryCard
          key={b.category}
          budget={b}
          transactions={monthTransactions.filter((t) => t.type === "expense" && t.category === b.category)}
          onEditLimit={(newLimit) => {
            const updated = settings.categoryBudgets.map((cb) =>
              cb.category === b.category ? { ...cb, limit: newLimit } : cb
            );
            setSettings({ ...settings, categoryBudgets: updated });
          }}
        />
      ))}

      <Card>
        <div className="flex items-center gap-2">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="Nova categoria"
            className="flex-1 rounded-[10px] bg-[#F2F2F7] px-3.5 py-2.5 text-[15px] text-[#000] outline-none placeholder:text-[#C7C7CC] dark:bg-[#2C2C2E] dark:text-white"
          />
          <input
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            placeholder="Limite"
            type="number"
            className="w-24 rounded-[10px] bg-[#F2F2F7] px-3.5 py-2.5 text-[15px] text-[#000] outline-none placeholder:text-[#C7C7CC] dark:bg-[#2C2C2E] dark:text-white"
          />
          <button
            onClick={() => {
              if (!newCat.trim() || !newLimit) return;
              setSettings({ ...settings, categoryBudgets: [...settings.categoryBudgets, { category: newCat.trim(), limit: parseFloat(newLimit) }] });
              setNewCat("");
              setNewLimit("");
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-white"
          >
            <Plus size={18} />
          </button>
        </div>
      </Card>
    </div>
  );
}
