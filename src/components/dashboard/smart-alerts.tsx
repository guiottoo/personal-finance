"use client";

import type { Alert } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, Info, Sparkles } from "lucide-react";

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success:
    "border-l-4 border-l-emerald-500 bg-emerald-50/80 text-emerald-900 dark:bg-emerald-900/10 dark:text-emerald-300",
  warning:
    "border-l-4 border-l-amber-500 bg-amber-50/80 text-amber-900 dark:bg-amber-900/10 dark:text-amber-300",
  info: "border-l-4 border-l-brand-500 bg-brand-50/80 text-brand-900 dark:bg-brand-900/10 dark:text-brand-300",
};

const iconStyles = {
  success: "text-emerald-500",
  warning: "text-amber-500",
  info: "text-brand-500",
};

export function SmartAlerts({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-brand-500" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-300">
          Insights
        </h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {alerts.map((alert) => {
          const Icon = icons[alert.type];
          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-3 rounded-xl p-4 text-sm font-medium",
                styles[alert.type]
              )}
            >
              <Icon
                size={18}
                className={cn("mt-0.5 shrink-0", iconStyles[alert.type])}
              />
              <span className="leading-relaxed">{alert.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
