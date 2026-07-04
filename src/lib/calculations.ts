import type {
  Settings,
  MonthlyBudget,
  Scenario,
  ContributionPhase,
  Alert,
  CategoryBudget,
  Transaction,
} from "./types";
import { DEFAULT_SETTINGS, GOAL_START_AMOUNT } from "./constants";

function addMonths(monthStr: string, n: number): string {
  const [year, month] = monthStr.split("-").map(Number);
  const date = new Date(year, month - 1 + n, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(monthStr: string): string {
  const [year, month] = monthStr.split("-").map(Number);
  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];
  return `${months[month - 1]} ${year}`;
}

export function monthDiff(a: string, b: string): number {
  const [ay, am] = a.split("-").map(Number);
  const [by, bm] = b.split("-").map(Number);
  return (by - ay) * 12 + (bm - am);
}

function isPhoneActive(month: string, settings: Settings): boolean {
  if (!settings.phoneInstallmentActive) return false;
  return month <= settings.phoneInstallmentEndsAt;
}

function getOneTimeExpense(month: string, settings: Settings): number {
  return settings.oneTimeExpenses
    .filter((e) => e.month === month)
    .reduce((sum, e) => sum + e.amount, 0);
}

// Total dos orcamentos variaveis (besteiras + alimentação + transporte + lazer)
function totalVariableBudgets(settings: Settings): number {
  return settings.categoryBudgets.reduce((sum, b) => sum + b.limit, 0);
}

// Despesas planejadas do mês (fixas + celular + variaveis orcadas + pontuais)
export function calculateMonthlyExpenses(
  month: string,
  settings: Settings
): {
  fixed: number;
  phone: number;
  variableBudgets: number;
  oneTime: number;
  total: number;
} {
  const fixed = 950 + 150 + 90; // aluguel + agua/luz + cnpj
  const phone = isPhoneActive(month, settings) ? settings.phoneInstallmentAmount : 0;
  const variableBudgets = totalVariableBudgets(settings); // besteiras + alimentação + transporte + lazer
  const oneTime = getOneTimeExpense(month, settings);

  return {
    fixed,
    phone,
    variableBudgets,
    oneTime,
    total: fixed + phone + variableBudgets + oneTime,
  };
}

// Sobra real = receita - tudo planejado. Isso e o que sobra pra aporte.
export function calculateMonthlySurplus(
  month: string,
  settings: Settings
): number {
  const expenses = calculateMonthlyExpenses(month, settings);
  return settings.monthlyIncome - expenses.total;
}

export function calculateCategoryBudgets(
  settings: Settings,
  transactions: Transaction[],
  month: string
): CategoryBudget[] {
  return settings.categoryBudgets.map((budget) => {
    const spent = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === budget.category &&
          t.date.startsWith(month)
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      category: budget.category,
      limit: budget.limit,
      spent,
      remaining: Math.max(budget.limit - spent, 0),
    };
  });
}

export function calculateScenarios(
  settings: Settings = DEFAULT_SETTINGS
): Scenario[] {
  const startMonth = "2026-07";
  const startAmount = 800; // aporte real de julho
  const target = settings.goalAmount;

  const surplusWithPhone = calculateMonthlySurplus(startMonth, settings);
  const surplusWithoutPhone = calculateMonthlySurplus(
    addMonths(settings.phoneInstallmentEndsAt, 1),
    settings
  );

  const scenarios: {
    name: string;
    label: string;
    factor1: number;
    factor2: number;
  }[] = [
    { name: "conservative", label: "Conservador", factor1: 0.55, factor2: 0.55 },
    { name: "realistic", label: "Realista", factor1: 0.7, factor2: 0.7 },
    { name: "strong", label: "Forte", factor1: 0.85, factor2: 0.85 },
  ];

  return scenarios.map((s) => {
    let accumulated = startAmount;
    let months = 0;
    let currentMonth = startMonth;

    const phase1Savings = Math.round((surplusWithPhone * s.factor1) / 100) * 100;
    const phase2Savings = Math.round((surplusWithoutPhone * s.factor2) / 100) * 100;

    while (accumulated < target && months < 36) {
      currentMonth = addMonths(startMonth, months + 1);
      const oneTime = getOneTimeExpense(currentMonth, settings);
      const saving = isPhoneActive(currentMonth, settings)
        ? phase1Savings
        : phase2Savings;
      accumulated += saving - oneTime;
      months++;
    }

    return {
      name: s.name,
      label: s.label,
      monthlySavingsPhase1: phase1Savings,
      monthlySavingsPhase2: phase2Savings,
      monthlySavingsPhase3: phase2Savings,
      monthsToGoal: months,
      completionDate: monthLabel(addMonths(startMonth, months)),
    };
  });
}

