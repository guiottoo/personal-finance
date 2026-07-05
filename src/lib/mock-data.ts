import type { Transaction } from "./types";

export const MOCK_TRANSACTIONS: Transaction[] = [
  // Mock data vazio — tudo vem do Supabase
];

export const EXPENSE_CATEGORIES = [
  "Moradia",
  "Alimentacao",
  "Transporte",
  "Impostos",
  "Parcelas",
  "Besteiras",
  "Lazer",
  "Cuidado Pessoal",
  "Dividas",
  "Emprestimos",
  "Saude",
  "Outros",
];

export const CATEGORY_LABELS: Record<string, string> = {
  Moradia: "Moradia",
  Alimentacao: "Alimentação",
  Transporte: "Transporte",
  Impostos: "Impostos",
  Parcelas: "Parcelas",
  Besteiras: "Besteiras",
  Lazer: "Lazer",
  "Cuidado Pessoal": "Cuidado Pessoal",
  Dividas: "Dívidas",
  Emprestimos: "Empréstimos",
  Saude: "Saúde",
  Outros: "Outros",
  Salario: "Salário",
  Investimento: "Investimento",
};

export const INCOME_CATEGORIES = ["Salario", "Freelance", "Outros"];
