"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { MonthlyBudget } from "@/lib/types";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, CartesianGrid,
} from "recharts";
import { MONTHS_PT } from "@/lib/constants";

function monthShort(monthStr: string): string {
  const [, m] = monthStr.split("-").map(Number);
  return MONTHS_PT[m - 1];
}

interface TooltipPayloadItem { value: number; }

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl bg-white p-2.5 shadow-lg dark:bg-[#2C2C2E]">
      <p className="text-[11px] text-[#8E8E93]">{label}</p>
      <p className="text-[15px] font-semibold text-[#007AFF]">{formatCurrency(payload[0]?.value || 0)}</p>
    </div>
  );
}

export function GoalProgressChart({ projection, goalAmount }: { projection: MonthlyBudget[]; goalAmount: number }) {
  const data = projection.map((m) => ({ name: monthShort(m.month), Acumulado: m.accumulated }));

  return (
    <Card>
      <CardTitle>Caminho até a Meta</CardTitle>
      <div className="mt-4 h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="goalGradApple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#007AFF" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#007AFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(60,60,67,0.08)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8E8E93" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8E8E93" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={goalAmount} stroke="#FF3B30" strokeDasharray="6 4" strokeWidth={1.5} label={{ value: `Meta ${(goalAmount / 1000).toFixed(0)}k`, position: "insideTopRight", fill: "#FF3B30", fontSize: 11, fontWeight: 600 }} />
            <Area type="monotone" dataKey="Acumulado" stroke="#007AFF" strokeWidth={2} fill="url(#goalGradApple)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
