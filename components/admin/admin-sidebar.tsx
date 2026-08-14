"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  CalendarRange,
  ShieldCheck,
  LogOut,
} from "lucide-react";
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
import { useSession } from "@/lib/session";

const NAV_ITEMS = [
  { title: "Temporadas", href: "/admin/temporadas", icon: CalendarRange },
  { title: "Localizações", href: "/admin/localizacoes", icon: MapPin },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useSession();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Painel do Administrador"
              render={<Link href="/admin/temporadas" />}
              className="gap-2.5 py-2 data-[active=true]:bg-transparent"
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 text-white shadow-[0_4px_16px_-4px_rgba(244,63,94,0.6)]">
                <ShieldCheck className="size-4" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-none">
                <span className="truncate font-semibold tracking-tight">
                  Admin UEMGuessr
                </span>
                <span className="text-xs text-muted-foreground">
                  Gerenciamento do jogo
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestão</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => (
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
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Voltar ao jogo"
                render={<Link href="/lobby" />}
              >
                <ArrowLeft />
                <span>Voltar ao jogo</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
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