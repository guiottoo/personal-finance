import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "grouped";
}

export function Card({
  className,
  children,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white dark:bg-[#1C1C1E]",
        variant === "grouped" ? "p-0" : "p-5 sm:p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-[13px] font-semibold uppercase tracking-wide text-[#8E8E93]",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
