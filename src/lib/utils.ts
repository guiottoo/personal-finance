import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

export function categoryLabel(key: string): string {
  const labels: Record<string, string> = {
    Alimentacao: "Alimentação",
    Dividas: "Dívidas",
    Emprestimos: "Empréstimos",
    Saude: "Saúde",
    Salario: "Salário",
  };
  return labels[key] || key;
}
