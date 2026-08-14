"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Gamepad2,
  LogOut,
  Settings,
  ShieldCheck,
  Trophy,
  UserRound,
} from "lucide-react";
import logo from "@/public/logo-uemguessr.webp";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/lib/session";
import { useLobbyData } from "@/lib/lobby-data";
import { initialsOf } from "@/lib/ranked";
import Image from "next/image";

const NAV_GROUPS = [
  {
    label: "Jogo",
    items: [
      { title: "Jogar", href: "/lobby", icon: Gamepad2 },
      { title: "Ranking", href: "/lobby/ranking", icon: Trophy },
    ],
  },
  {
    label: "Você",
    items: [
      { title: "Estatísticas", href: "/lobby/estatisticas", icon: BarChart3 },
      { title: "Perfil", href: "/lobby/perfil", icon: UserRound },
      { title: "Configurações", href: "/lobby/configuracoes", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useSession();
  const { ranked } = useLobbyData();

  const isActive = (href: string) =>
    href === "/lobby" ? pathname === "/lobby" : pathname.startsWith(href);

  const displayName = user?.username ?? "Explorador";
  const rating = ranked?.profile?.rating;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="UEMGuessr"
              render={<Link href="/lobby" />}
              className="gap-2.5 py-2 data-[active=true]:bg-transparent"
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-white p-1 shadow-[0_4px_16px_-4px_rgba(59,130,246,0.6)]">
                <Image src={logo} alt="UEMGuessr" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-none">
                <span className="truncate font-semibold tracking-tight">
                  UEMGuessr
                </span>
                <span className="text-xs text-muted-foreground">
                  {ranked?.season?.name ?? "Campus de Maringá"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}

        {user?.role === "ADMIN" ? (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/admin")}
                  tooltip="Painel do administrador"
                  render={<Link href="/admin/temporadas" />}
                >
                  <ShieldCheck />
                  <span>Admin</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        ) : null}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={`${displayName}${rating != null ? ` · ${rating} de rating` : ""}`}
              render={<Link href="/lobby/perfil" />}
            >
              <Avatar className="size-6 shrink-0">
                {user?.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={displayName} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-[10px] font-semibold text-white">
                  {initialsOf(displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{displayName}</span>
              {rating != null ? (
                <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums">
                  {rating}
                </span>
              ) : null}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sair da conta" onClick={logout}>
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}