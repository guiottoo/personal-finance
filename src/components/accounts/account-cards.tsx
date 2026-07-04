"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Account } from "@/lib/types";
import { Building2, CreditCard, TrendingUp } from "lucide-react";

const icons = { operational: Building2, spending: CreditCard, investment: TrendingUp };
const colors = { operational: "#8E8E93", spending: "#FF9500", investment: "#007AFF" };

export function AccountCards({ accounts }: { accounts: Account[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => {
        const Icon = icons[account.type];
        const color = colors[account.type];
        return (
          <Card key={account.id}>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}15` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#000] dark:text-white">{account.name}</p>
                <p className="text-[11px] text-[#8E8E93]">{account.bank}</p>
              </div>
            </div>
            <p className="text-[28px] font-bold tracking-tight text-[#000] dark:text-white">
              {formatCurrency(account.balance)}
            </p>
            <p className="mt-1 text-[13px] text-[#8E8E93]">{account.description}</p>
          </Card>
        );
      })}
    </div>
  );
}
