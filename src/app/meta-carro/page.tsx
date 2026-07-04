"use client";

import { useFinancialData } from "@/hooks/use-financial-data";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScenarioCards } from "@/components/goal/scenarios";
import { ContributionPlan } from "@/components/goal/contribution-plan";
import { GoalProgressChart } from "@/components/dashboard/goal-progress";
import { formatCurrency } from "@/lib/utils";
import { Car } from "lucide-react";

export default function MetaCarroPage() {
  const { scenarios, phases, projection, goalAmount, currentAccumulated, goalProgress } = useFinancialData();
  const remaining = goalAmount - currentAccumulated;
  const realistic = scenarios.find((s) => s.name === "realistic");

  return (
    <div className="space-y-5">
      <h2 className="text-[22px] font-bold text-[#000] dark:text-white">Meta do Carro</h2>

      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#007AFF]">
              <Car size={28} className="text-white" />
            </div>
            <div>
              <p className="text-[20px] font-bold text-[#000] dark:text-white">Chevrolet Classic</p>
              <p className="text-[13px] text-[#8E8E93]">{formatCurrency(goalAmount)} a vista</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[34px] font-bold tracking-tight text-[#000] dark:text-white">{formatCurrency(currentAccumulated)}</p>
            <p className="text-[13px] text-[#8E8E93]">faltam {formatCurrency(remaining)}</p>
          </div>
        </div>
        <Progress value={goalProgress} size="lg" className="mt-5" showLabel />
        {realistic && (
          <p className="mt-2 text-[13px] text-[#8E8E93]">
            Previsão: {realistic.completionDate} ({realistic.monthsToGoal} meses)
          </p>
        )}
      </Card>

      <ScenarioCards scenarios={scenarios} />

      <ContributionPlan phases={phases} />
      <GoalProgressChart projection={projection} goalAmount={goalAmount} />
    </div>
  );
}
