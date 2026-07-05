import type { Settings, Account, RecurringExpense } from "./types";

export const DEFAULT_SETTINGS: Settings = {
  monthlyIncome: 5600,
  incomeInstallments: [
    { description: "Jonas Kaz", amount: 2500, dayOfMonth: 1 },
    { description: "Rush4Ai", amount: 2500, dayOfMonth: 10 },
    { description: "WK", amount: 600, dayOfMonth: 23 },
  ],
  goalAmount: 20000,
  funMoneyLimit: 300,
  phoneInstallmentActive: true,
  phoneInstallmentAmount: 300,
  phoneInstallmentEndsAt: "2026-10",
  oneTimeExpenses: [],
  categoryBudgets: [
    { category: "Besteiras", limit: 300 },
    { category: "Alimentacao", limit: 500 },
    { category: "Transporte", limit: 400 },
    { category: "Lazer", limit: 400 },
  ],
};

export const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: "c6-bank",
    name: "C6 Bank",
    bank: "C6",
    type: "operational",
    description: "Conta operacional para receber e pagar contas",
    balance: 800,
  },
  {
    id: "banco-inter",
    name: "Banco Inter",
    bank: "Inter",
    type: "spending",
    description: "Conta de debito para besteiras (limite R$ 300/mês)",
    balance: 300,
  },
  {
    id: "c6-invest",
    name: "C6 Invest",
    bank: "C6",
    type: "investment",
    description: "Aportes mensais rumo a meta de R$ 20.000",
    balance: 800,
  },
];

export const DEFAULT_RECURRING_EXPENSES: RecurringExpense[] = [
  { id: "aluguel", name: "Aluguel", amount: 950, category: "fixed", active: true },
  { id: "agua-luz", name: "Água e Luz", amount: 150, category: "fixed", active: true },
  { id: "cnpj", name: "Imposto CNPJ", amount: 90, category: "fixed", active: true },
  { id: "celular", name: "Parcela Celular", amount: 300, category: "temporary", active: true, endsAt: "2026-10" },
  { id: "besteiras", name: "Banco Inter (Besteiras)", amount: 300, category: "variable", active: true },
];

// R$ 338,20 NAO entra. Entra e sai automaticamente.
export const FIXED_EXPENSES_TOTAL = 950 + 150 + 90; // 1190
export const CURRENT_MONTH = "2026-07";
export const GOAL_START_AMOUNT = 0;
export const MONTHS_PT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];
