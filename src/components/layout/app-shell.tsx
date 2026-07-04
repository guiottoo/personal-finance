"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000]">
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <div
        className={cn(
          "transition-all duration-200",
          collapsed ? "lg:ml-[60px]" : "lg:ml-[220px]"
        )}
      >
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          isDark={isDark}
          onToggleTheme={toggle}
        />
        <main className="px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
