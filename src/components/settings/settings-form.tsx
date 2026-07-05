"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Settings } from "@/lib/types";
import { Save, Plus, Trash2, Pencil, Check, X } from "lucide-react";

export function SettingsForm({ settings, onSave }: { settings: Settings; onSave: (s: Settings) => void }) {
  const [budgets, setBudgets] = useState(settings.categoryBudgets);
  const [newCat, setNewCat] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editCat, setEditCat] = useState("");
  const [editLimit, setEditLimit] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSave({
      ...settings,
      monthlyIncome: parseFloat(fd.get("monthlyIncome") as string) || settings.monthlyIncome,
      goalAmount: parseFloat(fd.get("goalAmount") as string) || settings.goalAmount,
      funMoneyLimit: parseFloat(fd.get("funMoneyLimit") as string) || settings.funMoneyLimit,
      phoneInstallmentActive: fd.get("phoneActive") === "on",
      phoneInstallmentAmount: parseFloat(fd.get("phoneAmount") as string) || settings.phoneInstallmentAmount,
      phoneInstallmentEndsAt: (fd.get("phoneEnds") as string) || settings.phoneInstallmentEndsAt,
      categoryBudgets: budgets,
    });
  };

  const addBudget = () => {
    if (!newCat.trim() || !newLimit) return;
    setBudgets([...budgets, { category: newCat.trim(), limit: parseFloat(newLimit) }]);
    setNewCat("");
    setNewLimit("");
  };

  const removeBudget = (idx: number) => {
    setBudgets(budgets.filter((_, i) => i !== idx));
  };

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditCat(budgets[idx].category);
    setEditLimit(String(budgets[idx].limit));
  };

  const saveEdit = () => {
    if (editingIdx === null || !editCat.trim() || !editLimit) return;
    setBudgets(budgets.map((b, i) => i === editingIdx ? { category: editCat.trim(), limit: parseFloat(editLimit) } : b));
    setEditingIdx(null);
  };

  const cancelEdit = () => setEditingIdx(null);

  return (
    <Card>
      <CardTitle>Geral</CardTitle>
      <form onSubmit={handleSubmit} className="mt-4 space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input label="Receita mensal (R$)" id="monthlyIncome" name="monthlyIncome" type="number" step="0.01" defaultValue={settings.monthlyIncome} />
          <Input label="Meta (R$)" id="goalAmount" name="goalAmount" type="number" step="0.01" defaultValue={settings.goalAmount} />
          <Input label="Teto besteiras (R$)" id="funMoneyLimit" name="funMoneyLimit" type="number" step="0.01" defaultValue={settings.funMoneyLimit} />
        </div>

        <p className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Celular</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-[10px] bg-[#F2F2F7] px-3.5 py-2.5 dark:bg-[#2C2C2E]">
            <input type="checkbox" id="phoneActive" name="phoneActive" defaultChecked={settings.phoneInstallmentActive} className="h-4 w-4 rounded accent-[#007AFF]" />
            <label htmlFor="phoneActive" className="text-[15px] text-[#000] dark:text-white">Ativa</label>
          </div>
          <Input label="Valor" id="phoneAmount" name="phoneAmount" type="number" step="0.01" defaultValue={settings.phoneInstallmentAmount} />
          <Input label="Ate" id="phoneEnds" name="phoneEnds" type="month" defaultValue={settings.phoneInstallmentEndsAt} />
        </div>

        <p className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Orçamentos por categoria</p>
        <div className="space-y-2">
          {budgets.map((b, i) => (
            <div key={i} className="flex items-center gap-2 rounded-[10px] bg-[#F2F2F7] px-3.5 py-2.5 dark:bg-[#2C2C2E]">
              {editingIdx === i ? (
                <>
                  <input value={editCat} onChange={(e) => setEditCat(e.target.value)} className="flex-1 bg-transparent text-[15px] text-[#000] outline-none dark:text-white" />
                  <input value={editLimit} onChange={(e) => setEditLimit(e.target.value)} type="number" step="0.01" className="w-20 bg-transparent text-right text-[15px] font-semibold text-[#000] outline-none dark:text-white" />
                  <button type="button" onClick={saveEdit} className="p-1 text-[#34C759]"><Check size={16} /></button>
                  <button type="button" onClick={cancelEdit} className="p-1 text-[#8E8E93]"><X size={16} /></button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-[15px] text-[#000] dark:text-white">{b.category}</span>
                  <span className="text-[15px] font-semibold text-[#000] dark:text-white">R$ {b.limit}</span>
                  <button type="button" onClick={() => startEdit(i)} className="p-1 text-[#007AFF]"><Pencil size={14} /></button>
                  <button type="button" onClick={() => removeBudget(i)} className="p-1 text-[#FF3B30]"><Trash2 size={14} /></button>
                </>
              )}
            </div>
          ))}
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
              step="0.01"
              className="w-24 rounded-[10px] bg-[#F2F2F7] px-3.5 py-2.5 text-[15px] text-[#000] outline-none placeholder:text-[#C7C7CC] dark:bg-[#2C2C2E] dark:text-white"
            />
            <button type="button" onClick={addBudget} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-white">
              <Plus size={18} />
            </button>
          </div>
        </div>

        {settings.oneTimeExpenses.length > 0 && (
          <>
            <p className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Pontuais</p>
            {settings.oneTimeExpenses.map((exp, i) => (
              <div key={i} className="flex gap-3 rounded-[10px] bg-[#F2F2F7] px-3.5 py-2.5 text-[15px] dark:bg-[#2C2C2E]">
                <span className="font-medium text-[#000] dark:text-white">{exp.name}</span>
                <span className="text-[#8E8E93]">R$ {exp.amount}</span>
                <span className="text-[#C7C7CC]">{exp.month}</span>
              </div>
            ))}
          </>
        )}

        <Button type="submit"><Save size={16} /> Salvar</Button>
      </form>
    </Card>
  );
}
