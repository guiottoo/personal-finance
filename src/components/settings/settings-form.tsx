"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Settings } from "@/lib/types";
import { Save } from "lucide-react";

export function SettingsForm({ settings, onSave }: { settings: Settings; onSave: (s: Settings) => void }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSave({
      ...settings,
      goalAmount: parseFloat(fd.get("goalAmount") as string) || settings.goalAmount,
      funMoneyLimit: parseFloat(fd.get("funMoneyLimit") as string) || settings.funMoneyLimit,
      phoneInstallmentActive: fd.get("phoneActive") === "on",
      phoneInstallmentAmount: parseFloat(fd.get("phoneAmount") as string) || settings.phoneInstallmentAmount,
      phoneInstallmentEndsAt: (fd.get("phoneEnds") as string) || settings.phoneInstallmentEndsAt,
    });
  };

  return (
    <Card>
      <CardTitle>Geral</CardTitle>
      <form onSubmit={handleSubmit} className="mt-4 space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input label="Meta (R$)" id="goalAmount" name="goalAmount" type="number" step="0.01" defaultValue={settings.goalAmount} />
          <Input label="Teto besteiras (R$)" id="funMoneyLimit" name="funMoneyLimit" type="number" step="0.01" defaultValue={settings.funMoneyLimit} />
        </div>

        <p className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Celular</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-[10px] bg-[#F2F2F7] px-3.5 py-2.5 dark:bg-[#2C2C2E]">
            <input type="checkbox" id="phoneActive" name="phoneActive" defaultChecked={settings.phoneInstallmentActive} className="h-4 w-4 rounded accent-[#007AFF]" />
            <label htmlFor="phoneActive" className="text-[15px] text-[#000] dark:text-white">Ativa</label>
          </div>
          <Input label="Valor" id="phoneAmount" name="phoneAmount" type="number" step="0.01" defaultValue={settings.phoneInstallmentAmount} />
          <Input label="Ate" id="phoneEnds" name="phoneEnds" type="month" defaultValue={settings.phoneInstallmentEndsAt} />
        </div>

        {settings.oneTimeExpenses.length > 0 && (
          <>
            <p className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Pontuais</p>
            {settings.oneTimeExpenses.map((exp, i) => (
              <div key={i} className="flex gap-3 rounded-[10px] bg-[#F2F2F7] px-3.5 py-2.5 text-[15px] dark:bg-[#2C2C2E]">
                <span className="font-medium text-[#000] dark:text-white">{exp.name}</span>
                <span className="text-[#8E8E93]">R$ {exp.amount}</span>
                <span className="text-[#C7C7CC]">{exp.month}</span>
              </div>
            ))}
          </>
        )}

        <Button type="submit"><Save size={16} /> Salvar</Button>
      </form>
    </Card>
  );
}
