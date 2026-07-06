"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import type { Transaction } from "@/lib/types";
import { INCOME_CATEGORIES } from "@/lib/mock-data";
import { DEFAULT_ACCOUNTS } from "@/lib/constants";
import { Plus } from "lucide-react";

export function TransactionForm({ onAdd, budgetCategories }: { onAdd: (t: Omit<Transaction, "id">) => void; budgetCategories?: string[] }) {
  const [type, setType] = useState<"income" | "expense" | "contribution">("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("c6-bank");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const extraCategories = ["Dividas", "Emprestimos"];
  const categories = type === "income" ? INCOME_CATEGORIES : type === "contribution" ? ["Investimento"] : [...(budgetCategories || []), ...extraCategories];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;
    onAdd({ date, description, amount: parseFloat(amount), type, category, account, notes: notes || undefined });
    setDescription(""); setAmount(""); setCategory(""); setNotes("");
  };

  return (
    <Card>
      <CardTitle>Novo Lancamento</CardTitle>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select label="Tipo" id="type" value={type} onChange={(e) => setType(e.target.value as "income" | "expense" | "contribution")} options={[{ value: "expense", label: "Despesa" }, { value: "income", label: "Receita" }, { value: "contribution", label: "Aporte" }]} />
          <Input label="Data" id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input label="Valor (R$)" id="amount" type="number" step="0.01" placeholder="0,00" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input label="Descricao" id="description" placeholder="Ex: Mercado, Uber..." value={description} onChange={(e) => setDescription(e.target.value)} />
          <Select label="Categoria" id="category" value={category} onChange={(e) => setCategory(e.target.value)} options={[{ value: "", label: "Selecione" }, ...categories.map((c) => ({ value: c, label: c }))]} />
          <Select label="Conta" id="account" value={account} onChange={(e) => setAccount(e.target.value)} options={DEFAULT_ACCOUNTS.map((a) => ({ value: a.id, label: a.name }))} />
        </div>
        <Input label="Observacao" id="notes" placeholder="Opcional" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button type="submit"><Plus size={16} /> Adicionar</Button>
      </form>
    </Card>
  );
}
