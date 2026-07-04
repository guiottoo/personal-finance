import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#007AFF] text-white active:bg-[#0062CC]",
  secondary:
    "bg-[#F2F2F7] text-[#007AFF] active:bg-[#E5E5EA] dark:bg-[#2C2C2E] dark:text-[#0A84FF]",
  ghost:
    "text-[#007AFF] active:opacity-60 dark:text-[#0A84FF]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[13px]",
  md: "px-4 py-2 text-[15px]",
  lg: "px-5 py-2.5 text-[17px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-all disabled:opacity-40",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
