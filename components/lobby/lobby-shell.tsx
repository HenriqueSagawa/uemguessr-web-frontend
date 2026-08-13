"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RequireAuth } from "@/components/auth/require-auth";
import { AppSidebar } from "@/components/lobby/app-sidebar";
import { DashboardHeader } from "@/components/lobby/dashboard-header";

export function LobbyShell({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  );
}