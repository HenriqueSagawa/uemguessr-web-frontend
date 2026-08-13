"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  Languages,
  Loader2,
  LogOut,
  Moon,
  Sparkles,
  Timer,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import type { UserSettings } from "@/lib/data/settings";
import { useSession } from "@/lib/session";
import { SectionHeading } from "@/components/lobby/section-heading";

const STORAGE_KEY = "uemguessr.settings";
const DEFAULT_SETTINGS: UserSettings = {
  sound: true,
  notifications: true,
  timerOnMap: true,
  reducedMotion: false,
  language: "pt-BR",
};

function loadSettings(): UserSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<UserSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Volume2;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-border/50 px-1 py-4 last:border-0">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </div>
      {children}
    </li>
  );
}

export function SettingsView() {
  const { logout } = useSession();
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [saved, setSaved] = useState(false);

  const toggle =
    (key: keyof UserSettings) =>
    (checked: boolean) =>
      setSettings((prev) => ({ ...prev, [key]: checked }));

  const handleSave = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    toast("Configurações salvas neste dispositivo.");
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Configurações"
        title="Ajuste sua arena"
        description="Prefere silêncio absoluto ou buzina de torcida? Você decide."
        action={
          <Button className="rounded-full" onClick={handleSave}>
            {saved ? <Loader2 className="size-4 animate-spin" /> : null}
            {saved ? "Salvo" : "Salvar"}
          </Button>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1 rounded-3xl border bg-card px-5 py-2 sm:px-6">
          <ul className="flex flex-col">
            <SettingRow
              icon={Volume2}
              title="Som do jogo"
              description="Efeitos de palpite e resposta"
            >
              <Switch
                checked={settings.sound}
                onCheckedChange={toggle("sound")}
                aria-label="Ativar som do jogo"
              />
            </SettingRow>
            <SettingRow
              icon={Bell}
              title="Notificações"
              description="Alertas do desafio diário e fim de temporada"
            >
              <Switch
                checked={settings.notifications}
                onCheckedChange={toggle("notifications")}
                aria-label="Ativar notificações"
              />
            </SettingRow>
            <SettingRow
              icon={Timer}
              title="Timer no mapa"
              description="Contagem regressiva visível durante as rodadas"
            >
              <Switch
                checked={settings.timerOnMap}
                onCheckedChange={toggle("timerOnMap")}
                aria-label="Mostrar timer no mapa"
              />
            </SettingRow>
            <SettingRow
              icon={Sparkles}
              title="Reduzir animações"
              description="Menos efeitos para partidas mais leves"
            >
              <Switch
                checked={settings.reducedMotion}
                onCheckedChange={toggle("reducedMotion")}
                aria-label="Reduzir animações"
              />
            </SettingRow>
            <SettingRow
              icon={Languages}
              title="Idioma"
              description="Idioma do jogo e do lobby"
            >
              <select
                value={settings.language}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, language: event.target.value }))
                }
                className="h-9 rounded-xl border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Idioma"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en">English</option>
              </select>
            </SettingRow>
            <SettingRow
              icon={Moon}
              title="Tema"
              description="Luz, escuridão ou o jeito que a brisa pedir"
            >
              <AnimatedThemeToggler
                aria-label="Alternar tema"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-[18px]"
              />
            </SettingRow>
          </ul>
        </div>

        <div className="w-full lg:w-72">
          <div className="flex flex-col gap-4 rounded-3xl border border-destructive/25 bg-destructive/5 p-6">
            <h3 className="text-sm font-semibold tracking-tight">Zona de perigo</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Sair da conta não apaga seus pontos, mas você perde a posição na
              fila do ranqueado.
            </p>
            <Button variant="outline" className="rounded-full" onClick={logout}>
              <LogOut />
              Sair da conta
            </Button>
            <Button
              render={<a href="/esqueci-senha" />}
              variant="ghost"
              className="rounded-full text-muted-foreground"
            >
              Esqueci minha senha
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}