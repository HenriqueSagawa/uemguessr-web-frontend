"use client";

import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLobbyData } from "@/lib/lobby-data";

const TITLES: Record<string, string> = {
  "/lobby": "Jogar",
  "/lobby/ranking": "Ranking",
  "/lobby/estatisticas": "Estatísticas",
  "/lobby/perfil": "Perfil",
  "/lobby/configuracoes": "Configurações",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const { ranked } = useLobbyData();
  const title = TITLES[pathname] ?? "Lobby";
  const rating = ranked?.profile?.rating;

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        {rating != null ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Flame className="size-3.5 text-orange-500" />
            <span className="font-mono tabular-nums">{rating}</span>
            rating
          </span>
        ) : null}
      </div>
    </header>
  );
}