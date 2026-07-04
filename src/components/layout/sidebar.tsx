"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarRange,
  Car,
  Wallet,
  ArrowUpDown,
  Settings,
  X,
  ChevronLeft,
  PieChart,
  MessageCircle,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orcamentos", label: "Or\u00e7amentos", icon: PieChart },
  { href: "/planejamento", label: "Planejamento", icon: CalendarRange },
  { href: "/meta-carro", label: "Meta do Carro", icon: Car },
  { href: "/contas", label: "Contas", icon: Wallet },
  { href: "/lancamentos", label: "Lan\u00e7amentos", icon: ArrowUpDown },
  { href: "/thomas", label: "Thomas", icon: MessageCircle },
  { href: "/configuracoes", label: "Configura\u00e7\u00f5es", icon: Settings },
];

export function Sidebar({
  open,
  collapsed,
  onClose,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col bg-[#F2F2F7]/80 backdrop-blur-xl transition-all duration-200 dark:bg-[#1C1C1E]/80",
          collapsed ? "w-[60px]" : "w-[220px]",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex h-[52px] items-center px-4">
          {!collapsed && (
            <span className="text-[17px] font-bold tracking-tight text-[#000] dark:text-white">
              finance
            </span>
          )}
          {collapsed && (
            <span className="mx-auto text-[17px] font-bold text-[#007AFF]">
              F
            </span>
          )}
          <button
            onClick={onClose}
            className="ml-auto rounded-full p-1 text-[#8E8E93] active:bg-[#E5E5EA] lg:hidden dark:active:bg-[#3A3A3C]"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 px-2 pt-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] transition-all",
                  isActive
                    ? "bg-[#007AFF]/10 font-semibold text-[#007AFF] dark:text-[#0A84FF]"
                    : "font-medium text-[#3C3C43] active:bg-[#E5E5EA] dark:text-[#EBEBF5] dark:active:bg-[#3A3A3C]"
                )}
              >
                <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="hidden px-2 pb-3 lg:block">
          <button
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center rounded-lg p-2 text-[#8E8E93] active:bg-[#E5E5EA] dark:active:bg-[#3A3A3C]"
          >
            <ChevronLeft
              size={14}
              className={cn("transition-transform", collapsed && "rotate-180")}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
