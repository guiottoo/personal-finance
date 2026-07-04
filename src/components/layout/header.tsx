"use client";

import { Menu, Moon, Sun } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function Header({ onMenuClick, isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between bg-[#F2F2F7]/80 px-5 backdrop-blur-xl dark:bg-[#000]/80 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-full p-2 text-[#8E8E93] active:bg-[#E5E5EA] lg:hidden dark:active:bg-[#3A3A3C]"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-[17px] font-semibold text-[#000] dark:text-white">
            Planejamento Financeiro
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className="rounded-full p-2 text-[#8E8E93] active:bg-[#E5E5EA] dark:active:bg-[#3A3A3C]"
          aria-label="Alternar tema"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#007AFF] text-[13px] font-semibold text-white">
          G
        </div>
      </div>
    </header>
  );
}
