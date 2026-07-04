"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { MonthlyBudget } from "@/lib/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MONTHS_PT } from "@/lib/constants";

function monthShort(monthStr: string): string {
  const [, m] = monthStr.split("-").map(Number);
  return MONTHS_PT[m - 1];
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl bg-white p-3 shadow-lg dark:bg-[#2C2C2E]">
      <p className="mb-1 text-[11px] font-semibold text-[#8E8E93]">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[13px] text-[#8E8E93]">{entry.name}:</span>
          <span className="text-[13px] font-semibold text-[#000] dark:text-white">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyOverviewChart({ projection }: { projection: MonthlyBudget[] }) {
  const data = projection.map((m) => ({
    name: monthShort(m.month),
    Aportes: m.contribution,
    Acumulado: m.accumulated,
  }));

  return (
    <Card>
      <CardTitle>Evolucao dos Aportes</CardTitle>
      <div className="mt-4 h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="gradAportes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#007AFF" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#007AFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradAcumulado" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34C759" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#34C759" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(60,60,67,0.08)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8E8E93" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8E8E93" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="Acumulado" stroke="#34C759" strokeWidth={2} fill="url(#gradAcumulado)" />
            <Area type="monotone" dataKey="Aportes" stroke="#007AFF" strokeWidth={2} fill="url(#gradAportes)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
