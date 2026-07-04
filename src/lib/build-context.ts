import type { Settings, Transaction, CategoryBudget, Account } from "./types";
import { formatCurrency } from "./utils";

export function buildFinancialContext(data: {
  settings: Settings;
  transactions: Transaction[];
  categoryBudgets: CategoryBudget[];
  accounts: Account[];
  currentContribution: number;
  currentAccumulated: number;
  goalProgress: number;
  currentSurplus: number;
  selectedMonth: string;
}): string {
  const {
    settings, transactions, categoryBudgets, accounts,
    currentContribution, currentAccumulated, goalProgress,
    currentSurplus, selectedMonth,
  } = data;

  const monthTxs = transactions.filter((t) => t.date.startsWith(selectedMonth));
  const income = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const budgetLines = categoryBudgets
    .map((b) => `  ${b.category}: gasto ${formatCurrency(b.spent)} de ${formatCurrency(b.limit)} (restam ${formatCurrency(b.remaining)})`)
    .join("\n");

  const accountLines = accounts
    .map((a) => `  ${a.name}: ${formatCurrency(a.balance)}`)
    .join("\n");

  const recentTxs = monthTxs
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 15)
    .map((t) => `  ${t.date} | ${t.description} | ${t.type === "income" ? "+" : "-"}${formatCurrency(t.amount)} | ${t.category}`)
    .join("\n");

  const fixedTotal = 950 + 150 + 90 + (settings.phoneInstallmentActive ? settings.phoneInstallmentAmount : 0);
  const budgetTotal = settings.categoryBudgets.reduce((s, b) => s + b.limit, 0);
  const sobraMinima = settings.monthlyIncome - fixedTotal - budgetTotal;

  return `Mes selecionado: ${selectedMonth}
Hoje: ${new Date().toISOString().split("T")[0]}

RECEITA MENSAL: ${formatCurrency(settings.monthlyIncome)}
Fontes:
${settings.incomeInstallments.map((i) => `  ${i.description}: ${formatCurrency(i.amount)} (dia ${i.dayOfMonth})`).join("\n")}

CONTAS:
${accountLines}
Patrimonio total: ${formatCurrency(accounts.reduce((s, a) => s + a.balance, 0))}

DESPESAS FIXAS: ${formatCurrency(fixedTotal)}
  Aluguel: R$ 950 | Agua/Luz: R$ 150 | CNPJ: R$ 90${settings.phoneInstallmentActive ? ` | Celular: R$ ${settings.phoneInstallmentAmount} (ate ${settings.phoneInstallmentEndsAt})` : ""}

ORCAMENTOS VARIAVEIS (total ${formatCurrency(budgetTotal)}):
${budgetLines}

SOBRA MINIMA PARA APORTE (mesmo gastando tudo): ${formatCurrency(sobraMinima)}
Sobra real (receita - fixas - variaveis): ${formatCurrency(currentSurplus)}

META: Chevrolet Classic ${formatCurrency(settings.goalAmount)}
Acumulado: ${formatCurrency(currentAccumulated)} (${(goalProgress * 100).toFixed(1)}%)
Faltam: ${formatCurrency(settings.goalAmount - currentAccumulated)}
Aporte deste mês: ${formatCurrency(currentContribution)}

RECEITA DO MES: ${formatCurrency(income)}
GASTOS DO MES: ${formatCurrency(expenses)}

LANCAMENTOS RECENTES:
${recentTxs}

R$ 338,20 nao entra nos calculos (entra e sai automaticamente da conta).`;
}
