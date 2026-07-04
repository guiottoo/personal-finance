"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS_PT } from "@/lib/constants";

interface MonthSelectorProps {
  value: string;
  onChange: (month: string) => void;
  options: string[];
}

function label(monthStr: string): string {
  const [year, m] = monthStr.split("-").map(Number);
  return `${MONTHS_PT[m - 1]} ${year}`;
}

export function MonthSelector({ value, onChange, options }: MonthSelectorProps) {
  const idx = options.indexOf(value);
  const hasPrev = idx > 0;
  const hasNext = idx < options.length - 1;

  return (
    <div className="inline-flex items-center gap-0.5 rounded-full bg-white px-1 py-0.5 dark:bg-[#1C1C1E]">
      <button
        onClick={() => hasPrev && onChange(options[idx - 1])}
        disabled={!hasPrev}
        className="rounded-full p-1.5 text-[#007AFF] disabled:text-[#C7C7CC] active:bg-[#F2F2F7] dark:active:bg-[#2C2C2E]"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="min-w-[90px] text-center text-[13px] font-semibold text-[#000] dark:text-white">
        {label(value)}
      </span>
      <button
        onClick={() => hasNext && onChange(options[idx + 1])}
        disabled={!hasNext}
        className="rounded-full p-1.5 text-[#007AFF] disabled:text-[#C7C7CC] active:bg-[#F2F2F7] dark:active:bg-[#2C2C2E]"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
