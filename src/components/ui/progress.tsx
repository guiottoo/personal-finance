import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  color?: string;
}

const sizes = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function Progress({
  value,
  className,
  showLabel = false,
  size = "md",
  color,
}: ProgressProps) {
  const percent = Math.min(Math.max(value * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E]",
          sizes[size]
        )}
      >
        <div
          className={cn(
            "rounded-full transition-all duration-700",
            sizes[size],
            color || "bg-[#007AFF]"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="mt-1 block text-right text-[11px] font-medium text-[#8E8E93]">
          {percent.toFixed(1)}%
        </span>
      )}
    </div>
  );
}
