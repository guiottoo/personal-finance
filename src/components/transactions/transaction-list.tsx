"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/lib/types";
import { DEFAULT_ACCOUNTS } from "@/lib/constants";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

export function TransactionList({ transactions, onRemove }: { transactions: Transaction[]; onRemove?: (id: string) => void }) {
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <Card variant="grouped">
      <div className="p-5 sm:p-6 flex items-center justify-between">
        <CardTitle>{"Lan\u00e7amentos"}</CardTitle>
        {totalPages > 1 && (
          <span className="text-[11px] text-[#8E8E93]">
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} de {sorted.length}
          </span>
        )}
      </div>
      <div className="divide-y divide-[rgba(60,60,67,0.08)] dark:divide-[rgba(84,84,88,0.18)]">
        {paginated.map((t) => {
          const accountName = DEFAULT_ACCOUNTS.find((a) => a.id === t.account)?.name || t.account;
          return (
            <div key={t.id} className="flex items-center justify-between px-5 py-3 sm:px-6">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`h-2 w-2 shrink-0 rounded-full ${t.type === "income" ? "bg-[#34C759]" : t.type === "contribution" ? "bg-[#007AFF]" : "bg-[#FF3B30]"}`} />
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-[#000] dark:text-white truncate">{t.description}</p>
                  <p className="text-[11px] text-[#8E8E93]">
                    {formatDate(new Date(t.date + "T12:00:00"))} · {t.category} · {accountName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[15px] font-semibold ${t.type === "income" ? "text-[#34C759]" : t.type === "contribution" ? "text-[#007AFF]" : "text-[#000] dark:text-white"}`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </span>
                {onRemove && (
                  <button onClick={() => onRemove(t.id)} className="rounded-full p-1 text-[#C7C7CC] active:text-[#FF3B30]">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <p className="px-5 py-8 text-center text-[15px] text-[#8E8E93]">{"Nenhum lan\u00e7amento"}</p>
        )}
      </div>

      {/* Apple-style pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 border-t border-[rgba(60,60,67,0.08)] px-5 py-3 dark:border-[rgba(84,84,88,0.18)]">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-full p-1.5 text-[#007AFF] disabled:text-[#C7C7CC] active:bg-[#F2F2F7] dark:active:bg-[#2C2C2E]"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all ${
                  i === page ? "w-5 bg-[#007AFF]" : "w-2 bg-[#C7C7CC] dark:bg-[#48484A]"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="rounded-full p-1.5 text-[#007AFF] disabled:text-[#C7C7CC] active:bg-[#F2F2F7] dark:active:bg-[#2C2C2E]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </Card>
  );
}
