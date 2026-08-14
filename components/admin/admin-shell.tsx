"use client";

import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { RequireAdmin } from "@/components/admin/require-admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

const TITLES: Record<string, string> = {
  "/admin/temporadas": "Temporadas",
  "/admin/localizacoes": "Localizações",
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Administração";

  return (
    <RequireAdmin>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
          </header>
          <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RequireAdmin>
  );
}