import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, id, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-[13px] font-medium text-[#8E8E93]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full rounded-[10px] bg-[#F2F2F7] px-3.5 py-2.5 text-[15px] text-[#000] outline-none transition-colors",
          "placeholder:text-[#C7C7CC]",
          "focus:ring-2 focus:ring-[#007AFF]/30",
          "dark:bg-[#2C2C2E] dark:text-white dark:placeholder:text-[#48484A]",
          className
        )}
        {...props}
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  options,
  className,
  id,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-[13px] font-medium text-[#8E8E93]"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          "w-full rounded-[10px] bg-[#F2F2F7] px-3.5 py-2.5 text-[15px] text-[#000] outline-none transition-colors",
          "focus:ring-2 focus:ring-[#007AFF]/30",
          "dark:bg-[#2C2C2E] dark:text-white",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
