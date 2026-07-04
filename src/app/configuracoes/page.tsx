"use client";

import { useFinancialData } from "@/hooks/use-financial-data";
import { SettingsForm } from "@/components/settings/settings-form";
import { Card, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function ConfiguracoesPage() {
  const { settings, setSettings } = useFinancialData();

  return (
    <div className="max-w-2xl space-y-5">
      <h2 className="text-[22px] font-bold text-[#000] dark:text-white">Configuracoes</h2>

      <Card>
        <CardTitle>Receitas Mensais</CardTitle>
        <div className="mt-4 divide-y divide-[rgba(60,60,67,0.08)] dark:divide-[rgba(84,84,88,0.18)]">
          {settings.incomeInstallments.map((inst, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="text-[15px] font-medium text-[#000] dark:text-white">{inst.description}</p>
                <p className="text-[11px] text-[#8E8E93]">Dia {inst.dayOfMonth}</p>
              </div>
              <p className="text-[17px] font-semibold text-[#000] dark:text-white">{formatCurrency(inst.amount)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between rounded-xl bg-[#34C759]/10 px-4 py-2.5">
          <span className="text-[13px] font-semibold text-[#34C759]">Total</span>
          <span className="text-[15px] font-bold text-[#34C759]">
            {formatCurrency(settings.incomeInstallments.reduce((s, i) => s + i.amount, 0))}
          </span>
        </div>
        <p className="mt-3 text-[11px] text-[#C7C7CC]">R$ 338,20 não contabilizado (entra e sai automaticamente)</p>
      </Card>

      <SettingsForm settings={settings} onSave={setSettings} />
    </div>
  );
}
