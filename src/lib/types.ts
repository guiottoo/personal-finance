export type AccountType = "operational" | "spending" | "investment";

export interface Account {
  id: string;
  name: string;
  bank: string;
  type: AccountType;
  description: string;
  balance: number;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: "fixed" | "variable" | "temporary";
  active: boolean;
  endsAt?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense" | "contribution";
  category: string;
  account: string;
  notes?: string;
}

export interface MonthlyBudget {
  month: string;
  initialBalance: number;
  income: number;
  fixedExpenses: number;
  variableExpenses: number;
  funMoney: number;
  contribution: number;
  finalBalance: number;
  accumulated: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  description: string;
}

export interface Scenario {
  name: string;
  label: string;
  monthlySavingsPhase1: number;
  monthlySavingsPhase2: number;
  monthlySavingsPhase3: number;
  monthsToGoal: number;
  completionDate: string;
}

export interface ContributionPhase {
  phase: number;
  name: string;
  description: string;
  months: string[];
  suggestedContribution: number;
  surplus: number;
}

export interface IncomeInstallment {
  description: string;
  amount: number;
  dayOfMonth: number;
}

export interface CategoryBudget {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
}

export interface Settings {
  monthlyIncome: number;
  incomeInstallments: IncomeInstallment[];
  goalAmount: number;
  funMoneyLimit: number;
  phoneInstallmentActive: boolean;
  phoneInstallmentAmount: number;
  phoneInstallmentEndsAt: string;
  oneTimeExpenses: { name: string; amount: number; month: string }[];
  categoryBudgets: { category: string; limit: number }[];
}

export interface Alert {
  id: string;
  type: "success" | "warning" | "info";
  message: string;
}
