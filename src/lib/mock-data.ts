import type { Transaction } from "./types";

export const MOCK_TRANSACTIONS: Transaction[] = [
  // === APORTE JULHO ===
  { id: "inv1", date: "2026-07-01", description: "Aporte C6 Invest", amount: 800, type: "contribution", category: "Investimento", account: "c6-invest" },

  // === RECEITAS JULHO ===
  { id: "r1", date: "2026-07-01", description: "Jonas Kaz", amount: 2500, type: "income", category: "Salario", account: "c6-bank" },

  // === FIXAS: aluguel e agua/luz ainda nao pagos, saem dia 10 com Rush4Ai ===
  // CNPJ e Celular tambem pendentes

  // === DIVIDAS PAGAS (01/07) ===
  { id: "d1", date: "2026-07-01", description: "Aquila (divida)", amount: 300, type: "expense", category: "Dividas", account: "c6-bank" },
  { id: "d2", date: "2026-07-01", description: "Andrew (divida)", amount: 170, type: "expense", category: "Dividas", account: "c6-bank" },

  // === BESTEIRAS (Banco Inter) ===
  { id: "b1", date: "2026-07-01", description: "Refrigerante", amount: 14.99, type: "expense", category: "Besteiras", account: "banco-inter" },
  { id: "b2", date: "2026-07-02", description: "Padaria", amount: 8, type: "expense", category: "Besteiras", account: "banco-inter" },
  { id: "b3", date: "2026-07-02", description: "Padaria", amount: 18, type: "expense", category: "Besteiras", account: "banco-inter" },
  { id: "b4", date: "2026-07-02", description: "Padaria", amount: 16, type: "expense", category: "Besteiras", account: "banco-inter" },
  { id: "b5", date: "2026-07-02", description: "Padaria", amount: 9, type: "expense", category: "Besteiras", account: "banco-inter" },
  { id: "b6", date: "2026-07-03", description: "Capuccino", amount: 14.90, type: "expense", category: "Besteiras", account: "banco-inter" },
  { id: "b7", date: "2026-07-03", description: "Energetico", amount: 12.90, type: "expense", category: "Besteiras", account: "banco-inter" },
  { id: "b8", date: "2026-07-03", description: "Padaria", amount: 14.25, type: "expense", category: "Besteiras", account: "banco-inter" },
  { id: "b9", date: "2026-07-03", description: "Bolacha", amount: 5.90, type: "expense", category: "Besteiras", account: "banco-inter" },
  { id: "b10", date: "2026-07-03", description: "Esfirra", amount: 7.00, type: "expense", category: "Besteiras", account: "banco-inter" },

  // === ALIMENTACAO ===
  { id: "a1", date: "2026-07-01", description: "Marmita", amount: 38, type: "expense", category: "Alimentação", account: "c6-bank" },

  // === TRANSPORTE ===
  { id: "t1", date: "2026-07-01", description: "Uber", amount: 26.79, type: "expense", category: "Transporte", account: "c6-bank" },

  // === CUIDADO PESSOAL ===
  { id: "cp1", date: "2026-07-02", description: "Perfume", amount: 160, type: "expense", category: "Cuidado Pessoal", account: "c6-bank" },

  // === EMPRESTIMOS ===
  { id: "e1", date: "2026-07-02", description: "Emprestei (amigo)", amount: 40, type: "expense", category: "Emprestimos", account: "c6-bank" },
];

export const EXPENSE_CATEGORIES = [
  "Moradia",
  "Alimentação",
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

export const INCOME_CATEGORIES = ["Salario", "Freelance", "Outros"];
