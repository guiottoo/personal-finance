import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-[#F2F2F7] text-[#8E8E93] dark:bg-[#2C2C2E] dark:text-[#8E8E93]",
  success: "bg-[#34C759]/10 text-[#34C759]",
  warning: "bg-[#FF9500]/10 text-[#FF9500]",
  info: "bg-[#007AFF]/10 text-[#007AFF] dark:text-[#0A84FF]",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
