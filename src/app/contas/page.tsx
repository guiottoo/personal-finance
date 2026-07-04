"use client";

import { useFinancialData } from "@/hooks/use-financial-data";
import { AccountCards } from "@/components/accounts/account-cards";
import { Card, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function ContasPage() {
  const { accounts } = useFinancialData();
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-bold text-[#000] dark:text-white">Contas</h2>

      <Card>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">Patrimonio Total</p>
        <p className="mt-2 text-[34px] font-bold tracking-tight text-[#000] dark:text-white">{formatCurrency(totalBalance)}</p>
        <p className="text-[13px] text-[#8E8E93] mt-1">Calculado em tempo real dos lancamentos</p>
      </Card>

      <AccountCards accounts={accounts} />

      <Card>
        <CardTitle>Funcao de cada conta</CardTitle>
        <div className="mt-4 divide-y divide-[rgba(60,60,67,0.08)] dark:divide-[rgba(84,84,88,0.18)]">
          {[
            { name: "C6 Bank", desc: "Conta operacional. Recebe salário e paga contas fixas." },
            { name: "Banco Inter", desc: "Conta para besteiras. R$ 300/mês. Acabou, acabou." },
            { name: "C6 Invest", desc: "Aportes mensais rumo a meta de R$ 20k." },
          ].map((item) => (
            <div key={item.name} className="py-3">
              <p className="text-[15px] font-semibold text-[#000] dark:text-white">{item.name}</p>
              <p className="text-[13px] text-[#8E8E93] mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
