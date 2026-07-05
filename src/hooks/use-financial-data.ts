"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { Settings, Transaction, Account } from "@/lib/types";
import { DEFAULT_SETTINGS, DEFAULT_ACCOUNTS, GOAL_START_AMOUNT } from "@/lib/constants";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import {
  calculateMonthlyExpenses,
  calculateMonthlySurplus,
  calculateScenarios,
  calculateContributionPhases,
  generateMonthlyProjection,
  generateAlerts,
  calculateCategoryBudgets,
} from "@/lib/calculations";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function inferAccount(category: string, type: string): string {
  if (type === "contribution") return "c6-invest";
  if (category === "Besteiras") return "banco-inter";
  return "c6-bank";
}

function loadSavedBudgets(): { category: string; limit: number }[] | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("category-budgets");
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

function saveBudgets(budgets: { category: string; limit: number }[]) {
  localStorage.setItem("category-budgets", JSON.stringify(budgets));
}

export function useFinancialData() {
  const [settings, setSettingsRaw] = useState<Settings>(DEFAULT_SETTINGS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [selectedMonth, setSelectedMonth] = useState("2026-07");

  const setSettings = useCallback((s: Settings) => {
    setSettingsRaw(s);
    saveBudgets(s.categoryBudgets);
  }, []);

  useEffect(() => {
    const savedBudgets = loadSavedBudgets();
    if (savedBudgets) {
      setSettingsRaw((prev) => ({ ...prev, categoryBudgets: savedBudgets }));
    }

    if (!isSupabaseConfigured || !supabase) return;

    async function loadData() {
      try {
        const { data: txData } = await supabase!
          .from("transactions")
          .select("*")
          .order("date", { ascending: false });

        if (txData && txData.length > 0) {
          setTransactions(
            txData.map((t) => ({
              id: t.id,
              date: t.date,
              description: t.description,
              amount: Number(t.amount),
              type: t.type as Transaction["type"],
              category: t.category,
              account: inferAccount(t.category, t.type),
              notes: t.notes,
            }))
          );
        }

        const { data: settingsData } = await supabase!
          .from("user_settings")
          .select("*")
          .limit(1)
          .single();

        if (settingsData) {
          const saved = loadSavedBudgets();
          setSettingsRaw({
            monthlyIncome: Number(settingsData.monthly_income),
            incomeInstallments: DEFAULT_SETTINGS.incomeInstallments,
            goalAmount: Number(settingsData.goal_amount),
            funMoneyLimit: Number(settingsData.fun_money_limit),
            phoneInstallmentActive: settingsData.phone_installment_active,
            phoneInstallmentAmount: Number(settingsData.phone_installment_amount),
            phoneInstallmentEndsAt: settingsData.phone_installment_ends_at,
            oneTimeExpenses: settingsData.one_time_expenses || [],
            categoryBudgets: saved || DEFAULT_SETTINGS.categoryBudgets,
          });
        }
      } catch (err) {
        console.error("Supabase load error:", err);
      }
    }

    loadData();
  }, []);

  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const actualContributions = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === "contribution")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const actualExpenses = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  const actualIncome = useMemo(() => {
    return monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthTransactions]);

  // R$ 800 aportado antes de julho (pre-existente) + novos aportes
  const totalContributions = useMemo(() => {
    const fromTransactions = transactions
      .filter((t) => t.type === "contribution")
      .reduce((sum, t) => sum + t.amount, 0);
    return GOAL_START_AMOUNT + fromTransactions;
  }, [transactions]);

  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Patrimonio dinamico por conta, baseado em transacoes reais
  const accounts: Account[] = useMemo(() => {
    const c6Income = transactions
      .filter((t) => t.type === "income" && t.account === "c6-bank")
      .reduce((s, t) => s + t.amount, 0);
    const c6Expenses = transactions
      .filter((t) => t.type === "expense" && t.account === "c6-bank")
      .reduce((s, t) => s + t.amount, 0);
    const c6Contributions = transactions
      .filter((t) => t.type === "contribution" && t.account === "c6-bank")
      .reduce((s, t) => s + t.amount, 0);

    // Inter: besteiras sao gastas no Inter, aporte de R$300 vai dia 10
    const interExpenses = transactions
      .filter((t) => t.type === "expense" && t.account === "banco-inter")
      .reduce((s, t) => s + t.amount, 0);

    return [
      {
        ...DEFAULT_ACCOUNTS[0],
        balance: c6Income - c6Expenses - c6Contributions,
      },
      {
        ...DEFAULT_ACCOUNTS[1],
        balance: -interExpenses, // negativo ate abastecer dia 10
        description: `Besteiras gastas: R$ ${interExpenses.toFixed(0)}. Aporte dia 10.`,
      },
      {
        ...DEFAULT_ACCOUNTS[2],
        balance: totalContributions,
      },
    ];
  }, [transactions, totalContributions]);

  const currentExpenses = useMemo(
    () => calculateMonthlyExpenses(selectedMonth, settings),
    [settings, selectedMonth]
  );
  const currentSurplus = useMemo(
    () => calculateMonthlySurplus(selectedMonth, settings),
    [settings, selectedMonth]
  );
  const scenarios = useMemo(() => calculateScenarios(settings), [settings]);
  const phases = useMemo(() => calculateContributionPhases(settings), [settings]);
  const projection = useMemo(() => generateMonthlyProjection(settings, 14), [settings]);

  const categoryBudgets = useMemo(
    () => calculateCategoryBudgets(settings, transactions, selectedMonth),
    [settings, transactions, selectedMonth]
  );

  const goalAmount = settings.goalAmount;
  const currentAccumulated = totalContributions;
  const goalProgress = currentAccumulated / goalAmount;
  const currentContribution = actualContributions;

  const alerts = useMemo(
    () => generateAlerts(settings, currentContribution, categoryBudgets),
    [settings, currentContribution, categoryBudgets]
  );

  const addTransaction = useCallback(async (t: Omit<Transaction, "id">) => {
    const newTx = { ...t, id: `t${Date.now()}` };
    setTransactions((prev) => [...prev, newTx]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("transactions").insert({
          date: t.date,
          description: t.description,
          amount: t.amount,
          type: t.type,
          category: t.category,
          notes: t.notes,
        });
      } catch (err) {
        console.error("Error saving transaction:", err);
      }
    }
  }, []);

  const removeTransaction = useCallback(async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("transactions").delete().eq("id", id);
      } catch (err) {
        console.error("Error removing transaction:", err);
      }
    }
  }, []);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach((t) => months.add(t.date.substring(0, 7)));
    if (!months.has("2026-07")) months.add("2026-07");
    return Array.from(months).sort();
  }, [transactions]);

  return {
    settings,
    setSettings,
    transactions,
    monthTransactions,
    addTransaction,
    removeTransaction,
    accounts,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    currentExpenses,
    currentSurplus,
    scenarios,
    phases,
    projection,
    alerts,
    categoryBudgets,
    currentContribution,
    goalAmount,
    currentAccumulated,
    goalProgress,
    actualIncome,
    actualExpenses,
  };
}