export function calculateContributionPhases(
  settings: Settings = DEFAULT_SETTINGS
): ContributionPhase[] {
  const startMonth = "2026-07";
  const phoneEndMonth = settings.phoneInstallmentEndsAt;

  const surplusWithPhone = calculateMonthlySurplus(startMonth, settings);
  const surplusWithoutPhone = calculateMonthlySurplus(
    addMonths(phoneEndMonth, 1),
    settings
  );

  const phase1Months: string[] = [];
  for (let i = 0; i <= monthDiff(startMonth, phoneEndMonth); i++) {
    phase1Months.push(addMonths(startMonth, i));
  }

  const phase2Months: string[] = [];
  for (let i = 1; i <= 4; i++) {
    phase2Months.push(addMonths(phoneEndMonth, i));
  }

  const phase3Months: string[] = [];
  for (let i = 5; i <= 8; i++) {
    phase3Months.push(addMonths(phoneEndMonth, i));
  }

  return [
    {
      phase: 1,
      name: "Fase 1: Com celular",
      description: "Parcela do celular ativa. Sobra menor, aporte moderado.",
      months: phase1Months.map(monthLabel),
      suggestedContribution: Math.round((surplusWithPhone * 0.7) / 100) * 100,
      surplus: surplusWithPhone,
    },
    {
      phase: 2,
      name: "Fase 2: Sem celular",
      description: "Parcela encerrada. +R$ 300/mês de capacidade.",
      months: phase2Months.map(monthLabel),
      suggestedContribution: Math.round((surplusWithoutPhone * 0.7) / 100) * 100,
      surplus: surplusWithoutPhone,
    },
    {
      phase: 3,
      name: "Fase 3: Reta final",
      description: "Aperto opcional para fechar a meta mais rapido.",
      months: phase3Months.map(monthLabel),
      suggestedContribution: Math.round((surplusWithoutPhone * 0.85) / 100) * 100,
      surplus: surplusWithoutPhone,
    },
  ];
}

export function generateMonthlyProjection(
  settings: Settings = DEFAULT_SETTINGS,
  monthsAhead: number = 14
): MonthlyBudget[] {
  const startMonth = "2026-07";
  const julyAporte = 800; // aporte real de julho
  let accumulated = julyAporte;
  const budgets: MonthlyBudget[] = [];

  const julyExpenses = calculateMonthlyExpenses(startMonth, settings);
  budgets.push({
    month: startMonth,
    initialBalance: 0,
    income: settings.monthlyIncome,
    fixedExpenses: julyExpenses.fixed + julyExpenses.phone,
    variableExpenses: julyExpenses.variableBudgets + julyExpenses.oneTime,
    funMoney: 0,
    contribution: julyAporte,
    finalBalance: settings.monthlyIncome - julyExpenses.total - julyAporte,
    accumulated,
  });

  for (let i = 1; i < monthsAhead; i++) {
    if (accumulated >= settings.goalAmount) break; // meta batida, para

    const month = addMonths(startMonth, i);
    const expenses = calculateMonthlyExpenses(month, settings);
    const surplus = settings.monthlyIncome - expenses.total;
    const contribution = Math.round((surplus * 0.7) / 100) * 100;

    accumulated = Math.min(accumulated + contribution, settings.goalAmount);

    budgets.push({
      month,
      initialBalance: 0,
      income: settings.monthlyIncome,
      fixedExpenses: expenses.fixed + expenses.phone,
      variableExpenses: expenses.variableBudgets + expenses.oneTime,
      funMoney: 0,
      contribution,
      finalBalance: surplus - contribution,
      accumulated,
    });
  }

  return budgets;
}

export function generateAlerts(
  settings: Settings = DEFAULT_SETTINGS,
  currentContribution: number = 800,
  categoryBudgets: CategoryBudget[] = []
): Alert[] {
  const alerts: Alert[] = [];
  const currentMonth = "2026-07";
  const surplus = calculateMonthlySurplus(currentMonth, settings);
  const idealContribution = Math.round((surplus * 0.7) / 100) * 100;

  if (currentContribution >= idealContribution) {
    alerts.push({
      id: "contribution-ok",
      type: "success",
      message: "Seu aporte deste mês esta dentro ou acima do planejado.",
    });
  } else {
    alerts.push({
      id: "contribution-low",
      type: "warning",
      message: `Seu aporte este mes ficou R$ ${idealContribution - currentContribution} abaixo do planejado.`,
    });
  }

  for (const b of categoryBudgets) {
    const pct = b.spent / b.limit;
    if (pct >= 1) {
      alerts.push({
        id: `budget-over-${b.category}`,
        type: "warning",
        message: `Orçamento de ${b.category} estourado! R$ ${b.spent.toFixed(0)} de R$ ${b.limit} gastos.`,
      });
    } else if (pct >= 0.8) {
      alerts.push({
        id: `budget-warn-${b.category}`,
        type: "info",
        message: `${b.category}: ${(pct * 100).toFixed(0)}% do orçamento usado. Restam R$ ${b.remaining.toFixed(0)}.`,
      });
    }
  }

  return alerts;
}
